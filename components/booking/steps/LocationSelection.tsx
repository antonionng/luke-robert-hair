'use client';

import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import { LOCATIONS } from '@/lib/bookingConfig';
import { MapPin, Phone, Navigation, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LocationSelection() {
  const { location, setLocation, nextStep, previousStep } = useBookingStore();

  const handleSelectLocation = (selectedLocation: typeof LOCATIONS[0]) => {
    setLocation(selectedLocation);
  };

  const handleContinue = () => {
    if (location) {
      nextStep();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-light mb-2">Choose Your Location</h2>
        <p className="text-graphite/70">Select the salon that's most convenient for you</p>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        {LOCATIONS.map((loc, index) => (
          <motion.button
            key={loc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectLocation(loc)}
            className={`text-left p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              location?.id === loc.id
                ? 'border-sage bg-sage/5'
                : 'border-mist hover:border-sage/50'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-graphite mb-1">{loc.salonName}</h3>
                <p className="text-sm text-graphite/60">{loc.name}</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                location?.id === loc.id ? 'border-sage bg-sage' : 'border-mist'
              }`}>
                {location?.id === loc.id && (
                  <div className="w-2 h-2 bg-white rounded-full" />
                )}
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2 text-sm text-graphite/70">
                <MapPin size={16} className="mt-0.5 flex-shrink-0 text-sage" />
                <span>{loc.address}, {loc.postcode}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-graphite/70">
                <Phone size={16} className="flex-shrink-0 text-sage" />
                <span>{loc.phone}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-mist">
              <div className="flex items-start gap-2 text-xs text-graphite/60">
                <Navigation size={14} className="mt-0.5 flex-shrink-0" />
                <span>{loc.parkingInfo}</span>
              </div>
            </div>

            {/* Availability Info */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs font-medium text-blue-900">
                {loc.id === 'altrincham' && '📅 Available: Tuesdays & Wednesdays (3 weeks/month)'}
                {loc.id === 'knutsford' && '📅 Available: Fridays & Saturdays (3 weeks/month)'}
                {loc.id === 'reading' && '📅 Available: Monday-Saturday (1 week/month)'}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={previousStep}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!location}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
