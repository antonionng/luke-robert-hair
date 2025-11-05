import { NextRequest, NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/contentEngine';

/**
 * POST /api/admin/content/generate
 * Trigger content generation (manual or automatic)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📝 [GENERATE] Request body:', JSON.stringify(body, null, 2));

    const {
      requestId,
      category,
      source,
      reviewedBy,
      scheduledFor,
      autoPublish,
      requestedBy,
      metadata,
    } = body;

    console.log('📝 [GENERATE] Starting generation with requestId:', requestId);

    const result = await generateBlogPost({
      requestId,
      category,
      source,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      autoPublish: Boolean(autoPublish),
      requestedBy: requestedBy || reviewedBy,
      metadata,
    });

    console.log('📝 [GENERATE] Result:', result);

    if (!result.success) {
      console.error('📝 [GENERATE] Generation failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      contentId: result.contentId,
      requestId: result.requestId,
    });
  } catch (error: any) {
    console.error('POST /api/admin/content/generate error:', error);
    console.error('Stack trace:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to generate content' },
      { status: 500 }
    );
  }
}

