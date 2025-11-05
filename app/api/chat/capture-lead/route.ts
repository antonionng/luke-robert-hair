import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { 
      name, 
      email, 
      phone, 
      context, 
      extractedInfo, 
      conversationSummary 
    } = await request.json();

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Split name into first and last
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

    // Create CPD lead with chat-extracted information
    const leadData = {
      leadType: 'cpd_partnership',
      firstName,
      lastName,
      email,
      phone: phone || undefined,
      institution: extractedInfo?.institution,
      jobTitle: extractedInfo?.jobTitle,
      studentNumbers: extractedInfo?.studentNumbers,
      courseInterest: extractedInfo?.courseInterest || 'Not specified',
      deliveryPreference: extractedInfo?.deliveryPreference,
      message: conversationSummary,
      source: 'ai_chat_cpd',
    };

    // Call the leads API to create the lead
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/leads`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Failed to create lead:', data);
      return NextResponse.json(
        { error: data.error || 'Failed to create lead' },
        { status: response.status }
      );
    }

    return NextResponse.json({ 
      success: true, 
      leadId: data.leadId,
      message: "Perfect! I've passed your details to Luke. You'll hear from us within 24 hours to arrange your discovery call." 
    });
  } catch (error: any) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to capture lead' },
      { status: 500 }
    );
  }
}






