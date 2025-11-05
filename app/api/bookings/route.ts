import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { db as supabaseDb } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, service, location, date, time, notes } = await request.json();

    // Create or find contact
    const contact = await db.createContact({
      name,
      email,
      phone,
      type: 'client',
    });

    // Create booking
    const booking = await db.createBooking({
      contactId: contact.id,
      service,
      location,
      date: new Date(`${date}T${time}`),
      status: 'pending',
      notes,
    });

    // In production, send confirmation email using Resend
    // await sendBookingConfirmation({ name, email, service, location, date, time });

    console.log('Booking created:', {
      bookingId: booking.id,
      contactId: contact.id,
      service,
      location,
      date,
      time,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Booking request submitted successfully',
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Failed to process booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchServices = searchParams.get('services');
    const fetchLocations = searchParams.get('locations');

    // If requesting services
    if (fetchServices === 'true') {
      const { data: services, error } = await supabaseDb.getServices(true);
      if (error) {
        console.error('Error fetching services:', error);
        return NextResponse.json({ services: [] });
      }
      return NextResponse.json({ services: services || [] });
    }

    // If requesting locations
    if (fetchLocations === 'true') {
      const locations = [
        {
          id: 'salon-by-altin',
          name: 'The Salon By Altin Ltd',
          displayName: 'Alternate Salon',
          address: '19 Church Street, Caversham, RG4 8BA',
          city: 'Reading',
          phone: '01189073333',
          bookingSystem: 'ours',
          isPartner: true
        },
        {
          id: 'urban-sanctuary',
          name: 'Urban Sanctuary',
          address: '29 King St, Knutsford, WA16 6DW',
          phone: '01565 123 456',
          city: 'Knutsford',
          bookingSystem: 'theirs',
          externalUrl: 'https://urbansanctuary.org.uk/book-online/',
          isPartner: true
        },
        {
          id: 'fixx-salon',
          name: 'Fixx Salon',
          address: '1b Lloyd St, Altrincham, WA14 2DD',
          phone: '0161 123 4567',
          city: 'Altrincham',
          bookingSystem: 'theirs',
          externalUrl: 'https://phorest.com/book/salons/fixxsalonsltd',
          isPartner: true
        },
      ];
      return NextResponse.json({ locations });
    }

    // Otherwise return bookings
    const bookings = await db.getAllBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
