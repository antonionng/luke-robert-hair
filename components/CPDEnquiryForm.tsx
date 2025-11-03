'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';
import { getAllCourseTitles } from '@/lib/data/cpdCourses';

export default function CPDEnquiryForm() {
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    institution: '',
    email: '',
    phone: '',
    courseInterest: '',
    studentNumbers: '',
    deliveryPreference: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const courseTitles = getAllCourseTitles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Split name into first and last
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0] || '';

      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadType: 'cpd_partnership',
          firstName,
          lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          institution: formData.institution,
          jobTitle: formData.jobTitle || undefined,
          courseInterest: formData.courseInterest,
          studentNumbers: formData.studentNumbers ? parseInt(formData.studentNumbers) : undefined,
          deliveryPreference: formData.deliveryPreference || undefined,
          message: formData.message || undefined,
          source: 'cpd_partnership',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setIsSuccess(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          jobTitle: '',
          institution: '',
          email: '',
          phone: '',
          courseInterest: '',
          studentNumbers: '',
          deliveryPreference: '',
          message: '',
        });
        setIsSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-sage/10 border-2 border-sage rounded-2xl p-12 text-center"
      >
        <div className="w-20 h-20 bg-sage rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h3 className="font-playfair text-2xl text-graphite mb-3">
          Thank You!
        </h3>
        <p className="text-gray-700 text-lg leading-relaxed max-w-md mx-auto">
          We've received your partnership enquiry and will be in touch within 24 hours to discuss how we can support your hair and beauty students.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-graphite mb-2">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
          placeholder="John Smith"
        />
      </div>

      {/* Job Title */}
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-graphite mb-2">
          Job Title
        </label>
        <input
          type="text"
          id="jobTitle"
          name="jobTitle"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
          placeholder="e.g., Head of Hair & Beauty, Course Coordinator, Programme Manager"
        />
      </div>

      {/* Institution */}
      <div>
        <label htmlFor="institution" className="block text-sm font-medium text-graphite mb-2">
          Hair & Beauty College / Institution Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="institution"
          name="institution"
          required
          value={formData.institution}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
          placeholder="e.g., Manchester College of Hair & Beauty"
        />
      </div>

      {/* Email & Phone Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-graphite mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
            placeholder="john.smith@college.ac.uk"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-graphite mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
            placeholder="+44 1234 567890"
          />
        </div>
      </div>

      {/* Course Interest */}
      <div>
        <label htmlFor="courseInterest" className="block text-sm font-medium text-graphite mb-2">
          Course of Interest
        </label>
        <select
          id="courseInterest"
          name="courseInterest"
          value={formData.courseInterest}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
        >
          <option value="">Select a course...</option>
          <option value="All Courses">All Courses - Need Advice</option>
          {courseTitles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
          <option value="Custom Programme">Custom Programme</option>
        </select>
      </div>

      {/* Student Numbers & Delivery Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="studentNumbers" className="block text-sm font-medium text-graphite mb-2">
            Estimated Student Numbers
          </label>
          <input
            type="number"
            id="studentNumbers"
            name="studentNumbers"
            min="1"
            value={formData.studentNumbers}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
            placeholder="e.g., 25"
          />
        </div>

        <div>
          <label htmlFor="deliveryPreference" className="block text-sm font-medium text-graphite mb-2">
            Preferred Delivery
          </label>
          <select
            id="deliveryPreference"
            name="deliveryPreference"
            value={formData.deliveryPreference}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all"
          >
            <option value="">Select preference...</option>
            <option value="On-site">On-site at our institution</option>
            <option value="Online">Online / Virtual</option>
            <option value="Hybrid">Hybrid (both)</option>
            <option value="Flexible">Flexible - Let's Discuss</option>
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-graphite mb-2">
          Additional Requirements or Questions
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-transparent transition-all resize-none"
          placeholder="Tell us about your students' disciplines (hairdressing, beauty therapy, barbering, etc.), preferred dates, specific goals, or any questions..."
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 px-8 bg-sage text-white rounded-lg font-semibold text-lg hover:bg-graphite transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Request Partnership Information
            <Send className="w-5 h-5" />
          </>
        )}
      </button>

      {/* Privacy Notice */}
      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to be contacted about CPD partnership opportunities.
        We respect your privacy and will never share your information.
      </p>
    </form>
  );
}

