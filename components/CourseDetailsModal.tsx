'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, CheckCircle, Users, Award, Calendar } from 'lucide-react';
import { Course } from '@/lib/types';

interface CourseDetailsModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnquire: () => void;
}

// Extended course details (in real app, this would come from API/database)
const courseDetails: Record<string, {
  curriculum: { title: string; topics: string[] }[];
  whatYouWillLearn: string[];
  whoIsItFor: string[];
  includes: string[];
  outcomes: string[];
}> = {
  'foundation-cutting': {
    curriculum: [
      {
        title: 'Day 1: Fundamentals & Geometry',
        topics: [
          'Understanding hair structure and growth patterns',
          'Core cutting principles and angles',
          'Sectioning techniques for precision',
          'Tension control and hand positioning',
          'Classic bob and one-length cuts',
        ],
      },
      {
        title: 'Day 2: Graduation & Practice',
        topics: [
          'Graduation techniques and weight distribution',
          'Creating movement and texture',
          'Consultation and client communication',
          'Hands-on practice with live models',
          'Troubleshooting common mistakes',
        ],
      },
    ],
    whatYouWillLearn: [
      'Master the geometry behind every great haircut',
      'Build unshakeable confidence in your cutting technique',
      'Create precise, wearable styles that last 8-10 weeks',
      'Understand how to consult effectively with clients',
      'Develop a systematic approach to every cut',
    ],
    whoIsItFor: [
      'Stylists with 1-3 years experience',
      'Those wanting to refine their foundation skills',
      'Stylists looking to build confidence',
      'Anyone struggling with consistency',
    ],
    includes: [
      '2 full days of intensive training',
      'Live model practice sessions',
      'Course manual and reference materials',
      'Certificate of completion',
      '30 days post-course support',
    ],
    outcomes: [
      'Cut with precision and confidence',
      'Reduce cutting time by 30%',
      'Increase client satisfaction and retention',
      'Command higher prices for your work',
    ],
  },
  'advanced-cutting': {
    curriculum: [
      {
        title: 'Day 1: Advanced Layering',
        topics: [
          'Complex layering techniques',
          'Creating seamless blends',
          'Advanced graduation methods',
          'Working with different hair textures',
          'Precision point cutting',
        ],
      },
      {
        title: 'Day 2: Freehand & Texturising',
        topics: [
          'Freehand cutting techniques',
          'Advanced texturising methods',
          'Creating bespoke shapes',
          'Working without guides',
          'Speed and efficiency techniques',
        ],
      },
      {
        title: 'Day 3: Consultation & Portfolio',
        topics: [
          'Advanced consultation methods',
          'Reading clients and their lifestyle',
          'Creating signature styles',
          'Building your portfolio',
          'Marketing your advanced skills',
        ],
      },
    ],
    whatYouWillLearn: [
      'Master advanced cutting techniques',
      'Create any style you can envision',
      'Work confidently without guides',
      'Develop your signature cutting style',
      'Build a portfolio that attracts premium clients',
    ],
    whoIsItFor: [
      'Experienced stylists (3+ years)',
      'Those ready to push beyond basics',
      'Stylists wanting to specialize',
      'Anyone aiming for master-level skills',
    ],
    includes: [
      '3 full days of advanced training',
      'Multiple live model sessions',
      'Advanced technique manual',
      'Portfolio development guidance',
      '60 days post-course mentorship',
    ],
    outcomes: [
      'Create complex, bespoke styles',
      'Attract and retain premium clients',
      'Become the go-to stylist in your area',
      'Increase your prices by 40-50%',
    ],
  },
  'one-to-one': {
    curriculum: [
      {
        title: 'Customised to Your Needs',
        topics: [
          'We design the curriculum together based on your goals',
          'Focus on your specific challenges and opportunities',
          'Work at your pace with direct feedback',
          'Refine techniques that matter most to you',
          'Build systems that work for your business',
        ],
      },
    ],
    whatYouWillLearn: [
      'Whatever you need - this is fully customised',
      'Direct feedback on your technique',
      'Personalized business and brand development',
      'Systems to scale your success',
      'Ongoing support and accountability',
    ],
    whoIsItFor: [
      'Stylists at any level wanting personalized coaching',
      'Salon owners looking to elevate their team',
      'Those with specific challenges to overcome',
      'Anyone serious about accelerating their growth',
    ],
    includes: [
      'Fully customised curriculum',
      'Direct access to Luke',
      'Flexible scheduling',
      'Ongoing support between sessions',
      'Business and brand development',
    ],
    outcomes: [
      'Rapid skill development',
      'Overcome specific challenges',
      'Build a stronger personal brand',
      'Create systems for sustainable growth',
    ],
  },
  'salon-leaders': {
    curriculum: [
      {
        title: 'Month 1-2: Foundation',
        topics: [
          'Leadership principles and mindset',
          'Team assessment and development plans',
          'Systems audit and optimization',
          'Communication frameworks',
          'Setting clear standards',
        ],
      },
      {
        title: 'Month 3-4: Implementation',
        topics: [
          'Team training programmes',
          'Process documentation',
          'Quality control systems',
          'Client experience optimization',
          'Performance management',
        ],
      },
      {
        title: 'Month 5-6: Growth & Scale',
        topics: [
          'Business growth strategies',
          'Marketing and positioning',
          'Financial management',
          'Building your leadership team',
          'Creating lasting systems',
        ],
      },
    ],
    whatYouWillLearn: [
      'Lead with confidence and clarity',
      'Build systems that scale',
      'Develop teams that thrive',
      'Create consistent quality across your salon',
      'Grow profitably and sustainably',
    ],
    whoIsItFor: [
      'Salon owners and managers',
      'Senior stylists moving into leadership',
      'Those struggling with team performance',
      'Salons ready to scale',
    ],
    includes: [
      '6 months of intensive support',
      'Monthly on-site visits',
      'Team training sessions',
      'Systems and process templates',
      'Ongoing support and accountability',
    ],
    outcomes: [
      'Transform your salon culture',
      'Increase team performance by 50%',
      'Build systems that run without you',
      'Grow revenue while reducing stress',
    ],
  },
};

