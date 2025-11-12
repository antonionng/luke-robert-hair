'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, TrendingUp, Users, DollarSign, Check, X, Clock } from 'lucide-react';
import type { ReferralLeaderboard } from '@/lib/types';

interface ReferralsTableProps {
  leaderboard: ReferralLeaderboard[];
  aggregateStats: {
    totalCodes: number;
    activeCodes: number;
    totalRedemptions: number;
    totalCompletedBookings: number;
    totalDiscountsGiven: number;
    overallConversionRate: number;
  };
}

export default function ReferralsTable({ leaderboard, aggregateStats }: ReferralsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredData = leaderboard.filter(item => {
    if (statusFilter === 'all') return true;
    return item.status === statusFilter;
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="admin-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <Gift size={24} className="text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100 mb-1">{aggregateStats.totalCodes}</p>
          <p className="text-sm text-zinc-400">Total Codes</p>
          <p className="text-xs text-green-400 mt-2">{aggregateStats.activeCodes} active</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="admin-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <Users size={24} className="text-orange-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100 mb-1">{aggregateStats.totalRedemptions}</p>
          <p className="text-sm text-zinc-400">Total Redemptions</p>
          <p className="text-xs text-green-400 mt-2">{aggregateStats.totalCompletedBookings} completed</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="admin-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign size={24} className="text-green-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100 mb-1">£{aggregateStats.totalDiscountsGiven.toFixed(2)}</p>
          <p className="text-sm text-zinc-400">Total Discounts</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="admin-card p-6"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-500/20 rounded-lg">
              <TrendingUp size={24} className="text-red-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-zinc-100 mb-1">{aggregateStats.overallConversionRate}%</p>
          <p className="text-sm text-zinc-400">Conversion Rate</p>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'active', 'expired', 'disabled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              statusFilter === status
                ? 'bg-red-500 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-700">
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Completed
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Conversion
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Discounts
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-zinc-500">
                    No referral codes found
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-red-400 font-medium">{item.code}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-zinc-100 font-medium">{item.referrer_name}</p>
                        <p className="text-sm text-zinc-500">{item.referrer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : item.status === 'expired'
                            ? 'bg-orange-500/20 text-orange-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {item.status === 'active' ? (
                          <Check size={14} />
                        ) : item.status === 'expired' ? (
                          <Clock size={14} />
                        ) : (
                          <X size={14} />
                        )}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-zinc-100 font-medium">
                        {item.total_uses} / {item.max_uses}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-green-400 font-medium">{item.completed_bookings}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-medium ${
                        item.conversion_rate >= 50 ? 'text-green-400' :
                        item.conversion_rate >= 25 ? 'text-yellow-400' :
                        'text-zinc-400'
                      }`}>
                        {item.conversion_rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-zinc-100 font-medium">
                        £{(item.total_discounts_given || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-zinc-500">
                      {formatDate(item.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

