'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';

interface Booking {
  id: string;
  date: string;
  time: string;
  clientName?: string;
  client?: { firstName: string; lastName: string };
  service?: { name: string };
  status: string;
}

interface CalendarViewProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onDateClick: (date: Date) => void;
}

export default function CalendarView({ bookings, onBookingClick, onDateClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const getBookingsForDate = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date).toISOString().split('T')[0];
      return bookingDate === dateStr;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-zinc-700 text-zinc-400 border-zinc-600';
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="admin-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
            <CalendarIcon size={24} className="text-blue-500" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={today}
            className="admin-btn-secondary text-sm"
          >
            Today
          </button>
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-zinc-400" />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-zinc-400" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day headers */}
        {dayNames.map((day) => (
          <div key={day} className="text-center p-2 text-sm font-semibold text-zinc-400">
            {day}
          </div>
        ))}

        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square" />
        ))}

        {/* Calendar days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const dayBookings = getBookingsForDate(day);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={day}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`aspect-square border rounded-lg p-2 cursor-pointer transition-all hover:border-blue-500 ${
                isTodayDate
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-zinc-700 bg-zinc-800/50'
              }`}
              onClick={() => onDateClick(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
            >
              <div className="h-full flex flex-col">
                <div className={`text-sm font-semibold mb-1 ${
                  isTodayDate ? 'text-blue-400' : 'text-white'
                }`}>
                  {day}
                </div>
                <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
                  {dayBookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookingClick(booking);
                      }}
                      className={`text-[10px] p-1 rounded border ${getStatusColor(booking.status)} cursor-pointer hover:scale-105 transition-transform`}
                    >
                      <div className="flex items-center gap-1">
                        <Clock size={8} />
                        <span className="truncate">
                          {booking.time} {booking.clientName || `${booking.client?.firstName} ${booking.client?.lastName}`}
                        </span>
                      </div>
                    </div>
                  ))}
                  {dayBookings.length > 3 && (
                    <div className="text-[10px] text-zinc-400 text-center">
                      +{dayBookings.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-zinc-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          <span className="text-sm text-zinc-400">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-500/50"></div>
          <span className="text-sm text-zinc-400">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
          <span className="text-sm text-zinc-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <span className="text-sm text-zinc-400">Cancelled</span>
        </div>
      </div>
    </div>
  );
}



