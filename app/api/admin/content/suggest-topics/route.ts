import { NextRequest, NextResponse } from 'next/server';
import { suggestContentTopics } from '@/lib/contentEngine';
import { db } from '@/lib/supabase';

/**
 * POST /api/admin/content/suggest-topics
 * Generate AI-powered topic suggestions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      categories,
      baseIdeas,
      seasonalFocus,
      count = 5,
      toneOverride,
    } = body;

    // Optionally fetch lead interests from the database
    let leadInterests: string[] = [];
    if (body.includeLeadInterests !== false) {
      const { data: leads } = await db.getAllLeads();
      if (leads && leads.length > 0) {
        const interests: Record<string, number> = {};
        leads.forEach((lead: any) => {
          if (lead.course_interest) {
            interests[lead.course_interest] = (interests[lead.course_interest] || 0) + 1;
          }
          if (lead.tags && Array.isArray(lead.tags)) {
            lead.tags.forEach((tag: string) => {
              interests[tag] = (interests[tag] || 0) + 1;
            });
          }
        });

        leadInterests = Object.entries(interests)
          .sort(([, a], [, b]) => (b as number) - (a as number))
          .slice(0, 5)
          .map(([interest]) => interest);
      }
    }

    const suggestions = await suggestContentTopics({
      categories: Array.isArray(categories) ? categories : undefined,
      baseIdeas: Array.isArray(baseIdeas) ? baseIdeas : undefined,
      seasonalFocus,
      leadInterests,
      toneOverride,
      count: Math.min(Math.max(parseInt(count, 10) || 5, 1), 10),
    });

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('POST /api/admin/content/suggest-topics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate topic suggestions' },
      { status: 500 }
    );
  }
}




