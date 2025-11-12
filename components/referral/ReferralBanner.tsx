'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

export default function ReferralBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative overflow-hidden bg-gradient-to-br from-red-600 via-orange-500 to-red-700 rounded-3xl shadow-2xl"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-300/10 rounded-full blur-3xl" />
        <Sparkles className="absolute top-8 right-8 text-white/20" size={48} />
        <Sparkles className="absolute bottom-8 left-8 text-white/20" size={32} />
      </div>

      <div className="relative px-8 py-12 md:px-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left side - Content */}
            <div className="space-y-6 text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                <Gift size={16} />
                Referral Program
              </div>

              <h2 className="text-4xl md:text-5xl font-playfair font-light">
                Love Your Haircut?
                <br />
                <span className="text-red-100">Share the Experience!</span>
              </h2>

              <p className="text-lg text-red-100">
                Give your friends £10 off their first appointment and get £10 off yours when they book. 
                It's my way of saying thank you for spreading the word.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/referrals"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-red-600 rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Your Referral Code
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right side - Visual/Stats */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'For Your Friend', value: '£10 OFF', subtitle: 'Their first booking' },
                  { label: 'For You', value: '£10 OFF', subtitle: 'Your next booking' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30"
                  >
                    <p className="text-sm text-red-100 mb-2">{item.label}</p>
                    <p className="text-3xl font-bold text-white mb-1">{item.value}</p>
                    <p className="text-xs text-red-100">{item.subtitle}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 border border-white/30 text-center"
              >
                <p className="text-red-100 text-sm mb-2">Share with up to</p>
                <p className="text-5xl font-bold text-white">10</p>
                <p className="text-red-100 text-sm mt-2">friends</p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

