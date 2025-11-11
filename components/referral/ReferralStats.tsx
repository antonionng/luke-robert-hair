'use client';

import { motion } from 'framer-motion';
import { TrendingUp, Users, Check, Clock } from 'lucide-react';
import type { ReferralStatsResponse } from '@/lib/types';

interface ReferralStatsProps {
  stats: ReferralStatsResponse['stats'];
  recentRedemptions?: ReferralStatsResponse['recentRedemptions'];
}

export default function ReferralStats({ stats, recentRedemptions }: ReferralStatsProps) {
  if (!stats) return null;

  const statCards = [
    {
      label: 'Total Referrals',
      value: stats.totalRedemptions,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Completed Bookings',
      value: stats.completedBookings,
      icon: Check,
      color: 'from-pink-500 to-pink-600',
    },
    {
      label: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: Clock,
      color: 'from-purple-400 to-pink-400',
    },
    {
      label: 'Total Credits Earned',
      value: `£${stats.totalCreditsEarned.toFixed(2)}`,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-medium text-graphite mb-2">
          Your Referral Dashboard
        </h2>
        <p className="text-graphite/70">
          Track your impact and see your rewards grow
        </p>
      </div>

      {/* Code & Uses */}
      <div className="referral-card p-6 text-center">
        <p className="text-sm text-purple-700 font-semibold uppercase tracking-wide mb-2">
          Your Code
        </p>
        <p className="text-3xl font-bold text-purple-600 tracking-wider font-mono mb-4">
          {stats.code}
        </p>
        <div className="flex items-center justify-center gap-2 text-graphite/70">
          <span className="text-2xl font-bold text-purple-600">{stats.remainingUses}</span>
          <span>/ {stats.maxUses} uses remaining</span>
        </div>
        {/* Progress Bar */}
        <div className="mt-4 w-full bg-purple-100 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(stats.totalUses / stats.maxUses) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-purple-100"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-graphite mb-1">{stat.value}</p>
            <p className="text-sm text-graphite/60">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Conversion Rate */}
      <div className="referral-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-medium text-graphite">Conversion Rate</h3>
          <span className="text-3xl font-bold text-purple-600">{stats.conversionRate}%</span>
        </div>
        <div className="w-full bg-purple-100 rounded-full h-4 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.conversionRate}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600"
          />
        </div>
        <p className="text-sm text-graphite/60 mt-2">
          {stats.completedBookings} of {stats.totalRedemptions} referrals converted to bookings
        </p>
      </div>

      {/* Recent Activity */}
      {recentRedemptions && recentRedemptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
          <h3 className="text-xl font-medium text-graphite mb-4">Recent Referrals</h3>
          <div className="space-y-3">
            {recentRedemptions.map((redemption, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    redemption.bookingCompleted
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                      : 'bg-gradient-to-br from-purple-400 to-pink-400'
                  }`}>
                    {redemption.bookingCompleted ? (
                      <Check size={20} className="text-white" />
                    ) : (
                      <Clock size={20} className="text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-graphite">{redemption.refereeName}</p>
                    <p className="text-sm text-graphite/60">
                      {new Date(redemption.redeemedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  redemption.bookingCompleted
                    ? 'bg-green-100 text-green-700'
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {redemption.bookingCompleted ? 'Completed' : 'Pending'}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

