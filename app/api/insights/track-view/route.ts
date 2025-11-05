import { NextRequest, NextResponse } from 'next/server';
import { trackContentEvent } from '@/lib/contentEngine';

/**
 * POST /api/insights/track-view
 * Track content view events
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, sessionId, source, medium, campaign, referrer } = body;

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
    }

    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      undefined;

    const result = await trackContentEvent({
      contentId,
      type: 'view',
      sessionId,
      source,
      medium,
      campaign,
      referrer,
      userAgent,
      ipAddress,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/insights/track-view error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track view' },
      { status: 500 }
    );
  }
}




