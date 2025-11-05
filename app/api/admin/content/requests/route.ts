import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { createManualContentRequest } from '@/lib/contentEngine';

/**
 * GET /api/admin/content/requests
 * Fetch content requests with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;
    const source = searchParams.get('source') as any;
    const limit = searchParams.get('limit');

    const params: any = {};
    if (status) params.status = status;
    if (source) params.requestSource = source;
    if (limit) params.limit = parseInt(limit, 10);

    const { data, error } = await db.getContentRequests(params);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ requests: data || [] });
  } catch (error: any) {
    console.error('GET /api/admin/content/requests error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch requests' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/content/requests
 * Create a new manual content request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      topic,
      category,
      title,
      summary,
      brief,
      audience,
      tone,
      objectives,
      targetKeywords,
      inspirationLinks,
      notes,
      requestedBy,
      preferredPublishDate,
      scheduledFor,
      autoPublish,
      priority,
      metadata,
    } = body;

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    if (!category || category.trim().length === 0) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const contentRequest = await createManualContentRequest({
      topic,
      category,
      title,
      summary,
      brief,
      audience,
      tone,
      objectives: Array.isArray(objectives) ? objectives : undefined,
      targetKeywords: Array.isArray(targetKeywords) ? targetKeywords : undefined,
      inspirationLinks: Array.isArray(inspirationLinks) ? inspirationLinks : undefined,
      notes,
      requestedBy,
      preferredPublishDate: preferredPublishDate ? new Date(preferredPublishDate) : undefined,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      autoPublish: Boolean(autoPublish),
      priority: priority ? parseInt(priority, 10) : 3,
      metadata,
    });

    return NextResponse.json({ request: contentRequest }, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/admin/content/requests error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create request' },
      { status: 500 }
    );
  }
}




