'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Clock, MapPin, Phone } from 'lucide-react';
import TimeSelector from '@/components/TimeSelector';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;
  city: string;
  externalUrl: string;
}

interface ExternalBookingCaptureProps {
  location: Location;
  onBack: () => void;
}

export default function ExternalBookingCapture({ location, onBack }: ExternalBookingCaptureProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredService: '',
    preferredDate: '',
    preferredTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save lead with external booking intent
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          source: 'external_booking_intent',
          leadType: 'salon_client',
          custom_fields: {
            salon: location.id,
            salonName: location.name,
            preferredService: formData.preferredService,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
          },
          courseInterest: formData.preferredService || 'Salon Service',
          message: `External booking intent for ${location.name}. Preferred: ${formData.preferredService} on ${formData.preferredDate} at ${formData.preferredTime}`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save booking intent');
      }

      // Show success message
      setShowSuccess(true);

      // Open external booking URL in new tab after short delay
      setTimeout(() => {
        window.open(location.externalUrl, '_blank');
      }, 1500);
    } catch (error) {
      console.error('Error saving booking intent:', error);
      alert('Failed to save your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen pt-20 section-padding bg-sage-pale/30"
      >
        <div className="container-custom max-w-2xl">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ExternalLink size={40} className="text-green-600" />
            </div>
            <h2 className="text-3xl font-playfair font-light mb-4">Details Saved!</h2>
            <p className="text-lg text-graphite/70 mb-6">
              We've saved your information and are opening {location.name}'s booking page for you.
            </p>
            <p className="text-sm text-graphite/60 mb-8">
              Please complete your booking on their system. If the page doesn't open automatically, 
              <a href={location.externalUrl} target="_blank" rel="noopener noreferrer" className="text-sage hover:underline ml-1">
                click here
              </a>.
            </p>
            <button onClick={onBack} className="btn-secondary">
              Back to Booking
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen pt-20 section-padding bg-sage-pale/30">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button onClick={onBack} className="text-sage hover:text-sage-dark mb-4 flex items-center gap-2">
            ← Back to Location Selection
          </button>
          <h1 className="mb-4">Book at {location.name}</h1>
          <p className="text-lg text-graphite/70">
            We'll connect you to their booking system. First, let us save your details.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Location Info Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">{location.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin size={20} className="text-sage mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Address</p>
                    <p className="text-sm text-graphite/70">{location.address}</p>
                  </div>
                </div>

                {location.phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={20} className="text-sage mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-graphite">Phone</p>
                      <a href={`tel:${location.phone}`} className="text-sm text-sage hover:underline">
                        {location.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <ExternalLink size={20} className="text-sage mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-graphite">Booking System</p>
                    <p className="text-sm text-graphite/70">External (their website)</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-sage/5 rounded-xl">
                <p className="text-xs text-graphite/70">
                  <strong className="text-graphite">Note:</strong> After submitting, you'll be redirected to {location.name}'s 
                  booking system to complete your appointment.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Lead Capture Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6">Your Information</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <label className="block font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                    placeholder="+44 7700 900000"
                  />
                </div>

                {/* Booking Preferences */}
                <div className="pt-6 border-t border-mist">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-sage" />
                    Booking Preferences (Optional)
                  </h3>
                  <p className="text-sm text-graphite/60 mb-4">
                    Help us understand your needs - you'll finalize details on their booking system.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block font-medium mb-2">Preferred Service</label>
                      <select
                        name="preferredService"
                        value={formData.preferredService}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                      >
                        <option value="">Select a service (optional)</option>
                        <option value="Cut">Cut</option>
                        <option value="Cut & Finish">Cut & Finish</option>
                        <option value="Colour">Colour</option>
                        <option value="Highlights">Highlights</option>
                        <option value="Balayage">Balayage</option>
                        <option value="Styling">Styling</option>
                        <option value="Treatment">Treatment</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-medium mb-2">Preferred Date</label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                        />
                      </div>
                      <div>
                        <label className="block font-medium mb-2">Preferred Time</label>
                        <TimeSelector
                          value={formData.preferredTime}
                          onChange={(time) => setFormData({ ...formData, preferredTime: time })}
                          className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20"
                          placeholder="Select preferred time"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={onBack}
                    className="btn-secondary flex-1"
                    disabled={isSubmitting}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      'Saving...'
                    ) : (
                      <>
                        Continue to {location.name}
                        <ExternalLink size={18} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}



