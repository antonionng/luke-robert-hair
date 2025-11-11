'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, MessageCircle } from 'lucide-react';
import ServiceCard from '@/components/ServiceCard';
import TestimonialCard from '@/components/TestimonialCard';
import StructuredData from '@/components/StructuredData';
import { services, testimonials } from '@/lib/data';
import { 
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbs,
  siteConfig,
} from '@/lib/seo';

export default function SalonPage() {
  return (
    <div className="pt-20">
      {/* Structured Data for SEO */}
      <StructuredData 
        data={[
          generateOrganizationSchema(),
          ...siteConfig.locations.map(loc => generateLocalBusinessSchema(loc)),
          generateBreadcrumbs([
            { name: 'Home', url: '/' },
            { name: 'Salon Services', url: '/salon' },
          ]),
        ]} 
      />

      {/* Hero Section */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto space-y-6"
          >
            <h1>How I Can Help You</h1>
            <p className="text-xl text-graphite/70 leading-relaxed">
              After 15 years behind the chair, I've learned that every great haircut starts with understanding <em>you</em>. 
              Not just your hair - your lifestyle, your routine, how much time you have in the morning.
            </p>
            <p className="text-lg text-graphite/60 leading-relaxed">
              I believe every haircut should work as hard as you do. That's why I focus on creating styles that look 
              great today and still turn heads 8 weeks from now. No high-maintenance haircuts that fall apart after one wash - 
              just precision work that moves with you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/book" className="btn-primary">
              Book Your Appointment
            </Link>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section className="py-16 bg-sage-pale/20">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-6"
          >
            <h2 className="text-3xl lg:text-4xl">Not Sure Which Service is Right?</h2>
            <p className="text-xl text-graphite/70 leading-relaxed">
              Let me help you choose. I have built an AI assistant that understands exactly what each service offers. 
              Tell it about your hair type, lifestyle, and goals, and it will recommend the perfect fit.
            </p>
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).openChatWithMessage) {
                  (window as any).openChatWithMessage('Hi! I need help choosing the right service for my hair. Can you help me understand the differences?');
                }
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all hover:scale-105 shadow-lg"
            >
              <MessageCircle size={20} />
              Ask Luke's AI: "Which service is right for me?"
            </button>
          </motion.div>
        </div>
      </section>

      {/* Gallery - Haircuts Showcase */}
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6">Precision Haircuts Gallery</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Every haircut tells a story. From classic bobs to modern layered styles, each cut is crafted with precision 
              and designed to last. Here's a showcase of my work - all haircuts that move beautifully and grow out gracefully.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, src: '/images/gallery/haircut-1.png', alt: 'Luke Robert Hair - Precision haircut showcase 1' },
              { id: 2, src: '/images/gallery/haircut-2.png', alt: 'Luke Robert Hair - Precision haircut showcase 2' },
              { id: 3, src: '/images/gallery/haircut-3.png', alt: 'Luke Robert Hair - Precision haircut showcase 3' },
              { id: 4, src: '/images/gallery/haircut-4.png', alt: 'Luke Robert Hair - Precision haircut showcase 4' },
              { id: 5, src: '/images/gallery/haircut-5.png', alt: 'Luke Robert Hair - Precision haircut showcase 5' },
              { id: 6, src: '/images/gallery/haircut-6.png', alt: 'Luke Robert Hair - Precision haircut showcase 6' }
            ].map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative h-96 rounded-2xl overflow-hidden shadow-lg group"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6">Client Reviews</h2>
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

      {/* Locations */}
      <section className="section-padding bg-sage text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-white mb-6">Where to Find Me</h2>
            <p className="text-xl text-sage-light max-w-2xl mx-auto">
              I work across three locations in Cheshire and Berkshire. Each salon offers the same precision cutting 
              and personalised service - just choose the location that works best for you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Altrincham',
                salon: 'Fixx Salon',
                address: '1b Lloyd St, Altrincham',
                postcode: 'WA14 2DD',
                days: 'Tuesday & Wednesday',
                frequency: '3 weeks per month',
                id: 'altrincham'
              },
              {
                name: 'Knutsford',
                salon: 'Urban Sanctuary',
                address: '29 King St, Knutsford',
                postcode: 'WA16 6DW',
                days: 'Friday & Saturday',
                frequency: '3 weeks per month',
                id: 'knutsford'
              },
              {
                name: 'Caversham',
                salon: 'Alternate Salon',
                address: '19 Church Street, Caversham',
                postcode: 'RG4 8BA',
                days: 'Monday - Saturday',
                frequency: '1 week per month',
                id: 'caversham'
              }
            ].map((location, index) => (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-sage-light flex-shrink-0 mt-1" size={24} />
                    <div className="space-y-2">
                      <h3 className="text-2xl font-playfair font-light text-white">{location.name}</h3>
                      <p className="text-sage-light font-medium">{location.salon}</p>
                      <p className="text-sage-light text-sm">
                        {location.address}<br />
                        {location.postcode}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20 space-y-2">
                    <p className="text-white font-medium">{location.days}</p>
                    <p className="text-sage-light text-sm">{location.frequency}</p>
                  </div>

                  <Link
                    href="/book"
                    className="inline-block w-full text-center mt-4 px-6 py-3 bg-white text-sage rounded-full font-medium hover:shadow-xl transition-all"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center"
          >
            <p className="text-sage-light text-sm">
              💡 <strong>Tip:</strong> My Caversham week rotates monthly. When you book, the system will show you exactly when I'm available at each location.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
