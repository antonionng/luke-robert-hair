'use client';

import { useState } from 'react';
import { MessageSquare, Target, Heart, Lightbulb, Clock, Users, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CPDCourse } from '@/lib/data/cpdCourses';

interface CPDCourseCardProps {
  course: CPDCourse;
}

const iconMap = {
  MessageSquare,
  Target,
  Heart,
  Lightbulb,
};

export default function CPDCourseCard({ course }: CPDCourseCardProps) {
  const [showModal, setShowModal] = useState(false);
  
  const Icon = iconMap[course.icon as keyof typeof iconMap] || MessageSquare;

  return (
    <>
      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-sage group"
      >
        {/* Icon */}
        <div className="w-16 h-16 rounded-xl bg-sage/10 flex items-center justify-center mb-6 group-hover:bg-sage/20 transition-colors">
          <Icon className="w-8 h-8 text-sage" />
        </div>

        {/* Title */}
        <h3 className="font-playfair text-2xl text-graphite mb-3">
          {course.title}
        </h3>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sage/10 text-sage">
            <Clock className="w-3 h-3 mr-1" />
            {course.duration}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
            <Users className="w-3 h-3 mr-1" />
            {course.level}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed mb-6">
          {course.shortDescription}
        </p>

        {/* Key Outcomes Preview */}
        <ul className="space-y-2 mb-6">
          {course.outcomes.slice(0, 3).map((outcome, index) => (
            <li key={index} className="flex items-start text-sm text-gray-700">
              <CheckCircle className="w-4 h-4 text-sage mr-2 mt-0.5 flex-shrink-0" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>

        {/* Learn More Button */}
        <button
          onClick={() => setShowModal(true)}
          className="w-full py-3 px-6 bg-graphite text-white rounded-lg font-medium hover:bg-sage transition-colors duration-300"
        >
          Learn More
        </button>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-3xl bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-sage/5 px-8 py-6 border-b border-sage/10 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-sage/10 transition-colors"
                >
                  <X className="w-5 h-5 text-graphite" />
                </button>

                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-sage/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-sage" />
                  </div>
                  <div>
                    <h2 className="font-playfair text-3xl text-graphite mb-2">
                      {course.title}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-sage">
                        <Clock className="w-3 h-3 mr-1" />
                        {course.duration}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-700">
                        <Users className="w-3 h-3 mr-1" />
                        {course.level}
                      </span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-purple-700">
                        {course.accreditation}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="px-8 py-6 max-h-[60vh] overflow-y-auto">
                {/* Full Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-graphite mb-3">Overview</h3>
                  <p className="text-gray-700 leading-relaxed">{course.fullDescription}</p>
                </div>

                {/* Learning Outcomes */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-graphite mb-3">Learning Outcomes</h3>
                  <ul className="space-y-2">
                    {course.outcomes.map((outcome, index) => (
                      <li key={index} className="flex items-start text-gray-700">
                        <CheckCircle className="w-5 h-5 text-sage mr-3 mt-0.5 flex-shrink-0" />
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Suitable For */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-graphite mb-3">Suitable For</h3>
                  <p className="text-gray-700">{course.suitableFor}</p>
                </div>

                {/* Delivery Options */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-graphite mb-3">Delivery Options</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.deliveryOptions.map((option, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-sage/10 text-sage rounded-lg text-sm font-medium"
                      >
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 border-2 border-gray-300 text-graphite rounded-lg font-medium hover:border-sage hover:text-sage transition-colors duration-300"
                >
                  Close
                </button>
                <a
                  href="#enquiry-form"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 px-6 bg-sage text-white rounded-lg font-medium hover:bg-graphite transition-colors duration-300 text-center"
                >
                  Enquire About This Course
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}



