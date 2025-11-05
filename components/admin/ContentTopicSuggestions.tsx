'use client';

import { useState } from 'react';
import { Sparkles, RefreshCw, Plus, Calendar, TrendingUp } from 'lucide-react';

interface TopicSuggestion {
  title: string;
  rationale: string;
  category: string;
  targetAudience: string;
  potentialKeywords: string[];
  seasonalRelevance?: string;
}

interface ContentTopicSuggestionsProps {
  onCreateRequest: (suggestion: TopicSuggestion) => void;
}

export default function ContentTopicSuggestions({
  onCreateRequest,
}: ContentTopicSuggestionsProps) {
  const [loading, setLoading] = useState(false);
  const [creatingId, setCreatingId] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<TopicSuggestion[]>([]);
  const [options, setOptions] = useState({
    categories: ['Education & Training', 'Trends & Insights', 'Business Growth'],
    baseIdeas: '',
    seasonalFocus: false,
    count: 5,
  });

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/content/suggest-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: options.categories,
          baseIdeas: options.baseIdeas.split(',').filter((s) => s.trim().length > 0),
          seasonalFocus: options.seasonalFocus,
          count: options.count,
        }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Failed to generate suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryToggle = (category: string) => {
    setOptions((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI Topic Suggestions</h3>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={loading || options.categories.length === 0}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Generate Ideas
            </>
          )}
        </button>
      </div>

      {/* Options */}
      <div className="space-y-4 mb-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Content Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'Education & Training',
              'Trends & Insights',
              'Business Growth',
              'Technical Skills',
              'Industry News',
              'Client Experience',
            ].map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryToggle(category)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  options.categories.includes(category)
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 border border-zinc-600 hover:bg-zinc-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Base Ideas (Optional)
          </label>
          <input
            type="text"
            value={options.baseIdeas}
            onChange={(e) => setOptions({ ...options, baseIdeas: e.target.value })}
            className="admin-input w-full"
            placeholder="e.g., balayage, color theory, salon management (comma-separated)"
          />
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="seasonalFocus"
              checked={options.seasonalFocus}
              onChange={(e) => setOptions({ ...options, seasonalFocus: e.target.checked })}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="seasonalFocus" className="text-sm text-zinc-300 flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Include seasonal trends
            </label>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-zinc-300">Count:</label>
            <select
              value={options.count}
              onChange={(e) => setOptions({ ...options, count: parseInt(e.target.value) })}
              className="admin-input px-3 py-1 text-sm"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          {suggestions.map((suggestion, idx) => (
            <div
              key={idx}
              className="p-5 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl hover:shadow-lg hover:border-blue-500/40 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-white">{suggestion.title}</h4>
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded">
                      {suggestion.category}
                    </span>
                    {suggestion.seasonalRelevance && (
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {suggestion.seasonalRelevance}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-300 mb-3">{suggestion.rationale}</p>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span>
                      <span className="font-medium">Audience:</span> {suggestion.targetAudience}
                    </span>
                  </div>
                  {suggestion.potentialKeywords && suggestion.potentialKeywords.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {suggestion.potentialKeywords.slice(0, 5).map((kw, kwIdx) => (
                        <span
                          key={kwIdx}
                          className="px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded text-xs"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={async () => {
                    setCreatingId(idx);
                    try {
                      await onCreateRequest(suggestion);
                    } finally {
                      setCreatingId(null);
                    }
                  }}
                  disabled={creatingId === idx}
                  className="flex-shrink-0 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  title={creatingId === idx ? "Generating content..." : "Create Content Request"}
                >
                  {creatingId === idx ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <div className="text-center py-12 text-zinc-500">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
          <p>Click "Generate Ideas" to get AI-powered topic suggestions</p>
        </div>
      )}
    </div>
  );
}

