/**
 * CONTENT MARKETING ENGINE
 * 
 * AI-powered content generation system that creates blog posts automatically
 * - Intelligent topic selection based on trends, seasonality, and lead interests
 * - Avoids repetition by analyzing recent posts
 * - DALL-E image generation for each post
 * - SEO optimization
 * - Approval workflow before publishing
 * 
 * Runs 3x per week (Mon/Wed/Fri) via cron job
 */

import OpenAI from 'openai';
import { db } from './supabase';
import { Database } from './supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ContentCategory = 'Salon Tips' | 'Education Insights' | 'Product Highlights';

// Brand style guide for content
const CONTENT_STYLE = {
  voice: 'Confident, clear, educational',
  tone: 'Professional yet approachable',
  expertise: 'Expert hairdresser and educator with 15+ years experience',
  values: ['Craftsmanship', 'Education', 'Precision', 'Wearable results'],
  avoid: ['Hype', 'Gimmicks', 'Overpromising', 'Trends without substance'],
};

/**
 * Generate a new blog post using AI
 */
export async function generateBlogPost(category?: ContentCategory): Promise<{
  success: boolean;
  contentId?: string;
  error?: string;
}> {
  try {
    // Select category if not provided (rotate)
    if (!category) {
      category = await selectNextCategory();
    }

    // Select topic intelligently
    const topic = await selectIntelligentTopic(category);

    // Get context for AI (recent posts, trending topics, lead interests)
    const context = await buildContentContext(category, topic);

    // Generate content with AI
    const content = await generateContentWithAI(category, topic, context);

    // Generate image with DALL-E
    const imageUrl = await generateContentImage(content.title, category);

    // Save to content queue for review
    const { data: contentRecord, error: saveError } = await db.createContent({
      title: content.title,
      excerpt: content.excerpt,
      content: content.body,
      category,
      image_url: imageUrl,
      image_prompt: content.imagePrompt,
      status: 'review', // Needs approval before publishing
      ai_generated: true,
      ai_model: 'gpt-4o-mini',
      generation_prompt: JSON.stringify(context),
      meta_description: content.metaDescription,
      keywords: content.keywords,
    });

    if (saveError || !contentRecord) {
      throw new Error(`Failed to save content: ${saveError?.message}`);
    }

    // Mark topic as used
    await markTopicAsUsed(topic);

    // TODO: Send notification to admin that new content is ready for review

    return {
      success: true,
      contentId: contentRecord.id,
    };
  } catch (error: any) {
    console.error('Content generation error:', error);
    return {
      success: false,
      error: error.message || 'Failed to generate content',
    };
  }
}

/**
 * Select next category to write about (rotate fairly)
 */
