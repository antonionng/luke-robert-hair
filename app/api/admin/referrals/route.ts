import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { ReferralLeaderboard } from '@/lib/types';

/**
 * Get all referral codes and analytics (Admin only)
 * GET /api/admin/referrals
 */
export async function GET(request: NextRequest) {
  try {
    // Get all referral codes with stats from the view
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('referral_leaderboard')
      .select('*')
      .order('completed_bookings', { ascending: false });

    if (leaderboardError) {
      console.error('Error fetching referral leaderboard:', leaderboardError);
      return NextResponse.json(
        { error: 'Failed to fetch referral data' },
        { status: 500 }
      );
    }

    // Calculate aggregate stats
    const totalCodes = leaderboard?.length || 0;
    const activeCodes = leaderboard?.filter(r => r.status === 'active').length || 0;
    const totalRedemptions = leaderboard?.reduce((sum, r) => sum + r.total_redemptions, 0) || 0;
    const totalCompletedBookings = leaderboard?.reduce((sum, r) => sum + r.completed_bookings, 0) || 0;
    const totalDiscountsGiven = leaderboard?.reduce((sum, r) => sum + (r.total_discounts_given || 0), 0) || 0;
    const overallConversionRate = totalRedemptions > 0 
      ? Math.round((totalCompletedBookings / totalRedemptions) * 100)
      : 0;

    // Get recent activity
    const { data: recentRedemptions } = await supabase
      .from('referral_redemptions')
      .select(`
        id,
        referee_name,
        referee_email,
        redeemed_at,
        booking_completed,
        referral_codes (code, referrer_name)
      `)
      .order('redeemed_at', { ascending: false })
      .limit(10);

    return NextResponse.json({
      success: true,
      aggregateStats: {
        totalCodes,
        activeCodes,
        totalRedemptions,
        totalCompletedBookings,
        totalDiscountsGiven,
        overallConversionRate,
      },
      leaderboard: leaderboard || [],
      recentActivity: recentRedemptions || [],
    });
  } catch (error: any) {
    console.error('Get admin referrals error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Update referral code status (Admin only)
 * PATCH /api/admin/referrals
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { codeId, status, notes } = body;

    if (!codeId || !status) {
      return NextResponse.json(
        { error: 'Code ID and status are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['active', 'expired', 'disabled'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Update referral code
    const updateData: any = { status };
    if (notes !== undefined) {
      updateData.notes = notes;
    }

    const { data: updatedCode, error: updateError } = await supabase
      .from('referral_codes')
      .update(updateData)
      .eq('id', codeId)
      .select()
      .single();

    if (updateError || !updatedCode) {
      console.error('Failed to update referral code:', updateError);
      return NextResponse.json(
        { error: 'Failed to update referral code' },
        { status: 500 }
      );
    }

    console.log('✅ Referral code updated:', {
      code: updatedCode.code,
      newStatus: status,
    });

    return NextResponse.json({
      success: true,
      referralCode: updatedCode,
    });
  } catch (error: any) {
    console.error('Update referral code error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

