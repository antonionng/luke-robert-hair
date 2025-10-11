'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useBookingStore, getAllBookings } from '@/lib/bookingStore';
import { generateTimeSlots, formatDate, formatTime, meetsMinimumNotice, getAvailableDatesForLocation } from '@/lib/bookingUtils';
import { Calendar, Clock, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';

export default function DateTimeSelection() {
  const { service, location, date, time, setDateTime, nextStep, previousStep } = useBookingStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(date ? new Date(date) : null);
  const [selectedTime, setSelectedTime] = useState<string | null>(time);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (location) {
      const dates = getAvailableDatesForLocation(location.id, 8);
      setAvailableDates(dates);
    }
  }, [location]);

  useEffect(() => {
    if (selectedDate && service && location) {
      const existingBookings = getAllBookings();
      const slots = generateTimeSlots(selectedDate, service, location.id, existingBookings);
      setTimeSlots(slots);
    }
  }, [selectedDate, service, location]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleContinue = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      setDateTime(dateStr, selectedTime);
      nextStep();
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date || !location) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) return false;
    
    return availableDates.some(d => 
      d.getDate() === date.getDate() &&
      d.getMonth() === date.getMonth() &&
      d.getFullYear() === date.getFullYear()
    );
  };

  const isDateSelected = (date: Date | null) => {
    if (!date || !selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const monthDays = getDaysInMonth(currentMonth);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
      <div className="mb-8">
        <h2 className="text-2xl font-playfair font-light mb-2">Choose Date & Time</h2>
        <p className="text-graphite/70">Select your preferred appointment slot</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-graphite flex items-center gap-2">
              <Calendar size={20} className="text-sage" />
              Select Date
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-sage/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <span className="text-sm font-medium min-w-[120px] text-center">
                {currentMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-sage/10 rounded-lg transition-colors"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div className="border border-mist rounded-xl p-4">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {weekDays.map(day => (
                <div key={day} className="text-center text-xs font-medium text-graphite/60 py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((day, index) => {
                const available = isDateAvailable(day);
                const selected = isDateSelected(day);
                
                return (
                  <button
                    key={index}
                    onClick={() => day && available && handleDateSelect(day)}
                    disabled={!day || !available}
                    className={`aspect-square rounded-lg text-sm font-medium transition-all ${
                      !day
                        ? 'invisible'
                        : selected
                        ? 'bg-sage text-white'
                        : available
                        ? 'hover:bg-sage/10 text-graphite'
                        : 'text-graphite/20 cursor-not-allowed'
                    }`}
                  >
                    {day?.getDate()}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-blue-900">
              <strong>Location:</strong> {location?.salonName}, {location?.name}
            </p>
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <h3 className="font-semibold text-graphite mb-4 flex items-center gap-2">
            <Clock size={20} className="text-sage" />
            Select Time
          </h3>

          {!selectedDate ? (
            <div className="border border-mist rounded-xl p-8 text-center">
              <Calendar size={48} className="mx-auto text-graphite/20 mb-4" />
              <p className="text-graphite/60">Please select a date first</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="border border-mist rounded-xl p-8 text-center">
              <AlertCircle size={48} className="mx-auto text-orange-500 mb-4" />
              <p className="text-graphite/60">No available slots for this date</p>
              <p className="text-sm text-graphite/40 mt-2">Please choose another date</p>
            </div>
          ) : (
            <div className="border border-mist rounded-xl p-4 max-h-[400px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => {
                  const isAvailable = slot.available && meetsMinimumNotice(selectedDate, slot.time);
                  const isSelected = selectedTime === slot.time;
                  
                  return (
                    <button
                      key={slot.time}
                      onClick={() => isAvailable && handleTimeSelect(slot.time)}
                      disabled={!isAvailable}
                      className={`p-3 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? 'bg-sage text-white'
                          : isAvailable
                          ? 'hover:bg-sage/10 text-graphite border border-mist'
                          : 'text-graphite/30 bg-gray-50 cursor-not-allowed'
                      }`}
                    >
                      {formatTime(slot.time)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-sage/10 rounded-xl"
            >
              <p className="text-sm font-medium text-graphite mb-1">Selected Appointment:</p>
              <p className="text-sm text-graphite/70">{formatDate(selectedDate)}</p>
              <p className="text-sm text-graphite/70">{formatTime(selectedTime)}</p>
              <p className="text-xs text-graphite/60 mt-2">Duration: {service?.duration} minutes</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          onClick={previousStep}
          className="btn-secondary flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedDate || !selectedTime}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