async function selectNextCategory(): Promise<ContentCategory> {
  const { data: recentPosts } = await db.getPublishedContent();
  const posts = recentPosts || [];

  // Count posts by category in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentByCategory = posts
    .filter(p => new Date(p.published_at || p.created_at) > thirtyDaysAgo)
    .reduce((acc, post) => {
      acc[post.category] = (acc[post.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

  // Return category with fewest recent posts
  const categories: ContentCategory[] = ['Salon Tips', 'Education Insights', 'Product Highlights'];
  const sorted = categories.sort((a, b) => (recentByCategory[a] || 0) - (recentByCategory[b] || 0));
  
  return sorted[0];
}

/**
 * Intelligently select a topic based on multiple factors
 */
async function selectIntelligentTopic(category: ContentCategory): Promise<string> {
  // Get all topics for this category
  const { data: topics } = await db.getTopicsByCategory(category);
  const allTopics = topics || [];

  // Filter out recently used topics
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const availableTopics = allTopics.filter(t => 
    !t.last_used || new Date(t.last_used) < thirtyDaysAgo
  );

  if (availableTopics.length === 0) {
    // All topics used recently - pick one anyway or generate new
    return await generateNewTopic(category);
  }

  // Check for seasonal topics
  const currentMonth = new Date().getMonth() + 1;
  const seasonalTopics = availableTopics.filter(t => 
    t.seasonal && t.seasonal_months?.includes(currentMonth)
  );

  if (seasonalTopics.length > 0) {
    // Prefer seasonal topics
    return seasonalTopics[0].topic;
  }

  // Check what leads are interested in
  const leadInterests = await getLeadInterests();
  const relevantTopics = availableTopics.filter(t => 
    leadInterests.some(interest => 
      t.topic.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(t.topic.toLowerCase())
    )
  );

  if (relevantTopics.length > 0) {
    // Prefer topics leads are interested in
    return relevantTopics[0].topic;
  }

  // Otherwise, pick highest performing topic
  const sorted = availableTopics.sort((a, b) => b.performance_score - a.performance_score);
  return sorted[0].topic;
}

/**
 * Generate a new topic using AI (when all existing topics are exhausted)
 */
async function generateNewTopic(category: ContentCategory): Promise<string> {
  const prompt = `Generate a fresh, specific blog post topic for a premium hairdressing business.

Category: ${category}

Requirements:
- Not generic or obvious
- Specific and actionable
- Relevant to professional stylists or salon clients
- Educational value
- Current/timely

Return just the topic title, nothing else.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 50,
  });

  const topic = completion.choices[0].message.content?.trim() || 'Hairdressing Tips';
  
  // Save new topic
  await db.createContent({
    title: topic,
    category,
    content: '',
    status: 'queued',
  } as any); // Temporary casting

  return topic;
}

/**
 * Get what leads are currently interested in
 */
async function getLeadInterests(): Promise<string[]> {
  const { data: leads } = await db.getAllLeads();
  if (!leads) return [];

  const interests: Record<string, number> = {};

  leads.forEach(lead => {
    // From course interest
    if (lead.course_interest) {
      interests[lead.course_interest] = (interests[lead.course_interest] || 0) + 1;
    }

    // From tags
    if (lead.tags) {
      lead.tags.forEach((tag: string) => {
        interests[tag] = (interests[tag] || 0) + 1;
      });
    }
  });

  // Return top 5 interests
  return Object.entries(interests)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([interest]) => interest);
}

/**
 * Build context for AI content generation
 */
async function buildContentContext(category: ContentCategory, topic: string): Promise<Record<string, any>> {
  // Get recent posts to avoid repetition
  const { data: recentPosts } = await db.getPublishedContent();
  const last5Posts = recentPosts?.slice(0, 5).map(p => p.title) || [];

  // Get lead interests
  const leadInterests = await getLeadInterests();

  // Get chat conversations for topic ideas
  const { data: recentActivities } = await db.getAllLeads(); // Simplified
  
  return {
    category,
    topic,
    recentPostTitles: last5Posts,
    leadInterests,
    currentMonth: new Date().toLocaleString('default', { month: 'long' }),
    currentSeason: getCurrentSeason(),
  };
}

/**
 * Generate content using AI
 */
async function generateContentWithAI(
  category: ContentCategory,
  topic: string,
  context: Record<string, any>
): Promise<{
  title: string;
  excerpt: string;
  body: string;
  metaDescription: string;
  keywords: string[];
  imagePrompt: string;
}> {
  const systemPrompt = `You are a professional content writer for Luke Robert Hair, a premium hairdressing and education business.

BRAND VOICE:
- Tone: ${CONTENT_STYLE.tone}
- Voice: ${CONTENT_STYLE.voice}
- Expertise: ${CONTENT_STYLE.expertise}
- Values: ${CONTENT_STYLE.values.join(', ')}
- Avoid: ${CONTENT_STYLE.avoid.join(', ')}

WRITING STYLE:
- Clear, confident, educational
- Practical and actionable
- Shows expertise without being pretentious
- Uses specific examples
- Conversational but professional
- Short paragraphs (2-3 sentences)
- Subheadings for scannability
- Includes takeaways or action steps

TARGET AUDIENCE:
${category === 'Education Insights' ? 'Professional hairstylists looking to improve their skills' : 
  category === 'Product Highlights' ? 'Stylists and clients interested in product knowledge' :
  'Salon clients wanting to maintain beautiful hair'}`;

  const userPrompt = `Write a blog post about: ${topic}

Category: ${category}

Context:
- Current month: ${context.currentMonth}
- Current season: ${context.currentSeason}
- Lead interests: ${context.leadInterests.join(', ')}

AVOID repeating these recent topics:
${context.recentPostTitles.map((t: string) => `- ${t}`).join('\n')}

Requirements:
- 500-700 words
- Include 3-5 practical tips or insights
- Use subheadings (##)
- Clear introduction and conclusion
- Strong hook in first paragraph
- Include a call-to-action at the end
- SEO-friendly but natural writing

Output as JSON:
{
  "title": "Compelling, specific title (60 chars max)",
  "excerpt": "Engaging 1-2 sentence summary (160 chars max)",
  "body": "Full blog post in markdown format with ## subheadings",
  "metaDescription": "SEO meta description (155 chars max)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "imagePrompt": "Detailed DALL-E prompt for a featured image (editorial salon photography style)"
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const response = JSON.parse(completion.choices[0].message.content || '{}');

  return {
    title: response.title || topic,
    excerpt: response.excerpt || '',
    body: response.body || '',
    metaDescription: response.metaDescription || response.excerpt || '',
    keywords: response.keywords || [],
    imagePrompt: response.imagePrompt || '',
  };
}

/**
 * Generate featured image using DALL-E
 */
async function generateContentImage(title: string, category: ContentCategory): Promise<string> {
  // Check if DALL-E is enabled
  if (process.env.DALL_E_ENABLED !== 'true') {
    // Return Unsplash placeholder
    const query = encodeURIComponent(category.toLowerCase().replace(' ', '-'));
    return `https://source.unsplash.com/1200x630/?hair,salon,${query}`;
  }

  try {
    const basePrompt = `Editorial photography for a professional hairdressing blog. ${title}. Natural daylight, sage green and off-white color palette, muted tones, clean composition, high-end aesthetic, professional salon setting.`;

    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: basePrompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });

    return response.data?.[0]?.url || '';
  } catch (error) {
    console.error('DALL-E error:', error);
    // Fallback to Unsplash
    const query = encodeURIComponent(category.toLowerCase().replace(' ', '-'));
    return `https://source.unsplash.com/1200x630/?hair,salon,${query}`;
  }
}

/**
 * Mark topic as used
 */
async function markTopicAsUsed(topic: string): Promise<void> {
  // This would update the content_topics table
  // For now, we'll skip the implementation
  console.log(`Topic used: ${topic}`);
}

/**
 * Get current season
 */
function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'Spring';
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  return 'Winter';
}

/**
 * Approve content and schedule for publishing
 */
export async function approveContent(
  contentId: string,
  scheduledFor?: Date
): Promise<{ success: boolean; error?: string }> {
  try {
    const updates: any = {
      status: scheduledFor ? 'scheduled' : 'published',
      reviewed_at: new Date().toISOString(),
    };

    if (scheduledFor) {
      updates.scheduled_for = scheduledFor.toISOString();
    } else {
      updates.published_at = new Date().toISOString();
    }

    await db.updateContentStatus(contentId, updates.status);

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to approve content',
    };
  }
}

/**
 * Reject content (won't be published)
 */
export async function rejectContent(
  contentId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db.updateContentStatus(contentId, 'rejected');

    // TODO: Could blacklist the topic if repeatedly rejected

    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to reject content',
    };
  }
}

