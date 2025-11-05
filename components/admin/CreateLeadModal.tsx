'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Phone, GraduationCap, Building2, Users } from 'lucide-react';

interface CreateLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateLeadModal({ isOpen, onClose, onSuccess }: CreateLeadModalProps) {
  const [leadType, setLeadType] = useState<'education' | 'cpd'>('education');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    courseInterest: '',
    experienceLevel: 'beginner',
    // CPD fields
    institution: '',
    jobTitle: '',
    studentNumbers: '',
    deliveryPreference: 'on-site',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const leadData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        course_interest: formData.courseInterest,
        source: leadType === 'cpd' ? 'cpd_partnership' : 'education',
        lead_type: leadType === 'cpd' ? 'institution' : 'individual',
        lifecycle_stage: 'new',
        notes: formData.notes,
        custom_fields: {},
      };

      if (leadType === 'cpd') {
        leadData.custom_fields = {
          leadType: 'cpd_partnership',
          institution: formData.institution,
          jobTitle: formData.jobTitle,
          studentNumbers: parseInt(formData.studentNumbers) || 0,
          deliveryPreference: formData.deliveryPreference,
        };
      } else {
        leadData.custom_fields = {
          leadType: 'education',
          experienceLevel: formData.experienceLevel,
        };
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });

      if (!response.ok) {
        throw new Error('Failed to create lead');
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        courseInterest: '',
        experienceLevel: 'beginner',
        institution: '',
        jobTitle: '',
        studentNumbers: '',
        deliveryPreference: 'on-site',
        notes: '',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="admin-card max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Create New Lead</h2>
                  <p className="text-sm text-blue-100 mt-1">Add a new lead to your CRM</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Lead Type Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-3">Lead Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setLeadType('education')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        leadType === 'education'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <GraduationCap size={24} className={leadType === 'education' ? 'text-blue-500' : 'text-zinc-400'} />
                      <p className="font-medium text-white mt-2">Stylist Training</p>
                      <p className="text-xs text-zinc-400 mt-1">Professional education for stylists</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLeadType('cpd')}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        leadType === 'cpd'
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-zinc-700 bg-zinc-800 hover:border-zinc-600'
                      }`}
                    >
                      <Building2 size={24} className={leadType === 'cpd' ? 'text-blue-500' : 'text-zinc-400'} />
                      <p className="font-medium text-white mt-2">College Partnership</p>
                      <p className="text-xs text-zinc-400 mt-1">Educational programs for institutions</p>
                    </button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <User size={20} className="text-blue-500" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="admin-input w-full px-4 py-2"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="admin-input w-full px-4 py-2"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="admin-input w-full px-4 py-2"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="admin-input w-full px-4 py-2"
                      placeholder="+44 7700 900000"
                    />
                  </div>
                </div>

                {/* CPD-Specific Fields */}
                {leadType === 'cpd' && (
                  <div className="space-y-4 mb-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Building2 size={20} className="text-indigo-400" />
                      Institution Details
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Institution Name *</label>
                      <input
                        type="text"
                        name="institution"
                        value={formData.institution}
                        onChange={handleChange}
                        required={leadType === 'cpd'}
                        className="admin-input w-full px-4 py-2"
                        placeholder="University of Manchester"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Job Title</label>
                        <input
                          type="text"
                          name="jobTitle"
                          value={formData.jobTitle}
                          onChange={handleChange}
                          className="admin-input w-full px-4 py-2"
                          placeholder="Course Leader"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">Student Numbers</label>
                        <input
                          type="number"
                          name="studentNumbers"
                          value={formData.studentNumbers}
                          onChange={handleChange}
                          className="admin-input w-full px-4 py-2"
                          placeholder="50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Delivery Preference</label>
                      <select
                        name="deliveryPreference"
                        value={formData.deliveryPreference}
                        onChange={handleChange}
                        className="admin-select w-full px-4 py-2"
                      >
                        <option value="on-site">On-site</option>
                        <option value="online">Online</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Course Interest */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <GraduationCap size={20} className="text-purple-500" />
                    {leadType === 'cpd' ? 'Programme Interest' : 'Course Interest'}
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Course/Programme *</label>
                    <input
                      type="text"
                      name="courseInterest"
                      value={formData.courseInterest}
                      onChange={handleChange}
                      required
                      className="admin-input w-full px-4 py-2"
                      placeholder={leadType === 'cpd' ? 'Level 2 Hairdressing Programme' : 'Advanced Cutting Techniques'}
                    />
                  </div>

                  {leadType === 'education' && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Experience Level</label>
                      <select
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleChange}
                        className="admin-select w-full px-4 py-2"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="professional">Professional</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="admin-input w-full px-4 py-2 resize-none"
                    placeholder="Additional information about this lead..."
                  />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-700">
                  <button
                    type="button"
                    onClick={onClose}
                    className="admin-btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Lead'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

