'use client';

import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="pt-20">
      <section className="section-padding bg-sage-pale/30">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <h1>Privacy Policy</h1>
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
              <h2>Introduction</h2>
              <p>
                Luke Robert Hair ("we," "our," or "us") is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your personal information.
              </p>
            </div>

            <div>
              <h2>Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Booking and appointment details</li>
                <li>Communication preferences</li>
                <li>Chat conversations with our AI assistant</li>
              </ul>
            </div>

            <div>
              <h2>How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Respond to your enquiries</li>
                <li>Send appointment reminders and confirmations</li>
                <li>Improve our services and AI systems</li>
                <li>Comply with legal obligations</li>
              </ul>
            </div>

            <div>
              <h2>Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your 
                personal information against unauthorized access, alteration, or destruction.
              </p>
            </div>

            <div>
              <h2>Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2>Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy, please contact us at{' '}
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
