import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ValidateReferralRequest, ValidateReferralResponse } from '@/lib/types';

/**
 * Validate a referral code
 * POST /api/referrals/validate
 */
export async function POST(request: NextRequest) {
  try {
    const body: ValidateReferralRequest = await request.json();
    const { code, email } = body;

    // Validate required fields
    if (!code || !email) {
      return NextResponse.json<ValidateReferralResponse>(
        {
          valid: false,
          message: 'Code and email are required',
        },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedCode = code.trim().toUpperCase();
    const normalizedEmail = email.trim().toLowerCase();

    // Get referral code from database
    const { data: referralCode, error: fetchError } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('code', normalizedCode)
      .single();

    if (fetchError || !referralCode) {
      return NextResponse.json<ValidateReferralResponse>({
        valid: false,
        message: 'Invalid referral code. Please check and try again.',
      });
    }

    // Check if code is active
    if (referralCode.status !== 'active') {
      return NextResponse.json<ValidateReferralResponse>({
        valid: false,
        message: 'This referral code is no longer active.',
      });
    }

    // Check if code has expired
    if (referralCode.expires_at) {
      const expiryDate = new Date(referralCode.expires_at);
      if (expiryDate < new Date()) {
        // Update status to expired
        await supabase
          .from('referral_codes')
          .update({ status: 'expired' })
          .eq('id', referralCode.id);

        return NextResponse.json<ValidateReferralResponse>({
          valid: false,
          message: 'This referral code has expired.',
        });
      }
    }

    // Check if code has reached max uses
    if (referralCode.total_uses >= referralCode.max_uses) {
      return NextResponse.json<ValidateReferralResponse>({
        valid: false,
        message: 'This referral code has reached its maximum number of uses.',
      });
    }

    // Check if user is trying to use their own code
    if (referralCode.referrer_email === normalizedEmail) {
      return NextResponse.json<ValidateReferralResponse>({
        valid: false,
        message: 'You cannot use your own referral code.',
      });
    }

    // Check if this email has already used this code
    const { data: existingRedemption } = await supabase
      .from('referral_redemptions')
      .select('id')
      .eq('referral_code_id', referralCode.id)
      .eq('referee_email', normalizedEmail)
      .single();

    if (existingRedemption) {
      return NextResponse.json<ValidateReferralResponse>({
        valid: false,
        message: 'You have already used this referral code.',
      });
    }

    // Code is valid! Calculate discount
    let discountFormatted: string;
    if (referralCode.discount_type === 'fixed') {
      discountFormatted = `£${referralCode.discount_value.toFixed(2)} off`;
    } else {
      discountFormatted = `${referralCode.discount_value}% off`;
    }

    return NextResponse.json<ValidateReferralResponse>({
      valid: true,
      discount: {
        type: referralCode.discount_type,
        value: referralCode.discount_value,
        formatted: discountFormatted,
      },
      message: `Great! You'll get ${discountFormatted} your booking.`,
      referralCode: referralCode,
    });
  } catch (error: any) {
    console.error('Validate referral code error:', error);
    return NextResponse.json<ValidateReferralResponse>(
      {
        valid: false,
        message: 'An error occurred while validating the code. Please try again.',
      },
      { status: 500 }
    );
  }
}

