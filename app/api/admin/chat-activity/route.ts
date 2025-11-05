/**
 * Admin Chat Activity API
 * Fetch recent chat sessions from lead_activities
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    // Get recent chat activities
    const { data: activities, error } = await supabase
      .from('lead_activities')
      .select(`
        id,
        activity_type,
        activity_data,
        created_at,
        lead_id,
        leads (
          first_name,
          last_name,
          email,
          source
        )
      `)
      .in('activity_type', ['chat_opened', 'chat_message', 'chat_lead_captured'])
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Format the data for the frontend
    const formattedActivity = activities?.map(activity => {
      const activityData = (activity.activity_data as any) || {};
      const lead = activity.leads as any;
      
      // Determine outcome based on activity type
      let outcome = 'info';
      if (activity.activity_type === 'chat_lead_captured') {
        outcome = activityData.leadType === 'cpd_partnership' ? 'cpd_enquiry' : 'enquiry';
      } else if (activityData.bookingMentioned) {
        outcome = 'booking';
      }

      return {
        id: activity.id,
        timestamp: new Date(activity.created_at).toLocaleString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        leadName: lead ? `${lead.first_name} ${lead.last_name}` : 'Anonymous',
        leadEmail: lead?.email,
        activityType: activity.activity_type,
        outcome,
        page: activityData.page || activityData.context || '/',
        source: lead?.source || 'direct',
        createdAt: activity.created_at,
      };
    }) || [];

    return NextResponse.json(formattedActivity);
  } catch (error: any) {
    console.error('Chat activity error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat activity', details: error.message },
      { status: 500 }
    );
  }
}






