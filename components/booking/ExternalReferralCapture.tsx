'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Sparkles, Lock } from 'lucide-react';

interface ExternalReferralCaptureProps {
  isOpen: boolean;
  onClose: () => void;
  salonName: string;
  salonCity: string;
  salonId: string;
  onSubmit: (data: ReferralData) => void;
}

export interface ReferralData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceInterest: string;
  preferredDate?: string;
  marketingOptIn: boolean;
  salonId: string;
  salonName: string;
}

const salonServices = {
  'urban-sanctuary': [
    'Cut & Style',
    'Colour Service',
    'Balayage',
    'Highlights',
    'Restyle',
    'Not Sure Yet'
  ],
  'fixx-salon': [
    'Precision Cut',
    'Cut & Finish',
    'Colour Service',
    'Balayage',
    'Restyle',
    'Not Sure Yet'
  ]
};

export default function ExternalReferralCapture({
  isOpen,
  onClose,
  salonName,
  salonCity,
  salonId,
  onSubmit
}: ExternalReferralCaptureProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceInterest: '',
    preferredDate: '',
    marketingOptIn: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const referralData: ReferralData = {
      ...formData,
      salonId,
      salonName,
    };

    onSubmit(referralData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const services = salonServices[salonId as keyof typeof salonServices] || salonServices['urban-sanctuary'];

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
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <Sparkles size={24} />
                      </div>
                      <div>
                        <h2 className="text-2xl font-semibold">Booking at {salonName}</h2>
                        <p className="text-sm text-purple-100 flex items-center gap-1">
                          <MapPin size={14} />
                          {salonCity}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-purple-100">
                    Luke works at {salonName}. Let us save your details and connect you to their booking system!
                  </p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                <div className="space-y-5">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                      placeholder="+44 7700 900000"
                    />
                  </div>

                  {/* Service Interest */}
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2">
                      What service are you interested in?
                    </label>
                    <select
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 bg-white"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Preferred Date (Optional)
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                    />
                    <p className="text-xs text-graphite/60 mt-1">
                      This helps us follow up with you at the right time
                    </p>
                  </div>

                  {/* Marketing Opt-in */}
                  <div className="bg-sage/5 border border-sage/20 rounded-xl p-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="marketingOptIn"
                        checked={formData.marketingOptIn}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 text-sage border-gray-300 rounded focus:ring-sage"
                      />
                      <span className="text-sm text-graphite">
                        Send me updates about Luke's services, special offers, and hair care tips
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full font-medium transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue to {salonName}
                        <motion.span
                          animate={{ x: [0, 5, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </button>

                  {/* Trust Indicators */}
                  <div className="text-center">
                    <p className="text-xs text-graphite/60 flex items-center justify-center gap-1">
                      <Lock size={12} />
                      Your information is secure. <a href="/privacy" className="underline hover:text-sage">Privacy Policy</a>
                    </p>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



