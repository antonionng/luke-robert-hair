/**
 * CRON: Check and Send Reminders (FOUNDATION TIER)
 * Schedule: Daily at 8am
 * Purpose: Send booking reminders (24h before appointments)
 * 
 * Foundation tier: Send emails directly (no queue)
 * Growth tier adds: Queue system, SMS reminders, multi-step sequences
 */

import { NextResponse } from 'next/server';
import { db, supabase } from '@/lib/supabase';
import { sendBookingReminder } from '@/lib/email';

export async function GET(request: Request) {
  // Verify cron secret (optional - only if you set CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('⏰ [CRON] Checking for booking reminders...');
    
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Get confirmed bookings in next 24-26 hours
    const tomorrowStart = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tomorrowEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000); // 2 hour window

    // Get bookings (need to implement getBookingsInRange or adapt)
    const { data: allBookings } = await supabase
      .from('bookings')
      .select('*, clients(*), services(*), locations(*)')
      .eq('status', 'confirmed')
      .gte('start_time', tomorrowStart.toISOString())
      .lte('start_time', tomorrowEnd.toISOString());

    let remindersSent = 0;
    let remindersFailed = 0;

    // Send reminders directly (Foundation tier - no queue)
    if (allBookings && allBookings.length > 0) {
      for (const booking of allBookings) {
        const client = booking.clients as any;
        const service = booking.services as any;
        const location = booking.locations as any;

        if (!client || !service || !location) {
          console.warn(`Missing data for booking ${booking.id}`);
          continue;
        }

        try {
          // Send email reminder
          const result = await sendBookingReminder({
            clientEmail: client.email,
            clientName: `${client.first_name} ${client.last_name}`,
            serviceName: service.name,
            locationName: location.name,
            dateTime: new Date(booking.start_time),
          });

          if (result.success) {
            remindersSent++;
            console.log(`✅ Reminder sent to ${client.email} for booking ${booking.id}`);
          } else {
            remindersFailed++;
            console.error(`❌ Failed to send reminder to ${client.email}:`, result.error);
          }

          // Log activity for lead (if they are a lead)
          const { data: lead } = await db.getLeadByEmail(client.email);
          if (lead) {
            await db.createActivity({
              lead_id: lead.id,
              activity_type: 'email_sent',
              activity_data: {
                template: 'booking_reminder',
                booking_id: booking.id,
              },
              automated: true,
            });
          }
        } catch (error: any) {
          remindersFailed++;
          console.error(`Error sending reminder for booking ${booking.id}:`, error);
        }
      }
    }

    console.log(`✅ [CRON] Sent ${remindersSent} booking reminders${remindersFailed > 0 ? `, ${remindersFailed} failed` : ''}`);

    return NextResponse.json({
      success: true,
      remindersSent,
      remindersFailed,
      bookingsChecked: allBookings?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('❌ [CRON] Reminder check failed:', error);
    return NextResponse.json(
      { error: error.message || 'Reminder check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
