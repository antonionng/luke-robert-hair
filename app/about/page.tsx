'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Scissors, GraduationCap, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-5xl leading-tight">15 Years of Precision. 500+ Stylists Trained.</h1>
              <p className="text-xl text-sage font-medium">
                L'Oréal Professional Ambassador. Educator. Master Cutter.
              </p>
              <p className="text-lg text-graphite/70 leading-relaxed">
                I have spent 15 years perfecting my craft - understanding the geometry, the movement, the structure 
                that makes a haircut last. Every technique I teach has been tested on thousands of clients.
              </p>
              <p className="text-lg text-graphite/70 leading-relaxed">
                Now I train stylists across the UK, sharing the techniques that took me years to master. 
                I help them build the confidence and skill to create consistently exceptional results.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative h-[500px] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image
                src="/images/luke-portrait.png"
                alt="Luke Robert - Professional Hairdresser and Educator"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-sage-pale/20">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">What I Believe</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Technique Over Trends',
                desc: 'I teach foundations that work on every client, every time. Your reputation depends on consistency, not luck.',
              },
              {
                title: 'Wearable, Not Just Beautiful',
                desc: 'I create styles that work with your life, not against it. A great cut should last 8-10 weeks.',
              },
              {
                title: 'Teaching is My Legacy',
                desc: 'The stylists I train will impact thousands of clients. That is how I multiply my impact.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-3"
              >
                <h3 className="text-xl font-semibold text-graphite">{item.title}</h3>
                <p className="text-graphite/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-4">The Journey</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                year: '2010',
                title: 'Started Training',
                desc: 'Began apprenticeship, learning precision cutting and classic techniques.',
              },
              {
                year: '2015',
                title: 'Established Practice',
                desc: 'Opened first location in Altrincham, building a loyal client base.',
              },
              {
                year: '2018',
                title: 'L\'Oréal Professional Ambassador',
                desc: 'Became official training partner, teaching stylists nationwide.',
              },
              {
                year: '2021',
                title: 'Multi-Location Growth',
                desc: 'Expanded to Knutsford and Reading, serving clients across the UK.',
              },
              {
                year: '2024',
                title: '500+ Stylists Trained',
                desc: 'Built comprehensive education programs from foundation to advanced techniques.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-6 items-start border-l-2 border-sage pl-6 py-2"
              >
                <div className="flex-shrink-0 w-16 text-sage font-bold">{item.year}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-graphite mb-1">{item.title}</h3>
                  <p className="text-graphite/70">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-sage-pale/20">
        <div className="container-custom max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '15+', label: 'Years Experience' },
              { number: '500+', label: 'Stylists Trained' },
              { number: '3', label: 'UK Locations' },
              { number: '1000+', label: 'Clients Served' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-sage mb-2">{stat.number}</div>
                <div className="text-sm text-graphite/70">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <div>
              <h2 className="mb-2">Trusted By Industry Leaders</h2>
              <p className="text-graphite/60">
                Proud L'Oréal Professional Ambassador
              </p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[
                { name: "L'ORÉAL PROFESSIONNEL", image: '/images/brands/loreal.png' },
                { name: 'REDKEN', image: '/images/brands/redken.png' },
                { name: 'WELLA', image: '/images/brands/wella.png' },
              ].map((brand, index) => (
                <motion.div
                  key={brand.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative w-40 h-16 flex items-center justify-center"
                >
                  <Image
                    src={brand.image}
                    alt={`${brand.name} logo`}
                    fill
                    className="object-contain opacity-60 hover:opacity-100 transition-opacity"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.innerHTML = `<span class="text-xl font-bold text-graphite/60">${brand.name}</span>`;
                      }
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-sage text-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2 className="text-white">Ready to Work Together?</h2>
            <p className="text-lg text-sage-light max-w-2xl mx-auto">
              Whether you want a precision cut or professional training, I am here to help.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-4">
              <Link
                href="/book"
                className="px-8 py-3 bg-white text-sage rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
              >
                Book Appointment
              </Link>
              <Link
                href="/education"
                className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-sage transition-all hover:scale-105"
              >
                View Courses
              </Link>
              <Link
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white rounded-full font-medium hover:bg-white hover:text-sage transition-all hover:scale-105"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
