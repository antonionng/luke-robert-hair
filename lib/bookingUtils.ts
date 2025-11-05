import { Service, TimeSlot, Booking } from './bookingTypes';
import { SCHEDULE_CONFIG, isDateLocationAvailable } from './bookingConfig';

// Generate time slots for a given date and service
export function generateTimeSlots(
  date: Date,
  service: Service,
  locationId: string,
  existingBookings: Booking[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const workingDay = SCHEDULE_CONFIG.workingDays.find(
    wd => wd.location === locationId && wd.dayOfWeek === date.getDay()
  );

  if (!workingDay) return slots;

  const [startHour, startMin] = workingDay.startTime.split(':').map(Number);
  const [endHour, endMin] = workingDay.endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  const serviceDuration = service.duration;

  // Generate slots at 15-minute intervals
  for (let minutes = startMinutes; minutes + serviceDuration <= endMinutes; minutes += SCHEDULE_CONFIG.slotInterval) {
    const hour = Math.floor(minutes / 60);
    const min = minutes % 60;
    const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

    // Check if slot is available
    const isAvailable = !isSlotBooked(date, timeStr, serviceDuration, existingBookings);

    slots.push({
      time: timeStr,
      available: isAvailable,
      reason: isAvailable ? undefined : 'Booked',
    });
  }

  return slots;
}

// Check if a time slot is already booked
function isSlotBooked(
  date: Date,
  time: string,
  duration: number,
  bookings: Booking[]
): boolean {
  const dateStr = date.toISOString().split('T')[0];
  const [hour, min] = time.split(':').map(Number);
  const slotStart = hour * 60 + min;
  const slotEnd = slotStart + duration;

  return bookings.some(booking => {
    if (booking.date !== dateStr || booking.status === 'cancelled') return false;

    const [bookingHour, bookingMin] = booking.time.split(':').map(Number);
    const bookingStart = bookingHour * 60 + bookingMin;
    const bookingEnd = bookingStart + booking.service.duration;

    // Check for overlap
    return (slotStart < bookingEnd && slotEnd > bookingStart);
  });
}

// Calculate end time based on start time and duration
export function calculateEndTime(startTime: string, duration: number): string {
  const [hour, min] = startTime.split(':').map(Number);
  const totalMinutes = hour * 60 + min + duration;
  const endHour = Math.floor(totalMinutes / 60);
  const endMin = totalMinutes % 60;
  return `${endHour.toString().padStart(2, '0')}:${endMin.toString().padStart(2, '0')}`;
}

// Generate confirmation code
export function generateConfirmationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Check if booking meets minimum notice requirement
export function meetsMinimumNotice(date: Date, time: string): boolean {
  const [hour, min] = time.split(':').map(Number);
  const bookingDateTime = new Date(date);
  bookingDateTime.setHours(hour, min, 0, 0);

  const now = new Date();
  const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilBooking >= SCHEDULE_CONFIG.bookingBuffer;
}

// Check if date is within allowed booking window
export function isWithinBookingWindow(date: Date): boolean {
  const now = new Date();
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (SCHEDULE_CONFIG.maxAdvanceBooking * 7));

  return date >= now && date <= maxDate;
}

// Get next available date for a location
export function getNextAvailableDate(locationId: string, startDate: Date = new Date()): Date | null {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + (SCHEDULE_CONFIG.maxAdvanceBooking * 7));

  let currentDate = new Date(startDate);
  currentDate.setHours(0, 0, 0, 0);

  while (currentDate <= maxDate) {
    if (isDateLocationAvailable(currentDate, locationId)) {
      return currentDate;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return null;
}

// Format date for display
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Format time for display
export function formatTime(time: string): string {
  if (!time) return '';
  const parts = time.split(':');
  if (parts.length < 2) return time;
  
  const hour = parseInt(parts[0], 10);
  const min = parseInt(parts[1], 10);
  
  if (isNaN(hour) || isNaN(min)) return time;
  
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${min.toString().padStart(2, '0')} ${period}`;
}

// Generate recurring booking dates
export function generateRecurringDates(
  startDate: Date,
  frequency: 'weekly' | 'biweekly' | 'monthly',
  occurrences: number
): Date[] {
  const dates: Date[] = [new Date(startDate)];
  let currentDate = new Date(startDate);

  for (let i = 1; i < occurrences; i++) {
    switch (frequency) {
      case 'weekly':
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case 'biweekly':
        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 14);
        break;
      case 'monthly':
        currentDate = new Date(currentDate);
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    dates.push(new Date(currentDate));
  }

  return dates;
}

// Validate phone number (UK format)
export function validatePhoneNumber(phone: string): boolean {
  const ukPhoneRegex = /^(?:(?:\(?(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?(?:\(?0\)?[\s-]?)?)|(?:\(?0))(?:(?:\d{5}\)?[\s-]?\d{4,5})|(?:\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3}))|(?:\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4})|(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}))(?:[\s-]?(?:x|ext\.?|\#)\d{3,4})?$/;
  return ukPhoneRegex.test(phone.replace(/\s/g, ''));
}

// Validate email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Calculate deposit amount
export function calculateDeposit(service: Service): number {
  return service.requiresDeposit ? service.depositAmount : 0;
}

// Check if cancellation is within policy (24 hours)
export function canCancelBooking(bookingDate: string, bookingTime: string): boolean {
  const [hour, min] = bookingTime.split(':').map(Number);
  const bookingDateTime = new Date(bookingDate);
  bookingDateTime.setHours(hour, min, 0, 0);

  const now = new Date();
  const hoursUntilBooking = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

  return hoursUntilBooking >= 24;
}

// Get available dates for next N weeks
export function getAvailableDatesForLocation(
  locationId: string,
  weeksAhead: number = 4
): Date[] {
  const dates: Date[] = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + (weeksAhead * 7));

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (isDateLocationAvailable(currentDate, locationId)) {
      dates.push(new Date(currentDate));
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

// Export this function from bookingConfig
export { isDateLocationAvailable } from './bookingConfig';
