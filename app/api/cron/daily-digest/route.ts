/**
 * CRON: Daily Digest for Admin (FOUNDATION TIER)
 * Schedule: Daily at 5pm GMT
 * Purpose: Send summary of lower-priority activities to Luke
 * 
 * Includes:
 * - Contact form submissions
 * - General education enquiries (not CPD - those get immediate alerts)
 * - Other lead activities
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendAdminDailyDigest } from '@/lib/email';

export async function GET(request: Request) {
  // Verify cron secret (optional - only if you set CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📊 [CRON] Generating daily digest...');
    
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Get contact form submissions from last 24 hours
    // These are leads with source = 'contact_form_*'
    const { data: contactForms } = await supabase
      .from('leads')
      .select('*')
      .like('source', 'contact_form%')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false });

    // Get education enquiries (not CPD) from last 24 hours
    // CPD gets immediate alerts, so we exclude those here
    const { data: educationEnquiries } = await supabase
      .from('leads')
      .select('*')
      .or('source.eq.website,source.like.education%')
      .not('source', 'like', '%cpd%')
      .not('source', 'like', '%ai_chat%')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false });

    // Get other notable activities from last 24 hours
    const { data: activities } = await supabase
      .from('lead_activities')
      .select('*, leads(first_name, last_name, email)')
      .in('activity_type', ['email_opened', 'email_clicked', 'page_viewed'])
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(10); // Top 10 activities

    // Prepare data for digest
    const digestData = {
      contactForms: contactForms || [],
      educationEnquiries: educationEnquiries || [],
      activities: activities?.map(a => ({
        ...a,
        lead: a.leads as any
      })) || [],
    };

    console.log(`📊 [CRON] Digest summary:`, {
      contactForms: digestData.contactForms.length,
      educationEnquiries: digestData.educationEnquiries.length,
      activities: digestData.activities.length,
    });

    // Send digest email
    const result = await sendAdminDailyDigest(digestData);

    if (result.success) {
      console.log('✅ [CRON] Daily digest sent successfully');
    } else {
      console.error('❌ [CRON] Failed to send daily digest:', result.error);
    }

    return NextResponse.json({
      success: result.success,
      itemCount: {
        contactForms: digestData.contactForms.length,
        educationEnquiries: digestData.educationEnquiries.length,
        activities: digestData.activities.length,
        total: digestData.contactForms.length + digestData.educationEnquiries.length + digestData.activities.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ [CRON] Daily digest failed:', error);
    return NextResponse.json(
      { error: error.message || 'Daily digest failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}

