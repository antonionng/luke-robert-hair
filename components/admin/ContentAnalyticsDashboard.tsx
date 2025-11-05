'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Share2,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface ContentAnalytics {
  id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  views: number;
  clicks: number;
  ctaClicks: number;
  shares: number;
  impressions: number;
  leadsGenerated: number;
}

export default function ContentAnalyticsDashboard() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<ContentAnalytics[]>([]);
  const [sortBy, setSortBy] = useState<'views' | 'clicks' | 'leads'>('views');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/content/analytics');
      const data = await response.json();
      if (data.analytics) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedAnalytics = [...analytics].sort((a, b) => b[sortBy] - a[sortBy]);

  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = analytics.reduce((sum, item) => sum + item.clicks, 0);
  const totalLeads = analytics.reduce((sum, item) => sum + item.leadsGenerated, 0);
  const totalCtaClicks = analytics.reduce((sum, item) => sum + item.ctaClicks, 0);

  const avgEngagement = analytics.length > 0
    ? ((totalClicks / totalViews) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          <p className="text-blue-100 text-sm">Total Views</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <MousePointer className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">{avgEngagement}%</span>
          </div>
          <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
          <p className="text-green-100 text-sm">Total Clicks</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <TrendingUp className="w-5 h-5 opacity-60" />
          </div>
          <p className="text-3xl font-bold">{totalLeads.toLocaleString()}</p>
          <p className="text-purple-100 text-sm">Leads Generated</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-8 h-8 opacity-80" />
            <span className="text-sm opacity-80">
              {analytics.length > 0 ? ((totalCtaClicks / totalClicks) * 100).toFixed(1) : '0'}%
            </span>
          </div>
          <p className="text-3xl font-bold">{totalCtaClicks.toLocaleString()}</p>
          <p className="text-orange-100 text-sm">CTA Clicks</p>
        </div>
      </div>

      {/* Content Performance Table */}
      <div className="admin-card">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Content Performance</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('views')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  sortBy === 'views'
                    ? 'admin-btn-primary'
                    : 'admin-btn-secondary'
                }`}
              >
                By Views
              </button>
              <button
                onClick={() => setSortBy('clicks')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  sortBy === 'clicks'
                    ? 'admin-btn-primary'
                    : 'admin-btn-secondary'
                }`}
              >
                By Clicks
              </button>
              <button
                onClick={() => setSortBy('leads')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  sortBy === 'leads'
                    ? 'admin-btn-primary'
                    : 'admin-btn-secondary'
                }`}
              >
                By Leads
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            </div>
          ) : sortedAnalytics.length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
              <p>No published content yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-zinc-800/50 border-b border-zinc-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Content
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Clicks
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    CTA
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
                    CVR
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {sortedAnalytics.map((item) => {
                  const clickRate = item.views > 0 ? ((item.clicks / item.views) * 100).toFixed(1) : '0';
                  const conversionRate = item.views > 0 ? ((item.leadsGenerated / item.views) * 100).toFixed(2) : '0';

                  return (
                    <tr key={item.id} className="hover:bg-zinc-800/30 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-white">{item.title}</p>
                          <a
                            href={`/insights/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300"
                          >
                            View Live →
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-zinc-300">{item.category}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-sm text-zinc-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(item.publishedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-blue-400">
                          {item.views.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-green-400">
                          {item.clicks.toLocaleString()}
                        </div>
                        <div className="text-xs text-zinc-500">{clickRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm text-orange-400">{item.ctaClicks}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-semibold text-purple-400">
                          {item.leadsGenerated}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`text-sm font-medium ${
                            parseFloat(conversionRate) > 1
                              ? 'text-green-400'
                              : parseFloat(conversionRate) > 0.5
                              ? 'text-yellow-400'
                              : 'text-zinc-500'
                          }`}
                        >
                          {conversionRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

