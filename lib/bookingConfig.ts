import { Service, Location, WorkingDay, BlockedDate, ScheduleConfig } from './bookingTypes';

// Services Configuration
export const SERVICES: Service[] = [
  {
    id: 'precision-cut',
    name: 'Precision Cut',
    price: 79,
    duration: 60,
    description: 'Perfect for maintaining shape and creating wearable styles that last 8-10 weeks',
    requiresDeposit: false,
    depositAmount: 0,
  },
  {
    id: 'ladies-restyle',
    name: 'Ladies Restyle',
    price: 89,
    duration: 90,
    description: 'Significant changes, new looks, and transformations',
    requiresDeposit: true,
    depositAmount: 25,
  },
  {
    id: 'gents-restyle',
    name: 'Gents Restyle',
    price: 49,
    duration: 60,
    description: 'Professional restyle for gentlemen',
    requiresDeposit: false,
    depositAmount: 0,
  },
];

// Locations Configuration
export const LOCATIONS: Location[] = [
  {
    id: 'altrincham',
    name: 'Altrincham',
    salonName: 'Fixx Salon',
    address: '1b Lloyd St',
    postcode: 'WA14 2DD',
    phone: '0161 123 4567',
    coordinates: {
      lat: 53.3876,
      lng: -2.3520,
    },
    parkingInfo: 'Pay & Display parking available on Lloyd Street and nearby car parks',
  },
  {
    id: 'knutsford',
    name: 'Knutsford',
    salonName: 'Urban Sanctuary',
    address: '29 King St',
    postcode: 'WA16 6DW',
    phone: '01565 123 456',
    coordinates: {
      lat: 53.3031,
      lng: -2.3714,
    },
    parkingInfo: 'Free parking available on King Street and nearby streets',
  },
  {
    id: 'reading',
    name: 'Reading (Caversham)',
    salonName: 'Alternate Salon',
    address: '19 Church Street, Caversham',
    postcode: 'RG4 8BA',
    phone: '0118 123 4567',
    coordinates: {
      lat: 51.4668,
      lng: -0.9782,
    },
    parkingInfo: 'Street parking available on Church Street',
  },
];

// Working Days Configuration
// Week 1-3: Altrincham (Tue/Wed), Knutsford (Fri/Sat)
// Week 4: Reading (Mon-Sat)
export const WORKING_DAYS: WorkingDay[] = [
  // Altrincham - Tuesdays
  {
    location: 'altrincham',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Altrincham - Wednesdays
  {
    location: 'altrincham',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Knutsford - Fridays
  {
    location: 'knutsford',
    dayOfWeek: 5, // Friday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Knutsford - Saturdays
  {
    location: 'knutsford',
    dayOfWeek: 6, // Saturday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Monday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 1, // Monday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Tuesday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 2, // Tuesday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Wednesday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 3, // Wednesday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Thursday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 4, // Thursday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Friday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 5, // Friday
    startTime: '09:00',
    endTime: '18:00',
  },
  // Reading - Saturday (Week 4 only)
  {
    location: 'reading',
    dayOfWeek: 6, // Saturday
    startTime: '09:00',
    endTime: '18:00',
  },
];

// Blocked Dates (Holidays, Training, etc.)
export const BLOCKED_DATES: BlockedDate[] = [
  {
    date: '2025-12-25',
    reason: 'Christmas Day',
    allDay: true,
  },
  {
    date: '2025-12-26',
    reason: 'Boxing Day',
    allDay: true,
  },
  {
    date: '2026-01-01',
    reason: 'New Year\'s Day',
    allDay: true,
  },
  // Add more blocked dates as needed
];

// Schedule Configuration
export const SCHEDULE_CONFIG: ScheduleConfig = {
  workingDays: WORKING_DAYS,
  blockedDates: BLOCKED_DATES,
  bookingBuffer: 24, // 24 hours minimum notice
  maxAdvanceBooking: 12, // 12 weeks ahead
  slotInterval: 15, // 15-minute intervals
};

// Helper function to determine if a date is in week 4 of the month
export function isWeek4OfMonth(date: Date): boolean {
  const dayOfMonth = date.getDate();
  return dayOfMonth >= 22 && dayOfMonth <= 28;
}

// Helper function to get available locations for a specific date
export function getAvailableLocations(date: Date): Location[] {
  const dayOfWeek = date.getDay();
  const isWeek4 = isWeek4OfMonth(date);
  
  if (isWeek4) {
    // Week 4: Only Reading available
    return LOCATIONS.filter(loc => loc.id === 'reading');
  } else {
    // Weeks 1-3: Altrincham (Tue/Wed) and Knutsford (Fri/Sat)
    if (dayOfWeek === 2 || dayOfWeek === 3) {
      return LOCATIONS.filter(loc => loc.id === 'altrincham');
    } else if (dayOfWeek === 5 || dayOfWeek === 6) {
      return LOCATIONS.filter(loc => loc.id === 'knutsford');
    }
  }
  
  return [];
}

// Helper function to check if a specific date/location combination is available
export function isDateLocationAvailable(date: Date, locationId: string): boolean {
  const dayOfWeek = date.getDay();
  const isWeek4 = isWeek4OfMonth(date);
  
  // Check if date is blocked
  const dateStr = date.toISOString().split('T')[0];
  const isBlocked = BLOCKED_DATES.some(blocked => blocked.date === dateStr && blocked.allDay);
  if (isBlocked) return false;
  
  // Check week 4 logic
  if (isWeek4) {
    return locationId === 'reading' && dayOfWeek >= 1 && dayOfWeek <= 6;
  }
  
  // Weeks 1-3 logic
  if (locationId === 'altrincham') {
    return dayOfWeek === 2 || dayOfWeek === 3; // Tue/Wed
  }
  if (locationId === 'knutsford') {
    return dayOfWeek === 5 || dayOfWeek === 6; // Fri/Sat
  }
  
  return false;
}
