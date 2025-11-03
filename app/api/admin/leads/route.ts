/**
 * Admin Leads API
 * Fetch all leads with filtering and search capabilities
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all'; // all, cpd, education, salon
    const stage = searchParams.get('stage') || 'all'; // all, new, contacted, qualified, converted, lost

    // Build query
    let query = supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply stage filter
    if (stage !== 'all') {
      query = query.eq('lifecycle_stage', stage);
    }

    // Apply source/type filter
    if (filter === 'cpd') {
      query = query.or('source.ilike.%cpd%,custom_fields->>leadType.eq.cpd_partnership');
    } else if (filter === 'education') {
      query = query.or('source.ilike.%education%,course_interest.not.is.null');
    } else if (filter === 'salon') {
      query = query.ilike('source', '%salon%');
    }

    // Apply search
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: leads, error } = await query;

    if (error) {
      throw error;
    }

    // Format the data for the frontend
    const formattedLeads = leads?.map(lead => {
      const customFields = (lead.custom_fields as any) || {};
      const isCPD = customFields.leadType === 'cpd_partnership' || lead.source?.includes('cpd');
      const isSalonReferral = customFields.leadType === 'salon_referral' || lead.source?.includes('salon_referral');
      
      return {
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`,
        firstName: lead.first_name,
        lastName: lead.last_name,
        email: lead.email,
        phone: lead.phone,
        score: lead.lead_score,
        source: lead.source,
        lifecycle_stage: lead.lifecycle_stage,
        
        // Education/Course fields
        course: lead.course_interest || customFields.courseInterest || customFields.serviceInterest || 'N/A',
        experienceLevel: customFields.experienceLevel || 'N/A',
        
        // CPD-specific fields
        institution: customFields.institution,
        jobTitle: customFields.jobTitle,
        studentNumbers: customFields.studentNumbers,
        deliveryPreference: customFields.deliveryPreference,
        
        // Salon referral fields
        referralSalon: customFields.referralSalon,
        preferredDate: customFields.preferredDate,
        serviceInterest: customFields.serviceInterest,
        
        // Lead classification
        leadType: isSalonReferral ? 'salon_referral' : (isCPD ? 'cpd' : 'education'),
        
        // Dates
        enquiryDate: lead.created_at,
        lastActivity: lead.last_activity_date,
        
        // Estimated value
        value: estimateLeadValue(lead.course_interest, customFields, isCPD),
        
        // Notes
        notes: lead.notes,
      };
    }) || [];

    return NextResponse.json(formattedLeads);
  } catch (error: any) {
    console.error('Admin leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Estimate potential value based on course interest and lead type
 */
function estimateLeadValue(courseInterest: string | null, customFields: any, isCPD: boolean): number {
  // CPD leads (B2B)
  if (isCPD) {
    const students = customFields.studentNumbers || 0;
    if (students >= 100) return 2500; // Large cohort
    if (students >= 50) return 1500; // Medium cohort
    if (students >= 20) return 800; // Small cohort
    return 500; // Unknown size
  }

  // Education leads (individual stylists)
  if (!courseInterest) return 0;
  
  if (courseInterest.toLowerCase().includes('1-to-1') || courseInterest.toLowerCase().includes('mentorship')) {
    return 700; // 1-to-1 Mentorship
  }
  if (courseInterest.toLowerCase().includes('advanced')) {
    return 650; // Advanced Cutting
  }
  if (courseInterest.toLowerCase().includes('foundation')) {
    return 450; // Foundation Cutting
  }
  if (courseInterest.toLowerCase().includes('leader')) {
    return 1200; // Salon Leaders Programme (estimate)
  }
  
  return 500; // Default
}

