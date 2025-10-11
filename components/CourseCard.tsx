'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/lib/types';
import { Clock, CheckCircle, ArrowRight } from 'lucide-react';
import CourseEnquiryModal from './CourseEnquiryModal';
import CourseDetailsModal from './CourseDetailsModal';

interface CourseCardProps {
  course: Course;
  index: number;
}

export default function CourseCard({ course, index }: CourseCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group"
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="inline-block px-3 py-1 bg-sage/10 text-sage text-sm font-medium rounded-full mb-4">
            {course.level}
          </div>
          <h3 className="text-2xl font-playfair font-light mb-2">{course.title}</h3>
          <p className="text-graphite/70 leading-relaxed">{course.description}</p>
        </div>

        {/* Details */}
        <div className="flex items-center gap-6 text-sm text-graphite/60">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <span className="text-sage font-medium text-lg">{course.price}</span>
        </div>

        {/* Highlights */}
        <ul className="space-y-2">
          {course.highlights.map((highlight, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-graphite/70">
              <CheckCircle size={16} className="text-sage mt-0.5 flex-shrink-0" />
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsDetailsOpen(true)}
            className="flex-1 text-center px-6 py-3 border-2 border-sage text-sage rounded-full font-medium hover:bg-sage hover:text-white transition-all group-hover:scale-105"
          >
            View Details
          </button>
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="flex-1 text-center px-6 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all group-hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            Enquire
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>

    <CourseDetailsModal
      course={course}
      isOpen={isDetailsOpen}
      onClose={() => setIsDetailsOpen(false)}
      onEnquire={() => {
        setIsDetailsOpen(false);
        setIsEnquiryOpen(true);
      }}
    />

    <CourseEnquiryModal
      course={course}
      isOpen={isEnquiryOpen}
      onClose={() => setIsEnquiryOpen(false)}
    />
    </>
  );
}
