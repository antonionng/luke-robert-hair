'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore, getBookingsByEmail } from '@/lib/bookingStore';
import { formatDate, formatTime } from '@/lib/bookingUtils';
import { CheckCircle, Calendar, MapPin, Clock, Mail, Phone, Download, Home, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Confirmation() {
  const router = useRouter();
  const { service, location, date, time, client, reset } = useBookingStore();
  
  // Get the most recent booking for this email
  const recentBooking = client.email ? getBookingsByEmail(client.email).slice(-1)[0] : null;

  const handleNewBooking = () => {
    reset();
  };

  const handleGoHome = () => {
    reset();
    router.push('/');
  };

  const depositRequired = service?.requiresDeposit;
  const depositAmount = service?.depositAmount || 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-24 h-24 bg-sage rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="text-white" size={48} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-playfair font-light mb-3">Booking Confirmed!</h2>
        <p className="text-xl text-graphite/70">
          Your appointment has been successfully booked
        </p>
        {recentBooking && (
          <div className="mt-4 inline-block px-4 py-2 bg-sage/10 rounded-full">
            <p className="text-sm font-mono text-sage">
              Confirmation Code: <strong>{recentBooking.confirmationCode}</strong>
            </p>
          </div>
        )}
      </motion.div>

      {/* Booking Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-6 mb-8"
      >
        <div className="p-6 bg-sage/5 rounded-xl">
          <h3 className="font-semibold text-graphite mb-4">Appointment Details</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-graphite">{service?.name}</p>
                <p className="text-sm text-graphite/60">£{service?.price} • {service?.duration} minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={20} className="text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-graphite">{location?.salonName}</p>
                <p className="text-sm text-graphite/60">{location?.address}, {location?.postcode}</p>
                <p className="text-sm text-graphite/60">{location?.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar size={20} className="text-sage mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-graphite">{date && formatDate(new Date(date))}</p>
                <p className="text-sm text-graphite/60">{time && formatTime(time)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Deposit Information */}
        {depositRequired && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 bg-orange-50 rounded-xl border-2 border-orange-200"
          >
            <div className="flex items-start gap-3 mb-4">
              <CreditCard size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-graphite mb-2">Deposit Required</h4>
                <p className="text-sm text-graphite/70 mb-3">
                  A deposit of <strong>£{depositAmount}</strong> is required to secure your booking.
                </p>
                <button className="btn-primary text-sm">
                  Pay Deposit Now
                </button>
                <p className="text-xs text-graphite/60 mt-2">
                  You can also pay the deposit when you arrive for your appointment
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* What Happens Next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 bg-blue-50 rounded-xl"
        >
          <h3 className="font-semibold text-graphite mb-4 flex items-center gap-2">
            <Mail size={20} className="text-blue-600" />
            What Happens Next
          </h3>
          <ul className="space-y-3 text-sm text-graphite/70">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Confirmation email sent to <strong>{client.email}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Calendar invite attached (add to your calendar)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>Reminder sent 24 hours before your appointment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">4.</span>
              <span>Arrive 5 minutes early for check-in{client.isNewClient && ' and consultation'}</span>
            </li>
          </ul>
        </motion.div>

        {/* Preparation Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-6 bg-purple-50 rounded-xl"
        >
          <h3 className="font-semibold text-graphite mb-4">Prepare for Your Appointment</h3>
          <ul className="space-y-2 text-sm text-graphite/70">
            <li>• Wash your hair the morning of your appointment (no products)</li>
            <li>• Bring inspiration photos if you have them</li>
            <li>• Wear clothing that won't be affected by hair products</li>
            {client.isNewClient && <li>• Arrive 5 minutes early for your consultation with Luke</li>}
          </ul>
        </motion.div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <button
          onClick={() => window.print()}
          className="btn-secondary flex items-center justify-center gap-2 flex-1"
        >
          <Download size={18} />
          Print Confirmation
        </button>
        <button
          onClick={handleNewBooking}
          className="btn-secondary flex items-center justify-center gap-2 flex-1"
        >
          <Calendar size={18} />
          Book Another Appointment
        </button>
        <button
          onClick={handleGoHome}
          className="btn-primary flex items-center justify-center gap-2 flex-1"
        >
          <Home size={18} />
          Back to Home
        </button>
      </motion.div>

      {/* Need Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 text-center"
      >
        <p className="text-sm text-graphite/60">
          Need to modify or cancel your booking?{' '}
          <a href="/contact" className="text-sage hover:underline font-medium">
            Contact us
          </a>
        </p>
      </motion.div>
    </div>
  );
}
