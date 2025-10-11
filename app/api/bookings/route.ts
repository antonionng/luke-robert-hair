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

export async function GET() {
  try {
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
