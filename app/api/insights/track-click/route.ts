import { NextRequest, NextResponse } from 'next/server';
import { trackContentEvent } from '@/lib/contentEngine';

/**
 * POST /api/insights/track-click
 * Track content click events (CTA, shares, etc.)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, sessionId, eventType = 'click', metadata } = body;

    if (!contentId) {
      return NextResponse.json({ error: 'contentId is required' }, { status: 400 });
    }

    const validEventTypes = ['click', 'cta_click', 'share'];
    if (!validEventTypes.includes(eventType)) {
      return NextResponse.json(
        { error: `eventType must be one of: ${validEventTypes.join(', ')}` },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get('user-agent') || undefined;
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                      request.headers.get('x-real-ip') || 
                      undefined;

    const result = await trackContentEvent({
      contentId,
      eventType,
      sessionId,
      userAgent,
      ipAddress,
      metadata,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('POST /api/insights/track-click error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to track click' },
      { status: 500 }
    );
  }
}




