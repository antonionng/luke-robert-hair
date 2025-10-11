'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { GraduationCap, Award, Users, Target } from 'lucide-react';
import CourseCard from '@/components/CourseCard';
import { courses } from '@/lib/data';

export default function EducationPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-sage">
                <GraduationCap size={24} />
                <span className="text-sm font-medium tracking-wide uppercase">Professional Education</span>
              </div>
              <h1>Build Your Craft with Confidence</h1>
              <p className="text-xl text-graphite/70 leading-relaxed">
                After 15 years behind the chair and training hundreds of stylists, I have learned what actually works. 
                Not theory. Not trends. Just proven techniques that you can use on Monday morning with real clients.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/education-hero.png"
                alt="Luke Robert Hair professional education and training"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Luke's Education */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-6 mb-16"
          >
            <h2>Why I Teach</h2>
            <p className="text-xl text-graphite/70 leading-relaxed">
              I remember the fear of standing behind the chair early in my career. That moment when you are not quite sure 
              if you can deliver what the client wants. I have been there. Now, as a L'Oréal Professional Ambassador, 
              I help stylists move past that fear and into true confidence. Every course I teach is about giving you 
              techniques that work - not just once, but every single time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Award, title: 'L\'Oréal Educator', desc: 'Official training partner' },
              { icon: Users, title: '500+ Stylists', desc: 'Trained nationwide' },
              { icon: Target, title: 'Precision Focus', desc: 'Structured methodology' },
              { icon: GraduationCap, title: 'All Levels', desc: 'Foundation to advanced' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-3"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-sage/10 rounded-full">
                  <item.icon className="text-sage" size={28} />
                </div>
                <h3 className="text-xl font-playfair font-light">{item.title}</h3>
                <p className="text-graphite/70">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6">How I Can Help You Grow</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Whether you are just starting out or looking to refine your advanced skills, I have built these courses 
              to meet you where you are and take you where you want to be.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Assistant Prompt */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center space-y-8 bg-sage/5 p-12 rounded-3xl"
          >
            <h2>Not Sure Which Course is Right?</h2>
            <p className="text-xl text-graphite/70 leading-relaxed">
              Let me help you choose. I have built an AI assistant that understands exactly what each course offers. 
              Tell it about your experience level and goals, and it will recommend the perfect fit.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).openChatWithMessage) {
                  (window as any).openChatWithMessage('Help me choose the right course for my skill level');
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105 shadow-lg"
            >
              <span>💬</span>
              <span>Ask Luke's AI: "Which course is right for me?"</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-sage text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-white">Ready to Elevate Your Skills?</h2>
            <p className="text-xl text-sage-light leading-relaxed">
              Get in touch to discuss your training needs or book a course today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?type=education"
                className="px-8 py-4 bg-white text-sage rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
              >
                Enquire Now
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-sage transition-all hover:scale-105"
              >
                Learn More About Luke
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
