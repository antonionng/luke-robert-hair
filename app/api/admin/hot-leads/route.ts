/**
 * Admin Hot Leads API
 * Fetch high-scoring leads (score > 60) for quick action
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get leads with score > 60, ordered by score descending
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .gt('lead_score', 60)
      .in('lifecycle_stage', ['new', 'contacted', 'qualified'])
      .order('lead_score', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Format the data for the frontend
    const formattedLeads = leads?.map(lead => {
      const customFields = (lead.custom_fields as any) || {};
      
      return {
        id: lead.id,
        name: `${lead.first_name} ${lead.last_name}`,
        email: lead.email,
        phone: lead.phone,
        score: lead.lead_score,
        source: lead.source,
        lifecycle_stage: lead.lifecycle_stage,
        course: lead.course_interest || customFields.courseInterest || 'N/A',
        // CPD-specific fields
        institution: customFields.institution,
        jobTitle: customFields.jobTitle,
        studentNumbers: customFields.studentNumbers,
        // Lead type
        leadType: customFields.leadType || lead.lead_type,
        // Calculated potential value (rough estimate based on course interest)
        estimatedValue: estimateLeadValue(lead.course_interest, customFields),
        createdAt: lead.created_at,
      };
    }) || [];

    return NextResponse.json(formattedLeads);
  } catch (error: any) {
    console.error('Hot leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hot leads', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Estimate potential value based on course interest and lead type
 */
function estimateLeadValue(courseInterest: string | null, customFields: any): number {
  // CPD leads (B2B)
  if (customFields.leadType === 'cpd_partnership') {
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






