/**
 * Admin Lead Activities API
 * Fetch activity timeline for a specific lead
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get('leadId');

    if (!leadId) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }

    // Fetch activities for this lead
    const { data: activities, error } = await supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(activities || []);
  } catch (error: any) {
    console.error('Lead activities error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead activities', details: error.message },
      { status: 500 }
    );
  }
}






