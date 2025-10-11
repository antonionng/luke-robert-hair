import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { db } from '@/lib/db';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

const categories = ['Salon Tips', 'Education Insights', 'Product Highlights'] as const;

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Generate 3 blog posts
    const posts = await Promise.all([
      generateBlogPost(categories[0]),
      generateBlogPost(categories[1]),
      generateBlogPost(categories[2]),
    ]);

    // Save to database
    for (const post of posts) {
      await db.createBlogPost(post);
    }

    return NextResponse.json({ 
      success: true, 
      count: posts.length,
      posts: posts.map(p => ({ title: p.title, category: p.category })),
    });
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}

async function generateBlogPost(category: typeof categories[number]) {
  // Generate blog post content
  const contentPrompt = `Write a blog post for Luke Robert Hair, a premium hairdressing salon and education provider.

Category: ${category}

Requirements:
- Title should be engaging and professional
- Content should be 300-400 words
- Tone: Calm, confident, educational
- Focus on practical advice and insights
- Match the brand voice: "Every great haircut begins with structure"

Format your response as JSON:
{
  "title": "Post title here",
  "excerpt": "Brief 1-2 sentence summary",
  "content": "Full post content in markdown"
}`;

  const completion = await openai!.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: contentPrompt }],
    response_format: { type: 'json_object' },
    temperature: 0.8,
  });

  const postData = JSON.parse(completion.choices[0].message.content || '{}');

  // Generate image prompt
  const imagePrompt = `Editorial photo for a hairdressing blog post titled "${postData.title}". 
Professional salon setting, natural daylight, sage green and off-white color palette, 
muted tones, clean composition, high-end aesthetic.`;

  // In production, generate image with DALL-E
  // const imageResponse = await openai.images.generate({
  //   model: 'dall-e-3',
  //   prompt: imagePrompt,
  //   size: '1792x1024',
  //   quality: 'standard',
  // });
  // const imageUrl = imageResponse.data[0].url;

  // For now, use placeholder
  const imageUrl = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974';

  return {
    title: postData.title,
    excerpt: postData.excerpt,
    content: postData.content,
    category,
    imageUrl,
    publishedAt: new Date(),
    aiGenerated: true,
  };
}
