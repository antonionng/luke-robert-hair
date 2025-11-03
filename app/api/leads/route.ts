import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { onLeadCreated } from '@/lib/automation';
import { logActivityAndScore } from '@/lib/leadScoring';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
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
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email' },
        { status: 400 }
      );
    }

    // Additional validation for CPD leads
    if (leadType === 'cpd_partnership' && !institution) {
      return NextResponse.json(
        { error: 'Institution name is required for CPD partnership enquiries' },
        { status: 400 }
      );
    }

    // Check if lead already exists
    const { data: existingLead } = await db.getLeadByEmail(email);
    
    if (existingLead) {
      // Update existing lead
      await db.updateLead(existingLead.id, {
        course_interest: courseInterest || existingLead.course_interest,
        message: message || existingLead.message,
        notes: message ? `${existingLead.notes || ''}\n\n[${new Date().toISOString()}] ${message}` : existingLead.notes,
      });

      // Log activity
      await logActivityAndScore(existingLead.id, 'form_submitted', {
        form: 'education_enquiry',
        courseInterest,
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
    } else if (leadType === 'salon_client') {
      customFields.leadType = 'salon_client';
    }

    // Create new lead
    const { data: newLead, error: createError } = await db.createLead({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone || null,
      course_interest: courseInterest || null,
      message: message || null,
      source: source || (leadType === 'cpd_partnership' ? 'cpd_partnership' : 'website'),
      lifecycle_stage: 'new',
      lead_score: 0,
      custom_fields: customFields,
    });

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
      course: courseInterest,
      score: newLead.lead_score,
    });

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
