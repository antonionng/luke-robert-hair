'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Calendar, Tag, Share2, ExternalLink } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams } from 'next/navigation';
import StructuredData from '@/components/StructuredData';
import { siteConfig } from '@/lib/seo';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.id as string;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36)}`);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  useEffect(() => {
    if (post?.id) {
      trackView();
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data.post) {
          setPost(data.post);
        }
      }
    } catch (error) {
      console.error('Failed to fetch post:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch('/api/insights/track-view', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: post.id,
          sessionId,
          referrer: document.referrer,
          source: new URLSearchParams(window.location.search).get('utm_source'),
          medium: new URLSearchParams(window.location.search).get('utm_medium'),
          campaign: new URLSearchParams(window.location.search).get('utm_campaign'),
        }),
      });
    } catch (error) {
      console.error('Failed to track view:', error);
    }
  };

  const trackClick = async (eventType: 'click' | 'cta_click' | 'share', metadata?: any) => {
    try {
      await fetch('/api/insights/track-click', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentId: post.id,
          sessionId,
          eventType,
          metadata,
        }),
      });
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const handleShare = () => {
    trackClick('share', { platform: 'native' });
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleCtaClick = () => {
    if (post.cta_url) {
      trackClick('cta_click', { url: post.cta_url, label: post.cta_label });
    }
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin mb-4" />
          <p className="text-graphite/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-playfair mb-4">Post Not Found</h1>
          <Link href="/insights" className="text-sage hover:underline">
            Back to Insights
          </Link>
        </div>
      </div>
    );
  }

  // Generate Article structured data
  const articleSchema = post ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url || `${siteConfig.url}${siteConfig.ogImage}`,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: 'Luke Robert',
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo-white.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/insights/${slug}`,
    },
    articleSection: post.category,
    keywords: post.insight_tags?.join(', ') || '',
    wordCount: post.content?.split(' ').length || 0,
    ...(post.reading_time_minutes && {
      timeRequired: `PT${post.reading_time_minutes}M`,
    }),
  } : null;

  return (
    <div className="pt-20">
      {/* Structured Data for SEO */}
      {articleSchema && <StructuredData data={articleSchema} />}

      {/* Hero Section */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/insights"
              onClick={() => trackClick('click', { target: 'back_button' })}
              className="inline-flex items-center gap-2 text-sage font-medium mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft size={20} />
              Back to Insights
            </Link>

            <div className="flex items-center gap-4 text-sm text-graphite/60 mb-6">
              <div className="flex items-center gap-2">
                <Tag size={16} className="text-sage" />
                <span>{post.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(new Date(post.published_at))}</span>
              </div>
              {post.reading_time_minutes && (
                <div className="text-sm">
                  {post.reading_time_minutes} min read
                </div>
              )}
            </div>

            <h1 className="mb-6">{post.title}</h1>
            <p className="text-xl text-graphite/70 leading-relaxed">{post.excerpt}</p>

            {/* Tags */}
            {post.insight_tags && post.insight_tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-6">
                {post.insight_tags.map((tag: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-sage/10 text-sage rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          {post.image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-12"
            >
              <Image
                src={post.image_url}
                alt={post.hero_alt || post.title}
                fill
                className="object-cover"
              />
              {post.hero_caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <p className="text-white text-sm">{post.hero_caption}</p>
                </div>
              )}
            </motion.div>
          )}

          {/* Content */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="prose prose-lg prose-slate max-w-none 
              prose-headings:font-playfair prose-headings:text-graphite
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:font-semibold
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-h3:font-semibold
              prose-p:text-graphite/80 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
              prose-strong:text-graphite prose-strong:font-bold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-3
              prose-li:text-graphite/80 prose-li:leading-relaxed prose-li:text-base prose-li:pl-2
              [&>*:first-child]:mt-0
              [&_p>strong:only-child]:block [&_p>strong:only-child]:mt-6 [&_p>strong:only-child]:mb-3 [&_p>strong:only-child]:text-lg"
          >
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({children, ...props}) => {
                  return <p className="mb-6 leading-relaxed text-graphite/80" {...props}>{children}</p>;
                },
                strong: ({children, ...props}) => {
                  return <strong className="font-bold text-graphite" {...props}>{children}</strong>;
                },
                ul: ({...props}) => <ul className="my-6 space-y-3 list-disc pl-6" {...props} />,
                li: ({...props}) => <li className="leading-relaxed text-graphite/80" {...props} />,
                h2: ({children, ...props}) => <h2 className="text-3xl font-semibold mt-12 mb-6 font-playfair text-graphite" {...props}>{children}</h2>,
                h3: ({children, ...props}) => <h3 className="text-xl font-semibold mt-8 mb-4 font-playfair text-graphite" {...props}>{children}</h3>,
                a: ({children, href, ...props}) => (
                  <a 
                    href={href} 
                    onClick={() => trackClick('click', { target: 'content_link', url: href })}
                    className="text-sage hover:underline"
                    {...props}
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </motion.article>

          {/* CTA Section */}
          {post.cta_label && post.cta_url && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 p-8 bg-gradient-to-br from-sage-pale to-sage/10 rounded-2xl border border-sage/20"
            >
              <h3 className="text-2xl font-playfair text-graphite mb-3">{post.cta_label}</h3>
              {post.cta_description && (
                <p className="text-graphite/70 mb-6">{post.cta_description}</p>
              )}
              <a
                href={post.cta_url}
                onClick={handleCtaClick}
                target={post.cta_url.startsWith('http') ? '_blank' : undefined}
                rel={post.cta_url.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="inline-flex items-center gap-2 px-6 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all"
              >
                Learn More
                {post.cta_url.startsWith('http') && <ExternalLink size={16} />}
              </a>
            </motion.div>
          )}

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 pt-8 border-t border-mist"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-graphite/60 mb-2">Share this article</p>
                <div className="flex gap-4">
                  <button
                    onClick={handleShare}
                    className="p-3 bg-sage/10 rounded-full hover:bg-sage/20 transition-colors"
                  >
                    <Share2 size={20} className="text-sage" />
                  </button>
                </div>
              </div>
              {post.ai_generated && (
                <div className="text-sm text-graphite/50 italic">
                  AI-generated content
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="mb-8">Continue Reading</h2>
            <Link
              href="/insights"
              onClick={() => trackClick('click', { target: 'view_all_button' })}
              className="btn-primary"
            >
              View All Articles
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
