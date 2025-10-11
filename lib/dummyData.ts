// Dummy data for CRM dashboard

export const dummyBookings = [
  {
    id: 'BK001',
    clientName: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    phone: '07700 900123',
    service: 'Precision Cut',
    date: '2025-10-15',
    time: '10:00',
    status: 'confirmed' as const,
    price: 65,
    notes: 'Regular client, prefers layers'
  },
  {
    id: 'BK002',
    clientName: 'Emma Thompson',
    email: 'emma.t@email.com',
    phone: '07700 900456',
    service: 'Colour & Cut',
    date: '2025-10-15',
    time: '14:00',
    status: 'pending' as const,
    price: 150,
    notes: 'First time client, wants balayage'
  },
  {
    id: 'BK003',
    clientName: 'James Wilson',
    email: 'j.wilson@email.com',
    phone: '07700 900789',
    service: 'Restyle',
    date: '2025-10-16',
    time: '11:30',
    status: 'confirmed' as const,
    price: 85,
    notes: 'Growing out previous cut'
  },
  {
    id: 'BK004',
    clientName: 'Lucy Chen',
    email: 'lucy.chen@email.com',
    phone: '07700 900321',
    service: 'Blow Dry',
    date: '2025-10-16',
    time: '16:00',
    status: 'confirmed' as const,
    price: 35,
    notes: 'Wedding guest'
  },
  {
    id: 'BK005',
    clientName: 'Michael Brown',
    email: 'm.brown@email.com',
    phone: '07700 900654',
    service: 'Precision Cut',
    date: '2025-10-17',
    time: '09:00',
    status: 'pending' as const,
    price: 65,
  },
  {
    id: 'BK006',
    clientName: 'Sophie Anderson',
    email: 'sophie.a@email.com',
    phone: '07700 900987',
    service: 'Colour',
    date: '2025-10-12',
    time: '13:00',
    status: 'completed' as const,
    price: 95,
    notes: 'Root touch-up'
  },
  {
    id: 'BK007',
    clientName: 'David Lee',
    email: 'd.lee@email.com',
    phone: '07700 900111',
    service: 'Precision Cut',
    date: '2025-10-11',
    time: '15:30',
    status: 'cancelled' as const,
    price: 65,
    notes: 'Client cancelled - illness'
  },
];

export const dummyLeads = [
  {
    id: 'LD001',
    name: 'Rachel Green',
    email: 'rachel.green@salon.com',
    phone: '07800 123456',
    course: 'Foundation Cutting',
    experienceLevel: 'Junior Stylist (1-2 years)',
    status: 'new' as const,
    source: 'Instagram',
    enquiryDate: '2025-10-09',
    value: 450,
    notes: 'Interested in November dates'
  },
  {
    id: 'LD002',
    name: 'Tom Richards',
    email: 'tom.r@hairco.com',
    phone: '07800 234567',
    course: 'Advanced Cutting',
    experienceLevel: 'Senior Stylist (5+ years)',
    status: 'contacted' as const,
    source: 'Website',
    enquiryDate: '2025-10-08',
    value: 650,
    notes: 'Sent course details, awaiting response'
  },
  {
    id: 'LD003',
    name: 'Amy Foster',
    email: 'amy.foster@gmail.com',
    phone: '07800 345678',
    course: '1-to-1 Mentorship',
    experienceLevel: 'Mid-level Stylist (3-4 years)',
    status: 'qualified' as const,
    source: 'Referral',
    enquiryDate: '2025-10-05',
    value: 700,
    notes: 'Wants to focus on precision cutting techniques'
  },
  {
    id: 'LD004',
    name: 'Marcus Johnson',
    email: 'm.johnson@salon.com',
    phone: '07800 456789',
    course: 'Salon Leaders Programme',
    experienceLevel: 'Salon Owner',
    status: 'qualified' as const,
    source: 'LinkedIn',
    enquiryDate: '2025-10-03',
    value: 3500,
    notes: 'Owns 3 salons, looking to scale'
  },
  {
    id: 'LD005',
    name: 'Hannah Price',
    email: 'hannah.p@email.com',
    phone: '07800 567890',
    course: 'Foundation Cutting',
    experienceLevel: 'Recent Graduate',
    status: 'converted' as const,
    source: 'Google',
    enquiryDate: '2025-09-28',
    value: 450,
    notes: 'Booked for October 20-21'
  },
  {
    id: 'LD006',
    name: 'Chris Martin',
    email: 'chris.m@hairsalon.com',
    phone: '07800 678901',
    course: 'Advanced Cutting',
    experienceLevel: 'Senior Stylist (5+ years)',
    status: 'lost' as const,
    source: 'Instagram',
    enquiryDate: '2025-09-25',
    value: 650,
    notes: 'Chose competitor course due to location'
  },
];

export const dummyChatSessions = [
  {
    id: 'CS001',
    timestamp: '2025-10-10 14:23',
    duration: '3m 45s',
    messages: 8,
    outcome: 'booking' as const,
    page: '/salon'
  },
  {
    id: 'CS002',
    timestamp: '2025-10-10 11:15',
    duration: '2m 12s',
    messages: 5,
    outcome: 'enquiry' as const,
    page: '/education'
  },
  {
    id: 'CS003',
    timestamp: '2025-10-10 09:45',
    duration: '5m 30s',
    messages: 12,
    outcome: 'info' as const,
    page: '/insights'
  },
  {
    id: 'CS004',
    timestamp: '2025-10-09 16:20',
    duration: '1m 05s',
    messages: 3,
    outcome: 'abandoned' as const,
    page: '/'
  },
  {
    id: 'CS005',
    timestamp: '2025-10-09 13:50',
    duration: '4m 18s',
    messages: 9,
    outcome: 'booking' as const,
    page: '/salon'
  },
  {
    id: 'CS006',
    timestamp: '2025-10-09 10:30',
    duration: '6m 22s',
    messages: 15,
    outcome: 'enquiry' as const,
    page: '/education'
  },
];

export const dummyStats = {
  totalContacts: 156,
  pendingBookings: 12,
  activeLeads: 8,
  publishedPosts: 6,
  monthlyRevenue: 12450,
  conversionRate: 68,
  avgBookingValue: 78,
  chatSessions: 47,
};

export const revenueData = [
  { month: 'Apr', revenue: 8200, bookings: 98 },
  { month: 'May', revenue: 9500, bookings: 112 },
  { month: 'Jun', revenue: 10200, bookings: 125 },
  { month: 'Jul', revenue: 9800, bookings: 118 },
  { month: 'Aug', revenue: 11200, bookings: 135 },
  { month: 'Sep', revenue: 12450, bookings: 148 },
];
