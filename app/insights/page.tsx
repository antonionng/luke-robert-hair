'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag, Star, Pin } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import { formatDate } from '@/lib/utils';
import { generateBreadcrumbs } from '@/lib/seo';

interface InsightPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
  ai_generated: boolean;
  insight_tags: string[];
  reading_time_minutes?: number;
  featured?: boolean;
  pinned_until?: string;
}

export default function InsightsPage() {
  const [posts, setPosts] = useState<InsightPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.posts.map((p: InsightPost) => p.category))];
        setCategories(uniqueCategories as string[]);
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Separate pinned (non-expired) from regular posts
  const now = new Date();
  const allFilteredByCategory = selectedCategory === 'All'
    ? posts
    : posts.filter(post => post.category === selectedCategory);
  
  const pinnedPosts = allFilteredByCategory.filter(post => 
    post.pinned_until && new Date(post.pinned_until) > now
  );
  
  const regularPosts = allFilteredByCategory.filter(post => 
    !post.pinned_until || new Date(post.pinned_until) <= now
  );
  
  // Combine: pinned first, then regular
  const filteredPosts = [...pinnedPosts, ...regularPosts];

  return (
    <div className="pt-20">
      {/* Structured Data for SEO */}
      <StructuredData 
        data={[
          generateBreadcrumbs([
            { name: 'Home', url: '/' },
            { name: 'Insights', url: '/insights' },
          ]),
        ]} 
      />

      {/* Hero Section */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1>Insights & Articles</h1>
            <p className="text-xl text-graphite/70 leading-relaxed">
              Thoughts on craft, education, and the art of hairdressing. Updated weekly with 
              fresh perspectives and practical advice.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-4 mb-16"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full border-2 transition-all ${
                  selectedCategory === category
                    ? 'bg-sage text-white border-sage'
                    : 'border-sage text-sage hover:bg-sage hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
              <p className="mt-4 text-graphite/60">Loading insights...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-graphite/60">No insights available yet. Check back soon!</p>
            </div>
          ) : (
            /* Blog Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  <Link href={`/insights/${post.slug}`}>
                    <div className="relative h-64 overflow-hidden">
                      {post.image_url ? (
                        <Image
                          src={post.image_url}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-sage-pale flex items-center justify-center">
                          <span className="text-sage/30 text-4xl">📝</span>
                        </div>
                      )}
                      {/* Badges for featured and pinned posts */}
                      {(post.featured || (post.pinned_until && new Date(post.pinned_until) > now)) && (
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                          {post.featured && (
                            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
                              <Star size={12} fill="currentColor" />
                              Featured
                            </span>
                          )}
                          {post.pinned_until && new Date(post.pinned_until) > now && (
                            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1 shadow-lg">
                              <Pin size={12} />
                              Pinned
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-sm text-graphite/60">
                        <div className="flex items-center gap-1">
                          <Tag size={14} className="text-sage" />
                          <span>{post.category}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{formatDate(new Date(post.published_at))}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-playfair font-light group-hover:text-sage transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-graphite/70 leading-relaxed line-clamp-3">{post.excerpt}</p>
                      <div className="pt-2">
                        <span className="text-sage font-medium group-hover:gap-2 inline-flex items-center gap-1 transition-all">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}

          {/* AI Generated Notice */}
          {!loading && posts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16 text-center"
            >
              <p className="text-sm text-graphite/50">
                Content powered by AI and curated by Luke Roberts
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding bg-sage text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-white">Stay Updated</h2>
            <p className="text-xl text-sage-light leading-relaxed">
              Get weekly insights delivered to your inbox. Tips, techniques, and industry updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-6 py-3 rounded-full text-graphite focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button type="submit" className="px-8 py-3 bg-white text-sage rounded-full font-medium hover:shadow-xl transition-all">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
