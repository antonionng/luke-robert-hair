export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Foundation' | 'Advanced' | 'Mentorship' | 'Leadership';
  price: string;
  highlights: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Salon Tips' | 'Education Insights' | 'Product Highlights';
  imageUrl: string;
  publishedAt: Date;
  aiGenerated: boolean;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  type: 'client' | 'education' | 'general';
  createdAt: Date;
}

export interface Booking {
  id: string;
  contactId: string;
  service: string;
  location: 'Cheshire' | 'Berkshire';
  date: Date;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Lead {
  id: string;
  contactId: string;
  course: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  notes?: string;
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  contactId?: string;
  messages: ChatMessage[];
  page: string;
  createdAt: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  location: string;
  rating: number;
}

// ============================================================================
// REFERRAL SYSTEM TYPES
// ============================================================================

export interface ReferralCode {
  id: string;
  code: string;
  referrer_email: string;
  referrer_name: string;
  referrer_phone?: string | null;
  status: 'active' | 'expired' | 'disabled';
  created_at: string;
  expires_at?: string | null;
  total_uses: number;
  max_uses: number;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  notes?: string | null;
  last_used_at?: string | null;
}

export interface ReferralRedemption {
  id: string;
  referral_code_id: string;
  referee_email: string;
  referee_name: string;
  referee_phone?: string | null;
  booking_id?: string | null;
  lead_id?: string | null;
  redeemed_at: string;
  booking_completed: boolean;
  booking_completed_at?: string | null;
  referee_discount_amount?: number | null;
  referrer_credit_amount?: number | null;
  redemption_source: string;
  ip_address?: string | null;
  user_agent?: string | null;
}

export interface ReferralLeaderboard {
  id: string;
  code: string;
  referrer_name: string;
  referrer_email: string;
  total_uses: number;
  max_uses: number;
  status: string;
  created_at: string;
  total_redemptions: number;
  completed_bookings: number;
  total_discounts_given: number;
  total_credits_earned: number;
  conversion_rate: number;
}

// API Request/Response Types
export interface GenerateReferralRequest {
  email: string;
  name: string;
  phone?: string;
}

export interface GenerateReferralResponse {
  success: boolean;
  code?: string;
  shareUrl?: string;
  shareText?: string;
  error?: string;
}

export interface ValidateReferralRequest {
  code: string;
  email: string;
}

export interface ValidateReferralResponse {
  valid: boolean;
  discount?: {
    type: 'fixed' | 'percentage';
    value: number;
    formatted: string; // e.g., "£10 off" or "10% off"
  };
  message: string;
  referralCode?: ReferralCode;
}

export interface ApplyReferralRequest {
  code: string;
  bookingId?: string;
  email: string;
  name: string;
  phone?: string;
}

export interface ApplyReferralResponse {
  success: boolean;
  redemptionId?: string;
  discount?: {
    amount: number;
    type: 'fixed' | 'percentage';
  };
  error?: string;
}

export interface ReferralStatsResponse {
  success: boolean;
  stats?: {
    code: string;
    totalUses: number;
    maxUses: number;
    remainingUses: number;
    totalRedemptions: number;
    completedBookings: number;
    pendingBookings: number;
    totalCreditsEarned: number;
    conversionRate: number;
  };
  recentRedemptions?: Array<{
    refereeName: string;
    redeemedAt: string;
    bookingCompleted: boolean;
  }>;
  error?: string;
}
