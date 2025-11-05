'use client';

import { useState } from 'react';
import { X, Sparkles, Calendar, Target, Tag, Link2, FileText } from 'lucide-react';

interface ContentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: any) => Promise<void>;
}

export default function ContentCreationModal({
  isOpen,
  onClose,
  onSubmit,
}: ContentCreationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    category: 'Education & Training',
    title: '',
    summary: '',
    brief: '',
    audience: '',
    tone: 'Professional & Informative',
    objectives: [] as string[],
    targetKeywords: [] as string[],
    inspirationLinks: [] as string[],
    notes: '',
    preferredPublishDate: '',
    autoPublish: false,
    priority: 3,
  });

  const [objectiveInput, setObjectiveInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [linkInput, setLinkInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({
        ...formData,
        requestedBy: 'Luke Roberts',
      });
      onClose();
      // Reset form
      setFormData({
        topic: '',
        category: 'Education & Training',
        title: '',
        summary: '',
        brief: '',
        audience: '',
        tone: 'Professional & Informative',
        objectives: [],
        targetKeywords: [],
        inspirationLinks: [],
        notes: '',
        preferredPublishDate: '',
        autoPublish: false,
        priority: 3,
      });
    } catch (error) {
      console.error('Failed to create content request:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToArray = (
    array: string[],
    value: string,
    setValue: (val: string) => void,
    key: 'objectives' | 'targetKeywords' | 'inspirationLinks'
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [key]: [...prev[key], value.trim()],
      }));
      setValue('');
    }
  };

  const removeFromArray = (
    index: number,
    key: 'objectives' | 'targetKeywords' | 'inspirationLinks'
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Create Content Request</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Topic & Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Advanced Balayage Techniques"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option>Education & Training</option>
                <option>Trends & Insights</option>
                <option>Business Growth</option>
                <option>Technical Skills</option>
                <option>Industry News</option>
                <option>Client Experience</option>
              </select>
            </div>
          </div>

          {/* Title (optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title (Optional)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="AI will generate if left blank"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1" />
              Summary
            </label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Brief overview of what this content should cover"
            />
          </div>

          {/* Brief */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Brief
            </label>
            <textarea
              value={formData.brief}
              onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
              placeholder="Full creative brief with details, structure preferences, key points to include..."
            />
          </div>

          {/* Audience & Tone */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Salon owners, Junior stylists"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tone
              </label>
              <select
                value={formData.tone}
                onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Professional & Informative</option>
                <option>Inspirational & Motivational</option>
                <option>Conversational & Friendly</option>
                <option>Technical & Educational</option>
                <option>Authoritative & Expert</option>
              </select>
            </div>
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-1" />
              Content Objectives
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={objectiveInput}
                onChange={(e) => setObjectiveInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray(formData.objectives, objectiveInput, setObjectiveInput, 'objectives');
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add objective and press Enter"
              />
              <button
                type="button"
                onClick={() => addToArray(formData.objectives, objectiveInput, setObjectiveInput, 'objectives')}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.objectives.map((obj, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  {obj}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, 'objectives')}
                    className="hover:text-blue-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Target Keywords */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1" />
              Target Keywords (SEO)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray(formData.targetKeywords, keywordInput, setKeywordInput, 'targetKeywords');
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add keyword and press Enter"
              />
              <button
                type="button"
                onClick={() => addToArray(formData.targetKeywords, keywordInput, setKeywordInput, 'targetKeywords')}
                className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.targetKeywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, 'targetKeywords')}
                    className="hover:text-purple-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Inspiration Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Link2 className="w-4 h-4 inline mr-1" />
              Inspiration Links
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addToArray(formData.inspirationLinks, linkInput, setLinkInput, 'inspirationLinks');
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add URL and press Enter"
              />
              <button
                type="button"
                onClick={() => addToArray(formData.inspirationLinks, linkInput, setLinkInput, 'inspirationLinks')}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
              >
                Add
              </button>
            </div>
            <div className="space-y-1">
              {formData.inspirationLinks.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm"
                >
                  <Link2 className="w-3 h-3 flex-shrink-0" />
                  <span className="flex-1 truncate">{link}</span>
                  <button
                    type="button"
                    onClick={() => removeFromArray(idx, 'inspirationLinks')}
                    className="hover:text-green-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={2}
              placeholder="Any other details or requirements..."
            />
          </div>

          {/* Scheduling */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Preferred Publish Date
              </label>
              <input
                type="datetime-local"
                value={formData.preferredPublishDate}
                onChange={(e) => setFormData({ ...formData, preferredPublishDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={1}>1 - Urgent</option>
                <option value={2}>2 - High</option>
                <option value={3}>3 - Normal</option>
                <option value={4}>4 - Low</option>
                <option value={5}>5 - Whenever</option>
              </select>
            </div>
          </div>

          {/* Auto-publish */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoPublish"
              checked={formData.autoPublish}
              onChange={(e) => setFormData({ ...formData, autoPublish: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="autoPublish" className="text-sm text-gray-700">
              Auto-publish when ready (skip manual review)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create Request
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}