/**
 * Publish scheduled content (called by cron)
 */
export async function publishScheduledContent(): Promise<void> {
  const { data: scheduledContent } = await db.getContentByStatus('scheduled');
  
  if (!scheduledContent) return;

  const now = new Date();

  for (const content of scheduledContent) {
    if (content.scheduled_for && new Date(content.scheduled_for) <= now) {
      await db.updateContentStatus(content.id, 'published');
      
      // TODO: Send to email subscribers
      // TODO: Create social media drafts
      // TODO: Submit to Google for indexing
    }
  }
}

/**
 * Analyze content performance and update topic scores
 */
export async function analyzeContentPerformance(): Promise<void> {
  const { data: publishedContent } = await db.getPublishedContent();
  
  if (!publishedContent) return;

  // Analyze each post's performance
  for (const post of publishedContent) {
    const daysSincePublished = Math.floor(
      (Date.now() - new Date(post.published_at || post.created_at).getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSincePublished < 7) continue; // Need at least a week of data

    // Calculate performance score
    const viewsPerDay = post.views / daysSincePublished;
    const clickThroughRate = post.views > 0 ? post.clicks / post.views : 0;
    const leadsPerView = post.views > 0 ? post.leads_generated / post.views : 0;

    const performanceScore = 
      (viewsPerDay * 1) + // Views matter
      (clickThroughRate * 50) + // CTR matters more
      (leadsPerView * 100); // Lead generation matters most

    // TODO: Update topic performance score in content_topics table
    console.log(`${post.title}: ${performanceScore.toFixed(2)} score`);
  }
}

