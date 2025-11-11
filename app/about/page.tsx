'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Award, Scissors, GraduationCap, Heart } from 'lucide-react';
import StructuredData from '@/components/StructuredData';
import { generatePersonSchema, generateBreadcrumbs } from '@/lib/seo';

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Structured Data for SEO */}
      <StructuredData 
        data={[
          generatePersonSchema(),
          generateBreadcrumbs([
            { name: 'Home', url: '/' },
            { name: 'About', url: '/about' },
          ]),
        ]} 
      />

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
                Educator. Master Cutter. UK & Ireland
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
                title: 'Creating Beautiful, Wearable Hair',
                desc: 'Every cut I create must be both stunning to look at and practical to live with. Beautiful hair that works in real life - that is the standard.',
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
                year: '2012',
                title: 'Saturday Boy',
                desc: 'Where it all started. Sweeping floors, making tea, and watching the stylists work. I knew this was what I wanted to do.',
              },
              {
                year: '2014',
                title: 'Apprenticeship',
                desc: 'Proper training began. Long days, sore feet, but I was obsessed with getting every angle right, every section perfect.',
              },
              {
                year: '2016',
                title: 'Shop Floor Stylist',
                desc: 'Finally had my own chair. Started building relationships with clients and really understanding what makes a cut work in real life.',
              },
              {
                year: '2017',
                title: 'Young Artist Team',
                desc: 'Got selected for the young artist program. Pushed me creatively and taught me techniques I still use every day.',
              },
              {
                year: '2018',
                title: 'Salon International Stage Show',
                desc: 'Performed on stage in front of thousands. Nerve-wracking but incredible. Proved to myself I could compete at the highest level.',
              },
              {
                year: '2019',
                title: 'Opened My Salon',
                desc: 'Took the leap. Opened my own place where I could do things my way - precision haircuts, honest advice, no gimmicks.',
              },
              {
                year: '2020',
                title: 'Goldwell Guest Artist',
                desc: 'Started working with Goldwell as a guest artist. Loved sharing what I\'d learned and seeing other stylists have those "aha" moments.',
              },
              {
                year: '2021',
                title: 'International Education',
                desc: 'Teaching went global. Traveled to train stylists abroad and realized education was becoming as important to me as cutting.',
              },
              {
                year: '2022',
                title: 'L\'Oréal UKI Artist',
                desc: 'Became a L\'Oréal Professional artist. A dream partnership with a brand I\'ve always respected. Now training stylists across the UK and Ireland.',
              },
              {
                year: 'Present',
                title: 'Multi-Location & Beyond',
                desc: 'Running salons across multiple locations, trained over 500 stylists, and still learning every day. The journey continues.',
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
              <h2 className="mb-2">Trusted By Industry Leading Brands</h2>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-12">
              {[
                { name: 'GS Education', image: '/images/brands/gs-education.png' },
                { name: 'SACO', image: '/images/brands/saco.png' },
                { name: 'Wings', image: '/images/brands/wings.png' },
                { name: 'Yoi Scissors', image: '/images/brands/yoi-scissors.png' },
                { name: 'Ibiza Brushes', image: '/images/brands/ibiza-brushes.png' },
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
