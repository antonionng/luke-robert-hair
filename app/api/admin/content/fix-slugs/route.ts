import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

/**
 * POST /api/admin/content/fix-slugs
 * Fix missing slugs for existing content
 */
export async function POST() {
  try {
    // Get all content without slugs
    const { data: content, error: fetchError } = await supabase
      .from('content_queue')
      .select('id, title, slug')
      .or('slug.is.null,slug.eq.');

    if (fetchError) {
      throw new Error(`Failed to fetch content: ${fetchError.message}`);
    }

    if (!content || content.length === 0) {
      return NextResponse.json({ 
        message: 'No content needs slug fixes',
        fixed: 0 
      });
    }

    console.log(`Found ${content.length} posts without slugs`);

    // Update each post with a slug
    const updates = content.map(async (post) => {
      const slug = slugify(post.title);
      
      const { error: updateError } = await supabase
        .from('content_queue')
        .update({ slug })
        .eq('id', post.id);

      if (updateError) {
        console.error(`Failed to update post ${post.id}:`, updateError);
        return { id: post.id, success: false, error: updateError.message };
      }

      return { id: post.id, title: post.title, slug, success: true };
    });

    const results = await Promise.all(updates);
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success);

    return NextResponse.json({ 
      message: `Fixed ${successful} posts`,
      fixed: successful,
      failed: failed.length,
      failedItems: failed.length > 0 ? failed : undefined,
      results 
    });
  } catch (error: any) {
    console.error('POST /api/admin/content/fix-slugs error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fix slugs' },
      { status: 500 }
    );
  }
}

