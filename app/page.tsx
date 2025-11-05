'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Scissors, GraduationCap, BookOpen, Award, Users, MapPin } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import InsightCard from '@/components/InsightCard';
import { services, testimonials } from '@/lib/data';

interface InsightPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  image_url: string;
  published_at: string;
  reading_time_minutes?: number;
  featured?: boolean;
  pinned_until?: string;
}

export default function Home() {
  const [featuredInsights, setFeaturedInsights] = useState<InsightPost[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedInsights();
  }, []);

  const fetchFeaturedInsights = async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const data = await response.json();
        // Get the latest 3 published posts
        const latestPosts = (data.posts || []).slice(0, 3);
        setFeaturedInsights(latestPosts);
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error);
    } finally {
      setInsightsLoading(false);
    }
  };
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding min-h-[90vh] flex items-center pt-32">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h1 className="text-balance font-display">
                Precision Cuts.
                <br />
                <span className="text-sage">Powerful Results.</span>
              </h1>
              <p className="text-xl text-graphite/70 leading-relaxed max-w-xl">
                I believe every cut should be a masterpiece. Whether you are looking for a precision cut or want to master advanced techniques, I am here to help you achieve exceptional results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/salon" className="px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105 inline-flex items-center gap-2">
                  <Scissors size={20} />
                  Salon Services
                </Link>
                <Link href="/education" className="px-8 py-4 border-2 border-sage text-sage rounded-full font-medium hover:bg-sage hover:text-white transition-all hover:scale-105 inline-flex items-center gap-2">
                  <GraduationCap size={20} />
                  Education Courses
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 pt-4 border-t border-sage/20">
                <div className="flex items-center gap-2 text-graphite/70">
                  <Award className="text-sage" size={20} />
                  <span className="text-sm font-medium">15+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 text-graphite/70">
                  <Users className="text-sage" size={20} />
                  <span className="text-sm font-medium">500+ Happy Clients</span>
                </div>
                <div className="flex items-center gap-2 text-graphite/70">
                  <MapPin className="text-sage" size={20} />
                  <span className="text-sm font-medium">Altrincham, Knutsford & Reading</span>
                </div>
              </div>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <Image
                src="/images/hero-luke.png"
                alt="Luke Robert Hair - Professional hairdressing consultation"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Salon Services Section */}
      <section className="section-padding bg-gradient-to-br from-salon-light/20 to-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-salon/5 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-salon mb-4">
              <Scissors size={24} />
              <span className="text-sm font-semibold tracking-wide uppercase">Salon Services</span>
            </div>
            <h2 className="mb-6 text-salon-dark">Precision That Transforms</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Your hair is your signature. I craft cuts that move with you, styles that last, and confidence that shows. Every client gets my full attention and expertise.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link href="/salon" className="btn-salon inline-flex items-center gap-2">
              View All Services <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Education Section */}
      <section className="section-padding bg-gradient-to-br from-education-light/30 to-white relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-education/10 rounded-full blur-3xl"></div>
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/education-image.png"
                alt="Luke Robert Hair - Professional education and training"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Right: Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 text-education">
                <GraduationCap size={24} />
                <span className="text-sm font-semibold tracking-wide uppercase">Professional Education</span>
              </div>
              <h2 className="text-education-dark">Master Your Craft. Lead Your Industry.</h2>
              <p className="text-xl text-graphite/70 leading-relaxed">
                I have spent years refining my craft, and now I want to share that knowledge with you. Learn the techniques that separate good stylists from great ones. 
                Build the confidence to create consistently stunning results, every single time.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-education rounded-full mt-2"></div>
                  <span className="text-graphite/70 font-medium">Master precision cutting from foundation to advanced</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-education rounded-full mt-2"></div>
                  <span className="text-graphite/70 font-medium">Accelerate your growth with 1-to-1 mentorship</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 bg-education rounded-full mt-2"></div>
                  <span className="text-graphite/70 font-medium">Lead your salon to excellence</span>
                </li>
              </ul>
              <Link href="/education" className="inline-block btn-education">
                Explore Courses
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6">What People Say</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Trusted by clients and professional stylists across the UK.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                text={testimonial.text}
                location={testimonial.location}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Insights Section */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 text-sage mb-4">
              <BookOpen size={24} />
              <span className="text-sm font-medium tracking-wide uppercase">From the Chair</span>
            </div>
            <h2 className="mb-6">Insights That Inspire</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Real techniques. Real results. I share my insights on mastering your craft and transforming your style.
            </p>
          </motion.div>

          {insightsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-sage/30 border-t-sage rounded-full animate-spin" />
              <p className="mt-4 text-graphite/60">Loading insights...</p>
            </div>
          ) : featuredInsights.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-graphite/60">Check back soon for fresh insights!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {featuredInsights.map((insight, index) => (
                  <InsightCard
                    key={insight.id}
                    id={insight.slug}
                    title={insight.title}
                    excerpt={insight.excerpt}
                    category={insight.category}
                    readTime={insight.reading_time_minutes ? `${insight.reading_time_minutes} min read` : '5 min read'}
                    imageUrl={insight.image_url || `https://picsum.photos/seed/${insight.slug}/800/600`}
                    index={index}
                    featured={insight.featured}
                    pinnedUntil={insight.pinned_until}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <Link href="/insights" className="inline-flex items-center gap-2 text-sage font-medium hover:gap-4 transition-all text-lg">
                  View All Insights <ArrowRight size={20} />
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-sage text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-white">Your Transformation Starts Here</h2>
            <p className="text-xl text-sage-light leading-relaxed">
              Do not settle for ordinary. Experience the difference that true mastery makes. 
              Book your appointment with me or start your education journey today.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/book"
                className="px-8 py-4 bg-white text-sage rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
              >
                Transform Your Look
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-sage transition-all hover:scale-105"
              >
                Start Your Journey
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
