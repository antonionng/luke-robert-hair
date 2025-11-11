'use client';

import { useState, useEffect } from 'react';
import BookingWizard from '@/components/booking/BookingWizard';
import ExternalBookingCapture from '@/components/booking/ExternalBookingCapture';
import StructuredData from '@/components/StructuredData';
import { generateBreadcrumbs } from '@/lib/seo';

interface Location {
  id: string;
  name: string;
  displayName?: string;
  address: string;
  phone: string | null;
  city: string;
  bookingSystem: 'ours' | 'theirs';
  externalUrl?: string;
  isPartner?: boolean;
}

export default function BookPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/bookings?locations=true');
      if (response.ok) {
        const data = await response.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleBack = () => {
    setSelectedLocation(null);
  };

  return (
    <div className="pt-20 min-h-screen bg-sage-pale/30">
      {/* Structured Data for SEO */}
      <StructuredData 
        data={[
          generateBreadcrumbs([
            { name: 'Home', url: '/' },
            { name: 'Book', url: '/book' },
          ]),
        ]} 
      />
      
      <div className="section-padding">
        {!selectedLocation ? (
          // Step 1: Location Selection
          <div className="container-custom max-w-6xl">
            <div className="mb-16 text-center">
              <h1 className="mb-6 text-5xl md:text-6xl">Book Your Appointment</h1>
              <p className="text-xl text-graphite/70 max-w-2xl mx-auto">
                Choose your preferred location and let's create something beautiful together
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-20">
                <div className="animate-spin w-16 h-16 border-4 border-sage border-t-transparent rounded-full mx-auto"></div>
                <p className="mt-6 text-lg text-graphite/60">Loading locations...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className="bg-white rounded-3xl shadow-lg p-8 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-sage group relative overflow-hidden"
                    onClick={() => handleLocationSelect(location)}
                  >
                    {/* Decorative background gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sage/10 to-transparent rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    
                    <div className="relative z-10">
                      {location.isPartner && (
                        <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-4 border border-blue-200">
                          Partner Salon
                        </div>
                      )}
                      
                      <h3 className="text-3xl font-playfair font-light mb-6 text-graphite leading-tight">
                        Book me at {location.displayName || location.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-2 h-2 bg-sage rounded-full"></div>
                        <p className="text-sm font-medium text-sage uppercase tracking-wide">{location.city}</p>
                      </div>
                      
                      <p className="text-sm text-graphite/60 mb-4 leading-relaxed">{location.address}</p>
                      
                      {location.phone && (
                        <p className="text-sm text-graphite/50 mb-6">{location.phone}</p>
                      )}
                      
                      <button className="w-full bg-gradient-to-r from-sage to-sage-dark text-white py-4 rounded-full font-medium hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                        Continue
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Additional info section */}
            <div className="mt-20 text-center">
              <div className="max-w-3xl mx-auto bg-gradient-to-br from-sage/5 to-transparent rounded-3xl p-12 border border-sage/10">
                <h3 className="text-2xl font-playfair font-light mb-4">Not sure which location to choose?</h3>
                <p className="text-graphite/70 mb-6">
                  Each location offers Luke's signature precision cutting and exceptional service. 
                  Choose the location most convenient for you.
                </p>
                <a href="/contact" className="btn-secondary inline-block">
                  Contact Us for Help
                </a>
              </div>
            </div>
          </div>
        ) : selectedLocation.bookingSystem === 'theirs' ? (
          // External booking capture
          <ExternalBookingCapture location={selectedLocation as any} onBack={handleBack} />
        ) : (
          // Internal booking wizard
          <BookingWizard />
        )}
      </div>
    </div>
  );
}
