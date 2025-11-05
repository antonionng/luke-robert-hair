'use client';

import { useMemo } from 'react';

interface TimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  startHour?: number;
  endHour?: number;
  interval?: number; // in minutes
  required?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export default function TimeSelector({
  value,
  onChange,
  startHour = 9,
  endHour = 18,
  interval = 15,
  required = false,
  className = '',
  placeholder = 'Select time',
  disabled = false,
}: TimeSelectorProps) {
  // Generate time slots
  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    const startMinutes = startHour * 60;
    const endMinutes = endHour * 60;

    for (let minutes = startMinutes; minutes <= endMinutes; minutes += interval) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      const timeStr = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      slots.push(timeStr);
    }

    return slots;
  }, [startHour, endHour, interval]);

  // Format time for display (e.g., "09:00" -> "9:00 AM")
  const formatDisplayTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      disabled={disabled}
      className={className}
    >
      <option value="">{placeholder}</option>
      {timeSlots.map((time) => (
        <option key={time} value={time}>
          {formatDisplayTime(time)}
        </option>
      ))}
    </select>
  );
}




