import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { updateContentPreview } from '@/lib/contentEngine';

/**
 * GET /api/admin/content/queue/:id
 * Fetch a single content item
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await db.getContentById(params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ content: data });
  } catch (error: any) {
    console.error(`GET /api/admin/content/queue/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/content/queue/:id
 * Update a content item (for editing, scheduling, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const updates: any = {};

    if (body.title !== undefined) updates.title = body.title;
    if (body.excerpt !== undefined) updates.excerpt = body.excerpt;
    if (body.content !== undefined) updates.content = body.content;
    if (body.category !== undefined) updates.category = body.category;
    if (body.status !== undefined) updates.status = body.status;
    if (body.seoTitle !== undefined) updates.seo_title = body.seoTitle;
    if (body.metaDescription !== undefined) updates.meta_description = body.metaDescription;
    if (body.keywords !== undefined) updates.keywords = body.keywords;
    if (body.insightTags !== undefined) updates.insight_tags = body.insightTags;
    if (body.ctaLabel !== undefined) updates.cta_label = body.ctaLabel;
    if (body.ctaUrl !== undefined) updates.cta_url = body.ctaUrl;
    if (body.ctaDescription !== undefined) updates.cta_description = body.ctaDescription;
    if (body.editorNotes !== undefined) updates.editor_notes = body.editorNotes;
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);
    if (body.pinnedUntil !== undefined) {
      updates.pinned_until = body.pinnedUntil ? new Date(body.pinnedUntil).toISOString() : null;
    }
    if (body.scheduledFor !== undefined) {
      updates.scheduled_for = body.scheduledFor ? new Date(body.scheduledFor).toISOString() : null;
    }

    // Auto-set published_at when status changes to 'published'
    if (body.status === 'published') {
      updates.published_at = body.published_at || new Date().toISOString();
      // Clear scheduled_for when publishing immediately
      if (!body.scheduledFor) {
        updates.scheduled_for = null;
      }
    }

    // Auto-set scheduled_for when status changes to 'scheduled'
    if (body.status === 'scheduled' && body.scheduled_for) {
      updates.scheduled_for = new Date(body.scheduled_for).toISOString();
      updates.published_at = null; // Clear published_at for scheduled content
    }

    // If content was edited, regenerate preview
    if (body.content !== undefined && body.previewedBy) {
      await updateContentPreview(params.id, body.content, {
        previewedBy: body.previewedBy,
        editorNotes: body.editorNotes,
      });
    }

    const { data, error } = await db.updateContent(params.id, updates);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json({ content: data });
  } catch (error: any) {
    console.error(`PATCH /api/admin/content/queue/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to update content' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/content/queue/:id
 * Archive a content item
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await db.updateContent(params.id, {
      status: 'archived',
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`DELETE /api/admin/content/queue/${params.id} error:`, error);
    return NextResponse.json(
      { error: error.message || 'Failed to archive content' },
      { status: 500 }
    );
  }
}




