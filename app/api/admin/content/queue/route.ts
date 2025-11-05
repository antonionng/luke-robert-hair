import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/supabase';

/**
 * GET /api/admin/content/queue
 * Fetch content queue with optional status filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as any;

    let result;
    if (status) {
      result = await db.getContentByStatus(status);
    } else {
      // Get all content, ordered by most recent
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      result = await supabase
        .from('content_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
    }

    const { data, error } = result;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ content: data || [] });
  } catch (error: any) {
    console.error('GET /api/admin/content/queue error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch content queue' },
      { status: 500 }
    );
  }
}

