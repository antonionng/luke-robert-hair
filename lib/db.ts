// Simple in-memory database for demo purposes
// In production, replace with Supabase or another database solution

import { Contact, Booking, Lead, BlogPost, ChatSession } from './types';

class Database {
  private contacts: Map<string, Contact> = new Map();
  private bookings: Map<string, Booking> = new Map();
  private leads: Map<string, Lead> = new Map();
  private blogPosts: Map<string, BlogPost> = new Map();
  private chatSessions: Map<string, ChatSession> = new Map();

  // Contacts
  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const id = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newContact: Contact = {
      ...contact,
      id,
      createdAt: new Date(),
    };
    this.contacts.set(id, newContact);
    return newContact;
  }

  async getContact(id: string): Promise<Contact | undefined> {
    return this.contacts.get(id);
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }

  // Bookings
  async createBooking(booking: Omit<Booking, 'id'>): Promise<Booking> {
    const id = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newBooking: Booking = { ...booking, id };
    this.bookings.set(id, newBooking);
    return newBooking;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getAllBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async updateBookingStatus(id: string, status: Booking['status']): Promise<void> {
    const booking = this.bookings.get(id);
    if (booking) {
      booking.status = status;
      this.bookings.set(id, booking);
    }
  }

  // Leads
  async createLead(lead: Omit<Lead, 'id' | 'createdAt'>): Promise<Lead> {
    const id = `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newLead: Lead = {
      ...lead,
      id,
      createdAt: new Date(),
    };
    this.leads.set(id, newLead);
    return newLead;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }

  async updateLeadStatus(id: string, status: Lead['status']): Promise<void> {
    const lead = this.leads.get(id);
    if (lead) {
      lead.status = status;
      this.leads.set(id, lead);
    }
  }

  // Blog Posts
  async createBlogPost(post: Omit<BlogPost, 'id'>): Promise<BlogPost> {
    const id = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newPost: BlogPost = { ...post, id };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }

  // Chat Sessions
  async createChatSession(session: Omit<ChatSession, 'id' | 'createdAt'>): Promise<ChatSession> {
    const id = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ChatSession = {
      ...session,
      id,
      createdAt: new Date(),
    };
    this.chatSessions.set(id, newSession);
    return newSession;
  }

  async getChatSession(id: string): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getAllChatSessions(): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values());
  }
}

// Singleton instance
export const db = new Database();
