/**
 * CONTENT CREATION ENGINE
 *
 * Unified system for AI-assisted and manual content creation powering Luke's insights hub.
 * - Collects briefs/ideas via content requests (manual or AI-assisted)
 * - Generates topic suggestions, outlines, full drafts, and DALL·E imagery
 * - Produces live previews with editorial metadata for world-class review flows
 * - Records engagement analytics for optimisation across channels
 */

import OpenAI from 'openai';
import { db, supabase, Database } from './supabase';
import { slugify } from './utils';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DEFAULT_CATEGORIES = ['Salon Tips', 'Education Insights', 'Product Highlights'] as const;
type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
export type ContentCategory = DefaultCategory | string;

type ContentSource = 'automation' | 'manual' | 'ai_assist' | 'repurposed';

type ContentAnalyticsEventType = 'view' | 'click' | 'cta_click' | 'share' | 'impression';

type ContentRequestRow = Database['public']['Tables']['content_requests']['Row'];
type ContentQueueInsert = Database['public']['Tables']['content_queue']['Insert'];

interface GenerateBlogPostOptions {
  category?: ContentCategory;
  requestId?: string;
  topic?: string;
  source?: ContentSource;
  autoPublish?: boolean;
  scheduledFor?: Date | null;
  requestedBy?: string | null;
  metadata?: Record<string, any>;
}

interface ManualContentRequestInput {
  topic: string;
  category: ContentCategory;
  requestedBy?: string;
  title?: string;
  summary?: string;
  brief?: string;
  audience?: string;
  tone?: string;
  objectives?: string[];
  targetKeywords?: string[];
  inspirationLinks?: string[];
  notes?: string;
  preferredPublishDate?: Date | null;
  scheduledFor?: Date | null;
  autoPublish?: boolean;
  priority?: number;
  metadata?: Record<string, any>;
}

interface TopicSuggestionOptions {
  categories?: ContentCategory[];
  baseIdeas?: string[];
  seasonalFocus?: string;
  leadInterests?: string[];
  toneOverride?: string;
  count?: number;
}

interface TopicSuggestionResult {
  title: string;
  angle: string;
  category: ContentCategory;
  summary: string;
  keywords: string[];
}

interface ContentContext {
  category: ContentCategory;
  topic: string;
  recentPostTitles: string[];
  leadInterests: string[];
  currentMonth: string;
  currentSeason: string;
  requestSummary?: string;
  targetAudience?: string;
  tone?: string;
  objectives?: string[];
  targetKeywords?: string[];
  inspirationLinks?: string[];
  notes?: string;
  source: ContentSource;
  validationFeedback?: string; // Feedback from failed validation attempts
}

interface GeneratedContent {
  title: string;
  seoTitle?: string;
  excerpt: string;
  body: string;
  metaDescription: string;
  keywords: string[];
  insightTags: string[];
  outline: Array<{ heading: string; summary: string }>;
  editorState?: any;
  cta?: {
    label: string;
    url: string;
    description?: string;
  };
  imagePrompt: string;
  imageAlt: string;
  imageCaption: string;
  editorNotes?: string;
  metadata?: Record<string, any>;
}

interface ContentImageResult {
  url: string;
  prompt: string;
  alt: string;
  caption: string;
}

