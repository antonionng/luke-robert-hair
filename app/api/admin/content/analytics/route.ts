import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

/**
 * GET /api/admin/content/analytics
 * Get analytics summary for all published content
 */
export async function GET(request: NextRequest) {
  try {
    const { data: publishedContent, error: contentError } = await db.getPublishedContent();

    if (contentError) {
      return NextResponse.json({ error: contentError.message }, { status: 500 });
    }

    const analytics = await Promise.all(
      (publishedContent || []).map(async (content: any) => {
        const { data: summary } = await db.getContentAnalyticsSummary(content.id);

        const eventCounts: Record<string, number> = {};
        if (summary && Array.isArray(summary)) {
          summary.forEach((item: any) => {
            eventCounts[item.event_type] = item.total || 0;
          });
        }

        return {
          id: content.id,
          title: content.title,
          slug: content.slug,
          category: content.category,
          publishedAt: content.published_at,
          views: content.views || eventCounts.view || 0,
          clicks: content.clicks || eventCounts.click || 0,
          ctaClicks: eventCounts.cta_click || 0,
          shares: eventCounts.share || 0,
          impressions: eventCounts.impression || 0,
          leadsGenerated: content.leads_generated || 0,
        };
      })
    );

    return NextResponse.json({ analytics });
  } catch (error: any) {
    console.error('GET /api/admin/content/analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}




