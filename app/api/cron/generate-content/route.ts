/**
 * CRON: Generate AI Content
 * Schedule: Monday, Wednesday, Friday at 9am
 * Purpose: Generate new blog posts for review
 */

import { NextResponse } from 'next/server';
import { generateBlogPost } from '@/lib/contentEngine';

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log('📝 [CRON] Generating AI content...');
    
    // Generate one blog post (category will be auto-selected)
    const result = await generateBlogPost();
    
    if (result.success) {
      console.log(`✅ [CRON] Content generated: ${result.contentId}`);
      
      // TODO: Send notification to admin that content is ready for review
      
      return NextResponse.json({
        success: true,
        contentId: result.contentId,
        message: 'Content generated and queued for review',
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error(`❌ [CRON] Content generation failed: ${result.error}`);
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('❌ [CRON] Content generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Content generation failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}



