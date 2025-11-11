import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ReferralStatsResponse } from '@/lib/types';

/**
 * Get referral stats for a user
 * GET /api/referrals/stats?email=user@example.com
 * GET /api/referrals/stats?code=LUKE-SARAH-ABC
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const code = searchParams.get('code');

    if (!email && !code) {
      return NextResponse.json<ReferralStatsResponse>(
        { success: false, error: 'Email or code parameter is required' },
        { status: 400 }
      );
    }

    // Get referral code
    let referralCode;
    if (code) {
      const { data } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();
      referralCode = data;
    } else if (email) {
      const { data } = await supabase
        .from('referral_codes')
        .select('*')
        .eq('referrer_email', email.toLowerCase())
        .eq('status', 'active')
        .single();
      referralCode = data;
    }

    if (!referralCode) {
      return NextResponse.json<ReferralStatsResponse>({
        success: false,
        error: 'No referral code found for this user',
      });
    }

    // Get all redemptions for this code
    const { data: redemptions, error: redemptionsError } = await supabase
      .from('referral_redemptions')
      .select('*')
      .eq('referral_code_id', referralCode.id)
      .order('redeemed_at', { ascending: false });

    if (redemptionsError) {
      console.error('Error fetching redemptions:', redemptionsError);
      return NextResponse.json<ReferralStatsResponse>(
        { success: false, error: 'Failed to fetch referral stats' },
        { status: 500 }
      );
    }

    const totalRedemptions = redemptions?.length || 0;
    const completedBookings = redemptions?.filter(r => r.booking_completed).length || 0;
    const pendingBookings = totalRedemptions - completedBookings;
    const totalCreditsEarned = redemptions
      ?.filter(r => r.booking_completed && r.referrer_credit_amount)
      .reduce((sum, r) => sum + (r.referrer_credit_amount || 0), 0) || 0;
    
    const conversionRate = totalRedemptions > 0 
      ? Math.round((completedBookings / totalRedemptions) * 100)
      : 0;

    // Get recent redemptions for display
    const recentRedemptions = (redemptions || []).slice(0, 5).map(r => ({
      refereeName: r.referee_name,
      redeemedAt: r.redeemed_at,
      bookingCompleted: r.booking_completed,
    }));

    return NextResponse.json<ReferralStatsResponse>({
      success: true,
      stats: {
        code: referralCode.code,
        totalUses: referralCode.total_uses,
        maxUses: referralCode.max_uses,
        remainingUses: referralCode.max_uses - referralCode.total_uses,
        totalRedemptions,
        completedBookings,
        pendingBookings,
        totalCreditsEarned,
        conversionRate,
      },
      recentRedemptions,
    });
  } catch (error: any) {
    console.error('Get referral stats error:', error);
    return NextResponse.json<ReferralStatsResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

