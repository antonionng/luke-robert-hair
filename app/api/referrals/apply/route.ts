import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ApplyReferralRequest, ApplyReferralResponse } from '@/lib/types';

/**
 * Apply a referral code (create redemption record)
 * POST /api/referrals/apply
 */
export async function POST(request: NextRequest) {
  try {
    const body: ApplyReferralRequest = await request.json();
    const { code, bookingId, email, name, phone } = body;

    // Validate required fields
    if (!code || !email || !name) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'Code, email, and name are required' },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedCode = code.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Get referral code
    const { data: referralCode, error: fetchError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (fetchError || !referralCode) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Validate code status (same checks as validate endpoint)
    if (referralCode.status !== 'active') {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'This referral code is no longer active' },
        { status: 400 }
      );
    }

    if (referralCode.expires_at && new Date(referralCode.expires_at) < new Date()) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'This referral code has expired' },
        { status: 400 }
      );
    }

    if (referralCode.total_uses >= referralCode.max_uses) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'This referral code has reached its maximum uses' },
        { status: 400 }
      );
    }

    if (referralCode.referrer_email === normalizedEmail) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'You cannot use your own referral code' },
        { status: 400 }
      );
    }

    // Check for existing redemption
    const { data: existingRedemption } = await supabase
      .from('referral_redemptions')
      .select('id')
      .eq('referral_code_id', referralCode.id)
      .eq('referee_email', normalizedEmail)
      .single();

    if (existingRedemption) {
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'You have already used this referral code' },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (referralCode.discount_type === 'fixed') {
      discountAmount = referralCode.discount_value;
    }
    // For percentage, we'll calculate actual amount when booking is confirmed

    // Create or get lead
    let leadId: string | null = null;
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', normalizedEmail)
      .single();

    if (existingLead) {
      leadId = existingLead.id;
      
      // Update lead with referral info
      await supabase
        .from('leads')
        .update({
          custom_fields: {
            usedReferralCode: true,
            referralCode: normalizedCode,
          },
          lead_score: existingLead.lead_score || 0 + 10, // Bonus points for referral
        })
        .eq('id', leadId);
    } else {
      // Create new lead
      const { data: newLead } = await supabase
        .from('leads')
        .insert({
          first_name: name.split(' ')[0],
          last_name: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
          email: normalizedEmail,
          phone: phone || null,
          source: 'referral',
          lead_type: 'individual',
          lifecycle_stage: 'new',
          lead_score: 10,
          custom_fields: {
            usedReferralCode: true,
            referralCode: normalizedCode,
          },
        })
        .select()
        .single();

      if (newLead) {
        leadId = newLead.id;
      }
    }

    // Get request metadata
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create redemption record
    const { data: redemption, error: redemptionError } = await supabase
      .from('referral_redemptions')
      .insert({
        referral_code_id: referralCode.id,
        referee_email: normalizedEmail,
        referee_name: name,
        referee_phone: phone || null,
        booking_id: bookingId || null,
        lead_id: leadId,
        booking_completed: false,
        referee_discount_amount: discountAmount > 0 ? discountAmount : null,
        referrer_credit_amount: discountAmount > 0 ? discountAmount : null, // Same amount for both
        redemption_source: bookingId ? 'booking' : 'landing_page',
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (redemptionError || !redemption) {
      console.error('Failed to create redemption:', redemptionError);
      return NextResponse.json<ApplyReferralResponse>(
        { success: false, error: 'Failed to apply referral code' },
        { status: 500 }
      );
    }

    // Log activity for the referee lead
    if (leadId) {
      await supabase.from('lead_activities').insert({
        lead_id: leadId,
        activity_type: 'referral_used',
        activity_data: {
          referralCode: normalizedCode,
          referrerName: referralCode.referrer_name,
          discountAmount,
        },
        score_impact: 10,
        automated: true,
      });
    }

    // Send confirmation email to referee
    try {
      const { sendReferralWelcomeEmail } = await import('@/lib/email');
      await sendReferralWelcomeEmail({
        email: normalizedEmail,
        name,
        code: normalizedCode,
        discountAmount,
        referrerName: referralCode.referrer_name,
      });
      console.log('✅ Referral welcome email sent to referee:', normalizedEmail);
    } catch (emailError) {
      console.error('⚠️ Failed to send welcome email:', emailError);
    }

    console.log('✅ Referral code applied:', {
      code: normalizedCode,
      referee: name,
      email: normalizedEmail,
      redemptionId: redemption.id,
    });

    return NextResponse.json<ApplyReferralResponse>({
      success: true,
      redemptionId: redemption.id,
      discount: {
        amount: discountAmount,
        type: referralCode.discount_type,
      },
    });
  } catch (error: any) {
    console.error('Apply referral code error:', error);
    return NextResponse.json<ApplyReferralResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

