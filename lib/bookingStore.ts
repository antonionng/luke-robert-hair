import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingState, Service, Location, ClientDetails, AIConsultation, Booking } from './bookingTypes';

interface BookingStore extends BookingState {
  // Actions
  setService: (service: Service) => void;
  setLocation: (location: Location) => void;
  setDateTime: (date: string, time: string) => void;
  setClient: (client: Partial<ClientDetails>) => void;
  setConsultation: (consultation: AIConsultation) => void;
  setRecurring: (isRecurring: boolean, pattern?: Booking['recurringPattern']) => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (step: number) => void;
  reset: () => void;
}

const initialState: BookingState = {
  currentStep: 1,
  service: null,
  location: null,
  date: null,
  time: null,
  client: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    isNewClient: true,
    notes: '',
  },
  consultation: null,
  isRecurring: false,
  recurringPattern: null,
};

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      ...initialState,

      setService: (service) => set({ service }),
      
      setLocation: (location) => set({ location }),
      
      setDateTime: (date, time) => set({ date, time }),
      
      setClient: (client) => set((state) => ({
        client: { ...state.client, ...client }
      })),
      
      setConsultation: (consultation) => set({ consultation }),
      
      setRecurring: (isRecurring, pattern) => set({
        isRecurring,
        recurringPattern: pattern || null,
      }),
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 7)
      })),
      
      previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'booking-storage',
      partialize: (state) => ({
        service: state.service,
        location: state.location,
        date: state.date,
        time: state.time,
        client: state.client,
        consultation: state.consultation,
        isRecurring: state.isRecurring,
        recurringPattern: state.recurringPattern,
      }),
    }
  )
);

// In-memory bookings store (will be replaced with database)
let bookingsStore: Booking[] = [];

export function getAllBookings(): Booking[] {
  return bookingsStore;
}

export function getBookingById(id: string): Booking | undefined {
  return bookingsStore.find(b => b.id === id);
}

export function getBookingsByEmail(email: string): Booking[] {
  return bookingsStore.filter(b => b.client.email === email);
}

export function addBooking(booking: Booking): void {
  bookingsStore.push(booking);
}

export function updateBooking(id: string, updates: Partial<Booking>): void {
  const index = bookingsStore.findIndex(b => b.id === id);
  if (index !== -1) {
    bookingsStore[index] = { ...bookingsStore[index], ...updates, updatedAt: new Date() };
  }
}

export function cancelBooking(id: string, reason: string): void {
  updateBooking(id, {
    status: 'cancelled',
    cancellationReason: reason,
    cancelledAt: new Date(),
  });
}

export function getBookingsForDate(date: string, locationId?: string): Booking[] {
  return bookingsStore.filter(b => {
    const matchesDate = b.date === date;
    const matchesLocation = !locationId || b.location.id === locationId;
    const isActive = b.status !== 'cancelled';
    return matchesDate && matchesLocation && isActive;
  });
}

// Initialize with some dummy bookings for testing
bookingsStore = [
  {
    id: 'BK-TEST-001',
    service: {
      id: 'precision-cut',
      name: 'Precision Cut',
      price: 65,
      duration: 60,
      description: 'Perfect for maintaining shape',
      requiresDeposit: false,
      depositAmount: 0,
    },
    location: {
      id: 'altrincham',
      name: 'Altrincham',
      salonName: 'Fixx Salon',
      address: '1b Lloyd St',
      postcode: 'WA14 2DD',
      phone: '0161 123 4567',
      coordinates: { lat: 53.3876, lng: -2.3520 },
      parkingInfo: 'Pay & Display parking available',
    },
    date: '2025-10-15',
    time: '10:00',
    endTime: '11:00',
    client: {
      firstName: 'Test',
      lastName: 'Client',
      email: 'test@example.com',
      phone: '07700 900123',
      isNewClient: true,
    },
    depositRequired: false,
    depositAmount: 0,
    depositPaid: false,
    totalPrice: 65,
    isRecurring: false,
    status: 'confirmed',
    createdAt: new Date(),
    updatedAt: new Date(),
    confirmationCode: 'TEST1234',
    reminderSent: false,
  },
];
