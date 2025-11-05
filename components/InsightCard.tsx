'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Star, Pin } from 'lucide-react';

interface InsightCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  imageUrl: string;
  index: number;
  featured?: boolean;
  pinnedUntil?: string;
}

export default function InsightCard({ 
  id, 
  title, 
  excerpt, 
  category, 
  readTime, 
  imageUrl, 
  index,
  featured,
  pinnedUntil
}: InsightCardProps) {
  // Check if post is currently pinned
  const isPinned = pinnedUntil && new Date(pinnedUntil) > new Date();
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/insights/${id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 bg-sage text-white text-xs font-medium rounded-full">
              {category}
            </span>
            {featured && (
              <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Star size={12} fill="currentColor" />
                Featured
              </span>
            )}
            {isPinned && (
              <span className="px-3 py-1 bg-blue-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                <Pin size={12} />
                Pinned
              </span>
            )}
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-graphite/60 text-sm">
            <Clock size={16} />
            <span>{readTime}</span>
          </div>
          
          <h3 className="text-xl font-heading font-semibold text-graphite group-hover:text-sage transition-colors">
            {title}
          </h3>
          
          <p className="text-graphite/70 leading-relaxed">
            {excerpt}
          </p>
          
          <div className="flex items-center gap-2 text-sage font-medium group-hover:gap-4 transition-all">
            Read Article <ArrowRight size={18} />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
