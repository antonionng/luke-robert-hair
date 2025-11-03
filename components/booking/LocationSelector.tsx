'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';

interface Location {
  id: string;
  name: string;
  city: string;
  type: 'direct' | 'partner';
  description: string;
  badge?: string;
}

interface LocationSelectorProps {
  onSelectLocation: (location: Location) => void;
}

const locations: Location[] = [
  {
    id: 'knutsford',
    name: 'Urban Sanctuary',
    city: 'Knutsford',
    type: 'direct',
    description: 'Fridays & Saturdays (Weeks 1-3)',
    badge: 'Available'
  },
  {
    id: 'altrincham',
    name: 'Fixx Salon',
    city: 'Altrincham',
    type: 'direct',
    description: 'Tuesdays & Wednesdays (Weeks 1-3)',
    badge: 'Available'
  },
  {
    id: 'reading',
    name: 'Alternate Salon',
    city: 'Reading (Caversham)',
    type: 'direct',
    description: 'Week 4 only - Monday to Saturday',
    badge: 'Available'
  }
];

export default function LocationSelector({ onSelectLocation }: LocationSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-playfair font-light mb-4">
          Where would you like to book?
        </h2>
        <p className="text-lg text-graphite/70">
          Luke works at multiple locations across Cheshire
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {locations.map((location, index) => (
          <motion.button
            key={location.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectLocation(location)}
            className="group relative p-6 rounded-2xl border-2 border-sage bg-sage/5 hover:border-sage-dark hover:bg-sage/10 transition-all duration-300 text-left hover:shadow-xl hover:-translate-y-1"
          >
            {/* Badge */}
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-sage text-white text-xs font-medium rounded-full">
                {location.badge}
              </span>
            </div>

            {/* Location Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-sage">
              <MapPin className="text-white" size={24} />
            </div>

            {/* Location Info */}
            <h3 className="text-xl font-semibold mb-1 text-graphite group-hover:text-sage transition-colors">
              {location.city}
            </h3>
            <p className="text-sm text-graphite/60 mb-3">{location.name}</p>
            <p className="text-sm text-graphite/70 mb-4">{location.description}</p>

            {/* CTA */}
            <div className="flex items-center gap-2 text-sage font-medium group-hover:gap-3 transition-all">
              Book Here
              <ArrowRight size={18} />
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-sage opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </motion.button>
        ))}
      </div>

      {/* Trust Indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-center text-sm text-graphite/60"
      >
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sage">✓</span>
            <span>Secure booking</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sage">✓</span>
            <span>Trusted locations</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sage">✓</span>
            <span>Expert service</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

