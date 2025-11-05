'use client';

import { motion } from 'framer-motion';
import { Phone, FileText, Presentation, Award } from 'lucide-react';

const steps = [
  {
    number: 1,
    title: 'Discovery Call',
    description: '15-30 minutes to understand your needs, student demographics, and course objectives.',
    icon: Phone,
  },
  {
    number: 2,
    title: 'Custom Proposal',
    description: 'Receive a tailored course schedule, pricing structure, and detailed outline within 48 hours.',
    icon: FileText,
  },
  {
    number: 3,
    title: 'Course Delivery',
    description: 'Professional on-site or online delivery with full resources, materials, and ongoing support.',
    icon: Presentation,
  },
  {
    number: 4,
    title: 'CPD Certification',
    description: 'Students receive official CPD certificates recognising their professional development achievements.',
    icon: Award,
  },
];

export default function HowItWorksTimeline() {
  return (
    <div className="relative">
      {/* Desktop Timeline - Horizontal */}
      <div className="hidden lg:block">
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-sage/20 via-sage to-sage/20" />

          <div className="grid grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                {/* Number Circle */}
                <div className="relative z-10 mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-sage shadow-lg flex items-center justify-center">
                    <div className="text-center">
                      <step.icon className="w-10 h-10 text-sage mx-auto mb-2" />
                      <span className="text-2xl font-bold text-graphite">
                        {step.number}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-center">
                  <h3 className="font-playfair text-xl text-graphite mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Timeline - Vertical */}
      <div className="lg:hidden space-y-8">
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="relative flex gap-6"
          >
            {/* Left: Number Circle */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full bg-white border-4 border-sage shadow-lg flex items-center justify-center">
                <div className="text-center">
                  <step.icon className="w-6 h-6 text-sage mx-auto mb-1" />
                  <span className="text-lg font-bold text-graphite">
                    {step.number}
                  </span>
                </div>
              </div>

              {/* Connecting Line (not for last item) */}
              {index < steps.length - 1 && (
                <div className="absolute top-20 left-10 bottom-0 w-0.5 bg-gradient-to-b from-sage to-sage/20 transform -translate-x-1/2" />
              )}
            </div>

            {/* Right: Content */}
            <div className="flex-1 pb-8">
              <h3 className="font-playfair text-xl text-graphite mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}






