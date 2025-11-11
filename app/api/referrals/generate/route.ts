import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { GenerateReferralRequest, GenerateReferralResponse } from '@/lib/types';

/**
 * Generate a unique referral code for a client
 * POST /api/referrals/generate
 */
export async function POST(request: NextRequest) {
  try {
    const body: GenerateReferralRequest = await request.json();
    const { email, name, phone } = body;

    // Validate required fields
    if (!email || !name) {
      return NextResponse.json<GenerateReferralResponse>(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<GenerateReferralResponse>(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if user already has an active referral code
    const { data: existingCode } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('referrer_email', email.toLowerCase())
      .eq('status', 'active')
      .single();

    if (existingCode) {
      // Return existing code
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lukerobert.co.uk';
      const shareUrl = `${baseUrl}/book?ref=${existingCode.code}`;
      const shareText = `Try Luke's precision haircuts! Use my code ${existingCode.code} for £${existingCode.discount_value} off your first appointment. ${shareUrl}`;

      return NextResponse.json<GenerateReferralResponse>({
        success: true,
        code: existingCode.code,
        shareUrl,
        shareText,
      });
    }

    // Generate unique referral code
    const code = await generateUniqueCode(name);

    // Calculate expiry date (6 months from now)
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 6);

    // Create referral code in database
    const { data: newCode, error: createError } = await supabase
      .from('referral_codes')
      .insert({
        code,
        referrer_email: email.toLowerCase(),
        referrer_name: name,
        referrer_phone: phone || null,
        status: 'active',
        expires_at: expiresAt.toISOString(),
        total_uses: 0,
        max_uses: 10,
        discount_type: 'fixed',
        discount_value: 10.00, // £10 off
      })
      .select()
      .single();

    if (createError || !newCode) {
      console.error('Failed to create referral code:', createError);
      return NextResponse.json<GenerateReferralResponse>(
        { success: false, error: 'Failed to create referral code' },
        { status: 500 }
      );
    }

    // Create a lead entry if they don't exist
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (!existingLead) {
      await supabase.from('leads').insert({
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || name.split(' ')[0],
        email: email.toLowerCase(),
        phone: phone || null,
        source: 'referral_program',
        lead_type: 'individual',
        lifecycle_stage: 'new',
        lead_score: 5,
        custom_fields: {
          hasReferralCode: true,
          referralCode: code,
        },
      });
    }

    // Build share URL and text
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://lukerobert.co.uk';
    const shareUrl = `${baseUrl}/book?ref=${code}`;
    const shareText = `Try Luke's precision haircuts! Use my code ${code} for £10 off your first appointment. ${shareUrl}`;

    // Send email with referral code
    try {
      const { sendReferralCodeEmail } = await import('@/lib/email');
      await sendReferralCodeEmail({
        email,
        name,
        code,
        shareUrl,
        shareText,
      });
      console.log('✅ Referral code email sent to:', email);
    } catch (emailError) {
      console.error('⚠️ Failed to send referral code email:', emailError);
      // Don't fail the entire request if email fails
    }

    console.log('✅ Referral code created:', {
      code,
      referrer: name,
      email,
    });

    return NextResponse.json<GenerateReferralResponse>({
      success: true,
      code,
      shareUrl,
      shareText,
    });
  } catch (error: any) {
    console.error('Generate referral code error:', error);
    return NextResponse.json<GenerateReferralResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate a unique referral code
 * Format: LUKE-{FIRSTNAME}-{RANDOM}
 */
async function generateUniqueCode(name: string): Promise<string> {
  const firstName = name.split(' ')[0].toUpperCase();
  let code: string;
  let isUnique = false;
  let attempts = 0;

  while (!isUnique && attempts < 10) {
    // Generate random string (3 characters)
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    code = `LUKE-${firstName}-${random}`;

    // Check if code already exists
    const { data } = await supabase
      .from('referral_codes')
      .select('id')
      .eq('code', code)
      .single();

    if (!data) {
      isUnique = true;
      return code;
    }

    attempts++;
  }

  // Fallback with timestamp if we couldn't generate unique code
  const timestamp = Date.now().toString(36).toUpperCase().substring(-4);
  return `LUKE-${firstName}-${timestamp}`;
}

