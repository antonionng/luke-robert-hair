import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SALON_INFO = {
  'urban-sanctuary': {
    name: 'Urban Sanctuary',
    city: 'Knutsford',
    address: '29 King St, Knutsford, WA16 6DW',
    phone: '01565 123 456',
    bookingUrl: 'https://urbansanctuary.org.uk/book-online/',
  },
  'fixx-salon': {
    name: 'Fixx Salon',
    city: 'Altrincham',
    address: '1b Lloyd St, Altrincham, WA14 2DD',
    phone: '0161 123 4567',
    bookingUrl: 'https://phorest.com/book/salons/fixxsalonsltd',
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      serviceInterest,
      preferredDate,
      marketingOptIn,
      salonId,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !salonId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const salonInfo = SALON_INFO[salonId as keyof typeof SALON_INFO];
    if (!salonInfo) {
      return NextResponse.json(
        { error: 'Invalid salon ID' },
        { status: 400 }
      );
    }

    // Create or get lead in database
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', email)
      .single();

    let leadId: string;

    if (existingLead) {
      // Update existing lead
      const { data: updatedLead } = await supabase
        .from('leads')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || existingLead.phone,
          course_interest: serviceInterest || existingLead.course_interest,
          source: `salon_referral_${salonId.replace('-', '_')}`,
          custom_fields: {
            ...((existingLead.custom_fields as any) || {}),
            referralSalon: salonInfo.name,
            preferredDate: preferredDate || null,
            serviceInterest: serviceInterest || null,
            marketingOptIn,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      leadId = existingLead.id;
    } else {
      // Create new lead
      const { data: newLead, error: createError } = await supabase
        .from('leads')
        .insert({
          first_name: firstName,
          last_name: lastName,
          email,
          phone: phone || null,
          course_interest: serviceInterest || null,
          source: `salon_referral_${salonId.replace('-', '_')}`,
          lifecycle_stage: 'new',
          lead_score: 15, // Initial score for referral
          custom_fields: {
            leadType: 'salon_referral',
            referralSalon: salonInfo.name,
            preferredDate: preferredDate || null,
            serviceInterest: serviceInterest || null,
            marketingOptIn,
          },
        })
        .select()
        .single();

      if (createError || !newLead) {
        console.error('Failed to create lead:', createError);
        return NextResponse.json(
          { error: 'Failed to save lead information' },
          { status: 500 }
        );
      }

      leadId = newLead.id;

      // Create contact preferences
      await supabase.from('contact_preferences').insert({
        lead_id: leadId,
        email_enabled: true,
        sms_enabled: !!phone,
        marketing_enabled: marketingOptIn,
        gdpr_consent: true,
        gdpr_consent_date: new Date().toISOString(),
      });
    }

    // Log activity
    await supabase.from('lead_activities').insert({
      lead_id: leadId,
      activity_type: 'referral_captured',
      activity_data: {
        salon: salonInfo.name,
        salonId,
        serviceInterest,
        preferredDate,
      },
      score_impact: 15,
      automated: false,
    });

    // Build redirect URL with UTM parameters
    const redirectUrl = new URL(salonInfo.bookingUrl);
    redirectUrl.searchParams.append('utm_source', 'lukerobert');
    redirectUrl.searchParams.append('utm_medium', 'referral');
    redirectUrl.searchParams.append('utm_campaign', 'booking_redirect');
    redirectUrl.searchParams.append('utm_content', salonId);

    // Try to pass customer data (may not work with all systems)
    redirectUrl.searchParams.append('name', `${firstName} ${lastName}`);
    redirectUrl.searchParams.append('email', email);
    if (phone) redirectUrl.searchParams.append('phone', phone);

    console.log('✅ Referral captured (SERVER):', {
      leadId,
      salon: salonInfo.name,
      name: `${firstName} ${lastName}`,
      email,
      leadType: 'salon_referral',
      source: `salon_referral_${salonId.replace('-', '_')}`,
      customFields: {
        leadType: 'salon_referral',
        referralSalon: salonInfo.name,
        preferredDate: preferredDate || null,
        serviceInterest: serviceInterest || null,
      }
    });

    // Send confirmation email
    try {
      const { sendReferralConfirmation } = await import('@/lib/email');
      await sendReferralConfirmation({
        clientEmail: email,
        clientName: `${firstName} ${lastName}`,
        salonName: salonInfo.name,
        salonCity: salonInfo.city,
        salonAddress: salonInfo.address,
        salonPhone: salonInfo.phone,
        serviceInterest,
        preferredDate,
        leadId,
      });
      console.log('✅ Confirmation email sent');
    } catch (emailError) {
      console.error('⚠️ Email send failed (non-fatal):', emailError);
      // Don't fail the entire request if email fails
    }

    // Send admin notification (high priority - immediate alert)
    try {
      const { sendAdminNotification } = await import('@/lib/email');
      await sendAdminNotification('salon_referral', {
        contactName: `${firstName} ${lastName}`,
        email,
        phone,
        salonName: salonInfo.name,
        salonCity: salonInfo.city,
        serviceInterest,
        preferredDate,
        leadId,
      });
      console.log('✅ Admin notification sent for salon referral');
    } catch (emailError) {
      console.error('⚠️ Failed to send admin notification:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({
      success: true,
      leadId,
      redirectUrl: redirectUrl.toString(),
      salonInfo: {
        name: salonInfo.name,
        city: salonInfo.city,
        address: salonInfo.address,
        phone: salonInfo.phone,
      },
    });
  } catch (error: any) {
    console.error('Referral API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process referral' },
      { status: 500 }
    );
  }
}

