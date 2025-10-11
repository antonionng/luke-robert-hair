'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  text: string;
  location: string;
  rating?: number;
  index: number;
}

export default function TestimonialCard({ name, text, location, rating = 5, index }: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <Quote className="text-sage/20" size={32} />
        <div className="flex gap-1">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} className="text-education fill-education" size={16} />
          ))}
        </div>
      </div>
      <p className="text-graphite/80 leading-relaxed mb-6">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="font-semibold text-graphite">{name}</p>
        <p className="text-sm text-graphite/60">{location}</p>
      </div>
    </motion.div>
  );
}
