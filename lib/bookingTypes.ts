// Booking System Types

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number; // minutes
  description: string;
  requiresDeposit: boolean;
  depositAmount: number;
}

export interface Location {
  id: 'altrincham' | 'knutsford' | 'reading';
  name: string;
  salonName: string;
  address: string;
  postcode: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  parkingInfo: string;
}

export interface WorkingDay {
  location: 'altrincham' | 'knutsford' | 'reading';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  lunchBreak?: {
    start: string;
    end: string;
  };
}

export interface BlockedDate {
  date: string; // "2025-10-15"
  reason: string; // "Holiday", "Training", etc.
  allDay: boolean;
  timeSlots?: string[]; // If not all day, specific slots blocked
}

export interface TimeSlot {
  time: string; // "14:15"
  available: boolean;
  reason?: string; // If not available: "Booked", "Lunch", "Blocked"
}

export interface ClientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isNewClient: boolean;
  notes?: string;
  allergies?: string;
  previousVisits?: number;
  lastVisitDate?: string;
}

export interface AIConsultation {
  messages: {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }[];
  recommendations: string[];
  concerns: string[];
  completed: boolean;
}

export interface Booking {
  id: string;
  
  // Service Details
  service: Service;
  
  // Location & Time
  location: Location;
  date: string; // "2025-10-15"
  time: string; // "14:15"
  endTime: string; // Calculated from duration
  
  // Client
  client: ClientDetails;
  
  // AI Consultation
  consultation?: AIConsultation;
  
  // Payment
  depositRequired: boolean;
  depositAmount: number;
  depositPaid: boolean;
  depositPaymentId?: string;
  totalPrice: number;
  
  // Recurring
  isRecurring: boolean;
  recurringPattern?: {
    frequency: 'weekly' | 'biweekly' | 'monthly';
    endDate?: string;
    occurrences?: number;
  };
  parentBookingId?: string; // If part of recurring series
  
  // Status
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  cancellationReason?: string;
  cancelledAt?: Date;
  rescheduledFrom?: string; // Original booking ID
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  confirmationCode: string;
  reminderSent: boolean;
  
  // Admin notes
  adminNotes?: string;
}

export interface BookingState {
  currentStep: number;
  service: Service | null;
  location: Location | null;
  date: string | null;
  time: string | null;
  client: Partial<ClientDetails>;
  consultation: AIConsultation | null;
  isRecurring: boolean;
  recurringPattern: Booking['recurringPattern'] | null;
}

// Schedule configuration
export interface ScheduleConfig {
  workingDays: WorkingDay[];
  blockedDates: BlockedDate[];
  bookingBuffer: number; // hours - minimum notice required
  maxAdvanceBooking: number; // weeks - how far ahead can book
  slotInterval: number; // minutes between slot start times
}
