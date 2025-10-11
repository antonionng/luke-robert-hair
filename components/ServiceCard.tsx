'use client';

import { motion } from 'framer-motion';
import { Service } from '@/lib/types';
import { Clock } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-playfair font-light">{service.name}</h3>
          <span className="text-sage font-medium text-lg">{service.price}</span>
        </div>
        
        <p className="text-graphite/70 leading-relaxed">{service.description}</p>
        
        <div className="flex items-center gap-2 text-sm text-graphite/60">
          <Clock size={16} />
          <span>{service.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}
