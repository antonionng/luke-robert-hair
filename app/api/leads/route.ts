import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, course, notes } = await request.json();

    // Create or find contact
    const contact = await db.createContact({
      name,
      email,
      phone,
      type: 'education',
    });

    // Create lead
    const lead = await db.createLead({
      contactId: contact.id,
      course,
      status: 'new',
      notes,
    });

    // In production, send notification email
    console.log('Education lead created:', {
      leadId: lead.id,
      contactId: contact.id,
      course,
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Education enquiry submitted successfully',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process education enquiry' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const leads = await db.getAllLeads();
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('Get leads error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}
