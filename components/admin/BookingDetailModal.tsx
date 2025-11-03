'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Calendar, Clock, MapPin, User, Mail, Phone, Edit2, Save,
  CheckCircle, XCircle, AlertCircle, MessageSquare
} from 'lucide-react';

interface BookingDetailModalProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (bookingId: string, updates: any) => Promise<void>;
}

export default function BookingDetailModal({ booking, isOpen, onClose, onUpdate }: BookingDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedBooking, setEditedBooking] = useState(booking);

  useEffect(() => {
    if (isOpen && booking) {
      setEditedBooking(booking);
    }
  }, [isOpen, booking]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(booking.id, editedBooking);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert('Failed to update booking');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      await onUpdate(booking.id, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  if (!booking) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={18} className="text-green-500" />;
      case 'pending':
        return <Clock size={18} className="text-orange-500" />;
      case 'completed':
        return <CheckCircle size={18} className="text-blue-500" />;
      case 'cancelled':
        return <XCircle size={18} className="text-red-500" />;
      default:
        return <AlertCircle size={18} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-600';
      case 'pending':
        return 'bg-orange-600';
      case 'completed':
        return 'bg-blue-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
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
            <div className="admin-card max-w-3xl w-full max-h-[90vh] overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className={`${getStatusColor(booking.status)} text-white p-6 flex items-center justify-between`}>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">
                      Booking Details
                    </h2>
                    {getStatusIcon(booking.status)}
                  </div>
                  <p className="text-sm text-white/80 mt-1">
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)} • 
                    {booking.date && ` ${new Date(booking.date).toLocaleDateString('en-GB')}`}
                    {booking.time && ` at ${booking.time}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-white text-zinc-900 rounded-lg font-medium flex items-center gap-2 hover:bg-white/90 transition-colors disabled:opacity-50"
                    >
                      <Save size={18} />
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Client Info */}
                    <div className="admin-card p-4">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <User size={18} className="text-blue-500" />
                        Client Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-zinc-400">Name</label>
                          <p className="text-white font-medium">
                            {booking.client?.firstName || booking.clientName} {booking.client?.lastName || ''}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400">Email</label>
                          <a href={`mailto:${booking.client?.email || booking.email}`} className="text-blue-400 hover:underline flex items-center gap-1">
                            <Mail size={14} />
                            {booking.client?.email || booking.email}
                          </a>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400">Phone</label>
                          <a href={`tel:${booking.client?.phone || booking.phone}`} className="text-blue-400 hover:underline flex items-center gap-1">
                            <Phone size={14} />
                            {booking.client?.phone || booking.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="admin-card p-4">
                      <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                        <Calendar size={18} className="text-purple-500" />
                        Appointment Details
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-zinc-400">Service</label>
                          <p className="text-white font-medium">{booking.service?.name || booking.service}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-zinc-400">Date</label>
                            {isEditing ? (
                              <input
                                type="date"
                                value={editedBooking.date}
                                onChange={(e) => setEditedBooking({ ...editedBooking, date: e.target.value })}
                                className="admin-input w-full px-3 py-2 mt-1"
                              />
                            ) : (
                              <p className="text-white font-medium">
                                {booking.date && new Date(booking.date).toLocaleDateString('en-GB')}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="text-sm text-zinc-400">Time</label>
                            {isEditing ? (
                              <input
                                type="time"
                                value={editedBooking.time}
                                onChange={(e) => setEditedBooking({ ...editedBooking, time: e.target.value })}
                                className="admin-input w-full px-3 py-2 mt-1"
                              />
                            ) : (
                              <p className="text-white font-medium">{booking.time}</p>
                            )}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400">Location</label>
                          <p className="text-white font-medium flex items-center gap-1">
                            <MapPin size={14} />
                            {booking.location?.name || booking.location}
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400">Duration</label>
                          <p className="text-white font-medium flex items-center gap-1">
                            <Clock size={14} />
                            {booking.service?.duration || booking.duration || 60} minutes
                          </p>
                        </div>
                        <div>
                          <label className="text-sm text-zinc-400">Price</label>
                          <p className="text-white font-medium text-lg">£{booking.service?.price || booking.price}</p>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">Notes</label>
                      <textarea
                        value={isEditing ? editedBooking.notes || '' : booking.notes || ''}
                        onChange={(e) => isEditing && setEditedBooking({ ...editedBooking, notes: e.target.value })}
                        disabled={!isEditing}
                        placeholder="Add notes about this booking..."
                        className="admin-input w-full px-4 py-3 min-h-[100px] disabled:bg-zinc-800/50"
                      />
                    </div>
                  </div>

                  {/* Sidebar - Status & Actions */}
                  <div className="space-y-4">
                    {/* Status */}
                    <div className="admin-card p-4">
                      <label className="font-semibold text-white mb-3 block">Status</label>
                      <div className="space-y-2">
                        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                          <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            disabled={isSaving || booking.status === status}
                            className={`w-full px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center gap-2 ${
                              booking.status === status
                                ? getStatusColor(status) + ' text-white'
                                : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {getStatusIcon(status)}
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="admin-card p-4">
                      <h4 className="font-semibold text-white mb-3">Quick Actions</h4>
                      <div className="space-y-2">
                        <button
                          className="admin-btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                        >
                          <Mail size={16} />
                          Send Reminder
                        </button>
                        <button
                          className="admin-btn-secondary w-full flex items-center justify-center gap-2 text-sm"
                        >
                          <MessageSquare size={16} />
                          Send SMS
                        </button>
                        {booking.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusChange('cancelled')}
                            className="admin-btn-danger w-full flex items-center justify-center gap-2 text-sm"
                          >
                            <XCircle size={16} />
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Booking Info */}
                    <div className="admin-card p-4">
                      <h4 className="font-semibold text-white mb-3">Booking Info</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <label className="text-zinc-400">Created</label>
                          <p className="text-white">
                            {booking.createdAt && new Date(booking.createdAt).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                        <div>
                          <label className="text-zinc-400">Booking ID</label>
                          <p className="text-white font-mono text-xs">{booking.id.slice(0, 8)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}



