import { motion } from 'framer-motion';
import { CheckCircle, Clock, XCircle, AlertCircle, Mail, Phone, Eye, Edit, Trash2 } from 'lucide-react';
import { Booking } from '@/lib/bookingTypes';
import { formatDate, formatTime, canCancelBooking } from '@/lib/bookingUtils';
import { cancelBooking } from '@/lib/bookingStore';

interface BookingsTableProps {
  bookings: Booking[];
  searchTerm: string;
  onUpdate?: () => void;
}

export default function BookingsTable({ bookings, searchTerm }: BookingsTableProps) {
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

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: 'bg-green-500/20 text-green-400 border border-green-500/30',
      pending: 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border border-red-500/30',
    };
    return styles[status as keyof typeof styles] || 'bg-zinc-700 text-zinc-400 border border-zinc-600';
  };

  const filteredBookings = bookings.filter(booking =>
    `${booking.client.firstName} ${booking.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="admin-table-header">Client</th>
              <th className="admin-table-header">Service</th>
              <th className="admin-table-header">Date & Time</th>
              <th className="admin-table-header">Status</th>
              <th className="admin-table-header">Price</th>
              <th className="admin-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="admin-table-row border-b border-zinc-800"
              >
                <td className="admin-table-cell">
                  <div>
                    <p className="font-medium text-white">{booking.client.firstName} {booking.client.lastName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${booking.client.email}`} className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Mail size={12} />
                        {booking.client.email}
                      </a>
                    </div>
                    <a href={`tel:${booking.client.phone}`} className="text-xs text-zinc-400 hover:text-blue-400 flex items-center gap-1 mt-1" onClick={(e) => e.stopPropagation()}>
                      <Phone size={12} />
                      {booking.client.phone}
                    </a>
                  </div>
                </td>
                <td className="admin-table-cell">
                  <span className="text-sm text-white">{booking.service.name}</span>
                  {(booking as any).isReferral && (booking as any).referralSalon && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded-full text-xs font-medium mt-1">
                      📍 {(booking as any).referralSalon}
                    </span>
                  )}
                  {booking.client.notes && (
                    <p className="text-xs text-zinc-400 mt-1">{booking.client.notes}</p>
                  )}
                </td>
                <td className="admin-table-cell">
                  <p className="text-sm text-white">{formatDate(new Date(booking.date))}</p>
                  <p className="text-xs text-zinc-400">{formatTime(booking.time)}</p>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`admin-badge ${getStatusBadge(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="admin-table-cell">
                  <span className="text-sm font-semibold text-green-400">£{booking.service.price}</span>
                </td>
                <td className="admin-table-cell">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group" title="View Details">
                      <Eye size={16} className="text-zinc-400 group-hover:text-blue-400" />
                    </button>
                    <button className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors group" title="Edit Booking">
                      <Edit size={16} className="text-zinc-400 group-hover:text-blue-400" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-zinc-400">No bookings found</p>
        </div>
      )}
    </div>
  );
}
