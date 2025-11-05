'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log('📤 [CONTACT FORM] Submitting:', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      type: formData.type,
      messageLength: formData.message.length
    });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ [CONTACT FORM] Success:', {
          leadId: data.leadId,
          type: formData.type
        });
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', type: 'general', message: '' });
      } else {
        const errorData = await response.json();
        console.error('❌ [CONTACT FORM] Failed:', errorData);
      }
    } catch (error) {
      console.error('❌ [CONTACT FORM] Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h1 className="text-4xl lg:text-5xl">Let's Talk</h1>
            <p className="text-xl text-graphite/70">
              Whether you want to book an appointment, learn about courses, or just have a question - I am here to help.
            </p>
            <p className="text-sage font-medium">
              I typically respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="mb-4">Quick Contact</h2>
                <p className="text-graphite/70 leading-relaxed mb-6">
                  Prefer to reach out directly? Use any of these methods.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-sage" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a
                      href="mailto:luke@lukeroberthair.com"
                      className="text-graphite/70 hover:text-sage transition-colors"
                    >
                      luke@lukeroberthair.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-sage" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <a
                      href="tel:07862054292"
                      className="text-graphite/70 hover:text-sage transition-colors"
                    >
                      07862 054292
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sage/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-sage" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Locations</h3>
                    <p className="text-graphite/70">Cheshire & Berkshire</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-mist">
                <h3 className="font-medium mb-3">Prefer to Chat?</h3>
                <p className="text-graphite/70 mb-4">
                  Get instant answers from my AI assistant. Available 24/7.
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined' && (window as any).openChatWithMessage) {
                      (window as any).openChatWithMessage('Hi! I have a question...');
                    }
                  }}
                  className="px-6 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all"
                >
                  Start Chat
                </button>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {submitted ? (
                <div className="bg-sage/10 p-8 rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 bg-sage rounded-full flex items-center justify-center mx-auto">
                    <Send className="text-white" size={24} />
                  </div>
                  <h3 className="text-2xl font-playfair font-light">Message Sent!</h3>
                  <p className="text-graphite/70">
                    Thank you for getting in touch. We'll respond to your enquiry within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block font-medium mb-2">
                      Enquiry Type *
                    </label>
                    <select
                      id="type"
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    >
                      <option value="general">General Enquiry</option>
                      <option value="client">Salon Booking</option>
                      <option value="education">Education Course</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-medium mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-sage-pale/20">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center space-y-8"
          >
            <h2>Or Take Action Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
                <h3 className="text-xl font-semibold">Book an Appointment</h3>
                <p className="text-graphite/70">
                  Ready to experience precision cutting? Book your appointment online now.
                </p>
                <a
                  href="/book"
                  className="inline-block px-8 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all"
                >
                  Book Now
                </a>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm text-center space-y-4">
                <h3 className="text-xl font-semibold">Explore Courses</h3>
                <p className="text-graphite/70">
                  Interested in professional training? View our education programs.
                </p>
                <a
                  href="/education"
                  className="inline-block px-8 py-3 bg-sage text-white rounded-full font-medium hover:bg-sage-dark transition-all"
                >
                  View Courses
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
