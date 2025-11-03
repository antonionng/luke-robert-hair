import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

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
      // For now, return hardcoded services until we have them in DB
      const services = [
        { id: '1', name: 'Precision Cut', price: 65, duration: 60 },
        { id: '2', name: 'Cut & Finish', price: 85, duration: 90 },
        { id: '3', name: 'Colour Service', price: 120, duration: 120 },
        { id: '4', name: 'Balayage', price: 180, duration: 180 },
        { id: '5', name: 'Restyle', price: 95, duration: 90 },
      ];
      return NextResponse.json({ services });
    }

    // If requesting locations
    if (fetchLocations === 'true') {
      const locations = [
        {
          id: 'salon-by-altin',
          name: 'The Salon By Altin Ltd',
          displayName: 'Luke Robert Hair',
          address: '19 Church Street, Caversham, RG4 8BA',
          city: 'Reading',
          phone: null,
          bookingSystem: 'ours'
        },
        {
          id: 'urban-sanctuary',
          name: 'Urban Sanctuary',
          address: '29 King St, Knutsford, WA16 6DW',
          phone: '01565 123 456',
          city: 'Knutsford',
          bookingSystem: 'theirs',
          externalUrl: 'https://urbansanctuary.org.uk/book-online/'
        },
        {
          id: 'fixx-salon',
          name: 'Fixx Salon',
          address: '1b Lloyd St, Altrincham, WA14 2DD',
          phone: '0161 123 4567',
          city: 'Altrincham',
          bookingSystem: 'theirs',
          externalUrl: 'https://phorest.com/book/salons/fixxsalonsltd'
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
