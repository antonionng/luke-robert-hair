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
  // Preserve lead during exit animation
  const [displayLead, setDisplayLead] = useState(lead);
  // Separate state for notes to allow independent editing
  const [notes, setNotes] = useState(lead?.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesChanged, setNotesChanged] = useState(false);

  const fetchActivities = async (leadId: string) => {
    setIsLoadingActivities(true);
    try {
      const res = await fetch(`/api/admin/lead-activities?leadId=${leadId}`);
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

  useEffect(() => {
    if (isOpen && lead) {
      setDisplayLead(lead);
      setEditedLead(lead);
      setNotes(lead.notes || '');
      setNotesChanged(false);
      fetchActivities(lead.id);
    }
  }, [isOpen, lead]);

  const handleSave = async () => {
    if (!displayLead) return;
    setIsSaving(true);
    try {
      await onUpdate(displayLead.id, editedLead);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('Failed to update lead');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!displayLead) return;
    setIsSavingNotes(true);
    try {
      await onUpdate(displayLead.id, { notes });
      setNotesChanged(false);
      // Update the displayLead to reflect the saved notes
      setDisplayLead({ ...displayLead, notes });
    } catch (error) {
      console.error('Failed to save notes:', error);
      alert('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };

  const isCPD = displayLead?.leadType === 'cpd' || displayLead?.institution;
  const isContact = displayLead?.leadType === 'contact' || displayLead?.source === 'contact_form_general';
  const scoreColor = displayLead?.score >= 70 ? 'text-green-600' : displayLead?.score >= 40 ? 'text-yellow-600' : 'text-red-600';
  
  // Extract MOST RECENT user message from activities (NOT from notes)
  // Activities are ordered oldest to newest, so we reverse to get the latest first
  const formSubmissions = activities.filter(a => a.activity_type === 'form_submitted' && a.activity_data?.message);
  const latestMessage = formSubmissions[formSubmissions.length - 1]?.activity_data?.message;
  const userMessage = latestMessage ||
                      (displayLead?.custom_fields as any)?.message ||
                      (displayLead?.custom_fields as any)?.lastMessage;
  
  // Count of messages for display
  const messageCount = formSubmissions.length;

  // Don't render if no lead to display and modal is closed
  if (!displayLead && !isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && displayLead && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
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
                        displayLead.name
                      )}
                    </h2>
                    {isCPD && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        CPD Partnership
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {displayLead.lifecycle_stage?.charAt(0).toUpperCase() + displayLead.lifecycle_stage?.slice(1)} • Created {new Date(displayLead.enquiryDate || displayLead.createdAt).toLocaleDateString('en-GB')}
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
                {/* User Message Section - Prominent display for contact enquiries */}
                {isContact && userMessage && (
                  <div className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6 shadow-sm">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                        <MessageSquare size={20} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-graphite">
                            {messageCount > 1 ? 'Latest Message' : 'User Message'}
                          </h3>
                          {messageCount > 1 && (
                            <span className="px-2.5 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              {messageCount} messages
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-graphite/60">
                          {messageCount > 1 ? 'Most recent: ' : 'Submitted on '}
                          {formSubmissions[formSubmissions.length - 1] && new Date(formSubmissions[formSubmissions.length - 1].created_at).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-blue-100 max-h-[300px] overflow-y-auto">
                      <p className="text-graphite whitespace-pre-wrap leading-relaxed text-[15px]">{userMessage}</p>
                    </div>
                    {messageCount > 1 && (
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <p className="text-xs text-graphite/60 flex items-center gap-1">
                          <Clock size={12} />
                          View all {messageCount} messages in Activity Timeline below
                        </p>
                      </div>
                    )}
                  </div>
                )}

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
                            <a href={`mailto:${displayLead.email}`} className="text-sage hover:underline flex items-center gap-1">
                              {displayLead.email}
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
                            <a href={`tel:${displayLead.phone}`} className="text-sage hover:underline flex items-center gap-1">
                              {displayLead.phone}
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
                              <p className="text-graphite font-medium">{displayLead.institution || 'N/A'}</p>
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
                              <p className="text-graphite font-medium">{displayLead.jobTitle || 'N/A'}</p>
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
                                {displayLead.studentNumbers || 'N/A'}
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
                              <p className="text-graphite font-medium">{displayLead.deliveryPreference || 'N/A'}</p>
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
                            <p className="text-graphite font-medium">{displayLead.course}</p>
                          )}
                        </div>
                        {!isCPD && displayLead.experienceLevel && (
                          <div>
                            <label className="text-sm text-graphite/70 mb-1 block">Experience Level</label>
                            <p className="text-graphite font-medium">{displayLead.experienceLevel}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Admin Notes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <label className="text-sm text-graphite font-semibold">Admin Notes (Internal)</label>
                          <p className="text-xs text-graphite/60 mt-0.5">Private notes for your reference only</p>
                        </div>
                        {notesChanged && (
                          <button
                            onClick={handleSaveNotes}
                            disabled={isSavingNotes}
                            className="px-4 py-1.5 bg-sage text-white rounded-lg text-sm font-medium hover:bg-sage/90 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                          >
                            {isSavingNotes ? (
                              <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save size={14} />
                                Save Notes
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <textarea
                        value={notes}
                        onChange={(e) => {
                          setNotes(e.target.value);
                          setNotesChanged(true);
                        }}
                        placeholder="Add your private notes about this lead... (Not visible to the client)"
                        className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 min-h-[120px] bg-white text-graphite"
                      />
                    </div>

                    {/* Activity Timeline */}
                    <div>
                      <h3 className="font-semibold text-graphite mb-3 flex items-center gap-2">
                        <Clock size={18} className="text-sage" />
                        Activity Timeline
                        {activities.length > 0 && (
                          <span className="text-xs text-graphite/50 font-normal">
                            ({activities.length} {activities.length === 1 ? 'activity' : 'activities'})
                          </span>
                        )}
                      </h3>
                      {isLoadingActivities ? (
                        <div className="text-center py-4 text-graphite/50">Loading activities...</div>
                      ) : activities.length === 0 ? (
                        <div className="text-center py-4 text-graphite/50">No activities yet</div>
                      ) : (
                        <div className="space-y-3">
                          {/* Show all activities in reverse order (newest first) */}
                          {[...activities].reverse().map((activity, index) => {
                            const hasMessage = activity.activity_data?.message;
                            const isLatest = index === 0;
                            return (
                              <div key={activity.id} className={`p-3 rounded-lg ${hasMessage ? 'bg-blue-50 border-2 border-blue-200' : 'bg-sage/5 border border-sage/20'}`}>
                                <div className="flex items-start gap-3">
                                  <MessageSquare size={16} className={hasMessage ? "text-blue-600 mt-0.5 flex-shrink-0" : "text-sage mt-0.5 flex-shrink-0"} />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <p className="text-sm text-graphite font-medium">
                                        {activity.activity_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                      </p>
                                      {isLatest && hasMessage && (
                                        <span className="px-2 py-0.5 bg-blue-500 text-white text-xs font-semibold rounded">
                                          Latest
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-graphite/60 mt-0.5">
                                      {new Date(activity.created_at).toLocaleString('en-GB', {
                                        weekday: 'short',
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                    {hasMessage && (
                                      <div className="mt-2 p-3 bg-white rounded-lg border border-blue-100 max-h-[200px] overflow-y-auto shadow-sm">
                                        <p className="text-sm text-graphite whitespace-pre-wrap leading-relaxed">{activity.activity_data.message}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
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
                          {displayLead.score || 0}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute h-full ${
                            displayLead.score >= 70 ? 'bg-green-500' : displayLead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${displayLead.score || 0}%` }}
                        />
                      </div>
                      <p className="text-xs text-graphite/60 mt-2">
                        {displayLead.score >= 70 ? '🔥 Hot Lead' : displayLead.score >= 40 ? '⚡ Warm Lead' : '❄️ Cold Lead'}
                      </p>
                    </div>

                    {/* Estimated Value */}
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
                      <h3 className="font-semibold text-graphite flex items-center gap-2 mb-2">
                        <TrendingUp size={18} className="text-green-600" />
                        Estimated Value
                      </h3>
                      <p className="text-3xl font-bold text-green-600">£{displayLead.value || displayLead.estimatedValue || 0}</p>
                    </div>

                    {/* Status */}
                    <div className="bg-white border-2 border-mist rounded-xl p-4">
                      <label className="font-semibold text-graphite mb-2 block">Lifecycle Stage</label>
                      {isEditing ? (
                        <select
                          value={editedLead.lifecycle_stage || displayLead.lifecycle_stage}
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
                          displayLead.lifecycle_stage === 'converted' ? 'bg-green-100 text-green-700' :
                          displayLead.lifecycle_stage === 'qualified' ? 'bg-purple-100 text-purple-700' :
                          displayLead.lifecycle_stage === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {displayLead.lifecycle_stage?.charAt(0).toUpperCase() + displayLead.lifecycle_stage?.slice(1)}
                        </span>
                      )}
                    </div>

                    {/* Source */}
                    <div className="bg-white border-2 border-mist rounded-xl p-4">
                      <label className="font-semibold text-graphite mb-2 block">Lead Source</label>
                      <p className="text-graphite/70">{displayLead.source}</p>
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



