'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore, addBooking } from '@/lib/bookingStore';
import { formatDate, formatTime, calculateEndTime, generateConfirmationCode, calculateDeposit } from '@/lib/bookingUtils';
import { ArrowLeft, Calendar, MapPin, Clock, User, Mail, Phone, DollarSign, AlertCircle, CheckCircle2, Repeat } from 'lucide-react';

export default function ReviewConfirm() {
  const { service, location, date, time, client, isRecurring, recurringPattern, nextStep, previousStep, goToStep } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showRecurring, setShowRecurring] = useState(false);

  const depositAmount = service ? calculateDeposit(service) : 0;
  const endTime = service && time ? calculateEndTime(time, service.duration) : '';

  const handleConfirmBooking = async () => {
    if (!service || !location || !date || !time || !client.firstName || !client.lastName || !client.email || !client.phone) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create booking object
      const booking = {
        id: `BK-${Date.now()}`,
        service,
        location,
        date,
        time,
        endTime,
        client: {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          isNewClient: client.isNewClient ?? true,
          notes: client.notes,
          allergies: client.allergies,
        },
        depositRequired: service.requiresDeposit,
        depositAmount,
        depositPaid: false,
        totalPrice: service.price,
        isRecurring,
        recurringPattern: isRecurring && recurringPattern ? recurringPattern : undefined,
        status: 'pending' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        confirmationCode: generateConfirmationCode(),
        reminderSent: false,
      };

      // Add to store (will be replaced with API call)
      addBooking(booking);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Move to confirmation page
      nextStep();
    } catch (error) {
      console.error('Booking error:', error);
      alert('There was an error creating your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-light mb-2">Review Your Booking</h2>
        <p className="text-graphite/70">Please check all details before confirming</p>
      </div>

      <div className="space-y-6">
        {/* Service Details */}
        <div className="p-6 bg-sage/5 rounded-xl">
          <h3 className="font-semibold text-graphite mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} className="text-sage" />
            Service Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-graphite/70">Service:</span>
              <span className="font-medium text-graphite">{service?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-graphite/70">Duration:</span>
              <span className="font-medium text-graphite">{service?.duration} minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-graphite/70">Price:</span>
              <span className="font-semibold text-sage text-lg">£{service?.price}</span>
            </div>
            {service?.requiresDeposit && (
              <div className="pt-3 border-t border-sage/20">
                <div className="flex items-center justify-between">
                  <span className="text-graphite/70">Deposit Required:</span>
                  <span className="font-medium text-orange-600">£{depositAmount}</span>
                </div>
                <p className="text-xs text-graphite/60 mt-2">
                  Deposit secures your booking and will be deducted from the total price
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => goToStep(1)}
            className="text-sm text-sage hover:underline mt-4"
          >
            Change service
          </button>
        </div>

        {/* Location & Time */}
        <div className="p-6 bg-blue-50 rounded-xl">
          <h3 className="font-semibold text-graphite mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            Appointment Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-graphite">{location?.salonName}</p>
                <p className="text-sm text-graphite/70">{location?.address}, {location?.postcode}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-blue-600 flex-shrink-0" />
              <span className="font-medium text-graphite">{date && formatDate(new Date(date))}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-blue-600 flex-shrink-0" />
              <span className="font-medium text-graphite">
                {time && formatTime(time)} - {endTime && formatTime(endTime)}
              </span>
            </div>
          </div>
          <button
            onClick={() => goToStep(2)}
            className="text-sm text-blue-600 hover:underline mt-4"
          >
            Change date/time
          </button>
        </div>

        {/* Client Details */}
        <div className="p-6 bg-purple-50 rounded-xl">
          <h3 className="font-semibold text-graphite mb-4 flex items-center gap-2">
            <User size={20} className="text-purple-600" />
            Your Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User size={18} className="text-purple-600 flex-shrink-0" />
              <span className="font-medium text-graphite">{client.firstName} {client.lastName}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-purple-600 flex-shrink-0" />
              <span className="text-graphite/70">{client.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-purple-600 flex-shrink-0" />
              <span className="text-graphite/70">{client.phone}</span>
            </div>
            {client.notes && (
              <div className="pt-3 border-t border-purple-200">
                <p className="text-sm text-graphite/70"><strong>Notes:</strong> {client.notes}</p>
              </div>
            )}
            {client.allergies && (
              <div className="pt-2">
                <p className="text-sm text-graphite/70"><strong>Allergies:</strong> {client.allergies}</p>
              </div>
            )}
          </div>
          <button
            onClick={() => goToStep(4)}
            className="text-sm text-purple-600 hover:underline mt-4"
          >
            Edit details
          </button>
        </div>

        {/* Recurring Booking Option */}
        <div className="p-6 border-2 border-dashed border-mist rounded-xl">
          <button
            onClick={() => setShowRecurring(!showRecurring)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Repeat size={20} className="text-sage" />
              <span className="font-medium text-graphite">Make this a recurring booking</span>
            </div>
            <span className="text-sm text-sage">{showRecurring ? 'Hide' : 'Show'}</span>
          </button>
          {showRecurring && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 pt-4 border-t border-mist"
            >
              <p className="text-sm text-graphite/70 mb-4">
                Recurring bookings coming soon! This feature will allow you to automatically book regular appointments.
              </p>
            </motion.div>
          )}
        </div>

        {/* Booking Policy */}
        <div className="p-6 bg-orange-50 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <AlertCircle size={20} className="text-orange-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-graphite mb-2">Booking Policy</h4>
              <ul className="text-sm text-graphite/70 space-y-1">
                <li>• 24 hours notice required for cancellations</li>
                <li>• Please arrive 5 minutes before your appointment</li>
                <li>• Late arrivals may need to be rescheduled</li>
                {service?.requiresDeposit && (
                  <li>• Deposit is non-refundable but transferable to another date</li>
                )}
              </ul>
            </div>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreedToPolicy}
              onChange={(e) => setAgreedToPolicy(e.target.checked)}
              className="mt-1 w-4 h-4 text-sage border-mist rounded focus:ring-sage/20"
            />
            <span className="text-sm text-graphite">
              I have read and agree to the booking policy
            </span>
          </label>
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
          onClick={handleConfirmBooking}
          disabled={!agreedToPolicy || isSubmitting}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <CheckCircle2 size={18} />
              Confirm Booking
            </>
          )}
        </button>
      </div>
    </div>
  );
}
