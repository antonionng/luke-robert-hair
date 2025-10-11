'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Tag } from 'lucide-react';
import { formatDate } from '@/lib/utils';

// Sample blog posts - in production, these would come from the AI content engine
const samplePosts = [
  {
    id: '1',
    title: 'The Balance Behind Every Precision Cut',
    excerpt: 'Every great haircut begins with structure — invisible geometry that shapes movement and confidence.',
    category: 'Salon Tips' as const,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1974',
    publishedAt: new Date('2025-10-01'),
    aiGenerated: true,
  },
  {
    id: '2',
    title: 'Building Confidence Through Education',
    excerpt: 'Education isn\'t about theory — it\'s about precision, repetition, and confidence in your craft.',
    category: 'Education Insights' as const,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=2069',
    publishedAt: new Date('2025-09-28'),
    aiGenerated: true,
  },
  {
    id: '3',
    title: 'Consultation: The Key to Client Satisfaction',
    excerpt: 'Why every exceptional haircut starts with listening. Learn my consultation process that ensures perfect results every time.',
    category: 'Client Care' as const,
    imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=1974&auto=format&fit=crop',
    publishedAt: new Date('2025-09-25'),
    aiGenerated: true,
  },
  {
    id: '4',
    title: 'The Art of Consultation',
    excerpt: 'A great haircut starts with listening. How to conduct consultations that build trust and clarity.',
    category: 'Salon Tips' as const,
    imageUrl: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1974&auto=format&fit=crop',
    publishedAt: new Date('2025-09-20'),
    aiGenerated: true,
  },
  {
    id: '5',
    title: 'Advanced Layering Techniques',
    excerpt: 'Master the fundamentals of layering to create movement, texture, and dimension in every cut.',
    category: 'Education Insights' as const,
    imageUrl: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?q=80&w=1974&auto=format&fit=crop',
    publishedAt: new Date('2025-09-15'),
    aiGenerated: true,
  },
  {
    id: '6',
    title: 'Maintaining Your Cut Between Visits',
    excerpt: 'Simple tips to keep your hair looking fresh and styled between salon appointments.',
    category: 'Salon Tips' as const,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1974&auto=format&fit=crop',
    publishedAt: new Date('2025-09-10'),
    aiGenerated: true,
  },
];

const categories = ['All', 'Salon Tips', 'Education Insights', 'Product Highlights'];

export default function InsightsPage() {
  return (
    <div className="pt-20">
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
                className="px-6 py-2 rounded-full border-2 border-sage text-sage hover:bg-sage hover:text-white transition-all"
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {samplePosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <Link href={`/insights/${post.id}`}>
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-sm text-graphite/60">
                      <div className="flex items-center gap-1">
                        <Tag size={14} className="text-sage" />
                        <span>{post.category}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-playfair font-light group-hover:text-sage transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-graphite/70 leading-relaxed">{post.excerpt}</p>
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

          {/* AI Generated Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-graphite/50">
              Content automatically generated and curated by our AI system
            </p>
          </motion.div>
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
