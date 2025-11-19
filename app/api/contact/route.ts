import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, type, message } = await request.json();

    console.log('📥 [CONTACT API] Received contact form submission:', {
      name,
      email,
      phone,
      type,
      message: message?.substring(0, 50) + '...'
    });

    // Parse name into first and last name
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Determine lead type and source based on enquiry type
    let leadType = 'contact'; // default for general enquiries
    let source = 'contact_form_general';
    let courseInterest = 'General Enquiry';

    if (type === 'education') {
      leadType = 'education';
      source = 'contact_form_education';
      courseInterest = message || 'Education Enquiry';
    } else if (type === 'client') {
      leadType = 'salon_referral';
      source = 'contact_form_salon';
      courseInterest = 'Salon Booking Enquiry';
    } else if (type === 'general') {
      leadType = 'contact';
      source = 'contact_form_general';
      courseInterest = 'General Contact Enquiry';
    }

    // Create lead in Supabase
    const leadData: any = {
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase().trim(),
      phone: phone || null,
      source,
      lead_score: 50, // Default score for contact form submissions
      lifecycle_stage: 'new',
      course_interest: courseInterest,
      notes: message || null,
      custom_fields: {
        leadType,
        enquiryType: type,
        message,
        submittedVia: 'contact_form',
      },
    };

    console.log('💾 [CONTACT API] Checking for existing lead in Supabase:', {
      email: leadData.email,
      source: leadData.source,
      leadType,
      type
    });

    // Check if lead already exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('*')
      .eq('email', leadData.email)
      .single();

    let newLead;

    if (existingLead) {
      // Update existing lead with new information
      console.log('📝 [CONTACT API] Updating existing lead:', existingLead.id);
      
      const { data: updatedLead, error: updateError } = await supabase
        .from('leads')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: phone || existingLead.phone, // Keep existing phone if none provided
          source, // Update source to latest
          course_interest: courseInterest,
          notes: message ? (existingLead.notes ? `${existingLead.notes}\n\n---\n${new Date().toISOString()}\n${message}` : message) : existingLead.notes, // Append new message to existing notes
          custom_fields: {
            ...((existingLead.custom_fields as any) || {}),
            leadType,
            enquiryType: type,
            lastMessage: message,
            lastContactDate: new Date().toISOString(),
            submittedVia: 'contact_form',
          },
          updated_at: new Date().toISOString(),
          last_activity_date: new Date().toISOString(),
        })
        .eq('id', existingLead.id)
        .select()
        .single();

      if (updateError) {
        console.error('❌ [CONTACT API] Failed to update lead:', updateError);
        throw updateError;
      }

      newLead = updatedLead;
      console.log('✅ [CONTACT API] Lead updated successfully:', {
        leadId: newLead.id,
        email: newLead.email,
        source: newLead.source,
        leadType
      });
    } else {
      // Create new lead
      console.log('➕ [CONTACT API] Creating new lead');
      
      const { data: createdLead, error: createError } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
        .single();

      if (createError) {
        console.error('❌ [CONTACT API] Failed to create lead:', createError);
        throw createError;
      }

      newLead = createdLead;
      console.log('✅ [CONTACT API] Lead created successfully:', {
        leadId: newLead.id,
        email: newLead.email,
        source: newLead.source,
        leadType
      });
    }

    // Log activity with full message for display in timeline
    await supabase.from('lead_activities').insert({
      lead_id: newLead.id,
      activity_type: 'form_submitted',
      activity_data: {
        form_type: 'contact_form',
        enquiry_type: type,
        message: message || null, // Store full message for timeline display
        submitted_at: new Date().toISOString(),
      },
      automated: false,
    });

    // Send user acknowledgment email
    try {
      const { sendTransactionalEmail } = await import('@/lib/email');
      await sendTransactionalEmail({
        leadId: newLead.id,
        templateName: 'contact_acknowledgment',
        to: newLead.email,
        toName: `${firstName} ${lastName}`,
      });
      console.log('✅ [CONTACT API] Acknowledgment email sent to user');
    } catch (emailError) {
      console.error('⚠️ [CONTACT API] Failed to send acknowledgment email:', emailError);
      // Don't fail the entire request if email fails
    }

    // Send admin notification
    try {
      const { sendAdminNotification } = await import('@/lib/email');
      await sendAdminNotification('contact_form', {
        contactName: `${firstName} ${lastName}`,
        email: newLead.email,
        phone: phone || null,
        enquiryType: type,
        message: message || null,
        leadId: newLead.id,
      });
      console.log('✅ [CONTACT API] Admin notification sent');
    } catch (emailError) {
      console.error('⚠️ [CONTACT API] Failed to send admin notification:', emailError);
      // Don't fail the entire request if email fails
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      leadId: newLead.id,
    });
  } catch (error: any) {
    console.error('❌ [CONTACT API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form', details: error.message },
      { status: 500 }
    );
  }
}
