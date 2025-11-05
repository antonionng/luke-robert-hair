import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

/**
 * GET /api/admin/content/analytics/:id
 * Get detailed analytics for a specific content item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');
    const eventTypes = searchParams.get('eventTypes')?.split(',') as any[];
    const limit = searchParams.get('limit');

    const options: any = {};
    if (start) options.start = new Date(start);
    if (end) options.end = new Date(end);
    if (eventTypes) options.eventTypes = eventTypes;
    if (limit) options.limit = parseInt(limit, 10);

    const { data: events, error: eventsError } = await db.getContentAnalyticsEvents(
      params.id,
      options
    );

    if (eventsError) {
      return NextResponse.json({ error: eventsError.message }, { status: 500 });
    }

    const { data: summary } = await db.getContentAnalyticsSummary(params.id);

    const eventCounts: Record<string, number> = {};
    if (summary && Array.isArray(summary)) {
      summary.forEach((item: any) => {
        eventCounts[item.event_type] = item.total || 0;
      });
    }

    return NextResponse.json({
      events: events || [],
      summary: {
        views: eventCounts.view || 0,
        clicks: eventCounts.click || 0,
        ctaClicks: eventCounts.cta_click || 0,
        shares: eventCounts.share || 0,
        impressions: eventCounts.impression || 0,
      },
    });
  } catch (error: any) {
    console.error(`GET /api/admin/content/analytics/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}




