'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, MapPin, User, Search, Plus } from 'lucide-react';

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  prefilledClient?: { firstName: string; lastName: string; email: string; phone: string };
}

export default function CreateBookingModal({ isOpen, onClose, onSuccess, prefilledClient }: CreateBookingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    // Client data
    firstName: prefilledClient?.firstName || '',
    lastName: prefilledClient?.lastName || '',
    email: prefilledClient?.email || '',
    phone: prefilledClient?.phone || '',
    // Booking data
    serviceId: '',
    locationId: '',
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchServices();
      fetchLocations();
      if (prefilledClient) {
        setShowNewClientForm(true);
      }
    }
  }, [isOpen, prefilledClient]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/bookings?services=true');
      if (res.ok) {
        const data = await res.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/bookings?locations=true');
      if (res.ok) {
        const data = await res.json();
        setLocations(data.locations || []);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const selectedLocationData = locations.find(loc => loc.id === formData.locationId);

  const searchClients = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/admin/leads?search=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Error searching clients:', error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery && !showNewClientForm) {
        searchClients(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery, showNewClientForm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const isExternalLocation = (selectedLocationData as any)?.bookingSystem === 'theirs';

      if (isExternalLocation) {
        // For external locations, create a lead with booking intent
        const leadData = {
          firstName: formData.firstName || selectedClient?.firstName,
          lastName: formData.lastName || selectedClient?.lastName,
          email: formData.email || selectedClient?.email,
          phone: formData.phone || selectedClient?.phone,
          source: 'external_booking_intent',
          leadType: 'salon_client',
          custom_fields: {
            salon: formData.locationId,
            salonName: selectedLocationData?.name,
            preferredService: services.find(s => s.id === formData.serviceId)?.name,
            preferredDate: formData.date,
            preferredTime: formData.time,
          },
          courseInterest: services.find(s => s.id === formData.serviceId)?.name || 'Salon Service',
          message: `External booking intent for ${selectedLocationData?.name}. Created by admin.`,
          notes: formData.notes,
        };

        const leadRes = await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData),
        });

        if (!leadRes.ok) throw new Error('Failed to create booking intent lead');

        alert(`Lead created for ${selectedLocationData?.name}. Client should book through their system.`);
      } else {
        // For internal location, create normal booking
        // Create or get client
        let clientId = selectedClient?.id;

        if (!clientId) {
          // Create new client
          const clientRes = await fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              source: 'salon',
              lifecycle_stage: 'new',
            }),
          });

          if (!clientRes.ok) throw new Error('Failed to create client');
          const clientData = await clientRes.json();
          clientId = clientData.id;
        }

        // Create booking
        const bookingData = {
          clientId,
          serviceId: formData.serviceId,
          locationId: formData.locationId,
          date: formData.date,
          time: formData.time,
          notes: formData.notes,
          status: 'pending',
        };

        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingData),
        });

        if (!bookingRes.ok) throw new Error('Failed to create booking');
      }

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        serviceId: '',
        locationId: '',
        date: '',
        time: '',
        notes: '',
      });
      setSelectedClient(null);
      setShowNewClientForm(false);
      setSearchQuery('');

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const selectClient = (client: any) => {
    setSelectedClient(client);
    setFormData({
      ...formData,
      firstName: client.firstName || client.first_name,
      lastName: client.lastName || client.last_name,
      email: client.email,
      phone: client.phone,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="admin-card max-w-2xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Create New Booking</h2>
                  <p className="text-sm text-green-100 mt-1">Schedule an appointment</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                {/* Client Selection */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                    <User size={20} className="text-blue-500" />
                    Client
                  </h3>

                  {!selectedClient && !showNewClientForm && !prefilledClient && (
                    <>
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for existing client..."
                          className="admin-input w-full pl-10 pr-4 py-2"
                        />
                      </div>

                      {searchResults.length > 0 && (
                        <div className="admin-card p-2 mb-3 space-y-1">
                          {searchResults.map((client) => (
                            <button
                              key={client.id}
                              type="button"
                              onClick={() => selectClient(client)}
                              className="w-full text-left px-3 py-2 hover:bg-zinc-700 rounded-lg transition-colors"
                            >
                              <p className="text-white font-medium">{client.name}</p>
                              <p className="text-zinc-400 text-sm">{client.email}</p>
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setShowNewClientForm(true)}
                        className="admin-btn-secondary w-full flex items-center justify-center gap-2"
                      >
                        <Plus size={18} />
                        Create New Client
                      </button>
                    </>
                  )}

                  {(selectedClient || showNewClientForm || prefilledClient) && (
                    <div className="admin-card p-4 space-y-4">
                      {selectedClient && (
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-white font-medium">{selectedClient.name}</p>
                            <p className="text-zinc-400 text-sm">{selectedClient.email}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedClient(null);
                              setFormData({ ...formData, firstName: '', lastName: '', email: '', phone: '' });
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Change
                          </button>
                        </div>
                      )}

                      {(showNewClientForm || prefilledClient) && !selectedClient && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">First Name *</label>
                              <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                className="admin-input w-full px-4 py-2"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-zinc-300 mb-2">Last Name *</label>
                              <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                                className="admin-input w-full px-4 py-2"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              className="admin-input w-full px-4 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-zinc-300 mb-2">Phone *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              required
                              className="admin-input w-full px-4 py-2"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Booking Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar size={20} className="text-purple-500" />
                    Booking Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Service *</label>
                    <select
                      name="serviceId"
                      value={formData.serviceId}
                      onChange={handleChange}
                      required
                      className="admin-select w-full px-4 py-2"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.id} value={service.id}>
                          {service.name} - £{service.price} ({service.duration}min)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Location *</label>
                    <select
                      name="locationId"
                      value={formData.locationId}
                      onChange={handleChange}
                      required
                      className="admin-select w-full px-4 py-2"
                    >
                      <option value="">Select a location</option>
                      {locations.map((location: any) => (
                        <option key={location.id} value={location.id}>
                          {location.displayName || location.name} - {location.city}
                          {location.bookingSystem === 'theirs' ? ' (External)' : ''}
                        </option>
                      ))}
                    </select>
                    {selectedLocationData && (selectedLocationData as any).bookingSystem === 'theirs' && (
                      <div className="mt-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-xs text-yellow-200">
                          <strong>External Location:</strong> This will create a lead record. 
                          Client will need to book through {selectedLocationData.name}'s system.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Date *</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="admin-input w-full px-4 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">Time *</label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="admin-input w-full px-4 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-300 mb-2">Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="admin-input w-full px-4 py-2 resize-none"
                      placeholder="Special requests, allergies, etc..."
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-zinc-700 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="admin-btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn-success"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

