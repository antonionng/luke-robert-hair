import { NextRequest, NextResponse } from 'next/server';
import { db, supabase } from '@/lib/supabase';

/**
 * GET /api/posts
 * Fetch published content for public insights page
 * Query params:
 * - slug: fetch single post by slug
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    // Fetch single post by slug
    if (slug) {
      const { data, error } = await supabase
        .from('content_queue')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

      if (error || !data) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      const post = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        image_url: data.image_url,
        hero_alt: data.hero_alt,
        hero_caption: data.hero_caption,
        published_at: data.published_at,
        ai_generated: data.ai_generated,
        insight_tags: data.insight_tags || [],
        reading_time_minutes: data.reading_time_minutes,
        cta_label: data.cta_label,
        cta_url: data.cta_url,
        cta_description: data.cta_description,
      };

      return NextResponse.json({ post });
    }

    // Fetch all published posts
    const { data, error } = await db.getPublishedContent();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Map to public-friendly format with featured and pinned_until fields
    const now = new Date();
    const posts = (data || []).map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      category: item.category,
      image_url: item.image_url,
      published_at: item.published_at,
      ai_generated: item.ai_generated,
      insight_tags: item.insight_tags || [],
      reading_time_minutes: item.reading_time_minutes,
      featured: item.featured || false,
      pinned_until: item.pinned_until,
    }));

    // Smart sorting: pinned (non-expired) first, then featured, then by date
    const sortedPosts = posts.sort((a, b) => {
      const aIsPinned = a.pinned_until && new Date(a.pinned_until) > now;
      const bIsPinned = b.pinned_until && new Date(b.pinned_until) > now;
      
      // 1. Pinned posts come first
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      
      // 2. Then featured posts
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      
      // 3. Then by published date (newest first)
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
    });

    return NextResponse.json({ posts: sortedPosts });
  } catch (error: any) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}
