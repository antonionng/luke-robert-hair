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

    console.log('Booking created:', {
      bookingId: booking.id,
      contactId: contact.id,
      service,
      location,
      date,
      time,
    });

    // Get service and location details from database
    const { data: serviceData } = await supabaseDb.getServices(true);
    const serviceDetails = serviceData?.find(s => s.id === service);
    
    // Get location details
    const locations = [
      {
        id: 'salon-by-altin',
        name: 'The Salon By Altin Ltd',
        address: '19 Church Street, Caversham, RG4 8BA',
      },
      {
        id: 'urban-sanctuary',
        name: 'Urban Sanctuary',
        address: '29 King St, Knutsford, WA16 6DW',
      },
      {
        id: 'fixx-salon',
        name: 'Fixx Salon',
        address: '1b Lloyd St, Altrincham, WA14 2DD',
      },
    ];
    const locationDetails = locations.find(l => l.id === location);

    // Send confirmation email to user
    try {
      const { sendBookingConfirmation } = await import('@/lib/email');
      await sendBookingConfirmation({
        clientEmail: email,
        clientName: name,
        serviceName: serviceDetails?.name || service,
        locationName: locationDetails?.name || location,
        locationAddress: locationDetails?.address || 'TBC',
        dateTime: new Date(`${date}T${time}`),
        duration: serviceDetails?.duration_minutes || 60,
        price: serviceDetails?.price || 0,
        depositRequired: serviceDetails?.deposit_required || false,
        depositAmount: serviceDetails?.deposit_amount || 0,
        bookingId: booking.id,
      });
      console.log('✅ [BOOKINGS API] Confirmation email sent to user');
    } catch (emailError) {
      console.error('⚠️ [BOOKINGS API] Failed to send confirmation email:', emailError);
      // Don't fail the entire request if email fails
    }

    // Send admin notification (high priority - immediate alert)
    try {
      const { sendAdminNotification } = await import('@/lib/email');
      await sendAdminNotification('new_booking', {
        clientName: name,
        clientEmail: email,
        clientPhone: phone,
        serviceName: serviceDetails?.name || service,
        locationName: locationDetails?.name || location,
        dateTime: new Date(`${date}T${time}`),
        price: serviceDetails?.price || 0,
        depositRequired: serviceDetails?.deposit_required || false,
        depositAmount: serviceDetails?.deposit_amount || 0,
        notes,
        bookingId: booking.id,
      });
      console.log('✅ [BOOKINGS API] Admin notification sent');
    } catch (emailError) {
      console.error('⚠️ [BOOKINGS API] Failed to send admin notification:', emailError);
      // Don't fail the entire request if email fails
    }

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
