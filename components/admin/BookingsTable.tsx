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
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-orange-100 text-orange-700',
      completed: 'bg-blue-100 text-blue-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700';
  };

  const filteredBookings = bookings.filter(booking =>
    `${booking.client.firstName} ${booking.client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-sage/5 border-b border-mist">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Client</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Service</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Date & Time</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-graphite">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-mist">
            {filteredBookings.map((booking, index) => (
              <motion.tr
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-sage/5 transition-colors"
              >
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-graphite">{booking.client.firstName} {booking.client.lastName}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a href={`mailto:${booking.client.email}`} className="text-xs text-graphite/60 hover:text-sage flex items-center gap-1">
                        <Mail size={12} />
                        {booking.client.email}
                      </a>
                    </div>
                    <a href={`tel:${booking.client.phone}`} className="text-xs text-graphite/60 hover:text-sage flex items-center gap-1 mt-1">
                      <Phone size={12} />
                      {booking.client.phone}
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-graphite">{booking.service.name}</span>
                  {booking.client.notes && (
                    <p className="text-xs text-graphite/60 mt-1">{booking.client.notes}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-graphite">{formatDate(new Date(booking.date))}</p>
                  <p className="text-xs text-graphite/60">{formatTime(booking.time)}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(booking.status)}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-graphite">£{booking.service.price}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="View Details">
                      <Eye size={16} className="text-graphite/60" />
                    </button>
                    <button className="p-2 hover:bg-sage/10 rounded-lg transition-colors" title="Edit Booking">
                      <Edit size={16} className="text-graphite/60" />
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
          <p className="text-graphite/60">No bookings found</p>
        </div>
      )}
    </div>
  );
}
