'use client';

import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1>Terms of Service</h1>
            <p className="text-xl text-graphite/70">
              Last updated: October 2025
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom max-w-4xl prose prose-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8 text-graphite/80"
          >
            <div>
              <h2>Agreement to Terms</h2>
              <p>
                By accessing or using Luke Robert Hair's website and services, you agree to be 
                bound by these Terms of Service.
              </p>
            </div>

            <div>
              <h2>Booking and Appointments</h2>
              <ul>
                <li>All bookings are subject to availability and confirmation</li>
                <li>We require 24 hours notice for cancellations</li>
                <li>Late cancellations may incur a fee</li>
                <li>We reserve the right to refuse service</li>
              </ul>
            </div>

            <div>
              <h2>Education Courses</h2>
              <ul>
                <li>Course fees must be paid in full before attendance</li>
                <li>Cancellations must be made 14 days before the course start date</li>
                <li>Course materials are for personal use only</li>
                <li>We reserve the right to cancel courses due to insufficient enrollment</li>
              </ul>
            </div>

            <div>
              <h2>Intellectual Property</h2>
              <p>
                All content on this website, including text, images, and AI-generated content, 
                is the property of Luke Robert Hair and protected by copyright law.
              </p>
            </div>

            <div>
              <h2>Limitation of Liability</h2>
              <p>
                Luke Robert Hair shall not be liable for any indirect, incidental, or 
                consequential damages arising from the use of our services.
              </p>
            </div>

            <div>
              <h2>Changes to Terms</h2>
              <p>
                We reserve the right to modify these terms at any time. Continued use of our 
                services constitutes acceptance of any changes.
              </p>
            </div>

            <div>
              <h2>Contact</h2>
              <p>
                For questions about these Terms, contact us at{' '}
                <a href="mailto:luke@lukeroberthair.com" className="text-sage hover:underline">
                  luke@lukeroberthair.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
