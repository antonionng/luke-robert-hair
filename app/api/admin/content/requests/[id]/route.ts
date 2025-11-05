import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

/**
 * GET /api/admin/content/requests/:id
 * Fetch a single content request
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await db.getContentRequest(params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: data });
  } catch (error: any) {
    console.error(`GET /api/admin/content/requests/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch request' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/content/requests/:id
 * Update a content request
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updates: any = {};

    if (body.status !== undefined) updates.status = body.status;
    if (body.title !== undefined) updates.title = body.title;
    if (body.topic !== undefined) updates.topic = body.topic;
    if (body.category !== undefined) updates.category = body.category;
    if (body.summary !== undefined) updates.summary = body.summary;
    if (body.brief !== undefined) updates.brief = body.brief;
    if (body.audience !== undefined) updates.audience = body.audience;
    if (body.tone !== undefined) updates.tone = body.tone;
    if (body.objectives !== undefined) {
      updates.objectives = Array.isArray(body.objectives)
        ? body.objectives.join('\n')
        : body.objectives;
    }
    if (body.targetKeywords !== undefined) updates.target_keywords = body.targetKeywords;
    if (body.inspirationLinks !== undefined) updates.inspiration_links = body.inspirationLinks;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.preferredPublishDate !== undefined) {
      updates.preferred_publish_date = body.preferredPublishDate
        ? new Date(body.preferredPublishDate).toISOString()
        : null;
    }
    if (body.scheduledFor !== undefined) {
      updates.scheduled_for = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
    }
    if (body.autoPublish !== undefined) updates.auto_publish = Boolean(body.autoPublish);
    if (body.priority !== undefined) updates.priority = parseInt(body.priority, 10);
    if (body.metadata !== undefined) updates.metadata = body.metadata;

    const { data, error } = await db.updateContentRequest(params.id, updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }

    return NextResponse.json({ request: data });
  } catch (error: any) {
    console.error(`PATCH /api/admin/content/requests/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update request' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content/requests/:id
 * Cancel/delete a content request
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await db.updateContentRequest(params.id, {
      status: 'cancelled',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/admin/content/requests/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to cancel request' },
      { status: 500 }
    );
  }
}




