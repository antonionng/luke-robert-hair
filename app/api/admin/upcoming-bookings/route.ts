/**
 * Admin Upcoming Bookings API
 * Fetch next confirmed bookings ordered by date/time
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get confirmed bookings starting from now, ordered by start_time
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select(`
        id,
        start_time,
        end_time,
        status,
        price,
        notes,
        clients (
          first_name,
          last_name,
          email,
          phone
        ),
        services (
          name,
          duration
        ),
        locations (
          name,
          address
        )
      `)
      .eq('status', 'confirmed')
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Format the data for the frontend
    const formattedBookings = bookings?.map(booking => ({
      id: booking.id,
      clientName: `${(booking.clients as any)?.first_name} ${(booking.clients as any)?.last_name}`,
      service: (booking.services as any)?.name,
      dateTime: booking.start_time,
      time: new Date(booking.start_time).toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date(booking.start_time).toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short' 
      }),
      location: (booking.locations as any)?.name,
      price: booking.price,
      status: booking.status,
    })) || [];

    return NextResponse.json(formattedBookings);
  } catch (error: any) {
    console.error('Upcoming bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming bookings', details: error.message },
      { status: 500 }
    );
  }
}






