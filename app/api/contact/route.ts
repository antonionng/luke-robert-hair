import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, type, message } = await request.json();

    // Create contact in database
    const contact = await db.createContact({
      name,
      email,
      phone,
      type,
    });

    // In production, send email notification using Resend
    // await sendContactNotification({ name, email, phone, type, message });

    console.log('Contact form submission:', {
      contactId: contact.id,
      name,
      email,
      type,
      message,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      contactId: contact.id,
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}
