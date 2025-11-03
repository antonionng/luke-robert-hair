'use client';

import { motion } from 'framer-motion';
import { useBookingStore } from '@/lib/bookingStore';
import { SERVICES } from '@/lib/bookingConfig';
import { Clock, Info } from 'lucide-react';

export default function ServiceSelection() {
  const { service, setService, nextStep } = useBookingStore();

  const handleSelectService = (selectedService: typeof SERVICES[0]) => {
    setService(selectedService);
    // Auto-advance after selection
    setTimeout(() => nextStep(), 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-light mb-2">Choose Your Service</h2>
        <p className="text-graphite/70">Select the service that best fits your needs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SERVICES.map((s, index) => (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => handleSelectService(s)}
            className={`text-left p-6 rounded-xl border-2 transition-all hover:shadow-md ${
              service?.id === s.id
                ? 'border-sage bg-sage/5'
                : 'border-mist hover:border-sage/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-xl font-semibold text-graphite">{s.name}</h3>
              {s.requiresDeposit && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                  Deposit Required
                </span>
              )}
            </div>

            <p className="text-sm text-graphite/70 mb-4 leading-relaxed">
              {s.description}
            </p>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-graphite/60">
                <span className="font-semibold text-sage">£{s.price}</span>
              </div>
              <div className="flex items-center gap-1 text-graphite/60">
                <Clock size={16} />
                <span>{s.duration} mins</span>
              </div>
            </div>

            {s.requiresDeposit && (
              <div className="mt-3 pt-3 border-t border-mist">
                <div className="flex items-start gap-2 text-xs text-graphite/60">
                  <Info size={14} className="mt-0.5 flex-shrink-0" />
                  <span>£{s.depositAmount} deposit required to secure booking</span>
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-sage/5 rounded-xl">
        <p className="text-sm text-graphite/70">
          <strong>Not sure which service?</strong> Our AI assistant can help you choose. 
          Click the chat icon in the bottom right corner.
        </p>
      </div>
    </div>
  );
}
