'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Sparkles, TrendingUp, HelpCircle } from 'lucide-react';
import ReferralHero from '@/components/referral/ReferralHero';
import ReferralCodeDisplay from '@/components/referral/ReferralCodeDisplay';
import ReferralStats from '@/components/referral/ReferralStats';
import StructuredData from '@/components/StructuredData';
import type { GenerateReferralResponse, ReferralStatsResponse } from '@/lib/types';
import { generateBreadcrumbs } from '@/lib/seo';

export default function ReferralsPage() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareText, setShareText] = useState<string>('');
  const [stats, setStats] = useState<ReferralStatsResponse | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const loadReferralStats = async (code?: string, email?: string) => {
    setIsLoadingStats(true);
    try {
      const params = new URLSearchParams();
      if (code) params.append('code', code);
      if (email) params.append('email', email);

      const response = await fetch(`/api/referrals/stats?${params}`);
      if (response.ok) {
        const data: ReferralStatsResponse = await response.json();
        if (data.success && data.stats) {
          setStats(data);
          setReferralCode(data.stats.code);
          
          // Build share URLs
          const baseUrl = window.location.origin;
          const url = `${baseUrl}/book?ref=${data.stats.code}`;
          const text = `Try Luke's precision haircuts! Use my code ${data.stats.code} for £10 off your first appointment. ${url}`;
          setShareUrl(url);
          setShareText(text);
        }
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  // Check URL params for existing code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const email = urlParams.get('email');

    if (code) {
      loadReferralStats(code);
    } else if (email) {
      loadReferralStats(undefined, email);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateCode = async (email: string, name: string) => {
    const response = await fetch('/api/referrals/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate code');
    }

    const data: GenerateReferralResponse = await response.json();

    if (data.success && data.code && data.shareUrl && data.shareText) {
      setReferralCode(data.code);
      setShareUrl(data.shareUrl);
      setShareText(data.shareText);

      // Load stats for this code
      await loadReferralStats(data.code);
    }
  };

  return (
    <div className="pt-20">
      {/* Structured Data for SEO */}
      <StructuredData 
        data={[
          generateBreadcrumbs([
            { name: 'Home', url: '/' },
            { name: 'Referrals', url: '/referrals' },
          ]),
        ]} 
      />

      {/* Hero Section */}
      {!referralCode && (
        <ReferralHero onGenerate={handleGenerateCode} />
      )}

      {/* Code Display & Stats */}
      {referralCode && (
        <section className="section-padding bg-offwhite">
          <div className="container-custom max-w-4xl space-y-12">
            <ReferralCodeDisplay
              code={referralCode}
              shareUrl={shareUrl}
              shareText={shareText}
            />

            {isLoadingStats ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin" />
              </div>
            ) : stats?.stats ? (
              <ReferralStats
                stats={stats.stats}
                recentRedemptions={stats.recentRedemptions}
              />
            ) : null}
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="mb-6">How It Works</h2>
            <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
              Sharing the love is simple. Here&apos;s how my referral program works.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Share Your Code',
                description: 'Send your unique referral code to friends who deserve a great haircut.',
                color: 'from-red-500 to-red-600',
              },
              {
                icon: Sparkles,
                title: 'They Book & Save',
                description: 'Your friend uses your code and gets £10 off their first appointment.',
                color: 'from-orange-500 to-orange-600',
              },
              {
                icon: TrendingUp,
                title: 'You Both Win',
                description: 'Once they complete their booking, you get £10 off your next appointment too!',
                color: 'from-red-600 to-orange-600',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-white border-2 border-red-100 rounded-2xl p-8 hover:border-red-300 transition-all hover:shadow-xl">
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${step.color} mb-6`}>
                    <step.icon size={32} className="text-white" />
                  </div>

                  <h3 className="text-xl font-medium text-graphite mb-3">
                    {step.title}
                  </h3>
                  <p className="text-graphite/70">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-sage-pale/20">
        <div className="container-custom max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <HelpCircle className="inline-block text-red-600 mb-4" size={48} />
            <h2 className="mb-4">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: 'How many friends can I refer?',
                a: 'You can refer up to 10 friends with your unique code. Each successful referral earns you £10 off.',
              },
              {
                q: 'When do I get my £10 discount?',
                a: 'You\'ll receive your £10 credit once your friend completes their first appointment. The discount will be automatically applied to your next booking.',
              },
              {
                q: 'Can I use multiple referral discounts at once?',
                a: 'Yes! If you\'ve earned multiple £10 credits, they\'ll stack up. For example, 3 successful referrals = £30 off your next appointment.',
              },
              {
                q: 'Does my referral code expire?',
                a: 'Your code is valid for 6 months from the date it was generated. After that, you can request a new one.',
              },
              {
                q: 'Can my friend use multiple referral codes?',
                a: 'No, each new client can only use one referral code for their first booking discount.',
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-lg border border-red-100"
              >
                <h3 className="text-lg font-medium text-graphite mb-2">{faq.q}</h3>
                <p className="text-graphite/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!referralCode && (
        <section className="section-padding bg-gradient-to-br from-red-600 via-orange-500 to-red-700 text-white">
          <div className="container-custom max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-light text-white">
                Ready to Start Sharing?
              </h2>
              <p className="text-xl text-red-100">
                Get your referral code now and start earning rewards while helping friends discover precision haircuts.
              </p>
              <button
                onClick={() => {
                  document.querySelector('input[type="text"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    (document.querySelector('input[type="text"]') as HTMLInputElement)?.focus();
                  }, 500);
                }}
                className="inline-block px-8 py-4 bg-white text-red-600 rounded-full font-medium hover:shadow-xl transition-all hover:scale-105"
              >
                Get Your Code Now
              </button>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
