'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import { validateEmail, validatePhoneNumber } from '@/lib/bookingUtils';
import { ArrowLeft, ArrowRight, User, Mail, Phone, MessageSquare, AlertCircle } from 'lucide-react';

export default function ClientDetails() {
  const { client, setClient, nextStep, previousStep } = useBookingStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setClient({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!client.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!client.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!client.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(client.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!client.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(client.phone)) {
      newErrors.phone = 'Please enter a valid UK phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-light mb-2">Your Details</h2>
        <p className="text-graphite/70">We'll use this information to confirm your booking</p>
      </div>

      <div className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block font-medium mb-2 flex items-center gap-2">
              <User size={18} className="text-sage" />
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              value={client.firstName || ''}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 ${
                errors.firstName ? 'border-red-500' : 'border-mist'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block font-medium mb-2">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              value={client.lastName || ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 ${
                errors.lastName ? 'border-red-500' : 'border-mist'
              }`}
              placeholder="Smith"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-medium mb-2 flex items-center gap-2">
            <Mail size={18} className="text-sage" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={client.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 ${
              errors.email ? 'border-red-500' : 'border-mist'
            }`}
            placeholder="john.smith@email.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.email}
            </p>
          )}
          <p className="text-xs text-graphite/60 mt-1">
            We'll send your confirmation and reminders to this email
          </p>
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block font-medium mb-2 flex items-center gap-2">
            <Phone size={18} className="text-sage" />
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={client.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 ${
              errors.phone ? 'border-red-500' : 'border-mist'
            }`}
            placeholder="07700 900123"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.phone}
            </p>
          )}
          <p className="text-xs text-graphite/60 mt-1">
            We'll contact you if we need to discuss your appointment
          </p>
        </div>

        {/* New Client Checkbox */}
        <div className="p-4 bg-sage/5 rounded-xl">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={client.isNewClient ?? true}
              onChange={(e) => handleChange('isNewClient', e.target.checked)}
              className="mt-1 w-4 h-4 text-sage border-mist rounded focus:ring-sage/20"
            />
            <div>
              <span className="font-medium text-graphite">This is my first appointment with Luke</span>
              <p className="text-sm text-graphite/60 mt-1">
                New clients: Please arrive 5 minutes early for a brief consultation
              </p>
            </div>
          </label>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block font-medium mb-2 flex items-center gap-2">
            <MessageSquare size={18} className="text-sage" />
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            value={client.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 resize-none"
            placeholder="Any specific requests, allergies, or questions?"
          />
        </div>

        {/* Allergies */}
        <div>
          <label htmlFor="allergies" className="block font-medium mb-2">
            Allergies or Sensitivities (Optional)
          </label>
          <input
            type="text"
            id="allergies"
            value={client.allergies || ''}
            onChange={(e) => handleChange('allergies', e.target.value)}
            className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
            placeholder="e.g., PPD, ammonia, fragrances"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          onClick={previousStep}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleContinue}
          className="btn-primary flex items-center gap-2"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
