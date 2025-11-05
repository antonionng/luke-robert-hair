'use client';

import { useState, useEffect } from 'react';
import {
  X,
  Edit,
  Save,
  Eye,
  Calendar,
  Tag,
  ExternalLink,
  Clock,
  FileText,
  CheckCircle,
  Send,
} from 'lucide-react';

interface ContentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentId: string;
  onSave?: (updates: any) => Promise<void>;
  onPublish?: () => void;
}

export default function ContentPreviewModal({
  isOpen,
  onClose,
  contentId,
  onSave,
  onPublish,
}: ContentPreviewModalProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [content, setContent] = useState<any>(null);
  const [editedData, setEditedData] = useState<any>({});

  useEffect(() => {
    if (isOpen && contentId) {
      fetchContent();
    }
  }, [isOpen, contentId]);

  const fetchContent = async () => {
    setLoading(true);
    try {
      console.log('Fetching content with ID:', contentId);
      const response = await fetch(`/api/admin/content/queue/${contentId}`);
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data);
      
      if (data.content) {
        setContent(data.content);
        setEditedData({
          title: data.content.title || '',
          excerpt: data.content.excerpt || '',
          content: data.content.content || '',
          seoTitle: data.content.seo_title || '',
          metaDescription: data.content.meta_description || '',
          keywords: data.content.keywords || [],
          insightTags: data.content.insight_tags || [],
          ctaLabel: data.content.cta_label || '',
          ctaUrl: data.content.cta_url || '',
          ctaDescription: data.content.cta_description || '',
          editorNotes: data.content.editor_notes || '',
          scheduledFor: data.content.scheduled_for
            ? new Date(data.content.scheduled_for).toISOString().slice(0, 16)
            : '',
          featured: data.content.featured || false,
          pinnedUntil: data.content.pinned_until
            ? new Date(data.content.pinned_until).toISOString().slice(0, 16)
            : '',
        });
      } else {
        console.error('No content found in response');
      }
    } catch (error) {
      console.error('Failed to fetch content:', error);
      alert('Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave({
        ...editedData,
        previewedBy: 'Luke Roberts',
      });
      setEditMode(false);
      await fetchContent(); // Refresh
    } catch (error) {
      console.error('Failed to save content:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Publish this content now? It will be visible on your website immediately.')) {
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch(`/api/admin/content/queue/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'published',
          published_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to publish content');
      }

      alert('Content published successfully!');
      
      // Call the parent's onPublish callback if provided
      if (onPublish) {
        onPublish();
      }
      
      // Close modal and refresh
      onClose();
    } catch (error) {
      console.error('Failed to publish content:', error);
      alert('Failed to publish content. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSchedulePublish = async () => {
    const scheduledDate = editedData.scheduledFor;
    
    if (!scheduledDate) {
      alert('Please set a scheduled date first by editing the content.');
      return;
    }

    if (!confirm(`Schedule this content to publish on ${new Date(scheduledDate).toLocaleString()}?`)) {
      return;
    }

    setPublishing(true);
    try {
      const response = await fetch(`/api/admin/content/queue/${contentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'scheduled',
          scheduled_for: new Date(scheduledDate).toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to schedule content');
      }

      alert('Content scheduled successfully!');
      
      if (onPublish) {
        onPublish();
      }
      
      onClose();
    } catch (error) {
      console.error('Failed to schedule content:', error);
      alert('Failed to schedule content. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6" />
            <h2 className="text-2xl font-bold">
              {editMode ? 'Edit Content' : 'Preview Content'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Publish Actions - Only show if not already published */}
            {!editMode && content?.status !== 'published' && (
              <>
                <button
                  onClick={handlePublish}
                  disabled={publishing}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition flex items-center gap-2 font-medium disabled:opacity-50"
                  title="Publish Now"
                >
                  <CheckCircle className="w-4 h-4" />
                  {publishing ? 'Publishing...' : 'Publish Now'}
                </button>
                {editedData.scheduledFor && (
                  <button
                    onClick={handleSchedulePublish}
                    disabled={publishing}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center gap-2 font-medium disabled:opacity-50"
                    title="Schedule for Later"
                  >
                    <Send className="w-4 h-4" />
                    Schedule
                  </button>
                )}
              </>
            )}
            
            {/* Edit/Save Actions */}
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}
            {editMode && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg transition flex items-center gap-2 font-medium disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save'}
              </button>
            )}
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid lg:grid-cols-2 gap-6 p-6">
              {/* Left: Edit Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.title}
                      onChange={(e) =>
                        setEditedData({ ...editedData, title: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-lg font-semibold text-gray-900">{content?.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt
                  </label>
                  {editMode ? (
                    <textarea
                      value={editedData.excerpt}
                      onChange={(e) =>
                        setEditedData({ ...editedData, excerpt: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{content?.excerpt}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content (Markdown)
                  </label>
                  {editMode ? (
                    <textarea
                      value={editedData.content}
                      onChange={(e) =>
                        setEditedData({ ...editedData, content: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      rows={20}
                    />
                  ) : (
                    <div className="prose prose-sm max-w-none p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <pre className="whitespace-pre-wrap text-xs">{content?.content}</pre>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Title
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedData.seoTitle}
                      onChange={(e) =>
                        setEditedData({ ...editedData, seoTitle: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{content?.seo_title || '-'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  {editMode ? (
                    <textarea
                      value={editedData.metaDescription}
                      onChange={(e) =>
                        setEditedData({ ...editedData, metaDescription: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{content?.meta_description || '-'}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Scheduled For
                    </label>
                    {editMode ? (
                      <input
                        type="datetime-local"
                        value={editedData.scheduledFor}
                        onChange={(e) =>
                          setEditedData({ ...editedData, scheduledFor: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">
                        {content?.scheduled_for
                          ? new Date(content.scheduled_for).toLocaleString()
                          : '-'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Pinned Until
                    </label>
                    {editMode ? (
                      <input
                        type="datetime-local"
                        value={editedData.pinnedUntil}
                        onChange={(e) =>
                          setEditedData({ ...editedData, pinnedUntil: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-sm text-gray-700">
                        {content?.pinned_until
                          ? new Date(content.pinned_until).toLocaleString()
                          : '-'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {editMode ? (
                    <input
                      type="checkbox"
                      checked={editedData.featured}
                      onChange={(e) =>
                        setEditedData({ ...editedData, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={content?.featured}
                      disabled
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                  )}
                  <label className="text-sm text-gray-700">Featured Content</label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Editor Notes
                  </label>
                  {editMode ? (
                    <textarea
                      value={editedData.editorNotes}
                      onChange={(e) =>
                        setEditedData({ ...editedData, editorNotes: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-gray-700">{content?.editor_notes || '-'}</p>
                  )}
                </div>
              </div>

              {/* Right: Preview */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Live Preview</h3>
                  </div>

                  {content?.image_url && (
                    <img
                      src={content.image_url}
                      alt={content.hero_alt || content.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: content?.preview_html || '<p>No preview available</p>',
                    }}
                  />

                  {content?.cta_label && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-2">
                        {content.cta_label}
                      </p>
                      {content.cta_description && (
                        <p className="text-xs text-blue-700 mb-3">{content.cta_description}</p>
                      )}
                      {content.cta_url && (
                        <a
                          href={content.cta_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Learn More <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Metadata
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-600">{content?.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <span className="ml-2 text-gray-600">{content?.status}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Word Count:</span>
                      <span className="ml-2 text-gray-600">{content?.word_count}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Reading Time:</span>
                      <span className="ml-2 text-gray-600">
                        {content?.reading_time_minutes} min
                      </span>
                    </div>
                    {content?.keywords && content.keywords.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700 block mb-2">Keywords:</span>
                        <div className="flex flex-wrap gap-2">
                          {content.keywords.map((kw: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {content?.insight_tags && content.insight_tags.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700 block mb-2">Tags:</span>
                        <div className="flex flex-wrap gap-2">
                          {content.insight_tags.map((tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