interface TrackContentEventInput {
  contentId: string;
  type: ContentAnalyticsEventType;
  value?: number;
  source?: string;
  medium?: string;
  campaign?: string;
  referrer?: string;
  sessionId?: string;
  userAgent?: string;
  device?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

// Brand style guide for content
const CONTENT_STYLE = {
  voice: 'Confident, clear, educational',
  tone: 'Professional yet approachable',
  expertise: 'Expert hairdresser and educator with 15+ years experience',
  services: 'Cutting, styling, and barbering (NOT color/highlights)',
  specialization: 'Precision cutting techniques, styling education, barbering, and CPD training for professionals',
  values: ['Craftsmanship', 'Education', 'Precision', 'Wearable results'],
  avoid: ['Hype', 'Gimmicks', 'Overpromising', 'Trends without substance', 'Color/highlight topics (outside expertise)'],
};

const WORDS_PER_MINUTE = 220;

// Forbidden keywords/phrases that indicate color/highlight content (damages SEO)
// NOTE: These are checked in lowercase and must be contextual to avoid false positives
// e.g., "skin tone" is OK, but "hair toner" is not
const FORBIDDEN_KEYWORDS = [
  'highlight', 'highlights', 'highlighting',
  'balayage', 'foil highlights', 'foiling', 'babylight', 'babylights',
  'hair color', 'hair coloring', 'hair colour', 'hair colouring',
  'color services', 'colour services', 'coloring technique',
  'hair dye', 'dyeing hair', 'hair tint', 'tinting hair',
  'bleach', 'bleaching', 'lightening hair',
  'toner', 'toning hair', 'color correction',
  'lowlight', 'lowlights',
  'ombre', 'sombre',
  'dimensional color', 'color dimension',
];

// Metadata leak indicators (breaks SEO structure)
const METADATA_LEAK_PATTERNS = [
  'Call to Action',
  'CTA Details',
  'SEO Keywords',
  'Insight Tags',
  'Image Prompt',
  'Image Alt',
  'Image Caption',
  'Editor Notes',
  'Metadata',
  'Social Copy',
];

/**
 * Validate generated content to ensure it follows SEO constraints
 * Uses intelligent checking to avoid false positives
 */
function validateContent(content: GeneratedContent): { valid: boolean; violations: string[] } {
  const violations: string[] = [];
  const bodyLower = content.body.toLowerCase();
  const titleLower = content.title.toLowerCase();

  // Check for forbidden color/highlight keywords in title and body
  // Only flag if it's a significant focus (in title, headers, or mentioned multiple times)
  for (const keyword of FORBIDDEN_KEYWORDS) {
    const keywordLower = keyword.toLowerCase();
    
    // Check title - any mention here is significant
    if (titleLower.includes(keywordLower)) {
      violations.push(`forbidden_keyword_in_title: ${keyword}`);
      continue;
    }
    
    // Check body - only flag if it's a major topic (in headers or mentioned 2+ times)
    if (bodyLower.includes(keywordLower)) {
      const occurrences = (bodyLower.match(new RegExp(keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const inHeading = bodyLower.includes(`## ${keywordLower}`) || bodyLower.includes(`### ${keywordLower}`);
      
      if (occurrences >= 2 || inHeading) {
        violations.push(`forbidden_keyword: ${keyword} (${occurrences} mentions)`);
      }
    }
  }

  // Check if metadata is leaking into body as section headers or labels
  // These should ONLY be in JSON fields, never as text labels in the article
  for (const pattern of METADATA_LEAK_PATTERNS) {
    // Check for pattern as a standalone header or bold label
    const asHeader = content.body.includes(`\n${pattern}`) || content.body.includes(`\n## ${pattern}`) || content.body.includes(`\n### ${pattern}`);
    const asBold = content.body.includes(`**${pattern}**`) || content.body.includes(`__${pattern}__`);
    
    if (asHeader || asBold) {
      violations.push(`metadata_leak: ${pattern} (appears as section header/label in article)`);
    }
  }

  // Check keywords and tags for forbidden topics
  const allKeywords = [...(content.keywords || []), ...(content.insightTags || [])].join(' ').toLowerCase();
  for (const keyword of FORBIDDEN_KEYWORDS) {
    if (allKeywords.includes(keyword.toLowerCase())) {
      violations.push(`forbidden_in_tags: ${keyword}`);
    }
  }

  return {
    valid: violations.length === 0,
    violations,
  };
}

function computeWordCount(markdown: string): number {
  const text = markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
    .replace(/[#>*_`~\-]/g, '')
    .trim();

  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

function estimateReadingTimeMinutes(wordCount: number): number {
  if (wordCount <= 0) return 0;
  return Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));
}

// Lightweight markdown to HTML renderer for previews (sufficient for admin pane preview panels)
function markdownToPreviewHtml(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        output.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        output.push('<ul>');
        inList = true;
      }
      const item = line.replace(/^[-*]\s+/, '');
      output.push(`<li>${applyInlineFormatting(item)}</li>`);
      continue;
    }

    if (inList) {
      output.push('</ul>');
      inList = false;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = applyInlineFormatting(headingMatch[2]);
      output.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    if (line.startsWith('>')) {
      output.push(`<blockquote>${applyInlineFormatting(line.replace(/^>\s?/, ''))}</blockquote>`);
      continue;
    }

    output.push(`<p>${applyInlineFormatting(line)}</p>`);
  }

  if (inList) {
    output.push('</ul>');
  }

  return output.join('');
}

function applyInlineFormatting(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Generate a new blog post using AI
 */
export async function generateBlogPost(options: GenerateBlogPostOptions = {}): Promise<{
  success: boolean;
  contentId?: string;
  requestId?: string;
  error?: string;
}> {
  let category = options.category;
  let topic: string;
  let request: ContentRequestRow | null = null;
  const resolvedSource: ContentSource = options.source || (options.requestId ? 'manual' : 'automation');

  try {
    if (options.requestId) {
      const { data: requestRecord, error: requestError } = await db.getContentRequest(options.requestId);

      if (requestError || !requestRecord) {
        throw new Error(requestError?.message || 'Content request not found');
      }

      request = requestRecord;
      category = (request!.category as ContentCategory) || category || await selectNextCategory();
      topic = request!.topic;

      await db.updateContentRequest(request!.id, {
        status: 'generating',
        metadata: {
          ...(request!.metadata as Record<string, any> | null ?? {}),
          generation_started_at: new Date().toISOString(),
        },
      });
    } else {
      if (!category) {
        category = await selectNextCategory();
      }

      if (options.topic && options.topic.trim().length > 0) {
        topic = options.topic.trim();
      } else {
        topic = await selectIntelligentTopic(category);
      }
    }

    const contentContext = await buildContentContext(category!, topic, {
      request,
      source: request ? (request.request_source as ContentSource) : resolvedSource,
    });

    // Try to generate content with one retry if validation fails
    let aiContent: GeneratedContent;
    let validation: { valid: boolean; violations: string[] };
    let attempt = 0;
    const maxAttempts = 2;

    while (attempt < maxAttempts) {
      attempt++;
      
      // Add feedback from previous attempt if this is a retry
      const feedbackContext = attempt > 1 ? {
        ...contentContext,
        validationFeedback: `VALIDATION FAILED on previous attempt. Violations: ${validation!.violations.join(', ')}. 
        
Please correct these issues:
- If forbidden keywords were detected: DO NOT write about color/highlight topics. Focus ONLY on cutting, styling, or barbering.
- If metadata leak was detected: DO NOT include metadata labels in the body field. The body should be ONLY article prose.
- Review the CRITICAL JSON OUTPUT RULES and follow them exactly.`
      } : contentContext;

      aiContent = await generateContentWithAI(category!, topic, feedbackContext, request || undefined);
      
      // Validate content
      validation = validateContent(aiContent);
      
      if (validation.valid) {
        console.log(`✅ Content validation passed (attempt ${attempt}/${maxAttempts})`);
        break;
      }
      
      console.warn(`⚠️ Content validation failed on attempt ${attempt}/${maxAttempts}:`, validation.violations);
      
      if (attempt >= maxAttempts) {
        console.error('❌ Content validation failed after all retry attempts:', validation.violations);
        throw new Error(
          `Content validation failed: ${validation.violations.join(', ')}. ` +
          `This content violates SEO constraints (forbidden topics or metadata leaks). ` +
          `Please try regenerating with a different topic focused on cutting/styling/barbering.`
        );
      }
      
      console.log(`🔄 Retrying generation with validation feedback...`);
    }
    const image = await generateContentImage(aiContent!.title, category!, aiContent!.imagePrompt);

    const wordCount = computeWordCount(aiContent!.body);
    const readingTime = estimateReadingTimeMinutes(wordCount);
    const previewHtml = markdownToPreviewHtml(aiContent!.body);
    const now = new Date();
    const autoPublish = options.autoPublish ?? request?.auto_publish ?? false;

    const scheduledDate =
      (options.scheduledFor instanceof Date ? options.scheduledFor : null) ??
      (request?.scheduled_for ? new Date(request.scheduled_for) : null) ??
      (request?.preferred_publish_date ? new Date(request.preferred_publish_date) : null);

    const shouldPublishNow = autoPublish && (!scheduledDate || scheduledDate <= now);
    const scheduledForIso = !shouldPublishNow && scheduledDate ? scheduledDate.toISOString() : undefined;
    const publishedAtIso = shouldPublishNow ? now.toISOString() : undefined;

    const requestMetadata = (request?.metadata as Record<string, any> | null) ?? {};
    const optionMetadata = options.metadata ?? {};
    const aiMetadata = aiContent!.metadata ?? {};

    const pinnedUntilSource =
      optionMetadata.pinned_until ??
      requestMetadata.pinned_until ??
      aiMetadata.pinned_until ??
      null;

    const pinnedUntilIso = (() => {
      if (pinnedUntilSource instanceof Date) {
        return pinnedUntilSource.toISOString();
      }

      if (typeof pinnedUntilSource === 'string' && pinnedUntilSource.length > 0) {
        const parsed = new Date(pinnedUntilSource);
        if (!Number.isNaN(parsed.getTime())) {
          return parsed.toISOString();
        }
      }

      return undefined;
    })();

    const featuredFlag =
      optionMetadata.featured ?? requestMetadata.featured ?? aiMetadata.featured ?? false;

    const combinedMetadata: Record<string, any> = {
      ...requestMetadata,
      ...optionMetadata,
      ...aiMetadata,
      topic,
      generated_at: now.toISOString(),
      auto_publish: autoPublish,
    };

    const insertPayload: ContentQueueInsert = {
      request_id: request?.id || null,
      title: aiContent!.title,
      slug: slugify(aiContent!.title),
      excerpt: aiContent!.excerpt,
      content: aiContent!.body,
      category: category!,
      image_url: image.url,
      image_prompt: image.prompt,
      hero_alt: image.alt,
      hero_caption: image.caption,
      status: shouldPublishNow ? 'published' : autoPublish ? 'scheduled' : 'review',
      source: request ? (request.request_source as ContentSource) : resolvedSource,
      scheduled_for: scheduledForIso,
      published_at: publishedAtIso,
      pinned_until: pinnedUntilIso,
      featured: Boolean(featuredFlag),
      ai_generated: true,
      ai_model: 'gpt-4o-mini',
      generation_prompt: JSON.stringify(contentContext),
      outline: aiContent!.outline,
      editor_state: aiContent!.editorState ?? [],
      metadata: combinedMetadata,
      seo_title: aiContent!.seoTitle || aiContent!.title,
      meta_description: aiContent!.metaDescription,
      keywords: aiContent!.keywords,
      insight_tags: aiContent!.insightTags,
      cta_label: aiContent!.cta?.label,
      cta_url: aiContent!.cta?.url,
      cta_description: aiContent!.cta?.description,
      preview_html: previewHtml,
      preview_generated_at: now.toISOString(),
      last_previewed_at: now.toISOString(),
      last_previewed_by: request?.requested_by || options.requestedBy || 'system',
      editor_notes: aiContent!.editorNotes || request?.notes || undefined,
      word_count: wordCount,
      reading_time_minutes: readingTime,
    };

    const { data: contentRecord, error: saveError } = await db.createContent(insertPayload);

    if (saveError || !contentRecord) {
      throw new Error(`Failed to save content: ${saveError?.message}`);
    }

    if (request) {
      const requestMetadataUpdate = {
        ...(requestMetadata ?? {}),
        last_generated_content_id: contentRecord.id,
        last_generated_at: now.toISOString(),
        auto_publish: autoPublish,
        last_status: insertPayload.status,
        pinned_until: pinnedUntilIso ?? requestMetadata.pinned_until ?? null,
      } as Record<string, any>;

      if (publishedAtIso) {
        requestMetadataUpdate.published_at = publishedAtIso;
      }

      await db.updateContentRequest(request.id, {
        status: shouldPublishNow ? 'completed' : 'ready',
        scheduled_for: insertPayload.scheduled_for ?? request.scheduled_for ?? null,
        metadata: requestMetadataUpdate,
      });
    }

    await markTopicAsUsed(topic, category!);

    return {
      success: true,
      contentId: contentRecord.id,
      requestId: request?.id,
    };
  } catch (error: any) {
    console.error('Content generation error:', error);

    if (request) {
      await db.updateContentRequest(request.id, {
        status: 'draft',
        metadata: {
          ...(request.metadata as Record<string, any> | null ?? {}),
          last_error: error.message || 'Generation failed',
          last_error_at: new Date().toISOString(),
        },
      });
    }

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
  const categories: ContentCategory[] = [...DEFAULT_CATEGORIES];
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
  const now = new Date();
  const currentYear = now.getFullYear();
  
  const prompt = `Generate a fresh, specific blog post topic for a premium hairdressing business.

Category: ${category}

🚨 FORBIDDEN TOPICS (CRITICAL - NEVER SUGGEST):
❌ Hair coloring, color services, highlights, balayage
❌ Bleaching, lightening, toning, any chemical treatments
❌ Color maintenance or color-related topics

✅ ONLY SUGGEST TOPICS ABOUT:
- Cutting techniques and methods
- Haircut styles and trends
- Styling and finishing techniques
- Barbering and men's grooming
- Hair health through cutting
- Professional education and CPD

CURRENT DATE CONTEXT:
- Current Year: ${currentYear}
- DO NOT include past years (2023, 2024, etc.) in the topic title
- Focus on evergreen content or use "current", "upcoming", "this season" for timely topics

Requirements:
- Not generic or obvious
- Specific and actionable
- Relevant to professional stylists or salon clients
- Educational value
- Current/timely but no outdated year references
- MUST align EXCLUSIVELY with cutting/styling/barbering expertise

Return just the topic title, nothing else.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.9,
    max_tokens: 50,
  });

  const topic = completion.choices[0].message.content?.trim() || 'Hairdressing Tips';

  // Validate the generated topic doesn't violate constraints
  const topicLower = topic.toLowerCase();
  const hasViolation = FORBIDDEN_KEYWORDS.some(keyword => 
    topicLower.includes(keyword.toLowerCase())
  );

  if (hasViolation) {
    console.error(`🚨 Generated topic violates constraints: "${topic}". Generating fallback...`);
    return 'Precision Cutting Techniques for Modern Styles';
  }

  try {
    await supabase
      .from('content_topics')
      .insert({
        topic,
        category,
        seasonal: false,
        usage_count: 0,
        performance_score: 0,
      })
      .select()
      .single();
  } catch (error) {
    console.warn('Failed to persist newly generated topic (continuing)', error);
  }

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
async function buildContentContext(
  category: ContentCategory,
  topic: string,
  options: { request?: ContentRequestRow | null; source: ContentSource }
): Promise<ContentContext> {
  const { data: recentPosts } = await db.getPublishedContent();
  const last5Posts = recentPosts?.slice(0, 5).map(p => p.title) || [];

  const leadInterests = await getLeadInterests();

  const requestGoals = options.request?.objectives;
  const objectives = Array.isArray(requestGoals)
    ? requestGoals
    : typeof requestGoals === 'string' && requestGoals.length > 0
    ? requestGoals.split(/[;,\n]/).map(item => item.trim()).filter(Boolean)
    : [];

  const requestKeywords = options.request?.target_keywords;
  const targetKeywords = Array.isArray(requestKeywords)
    ? (requestKeywords as string[])
    : typeof requestKeywords === 'string'
    ? requestKeywords.split(/[;,\n]/).map(item => item.trim()).filter(Boolean)
    : [];

  const requestLinks = options.request?.inspiration_links;
  const inspirationLinks = Array.isArray(requestLinks)
    ? (requestLinks as string[])
    : typeof requestLinks === 'string'
    ? requestLinks.split(/[\s,]+/).filter(Boolean)
    : [];

  return {
    category,
    topic,
    recentPostTitles: last5Posts,
    leadInterests,
    currentMonth: new Date().toLocaleString('default', { month: 'long' }),
    currentSeason: getCurrentSeason(),
    requestSummary: options.request?.summary || options.request?.brief || undefined,
    targetAudience: options.request?.audience || undefined,
    tone: options.request?.tone || CONTENT_STYLE.tone,
    objectives,
    targetKeywords,
    inspirationLinks,
    notes: options.request?.notes || undefined,
    source: options.source,
  };
}

/**
 * Generate content using AI
 */
async function generateContentWithAI(
  category: ContentCategory,
  topic: string,
  context: ContentContext,
  request?: ContentRequestRow
): Promise<GeneratedContent> {
  const tone = context.tone || CONTENT_STYLE.tone;
  const objectives = context.objectives?.length ? context.objectives.join(', ') : 'Deliver value for readers and drive enquiries';
  const keywords = context.targetKeywords?.length ? context.targetKeywords.join(', ') : 'hair education, salon, Luke Robert Hair';
  const inspiration = context.inspirationLinks?.length ? context.inspirationLinks.join(', ') : 'None provided';

  const systemPrompt = `You are a professional content strategist and senior copywriter for Luke Robert Hair, a premium hairdressing and education studio in the UK.

BRAND VOICE & STYLE
- Voice: ${CONTENT_STYLE.voice}
- Tone: ${tone}
- Expertise: ${CONTENT_STYLE.expertise}
- Services: ${CONTENT_STYLE.services}
- Specialization: ${CONTENT_STYLE.specialization}
- Values: ${CONTENT_STYLE.values.join(', ')}
- Avoid: ${CONTENT_STYLE.avoid.join(', ')}

🚨 FORBIDDEN TOPICS (CRITICAL FOR SEO - NEVER WRITE ABOUT THESE):
❌ Hair coloring, color services, hair dye
❌ Highlights (balayage, foil highlights, babylights, lowlights)
❌ Bleaching, lightening, toning, color correction
❌ Any chemical color treatments or color maintenance
❌ Dimensional color, ombre, sombre

WHY THIS MATTERS:
Luke does NOT offer these services. Writing about color/highlights:
- Damages SEO rankings for his actual services (cutting/styling/barbering)
- Attracts wrong customers who will be disappointed
- Confuses search engines and LLMs about his expertise
- Wastes domain authority on irrelevant topics

✅ INSTEAD, WRITE ABOUT:
- Precision cutting techniques and methods
- Haircut styles and trends
- Styling techniques and finishing
- Barbering and men's grooming
- Hair health through cutting
- Haircut longevity and maintenance
- Professional education and CPD training

WRITING GUIDELINES
- Provide clear, confident, educational guidance
- Use real-world examples or salon scenarios to ground advice
- Keep paragraphs short (2-3 sentences) for readability
- Include actionable tips and specific techniques
- Use friendly, authoritative language (no fluff)
- Every section should reinforce Luke Robert's authority and precision ethos
- Focus content EXCLUSIVELY on cutting techniques, styling methods, barbering, and education/CPD topics`;

  const userPrompt = `Create a feature-rich insight article.

TOPIC: ${topic}
CATEGORY: ${category}
SOURCE MODE: ${context.source}

AUDIENCE: ${context.targetAudience || (category === 'Education Insights' ? 'Professional stylists seeking advanced education' : category === 'Product Highlights' ? 'Stylists and discerning clients evaluating premium products' : 'Salon clients who want healthy, precision cuts that last')}

TIME CONTEXT
- Month: ${context.currentMonth}
- Season: ${context.currentSeason}
- Trend & lead interests: ${context.leadInterests.join(', ') || 'No current lead interests available'}

REQUEST INSIGHTS
- Summary / brief: ${context.requestSummary || 'Use brand knowledge and category insights to shape the piece'}
- Objectives: ${objectives}
- Key phrases / keywords: ${keywords}
- Inspiration: ${inspiration}
- Internal notes: ${context.notes || 'None provided'}

${context.validationFeedback ? `
🚨 VALIDATION FEEDBACK FROM PREVIOUS ATTEMPT:
${context.validationFeedback}

PLEASE CORRECT THESE ISSUES IN THIS GENERATION.
` : ''}

AVOID DUPLICATION
${context.recentPostTitles.length ? context.recentPostTitles.map(title => `- ${title}`).join('\n') : '- No previous posts recorded'}

STRUCTURE REQUIREMENTS
- Length target: 600-800 words
- Use descriptive H2/H3 subheadings with markdown syntax
- Provide 3-5 detailed, actionable sections with supporting examples
- Open with a compelling hook that anchors the problem/opportunity
- Include a dedicated takeaway/summary section
- Conclude with a confident call-to-action that aligns with Luke Robert services (education bookings, salon services, partnerships)
- Provide a short CTA block (label + description + suggested URL slug)
- Suggest 3-5 SEO keywords and 3-5 insight tags that extend discoverability
- Provide an outline array summarising each major section (heading + 1 sentence summary)
- Recommend a detailed DALL·E prompt plus alt text & caption for the featured image (MUST show hair cutting/styling/barbering in action - stylist working on client, precision cutting, hairdressing techniques, salon setting)
- Suggest any editor notes (optional) and extra metadata (eg. social copy) if useful

FEATURED IMAGE REQUIREMENTS (CRITICAL):
- Image MUST depict hair cutting, styling, or barbering scenes
- Examples: "stylist performing precision haircut", "barber cutting men's hair", "hairdresser styling client's hair", "hands cutting hair with scissors"
- AVOID: generic salon interiors without people, product shots, abstract images
- Focus on the ACTION of hairdressing, not just the environment

🚨 CRITICAL JSON OUTPUT RULES:

1. The "body" field must ONLY contain the article prose in clean markdown
2. DO NOT include ANY metadata labels, section headers, or structural markers in the body:
   
   ❌ WRONG - These should NEVER appear as text in the body:
   "Call to Action"
   "CTA Details:"
   "SEO Keywords:"
   "Insight Tags:"
   "Outline:"
   "Image Prompt:"
   "Image Alt:"
   "Image Caption:"
   "Editor Notes:"
   "Metadata:"
   "Social Copy:"
   "**Call to Action**"
   "## SEO Keywords"
   
   ❌ BAD EXAMPLE of body field (this will be rejected):
   "## Why Cutting Matters\n\nGreat haircuts...\n\nCall to Action\n\nBook Now\n\nSEO Keywords:\nhaircut, styling, precision"
   
   ✅ GOOD EXAMPLE of body field (clean article prose only):
   "## Why Precision Cutting Matters\n\nYour haircut is an investment...\n\n## The Consultation Process\n\nBefore I pick up scissors...\n\n## Maintaining Your Cut\n\nA precision cut should last 8-10 weeks...\n\n## Ready to Transform Your Look?\n\nBook a consultation to experience precision cutting that lasts."

3. ALL metadata goes in their specific JSON fields:
   - CTA info → "cta" object with label, url, description
   - Keywords → "keywords" array
   - Tags → "insightTags" array
   - Image info → "imagePrompt", "imageAlt", "imageCaption" fields
   - Notes → "editorNotes" field

4. The body should read like a published magazine article - seamless prose from start to finish
5. NEVER mention color/highlight topics anywhere in any JSON field

OUTPUT STRICTLY AS JSON:
{
  "title": "Compelling, specific H1 title (<=60 characters) - NO color/highlight topics",
  "seoTitle": "Optional refined SEO title (<=60 characters)",
  "excerpt": "Punchy 1-2 sentence summary (<=160 characters)",
  "body": "Full article in markdown with ## and ### subheadings - ONLY article prose, NO metadata labels",
  "metaDescription": "SEO meta description (<=155 characters)",
  "keywords": ["cutting-focused", "styling-focused", "barbering-focused keywords only"],
  "insightTags": ["tags about cutting/styling/barbering only"],
  "outline": [{"heading": "Section heading", "summary": "Section purpose"}],
  "cta": {
    "label": "CTA button label",
    "url": "/relative-url-slug",
    "description": "1 sentence CTA description"
  },
  "imagePrompt": "Rich DALL·E prompt showing hair cutting/styling/barbering in action (stylist working on client, precision technique demonstration, hands cutting hair)",
  "imageAlt": "Accessible alt text for the featured image",
  "imageCaption": "Short caption for the featured image",
  "editorNotes": "Optional notes for human editor",
  "metadata": {
    "socialCopy": "Optional single-sentence social caption",
    "series": "Optional series name"
  }
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  let response: any = {};
  try {
    response = JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.warn('Failed to parse AI response JSON, falling back to minimal structure.', error);
  }

  const outline = Array.isArray(response.outline) ? response.outline : [];
  const insightTags = Array.isArray(response.insightTags) ? response.insightTags : response.keywords || [];
  const keywordsArray = Array.isArray(response.keywords) ? response.keywords : (typeof response.keywords === 'string' ? response.keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : []);

  return {
    title: response.title || topic,
    seoTitle: response.seoTitle || response.title || topic,
    excerpt: response.excerpt || '',
    body: response.body || '',
    metaDescription: response.metaDescription || response.excerpt || '',
    keywords: keywordsArray,
    insightTags,
    outline,
    editorState: Array.isArray(response.editorState)
      ? response.editorState
      : Array.isArray(response.editor_state)
      ? response.editor_state
      : [],
    cta: response.cta && typeof response.cta === 'object' ? {
      label: response.cta.label || 'Learn More',
      url: response.cta.url || '/contact',
      description: response.cta.description || `Book time with Luke Robert for ${category.toLowerCase()} support`,
    } : undefined,
    imagePrompt: response.imagePrompt || `Editorial salon photography celebrating ${topic}. High-end, natural light, sage and off-white palette, premium aesthetic.`,
    imageAlt: response.imageAlt || `Editorial salon image illustrating ${topic}`,
    imageCaption: response.imageCaption || `Photography inspired by ${topic}`,
    editorNotes: response.editorNotes || undefined,
    metadata: typeof response.metadata === 'object' && response.metadata !== null ? response.metadata : undefined,
  };
}

/**
 * Generate featured image using DALL-E
 */
async function generateContentImage(
  title: string,
  category: ContentCategory,
  customPrompt?: string
): Promise<ContentImageResult> {
  // Use Lorem Picsum for reliable free placeholder images
  // Format: https://picsum.photos/width/height?random=seed
  const seed = encodeURIComponent(title.slice(0, 20).replace(/\s+/g, '-'));
  const fallbackUrl = `https://picsum.photos/seed/${seed}/1200/630`;

  // Build hair-focused default prompt emphasizing cutting/styling action
  const hairActionContext = category.toLowerCase().includes('education') 
    ? 'professional hairdresser demonstrating precision cutting technique to student in modern salon'
    : category.toLowerCase().includes('product')
    ? 'stylist using professional hair cutting tools while working on client in premium salon'
    : 'experienced hairdresser performing precision haircut on client in refined salon setting';
  
  const defaultPrompt = `Professional editorial photography: ${hairActionContext}. Subject: "${title}". Natural daylight, sage green and off-white color palette, muted tones, showing hands cutting or styling hair, medium depth of field, cinematic composition. Focus on the craft of hairdressing in action.`;
  
  const prompt = customPrompt && customPrompt.length > 20 
    ? `${customPrompt} | Style: Professional hair cutting/styling/barbering scene in action | Palette: sage green and off-white | Mood: premium editorial salon with stylist working` 
    : defaultPrompt;

  if (process.env.DALL_E_ENABLED !== 'true') {
    return {
      url: fallbackUrl,
      prompt,
      alt: `Editorial salon image representing ${title}`,
      caption: `Photography inspired by ${category.toLowerCase()} insights from Luke Robert Hair`,
    };
  }

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1792x1024',
      quality: 'standard',
      n: 1,
    });

    const url = response.data?.[0]?.url || fallbackUrl;

    return {
      url,
      prompt,
      alt: `Editorial salon image representing ${title}`,
      caption: `Visual interpretation of ${title} for the ${category.toLowerCase()} series`,
    };
  } catch (error) {
    console.error('DALL-E error:', error);
    return {
      url: fallbackUrl,
      prompt,
      alt: `Editorial salon image representing ${title}`,
      caption: `Photography inspired by ${category.toLowerCase()} insights from Luke Robert Hair`,
    };
  }
}

/**
 * Mark topic as used
 */
async function markTopicAsUsed(topic: string, category: ContentCategory): Promise<void> {
  try {
    const { data: topics, error } = await db.getTopicsByCategory(category);

    if (error) {
      console.warn('Failed to fetch topics when marking usage', error);
      return;
    }

    const match = topics?.find(t => t.topic.toLowerCase() === topic.toLowerCase());

    if (match?.id) {
      await db.updateTopicUsage(match.id);
    }
  } catch (error) {
    console.warn('Unable to update topic usage', error);
  }
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

// =========================
// REQUEST & SUGGESTION APIs
// =========================

export async function createManualContentRequest(input: ManualContentRequestInput) {
  const now = new Date().toISOString();
  const objectives = Array.isArray(input.objectives) ? input.objectives.join('\n') : input.objectives || null;

  const payload: Database['public']['Tables']['content_requests']['Insert'] = {
    requested_by: input.requestedBy || null,
    request_source: 'manual',
    request_type: 'blog_post',
    status: input.autoPublish ? 'queued' : 'draft',
    title: input.title || null,
    topic: input.topic,
    category: input.category,
    summary: input.summary || null,
    brief: input.brief || null,
    audience: input.audience || null,
    tone: input.tone || null,
    objectives,
    target_keywords: input.targetKeywords?.length ? input.targetKeywords : [],
    inspiration_links: input.inspirationLinks?.length ? input.inspirationLinks : [],
    notes: input.notes || null,
    preferred_publish_date: input.preferredPublishDate ? input.preferredPublishDate.toISOString() : null,
    scheduled_for: input.scheduledFor ? input.scheduledFor.toISOString() : null,
    auto_publish: input.autoPublish ?? false,
    priority: input.priority ?? 3,
    metadata: {
      ...(input.metadata || {}),
      created_via: 'admin_manual',
      created_at: now,
    },
  };

  const { data, error } = await db.createContentRequest(payload);

  if (error || !data) {
    throw new Error(error?.message || 'Failed to create content request');
  }

  return data;
}

export async function suggestContentTopics(options: TopicSuggestionOptions = {}): Promise<TopicSuggestionResult[]> {
  const categories = options.categories?.length ? options.categories : (['Salon Tips', 'Education Insights', 'Product Highlights'] as ContentCategory[]);
  const count = Math.min(Math.max(options.count ?? 5, 1), 10);
  const leads = options.leadInterests?.length ? options.leadInterests.join(', ') : 'No lead interest data';
  const baseIdeas = options.baseIdeas?.length ? options.baseIdeas.join(', ') : 'None provided';
  const seasonal = options.seasonalFocus || getCurrentSeason();
  
  // Get current date context
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.toLocaleString('en-US', { month: 'long' });

  const prompt = `You are the content strategist for Luke Robert Hair.

TASK: Suggest ${count} precise blog topics for the upcoming publishing cycle.

🚨 FORBIDDEN TOPICS (CRITICAL FOR SEO - NEVER SUGGEST THESE):
❌ Hair coloring, color services, hair dye
❌ Highlights (balayage, foil highlights, babylights, lowlights)
❌ Bleaching, lightening, toning, color correction
❌ Any chemical color treatments or color maintenance
❌ Dimensional color, ombre, sombre

WHY: Luke does NOT offer these services. Suggesting color/highlight topics damages SEO and attracts wrong customers.

✅ INSTEAD, SUGGEST TOPICS ABOUT:
- Precision cutting techniques and methods
- Haircut styles and trends for any season
- Styling techniques and finishing methods
- Barbering and men's grooming
- Hair health through proper cutting
- Haircut longevity and maintenance
- Professional education and CPD training

CURRENT DATE CONTEXT (CRITICAL):
- Current Year: ${currentYear}
- Current Month: ${currentMonth}
- NEVER reference past years (e.g., 2023, 2024) in topic titles
- Focus on evergreen content OR reference current/upcoming timeframes only
- Use "this season", "upcoming", "current trends" instead of specific past years
- If seasonal, use the season name without year (e.g., "Autumn Haircut Trends" not "Autumn 2023 Highlights")

Brand voice: ${CONTENT_STYLE.voice}
Tone preference: ${options.toneOverride || CONTENT_STYLE.tone}
Categories to prioritise (rotate fairly): ${categories.join(', ')}
Lead/customer interests: ${leads}
Existing ideas to build from: ${baseIdeas}
Seasonal/temporal focus: ${seasonal}

Return JSON strictly in this format:
{
  "suggestions": [
    {
      "title": "Specific, search-friendly topic title - NO color/highlight topics",
      "angle": "Unique angle or hook related to cutting/styling/barbering",
      "category": "One of ${categories.join(', ')}",
      "summary": "1-2 sentence overview highlighting value",
      "keywords": ["cutting-focused", "styling-focused", "barbering-focused keywords"]
    }
  ]
}`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an elite content strategist who creates SEO-informed, audience-aware topics for Luke Robert Hair.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  let parsed: any = {};
  try {
    parsed = JSON.parse(completion.choices[0].message.content || '{}');
  } catch (error) {
    console.warn('Failed to parse topic suggestions JSON', error);
  }

  const suggestions: TopicSuggestionResult[] = Array.isArray(parsed.suggestions)
    ? parsed.suggestions.map((suggestion: any) => ({
        title: suggestion.title,
        angle: suggestion.angle,
        category: suggestion.category as ContentCategory,
        summary: suggestion.summary,
        keywords: Array.isArray(suggestion.keywords)
          ? suggestion.keywords
          : typeof suggestion.keywords === 'string'
          ? suggestion.keywords.split(',').map((kw: string) => kw.trim()).filter(Boolean)
          : [],
      }))
    : [];

  // Filter out any suggestions that violate forbidden topics
  const validSuggestions = suggestions.filter(suggestion => {
    const textToCheck = `${suggestion.title} ${suggestion.angle} ${suggestion.summary}`.toLowerCase();
    const hasViolation = FORBIDDEN_KEYWORDS.some(keyword => 
      textToCheck.includes(keyword.toLowerCase())
    );
    
    if (hasViolation) {
      console.warn(`🚨 Filtered out forbidden topic suggestion: "${suggestion.title}"`);
      return false;
    }
    
    return suggestion.title && categories.includes(suggestion.category);
  });

  return validSuggestions.slice(0, count);
}

// =========================
// ANALYTICS & PREVIEW HELPERS
// =========================

export async function trackContentEvent(input: TrackContentEventInput) {
  const value = input.value ?? 1;

  await db.logContentAnalyticsEvent({
    content_id: input.contentId,
    event_type: input.type,
    event_value: value,
    source: input.source || null,
    medium: input.medium || null,
    campaign: input.campaign || null,
    referrer: input.referrer || null,
    session_id: input.sessionId || null,
    user_agent: input.userAgent || null,
    device: input.device || null,
    ip_address: input.ipAddress || null,
    metadata: input.metadata || {},
  });

  const { data: content } = await db.getContentById(input.contentId);
  if (!content) return;

  const updates: Database['public']['Tables']['content_queue']['Update'] = {};

  if (input.type === 'view') {
    updates.views = (content.views ?? 0) + value;
  }

  if (input.type === 'click' || input.type === 'cta_click') {
    updates.clicks = (content.clicks ?? 0) + value;
  }

  if (input.type === 'cta_click') {
    updates.leads_generated = (content.leads_generated ?? 0) + value;
  }

  if (Object.keys(updates).length > 0) {
    await db.updateContent(input.contentId, updates);
  }
}

export async function updateContentPreview(
  contentId: string,
  markdown: string,
  options: { previewedBy?: string; editorNotes?: string } = {}
) {
  const previewHtml = markdownToPreviewHtml(markdown);
  const wordCount = computeWordCount(markdown);
  const readingTime = estimateReadingTimeMinutes(wordCount);
  const nowIso = new Date().toISOString();

  await db.updateContent(contentId, {
    content: markdown,
    preview_html: previewHtml,
    preview_generated_at: nowIso,
    last_previewed_at: nowIso,
    last_previewed_by: options.previewedBy || 'system',
    editor_notes: options.editorNotes || null,
    word_count: wordCount,
    reading_time_minutes: readingTime,
  });
}

/**
 * Approve content and schedule for publishing
 */
export async function approveContent(
  contentId: string,
  scheduledFor?: Date,
  options: { reviewer?: string } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const now = new Date();
    const nowIso = now.toISOString();
    const shouldPublishNow = !scheduledFor || scheduledFor <= now;

    const updates: Database['public']['Tables']['content_queue']['Update'] = {
      status: shouldPublishNow ? 'published' : 'scheduled',
      reviewed_at: nowIso,
      reviewed_by: options.reviewer || null,
    };

    if (shouldPublishNow) {
      updates.published_at = nowIso;
      updates.scheduled_for = null;
    } else if (scheduledFor) {
      updates.scheduled_for = scheduledFor.toISOString();
      updates.published_at = null;
    }

    await db.updateContent(contentId, updates);

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
  reason: string,
  options: { reviewer?: string } = {}
): Promise<{ success: boolean; error?: string }> {
  try {
    const nowIso = new Date().toISOString();

    await db.updateContent(contentId, {
      status: 'rejected',
      rejection_reason: reason,
      reviewed_at: nowIso,
      reviewed_by: options.reviewer || null,
    });

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
      await db.updateContent(content.id, {
        status: 'published',
        published_at: new Date().toISOString(),
      });
      
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

