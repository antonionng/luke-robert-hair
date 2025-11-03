/**
 * Admin Stats API - Real Data from Supabase
 * Foundation Tier: Calculate metrics from actual database records
 */

import { NextResponse } from 'next/server';
import { db, supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Total Contacts (clients + leads combined)
    const { data: clientsData } = await supabase.from('clients').select('id', { count: 'exact', head: true });
    const { data: leadsData } = await supabase.from('leads').select('id', { count: 'exact', head: true });
    const totalContacts = (clientsData?.length || 0) + (leadsData?.length || 0);

    // 2. Pending Bookings
    const { data: pendingBookingsData } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');
    const pendingBookings = pendingBookingsData?.length || 0;

    // 3. Active Leads (new + contacted + qualified stages)
    const { data: activeLeadsData } = await supabase
      .from('leads')
      .select('id', { count: 'exact' })
      .in('lifecycle_stage', ['new', 'contacted', 'qualified']);
    const activeLeads = activeLeadsData?.length || 0;

    // 4. Published Posts
    const { data: publishedPostsData } = await supabase
      .from('content_queue')
      .select('id', { count: 'exact' })
      .eq('status', 'published');
    const publishedPosts = publishedPostsData?.length || 0;

    // 5. Monthly Revenue (completed bookings in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select('price')
      .eq('status', 'completed')
      .gte('created_at', thirtyDaysAgo.toISOString());
    
    const monthlyRevenue = recentBookings?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0;

    // 6. Conversion Rate (converted leads / total leads * 100)
    const { data: convertedLeadsData } = await supabase
      .from('leads')
      .select('id', { count: 'exact' })
      .eq('lifecycle_stage', 'converted');
    const convertedLeads = convertedLeadsData?.length || 0;
    
    const { data: totalLeadsData } = await supabase
      .from('leads')
      .select('id', { count: 'exact' });
    const totalLeadsCount = totalLeadsData?.length || 0;
    
    const conversionRate = totalLeadsCount > 0 
      ? Math.round((convertedLeads / totalLeadsCount) * 100) 
      : 0;

    // 7. Average Booking Value
    const { data: allCompletedBookings } = await supabase
      .from('bookings')
      .select('price')
      .eq('status', 'completed');
    
    const avgBookingValue = allCompletedBookings && allCompletedBookings.length > 0
      ? Math.round(allCompletedBookings.reduce((sum, b) => sum + (b.price || 0), 0) / allCompletedBookings.length)
      : 0;

    // 8. Chat Sessions (count of chat_opened activities)
    const { data: chatSessionsData } = await supabase
      .from('lead_activities')
      .select('id', { count: 'exact' })
      .eq('activity_type', 'chat_opened');
    const chatSessions = chatSessionsData?.length || 0;

    return NextResponse.json({
      totalContacts,
      pendingBookings,
      activeLeads,
      publishedPosts,
      monthlyRevenue,
      conversionRate,
      avgBookingValue,
      chatSessions,
    });
  } catch (error: any) {
    console.error('Admin stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error.message },
      { status: 500 }
    );
  }
}



