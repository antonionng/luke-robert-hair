import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { onLeadCreated } from '@/lib/automation';
import { logActivityAndScore } from '@/lib/leadScoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📥 [LEADS API] Received lead submission:', {
      leadType: body.leadType,
      email: body.email,
      source: body.source,
      hasInstitution: !!body.institution,
      hasJobTitle: !!body.jobTitle,
      hasStudentNumbers: !!body.studentNumbers,
      hasDeliveryPreference: !!body.deliveryPreference
    });
    
    const { 
      leadType, 
      firstName, 
      lastName, 
      email, 
      phone, 
      courseInterest, 
      message, 
      source,
      // CPD-specific fields
      institution,
      jobTitle,
      studentNumbers,
      deliveryPreference,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email) {
      console.error('❌ [LEADS API] Missing required fields:', { firstName: !!firstName, lastName: !!lastName, email: !!email });
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      );
    }

    // Additional validation for CPD leads
    if (leadType === 'cpd_partnership' && !institution) {
      console.error('❌ [LEADS API] CPD lead missing institution');
      return NextResponse.json(
        { error: 'Institution name is required for CPD partnership enquiries' },
        { status: 400 }
      );
    }

    // Check if lead already exists
    const { data: existingLead } = await db.getLeadByEmail(email);
    
    if (existingLead) {
      console.log('⚠️ [LEADS API] Existing lead found, updating with new data');
      
      // Merge existing custom fields with new ones (new data takes priority)
      const existingCustomFields = (existingLead.custom_fields as any) || {};
      const updatedCustomFields: Record<string, any> = { ...existingCustomFields };
      
      // Update with CPD-specific fields if this is a CPD submission
      if (leadType === 'cpd_partnership') {
        updatedCustomFields.leadType = 'cpd_partnership';
        updatedCustomFields.institution = institution;
        if (jobTitle) updatedCustomFields.jobTitle = jobTitle;
        if (studentNumbers) updatedCustomFields.studentNumbers = studentNumbers;
        if (deliveryPreference) updatedCustomFields.deliveryPreference = deliveryPreference;
        
        console.log('🏫 [LEADS API] Updating existing lead with CPD data:', {
          leadId: existingLead.id,
          newCustomFields: updatedCustomFields
        });
      } else if (leadType === 'salon_client') {
        updatedCustomFields.leadType = 'salon_client';
      }
      
      // Update existing lead with new data
      await db.updateLead(existingLead.id, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || existingLead.phone,
        course_interest: courseInterest || existingLead.course_interest,
        message: message || existingLead.message,
        source: source || (leadType === 'cpd_partnership' ? 'cpd_partnership' : existingLead.source),
        custom_fields: updatedCustomFields,
        notes: message ? `${existingLead.notes || ''}\n\n[${new Date().toISOString()}] ${message}` : existingLead.notes,
      });

      // Log activity
      await logActivityAndScore(existingLead.id, 'form_submitted', {
        form: leadType === 'cpd_partnership' ? 'cpd_enquiry' : 'education_enquiry',
        courseInterest,
      });

      console.log('✅ [LEADS API] Existing lead updated successfully:', {
        leadId: existingLead.id,
        leadType: updatedCustomFields.leadType,
        source: source || (leadType === 'cpd_partnership' ? 'cpd_partnership' : existingLead.source)
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Thank you! We\'ll be in touch soon.',
        leadId: existingLead.id,
        existing: true,
      });
    }

    // Prepare custom fields for different lead types
    const customFields: Record<string, any> = body.custom_fields || {};
    
    if (leadType === 'cpd_partnership') {
      customFields.leadType = 'cpd_partnership';
      customFields.institution = institution;
      if (jobTitle) customFields.jobTitle = jobTitle;
      if (studentNumbers) customFields.studentNumbers = studentNumbers;
      if (deliveryPreference) customFields.deliveryPreference = deliveryPreference;
      
      console.log('🏫 [LEADS API] Preparing CPD lead with custom fields:', {
        leadType: customFields.leadType,
        institution: customFields.institution,
        jobTitle: customFields.jobTitle,
        studentNumbers: customFields.studentNumbers,
        deliveryPreference: customFields.deliveryPreference
      });
    } else if (leadType === 'salon_client') {
      customFields.leadType = 'salon_client';
      console.log('🏪 [LEADS API] Preparing Salon lead');
    } else {
      console.log('🎓 [LEADS API] Preparing Education lead');
    }

    // Create new lead
    const leadData = {
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      course_interest: courseInterest || null,
      message: message || null,
      source: source || (leadType === 'cpd_partnership' ? 'cpd_partnership' : 'website'),
      lifecycle_stage: 'new' as const,
      lead_score: 0,
      custom_fields: customFields,
    };
    
    console.log('💾 [LEADS API] Creating lead in database:', {
      email: leadData.email,
      source: leadData.source,
      leadType: customFields.leadType,
      hasInstitution: !!customFields.institution
    });
    
    const { data: newLead, error: createError } = await db.createLead(leadData);

    if (createError || !newLead) {
      console.error('Lead creation error:', createError);
      return NextResponse.json(
        { error: 'Failed to create lead' },
        { status: 500 }
      );
    }

    // Create contact preferences
    await db.createPreferences({
      lead_id: newLead.id,
      email_enabled: true,
      sms_enabled: !!phone,
      marketing_enabled: true,
      gdpr_consent: true,
      gdpr_consent_date: new Date().toISOString(),
    });

    // Log initial activity
    await logActivityAndScore(newLead.id, 'form_submitted', {
      form: 'education_enquiry',
      courseInterest,
    });

    // Trigger automation workflows
    await onLeadCreated(newLead.id);

    console.log('✅ New lead created:', {
      leadId: newLead.id,
      name: `${firstName} ${lastName}`,
      email,
      leadType: leadType,
      course: courseInterest,
      institution: institution,
      customFields: customFields,
      score: newLead.lead_score,
    });

    // Send admin notification for CPD leads (high priority - immediate alert)
    // Education leads go in daily digest (lower priority)
    if (leadType === 'cpd_partnership') {
      try {
        const { sendAdminNotification } = await import('@/lib/email');
        await sendAdminNotification('cpd_enquiry', {
          contactName: `${firstName} ${lastName}`,
          email,
          phone,
          institution,
          jobTitle,
          studentNumbers,
          deliveryPreference,
          courseInterest,
          message,
          leadId: newLead.id,
        });
        console.log('✅ [LEADS API] Admin notification sent for CPD enquiry');
      } catch (emailError) {
        console.error('⚠️ [LEADS API] Failed to send admin notification:', emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you! We\'ll be in touch soon.',
      leadId: newLead.id,
    });
  } catch (error: any) {
    console.error('Lead API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process education enquiry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication check for admin access
    const { searchParams } = new URL(request.url);
    const stage = searchParams.get('stage');

    let leadsData;
    if (stage) {
      leadsData = await db.getLeadsByStage(stage as any);
    } else {
      leadsData = await db.getAllLeads();
    }

    const { data: leads, error } = leadsData;

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ 
      success: true,
      leads: leads || [],
      count: leads?.length || 0,
    });
  } catch (error: any) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
