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
  location: 'Cheshire' | 'Oxford';
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
