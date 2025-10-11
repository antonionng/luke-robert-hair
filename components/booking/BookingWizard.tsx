'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import { CheckCircle } from 'lucide-react';
import ServiceSelection from './steps/ServiceSelection';
import LocationSelection from './steps/LocationSelection';
import DateTimeSelection from './steps/DateTimeSelection';
import ClientDetails from './steps/ClientDetails';
import ReviewConfirm from './steps/ReviewConfirm';
import Confirmation from './steps/Confirmation';

const STEPS = [
  { number: 1, title: 'Service', component: ServiceSelection },
  { number: 2, title: 'Location', component: LocationSelection },
  { number: 3, title: 'Date & Time', component: DateTimeSelection },
  { number: 4, title: 'Your Details', component: ClientDetails },
  { number: 5, title: 'Review', component: ReviewConfirm },
  { number: 6, title: 'Confirmed', component: Confirmation },
];

export default function BookingWizard() {
  const currentStep = useBookingStore((state) => state.currentStep);

  const CurrentStepComponent = STEPS.find(s => s.number === currentStep)?.component || ServiceSelection;

  return (
    <div className="section-padding">
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="mb-4">Book Your Appointment</h1>
          <p className="text-xl text-graphite/70">
            Let's find the perfect time for your visit
          </p>
        </motion.div>

        {/* Progress Indicator */}
        {currentStep < 6 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              {STEPS.slice(0, 5).map((step, index) => (
                <div key={step.number} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep > step.number
                          ? 'bg-sage text-white'
                          : currentStep === step.number
                          ? 'bg-sage text-white ring-4 ring-sage/20'
                          : 'bg-mist text-graphite/40'
                      }`}
                    >
                      {currentStep > step.number ? (
                        <CheckCircle size={20} />
                      ) : (
                        step.number
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 font-medium hidden sm:block ${
                        currentStep >= step.number ? 'text-graphite' : 'text-graphite/40'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < STEPS.slice(0, 5).length - 1 && (
                    <div
                      className={`h-0.5 flex-1 mx-2 transition-all ${
                        currentStep > step.number ? 'bg-sage' : 'bg-mist'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
