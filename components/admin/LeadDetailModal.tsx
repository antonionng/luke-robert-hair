'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Mail, Phone, MapPin, Calendar, TrendingUp, Edit2, Save,
  Building, Users, GraduationCap, MessageSquare, Clock, Target,
  ExternalLink, Award, Briefcase
} from 'lucide-react';

interface LeadActivity {
  id: string;
  activity_type: string;
  created_at: string;
  activity_data?: any;
}

interface LeadDetailModalProps {
  lead: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (leadId: string, updates: any) => Promise<void>;
}

export default function LeadDetailModal({ lead, isOpen, onClose, onUpdate }: LeadDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedLead, setEditedLead] = useState(lead);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);

  useEffect(() => {
    if (isOpen && lead) {
      setEditedLead(lead);
      fetchActivities();
    }
  }, [isOpen, lead]);

  const fetchActivities = async () => {
    if (!lead?.id) return;
    setIsLoadingActivities(true);
    try {
      const res = await fetch(`/api/admin/lead-activities?leadId=${lead.id}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(lead.id, editedLead);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Failed to update lead');
    } finally {
      setIsSaving(false);
    }
  };

  if (!lead) return null;

  const isCPD = lead.leadType === 'cpd' || lead.institution;
  const scoreColor = lead.score >= 70 ? 'text-green-600' : lead.score >= 40 ? 'text-yellow-600' : 'text-red-600';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-sage to-sage/80 text-white p-6 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-playfair font-light">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedLead.name}
                          onChange={(e) => setEditedLead({ ...editedLead, name: e.target.value })}
                          className="bg-white/20 px-3 py-1 rounded-lg border border-white/30 focus:outline-none focus:border-white"
                        />
                      ) : (
                        lead.name
                      )}
                    </h2>
                    {isCPD && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        CPD Partnership
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {lead.lifecycle_stage?.charAt(0).toUpperCase() + lead.lifecycle_stage?.slice(1)} • Created {new Date(lead.enquiryDate || lead.createdAt).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white text-sage rounded-lg font-medium flex items-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      <Save size={18} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left Column - Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Contact Info */}
                    <div className="bg-sage/5 rounded-xl p-4">
                      <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                        <Mail size={18} className="text-sage" />
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-graphite/70 mb-1 block">Email</label>
                          {isEditing ? (
                            <input
                              type="email"
                              value={editedLead.email}
                              onChange={(e) => setEditedLead({ ...editedLead, email: e.target.value })}
                              className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                            />
                          ) : (
                            <a href={`mailto:${lead.email}`} className="text-sage hover:underline flex items-center gap-1">
                              {lead.email}
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                        <div>
                          <label className="text-sm text-graphite/70 mb-1 block">Phone</label>
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editedLead.phone}
                              onChange={(e) => setEditedLead({ ...editedLead, phone: e.target.value })}
                              className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                            />
                          ) : (
                            <a href={`tel:${lead.phone}`} className="text-sage hover:underline flex items-center gap-1">
                              {lead.phone}
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* CPD-Specific Info */}
                    {isCPD && (
                      <div className="bg-indigo-50 rounded-xl p-4">
                        <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                          <Building size={18} className="text-indigo-600" />
                          Institution Details
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Institution</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedLead.institution || ''}
                                onChange={(e) => setEditedLead({ ...editedLead, institution: e.target.value })}
                                className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                            ) : (
                              <p className="text-graphite font-medium">{lead.institution || 'N/A'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Job Title</label>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editedLead.jobTitle || ''}
                                onChange={(e) => setEditedLead({ ...editedLead, jobTitle: e.target.value })}
                                className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                            ) : (
                              <p className="text-graphite font-medium">{lead.jobTitle || 'N/A'}</p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Student Numbers</label>
                            {isEditing ? (
                              <input
                                type="number"
                                value={editedLead.studentNumbers || ''}
                                onChange={(e) => setEditedLead({ ...editedLead, studentNumbers: parseInt(e.target.value) })}
                                className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              />
                            ) : (
                              <p className="text-graphite font-medium flex items-center gap-1">
                                <Users size={16} />
                                {lead.studentNumbers || 'N/A'}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Delivery Preference</label>
                            {isEditing ? (
                              <select
                                value={editedLead.deliveryPreference || 'on-site'}
                                onChange={(e) => setEditedLead({ ...editedLead, deliveryPreference: e.target.value })}
                                className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200"
                              >
                                <option value="on-site">On-site</option>
                                <option value="online">Online</option>
                                <option value="hybrid">Hybrid</option>
                              </select>
                            ) : (
                              <p className="text-graphite font-medium">{lead.deliveryPreference || 'N/A'}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Course/Interest Info */}
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                        <GraduationCap size={18} className="text-purple-600" />
                        {isCPD ? 'Programme Interest' : 'Course Interest'}
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-graphite/70 mb-1 block">Course</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={editedLead.course}
                              onChange={(e) => setEditedLead({ ...editedLead, course: e.target.value })}
                              className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
                            />
                          ) : (
                            <p className="text-graphite font-medium">{lead.course}</p>
                          )}
                        </div>
                        {!isCPD && lead.experienceLevel && (
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Experience Level</label>
                            <p className="text-graphite font-medium">{lead.experienceLevel}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-sm text-graphite/70 mb-2 block font-medium">Notes</label>
                      <textarea
                        value={isEditing ? editedLead.notes || '' : lead.notes || ''}
                        onChange={(e) => isEditing && setEditedLead({ ...editedLead, notes: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Add notes about this lead..."
                        className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 min-h-[100px] disabled:bg-gray-50"
                      />
                    </div>

                    {/* Activity Timeline */}
                    <div>
                      <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-sage" />
                        Activity Timeline
                      </h3>
                      {isLoadingActivities ? (
                        <div className="text-center py-4 text-graphite/50">Loading activities...</div>
                      ) : activities.length === 0 ? (
                        <div className="text-center py-4 text-graphite/50">No activities yet</div>
                      ) : (
                        <div className="space-y-3">
                          {activities.slice(0, 5).map((activity) => (
                            <div key={activity.id} className="flex items-start gap-3 p-3 bg-sage/5 rounded-lg">
                              <MessageSquare size={16} className="text-sage mt-0.5" />
                              <div className="flex-1">
                                <p className="text-sm text-graphite font-medium">
                                  {activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                </p>
                                <p className="text-xs text-graphite/60 mt-0.5">
                                  {new Date(activity.created_at).toLocaleString('en-GB')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column - Stats & Actions */}
                  <div className="space-y-6">
                    {/* Lead Score */}
                    <div className="bg-white border-2 border-sage/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-graphite flex items-center gap-2">
                          <Target size={18} className="text-sage" />
                          Lead Score
                        </h3>
                        <span className={`text-2xl font-bold ${scoreColor}`}>
                          {lead.score || 0}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full ${
                            lead.score >= 70 ? 'bg-green-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${lead.score || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-graphite/60 mt-2">
                        {lead.score >= 70 ? '🔥 Hot Lead' : lead.score >= 40 ? '⚡ Warm Lead' : '❄️ Cold Lead'}
                      </p>
                    </div>

                    {/* Estimated Value */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-graphite flex items-center gap-2 mb-2">
                        <TrendingUp size={18} className="text-green-600" />
                        Estimated Value
                      </h3>
                      <p className="text-3xl font-bold text-green-600">£{lead.value || lead.estimatedValue || 0}</p>
                    </div>

                    {/* Status */}
                    <div className="bg-white border-2 border-mist rounded-xl p-4">
                      <label className="font-semibold text-graphite mb-2 block">Lifecycle Stage</label>
                      {isEditing ? (
                        <select
                          value={editedLead.lifecycle_stage || lead.lifecycle_stage}
                          onChange={(e) => setEditedLead({ ...editedLead, lifecycle_stage: e.target.value })}
                          className="w-full px-3 py-2 border border-mist rounded-lg focus:outline-none focus:ring-2 focus:ring-sage/20"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="qualified">Qualified</option>
                          <option value="converted">Converted</option>
                          <option value="lost">Lost</option>
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          lead.lifecycle_stage === 'converted' ? 'bg-green-100 text-green-700' :
                          lead.lifecycle_stage === 'qualified' ? 'bg-purple-100 text-purple-700' :
                          lead.lifecycle_stage === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {lead.lifecycle_stage?.charAt(0).toUpperCase() + lead.lifecycle_stage?.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Source */}
                    <div className="bg-white border-2 border-mist rounded-xl p-4">
                      <label className="font-semibold text-graphite mb-2 block">Lead Source</label>
                      <p className="text-graphite/70">{lead.source}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-2">
                      <button className="w-full btn-primary flex items-center justify-center gap-2">
                        <Mail size={18} />
                        Send Email
                      </button>
                      <button className="w-full btn-secondary flex items-center justify-center gap-2">
                        <Phone size={18} />
                        Call Lead
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



