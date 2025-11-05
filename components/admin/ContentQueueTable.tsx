'use client';

import { useState } from 'react';
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  slug?: string;
  excerpt?: string;
  category: string;
  status: string;
  source: string;
  created_at: string;
  scheduled_for?: string;
  published_at?: string;
  views: number;
  clicks: number;
  leads_generated: number;
  ai_generated: boolean;
  featured: boolean;
  word_count: number;
  reading_time_minutes?: number;
}

interface ContentQueueTableProps {
  content: ContentItem[];
  onPreview: (item: ContentItem) => void;
  onEdit: (item: ContentItem) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function ContentQueueTable({
  content,
  onPreview,
  onEdit,
  onDelete,
  onStatusChange,
}: ContentQueueTableProps) {
  const [filter, setFilter] = useState<string>('all');

  const filteredContent = content.filter((item) => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: 'bg-gray-100 text-gray-700',
      queued: 'bg-yellow-100 text-yellow-700',
      generating: 'bg-blue-100 text-blue-700 animate-pulse',
      review: 'bg-purple-100 text-purple-700',
      scheduled: 'bg-indigo-100 text-indigo-700',
      published: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
      archived: 'bg-gray-100 text-gray-500',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getSourceIcon = (source: string, aiGenerated: boolean) => {
    if (aiGenerated) {
      return <Sparkles className="w-4 h-4 text-purple-500" title="AI Generated" />;
    }
    return null;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="admin-card">
      {/* Header */}
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Content Queue</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'all'
                  ? 'admin-btn-primary'
                  : 'admin-btn-secondary'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('review')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'review'
                  ? 'admin-btn-primary'
                  : 'admin-btn-secondary'
              }`}
            >
              Review
            </button>
            <button
              onClick={() => setFilter('scheduled')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'scheduled'
                  ? 'admin-btn-primary'
                  : 'admin-btn-secondary'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setFilter('published')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === 'published'
                  ? 'admin-btn-primary'
                  : 'admin-btn-secondary'
              }`}
            >
              Published
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-800/50 border-b border-zinc-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Content
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Schedule
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Performance
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-zinc-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {filteredContent.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  No content found
                </td>
              </tr>
            ) : (
              filteredContent.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-800/30 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      {getSourceIcon(item.source, item.ai_generated)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white truncate">
                            {item.title}
                          </p>
                          {item.featured && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">
                              Featured
                            </span>
                          )}
                        </div>
                        {item.excerpt && (
                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                            {item.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-1 text-xs text-zinc-500">
                          <span>{item.word_count} words</span>
                          {item.reading_time_minutes && (
                            <span>{item.reading_time_minutes} min read</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-zinc-300">{item.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      {item.published_at ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span>{formatDate(item.published_at)}</span>
                        </div>
                      ) : item.scheduled_for ? (
                        <div className="flex items-center gap-1 text-indigo-600">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(item.scheduled_for)}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-zinc-500">
                          <Clock className="w-4 h-4" />
                          <span>Not scheduled</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status === 'published' ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <Eye className="w-3 h-3 text-blue-400" />
                          <span className="text-zinc-300">{item.views}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <TrendingUp className="w-3 h-3 text-green-400" />
                          <span className="text-zinc-300">{item.clicks} clicks</span>
                        </div>
                        {item.leads_generated > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-purple-400 font-medium">
                              {item.leads_generated} leads
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onPreview(item)}
                        className="p-2 text-blue-400 hover:bg-zinc-700 rounded-lg transition"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 text-zinc-400 hover:bg-zinc-700 rounded-lg transition"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {item.status === 'review' && (
                        <>
                          <button
                            onClick={() => onStatusChange(item.id, 'published')}
                            className="p-2 text-green-400 hover:bg-zinc-700 rounded-lg transition"
                            title="Publish"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onStatusChange(item.id, 'rejected')}
                            className="p-2 text-red-400 hover:bg-zinc-700 rounded-lg transition"
                            title="Reject"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {item.slug && item.status === 'published' && (
                        <a
                          href={`/insights/${item.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-indigo-400 hover:bg-zinc-700 rounded-lg transition"
                          title="View Live"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 text-red-400 hover:bg-zinc-700 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