export default function CourseDetailsModal({ course, isOpen, onClose, onEnquire }: CourseDetailsModalProps) {
  if (!course) return null;

  const details = courseDetails[course.id];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
              >
                {/* Header */}
                <div className="bg-sage text-white p-8 relative">
                  <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                  
                  <div className="inline-block px-3 py-1 bg-white/20 text-white text-sm font-medium rounded-full mb-4">
                    {course.level}
                  </div>
                  <h2 className="text-4xl font-playfair font-light mb-4">{course.title}</h2>
                  <p className="text-sage-light text-lg">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-6 mt-6">
                    <div className="flex items-center gap-2">
                      <Clock size={20} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={20} />
                      <span>Certificate Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={20} />
                      <span>Small Groups</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
                  {/* Curriculum */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-playfair font-light mb-6">Curriculum</h3>
                    <div className="space-y-6">
                      {details.curriculum.map((section, idx) => (
                        <div key={idx} className="bg-sage-pale/20 p-6 rounded-2xl">
                          <h4 className="text-lg font-semibold text-sage mb-4">{section.title}</h4>
                          <ul className="space-y-2">
                            {section.topics.map((topic, topicIdx) => (
                              <li key={topicIdx} className="flex items-start gap-2 text-graphite/70">
                                <CheckCircle size={16} className="text-sage mt-1 flex-shrink-0" />
                                <span>{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What You'll Learn */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-playfair font-light mb-4">What You Will Learn</h3>
                    <ul className="space-y-3">
                      {details.whatYouWillLearn.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle size={20} className="text-sage mt-0.5 flex-shrink-0" />
                          <span className="text-graphite/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Who Is It For */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-playfair font-light mb-4">Who Is This For?</h3>
                    <ul className="space-y-3">
                      {details.whoIsItFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Users size={20} className="text-sage mt-0.5 flex-shrink-0" />
                          <span className="text-graphite/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What's Included */}
                  <div className="mb-8">
                    <h3 className="text-2xl font-playfair font-light mb-4">What's Included</h3>
                    <ul className="space-y-3">
                      {details.includes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Award size={20} className="text-sage mt-0.5 flex-shrink-0" />
                          <span className="text-graphite/70">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Outcomes */}
                  <div className="bg-sage-pale/30 p-6 rounded-2xl">
                    <h3 className="text-2xl font-playfair font-light mb-4">Expected Outcomes</h3>
                    <ul className="space-y-3">
                      {details.outcomes.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle size={20} className="text-sage mt-0.5 flex-shrink-0" />
                          <span className="text-graphite/70 font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-mist p-8 bg-sage-pale/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-graphite/60 mb-1">Investment</p>
                      <p className="text-3xl font-bold text-sage">{course.price}</p>
                    </div>
                    <button
                      onClick={onEnquire}
                      className="px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105 shadow-lg"
                    >
                      Enquire Now
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
