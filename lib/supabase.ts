import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gmbsjpmfqxcotjlmlhhk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false
  }
});

// Database schema types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      // Existing tables
      clients: {
        Row: {
          id: string;
          created_at: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
          notes?: string | null;
        };
      };
      bookings: {
        Row: {
          id: string;
          created_at: string;
          client_id: string;
          service_id: string;
          location_id: string;
          start_time: string;
          end_time: string;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes: string | null;
          price: number;
          deposit_paid: boolean;
          deposit_amount: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          client_id: string;
          service_id: string;
          location_id: string;
          start_time: string;
          end_time: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          price: number;
          deposit_paid?: boolean;
          deposit_amount?: number | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          client_id?: string;
          service_id?: string;
          location_id?: string;
          start_time?: string;
          end_time?: string;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          notes?: string | null;
          price?: number;
          deposit_paid?: boolean;
          deposit_amount?: number | null;
        };
      };
      services: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          duration: number;
          price: number;
          requires_deposit: boolean;
          deposit_amount: number | null;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          duration: number;
          price: number;
          requires_deposit?: boolean;
          deposit_amount?: number | null;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          duration?: number;
          price?: number;
          requires_deposit?: boolean;
          deposit_amount?: number | null;
          active?: boolean;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          address: string;
          city: string;
          postcode: string;
          phone: string;
          active: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          address: string;
          city: string;
          postcode: string;
          phone: string;
          active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string;
          city?: string;
          postcode?: string;
          phone?: string;
          active?: boolean;
        };
      };
      // New nurturing engine tables
      leads: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          first_name: string;
          last_name: string;
          email: string;
          phone: string | null;
          course_interest: string | null;
          message: string | null;
          source: string;
          lead_score: number;
          lifecycle_stage: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
          last_contact_date: string | null;
          next_follow_up_date: string | null;
          last_activity_date: string | null;
          tags: string[] | null;
          custom_fields: Json;
          notes: string | null;
          converted_at: string | null;
          conversion_value: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          first_name: string;
          last_name: string;
          email: string;
          phone?: string | null;
          course_interest?: string | null;
          message?: string | null;
          source?: string;
          lead_score?: number;
          lifecycle_stage?: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
          last_contact_date?: string | null;
          next_follow_up_date?: string | null;
          last_activity_date?: string | null;
          tags?: string[] | null;
          custom_fields?: Json;
          notes?: string | null;
          converted_at?: string | null;
          conversion_value?: number | null;
        };
        Update: {
          id?: string;
          updated_at?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string | null;
          course_interest?: string | null;
          message?: string | null;
          source?: string;
          lead_score?: number;
          lifecycle_stage?: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
          last_contact_date?: string | null;
          next_follow_up_date?: string | null;
          last_activity_date?: string | null;
          tags?: string[] | null;
          custom_fields?: Json;
          notes?: string | null;
          converted_at?: string | null;
          conversion_value?: number | null;
        };
      };
      lead_activities: {
        Row: {
          id: string;
          created_at: string;
          lead_id: string;
          activity_type: string;
          activity_data: Json;
          automated: boolean;
          user_agent: string | null;
          ip_address: string | null;
          score_impact: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lead_id: string;
          activity_type: string;
          activity_data?: Json;
          automated?: boolean;
          user_agent?: string | null;
          ip_address?: string | null;
          score_impact?: number;
        };
        Update: {
          id?: string;
          lead_id?: string;
          activity_type?: string;
          activity_data?: Json;
          automated?: boolean;
          user_agent?: string | null;
          ip_address?: string | null;
          score_impact?: number;
        };
      };
      lead_score_history: {
        Row: {
          id: string;
          created_at: string;
          lead_id: string;
          previous_score: number;
          new_score: number;
          score_change: number;
          reason: string;
          activity_id: string | null;
          behavioral_score: number;
          engagement_score: number;
          profile_score: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lead_id: string;
          previous_score: number;
          new_score: number;
          score_change: number;
          reason: string;
          activity_id?: string | null;
          behavioral_score?: number;
          engagement_score?: number;
          profile_score?: number;
        };
        Update: {
          lead_id?: string;
          previous_score?: number;
          new_score?: number;
          score_change?: number;
          reason?: string;
          activity_id?: string | null;
          behavioral_score?: number;
          engagement_score?: number;
          profile_score?: number;
        };
      };
      content_queue: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          slug: string | null;
          excerpt: string | null;
          content: string;
          category: 'Salon Tips' | 'Education Insights' | 'Product Highlights';
          image_url: string | null;
          image_prompt: string | null;
          status: 'queued' | 'generating' | 'review' | 'scheduled' | 'published' | 'rejected';
          scheduled_for: string | null;
          published_at: string | null;
          ai_generated: boolean;
          ai_model: string | null;
          generation_prompt: string | null;
          meta_description: string | null;
          keywords: string[] | null;
          views: number;
          clicks: number;
          leads_generated: number;
          reviewed_by: string | null;
          reviewed_at: string | null;
          rejection_reason: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          slug?: string | null;
          excerpt?: string | null;
          content: string;
          category: 'Salon Tips' | 'Education Insights' | 'Product Highlights';
          image_url?: string | null;
          image_prompt?: string | null;
          status?: 'queued' | 'generating' | 'review' | 'scheduled' | 'published' | 'rejected';
          scheduled_for?: string | null;
          published_at?: string | null;
          ai_generated?: boolean;
          ai_model?: string | null;
          generation_prompt?: string | null;
          meta_description?: string | null;
          keywords?: string[] | null;
          views?: number;
          clicks?: number;
          leads_generated?: number;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
        };
        Update: {
          title?: string;
          slug?: string | null;
          excerpt?: string | null;
          content?: string;
          category?: 'Salon Tips' | 'Education Insights' | 'Product Highlights';
          image_url?: string | null;
          image_prompt?: string | null;
          status?: 'queued' | 'generating' | 'review' | 'scheduled' | 'published' | 'rejected';
          scheduled_for?: string | null;
          published_at?: string | null;
          meta_description?: string | null;
          keywords?: string[] | null;
          views?: number;
          clicks?: number;
          leads_generated?: number;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          rejection_reason?: string | null;
        };
      };
      content_topics: {
        Row: {
          id: string;
          created_at: string;
          topic: string;
          category: string;
          last_used: string | null;
          usage_count: number;
          performance_score: number;
          seasonal: boolean;
          seasonal_months: number[] | null;
          blacklisted: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          topic: string;
          category: string;
          last_used?: string | null;
          usage_count?: number;
          performance_score?: number;
          seasonal?: boolean;
          seasonal_months?: number[] | null;
          blacklisted?: boolean;
        };
        Update: {
          topic?: string;
          category?: string;
          last_used?: string | null;
          usage_count?: number;
          performance_score?: number;
          seasonal?: boolean;
          seasonal_months?: number[] | null;
          blacklisted?: boolean;
        };
      };
      email_logs: {
        Row: {
          id: string;
          created_at: string;
          lead_id: string | null;
          to_email: string;
          to_name: string | null;
          subject: string;
          body_html: string | null;
          body_text: string | null;
          email_type: 'transactional' | 'nurturing' | 'marketing';
          template_name: string | null;
          ai_generated: boolean;
          personalization_data: Json;
          resend_id: string | null;
          status: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
          sent_at: string | null;
          delivered_at: string | null;
          opened_at: string | null;
          clicked_at: string | null;
          bounced_at: string | null;
          open_count: number;
          click_count: number;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lead_id?: string | null;
          to_email: string;
          to_name?: string | null;
          subject: string;
          body_html?: string | null;
          body_text?: string | null;
          email_type: 'transactional' | 'nurturing' | 'marketing';
          template_name?: string | null;
          ai_generated?: boolean;
          personalization_data?: Json;
          resend_id?: string | null;
          status?: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
          sent_at?: string | null;
          delivered_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          bounced_at?: string | null;
          open_count?: number;
          click_count?: number;
          error_message?: string | null;
        };
        Update: {
          lead_id?: string | null;
          to_email?: string;
          to_name?: string | null;
          subject?: string;
          body_html?: string | null;
          body_text?: string | null;
          email_type?: 'transactional' | 'nurturing' | 'marketing';
          template_name?: string | null;
          resend_id?: string | null;
          status?: 'pending' | 'sent' | 'delivered' | 'bounced' | 'failed';
          sent_at?: string | null;
          delivered_at?: string | null;
          opened_at?: string | null;
          clicked_at?: string | null;
          bounced_at?: string | null;
          open_count?: number;
          click_count?: number;
          error_message?: string | null;
        };
      };
      sms_logs: {
        Row: {
          id: string;
          created_at: string;
          lead_id: string | null;
          to_phone: string;
          message: string;
          sms_type: 'transactional' | 'nurturing' | 'marketing';
          twilio_sid: string | null;
          status: 'pending' | 'sent' | 'delivered' | 'failed' | 'undelivered';
          sent_at: string | null;
          delivered_at: string | null;
          replied: boolean;
          reply_message: string | null;
          replied_at: string | null;
          error_code: string | null;
          error_message: string | null;
          opt_in_confirmed: boolean;
        };
        Insert: {
          id?: string;
          created_at?: string;
          lead_id?: string | null;
          to_phone: string;
          message: string;
          sms_type: 'transactional' | 'nurturing' | 'marketing';
          twilio_sid?: string | null;
          status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'undelivered';
          sent_at?: string | null;
          delivered_at?: string | null;
          replied?: boolean;
          reply_message?: string | null;
          replied_at?: string | null;
          error_code?: string | null;
          error_message?: string | null;
          opt_in_confirmed?: boolean;
        };
        Update: {
          lead_id?: string | null;
          to_phone?: string;
          message?: string;
          sms_type?: 'transactional' | 'nurturing' | 'marketing';
          twilio_sid?: string | null;
          status?: 'pending' | 'sent' | 'delivered' | 'failed' | 'undelivered';
          sent_at?: string | null;
          delivered_at?: string | null;
          replied?: boolean;
          reply_message?: string | null;
          replied_at?: string | null;
          error_code?: string | null;
          error_message?: string | null;
          opt_in_confirmed?: boolean;
        };
      };
      automation_queue: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          scheduled_for: string;
          task_type: string;
          payload: Json;
          status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
          processed_at: string | null;
          retry_count: number;
          max_retries: number;
          next_retry_at: string | null;
          error_message: string | null;
          error_stack: string | null;
          priority: number;
          lead_id: string | null;
          execution_time_ms: number | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          scheduled_for: string;
          task_type: string;
          payload: Json;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
          processed_at?: string | null;
          retry_count?: number;
          max_retries?: number;
          next_retry_at?: string | null;
          error_message?: string | null;
          error_stack?: string | null;
          priority?: number;
          lead_id?: string | null;
          execution_time_ms?: number | null;
        };
        Update: {
          updated_at?: string;
          scheduled_for?: string;
          task_type?: string;
          payload?: Json;
          status?: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
          processed_at?: string | null;
          retry_count?: number;
          max_retries?: number;
          next_retry_at?: string | null;
          error_message?: string | null;
          error_stack?: string | null;
          priority?: number;
          lead_id?: string | null;
          execution_time_ms?: number | null;
        };
      };
      nurturing_sequences: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string;
          sequence_type: 'high_intent' | 'warm' | 'cold' | 'reengagement' | 'booking_reminders' | 'cpd_partnership';
          current_step: number;
          total_steps: number;
          status: 'active' | 'paused' | 'completed' | 'cancelled';
          started_at: string;
          next_action_at: string | null;
          completed_at: string | null;
          emails_sent: number;
          emails_opened: number;
          links_clicked: number;
          sms_sent: number;
          sms_replied: number;
          sequence_data: Json;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id: string;
          sequence_type: 'high_intent' | 'warm' | 'cold' | 'reengagement' | 'booking_reminders' | 'cpd_partnership';
          current_step?: number;
          total_steps: number;
          status?: 'active' | 'paused' | 'completed' | 'cancelled';
          started_at?: string;
          next_action_at?: string | null;
          completed_at?: string | null;
          emails_sent?: number;
          emails_opened?: number;
          links_clicked?: number;
          sms_sent?: number;
          sms_replied?: number;
          sequence_data?: Json;
        };
        Update: {
          lead_id?: string;
          sequence_type?: 'high_intent' | 'warm' | 'cold' | 'reengagement' | 'booking_reminders';
          current_step?: number;
          total_steps?: number;
          status?: 'active' | 'paused' | 'completed' | 'cancelled';
          next_action_at?: string | null;
          completed_at?: string | null;
          emails_sent?: number;
          emails_opened?: number;
          links_clicked?: number;
          sms_sent?: number;
          sms_replied?: number;
          sequence_data?: Json;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          created_at: string;
          insight_type: 'lead_intelligence' | 'communication_performance' | 'content_strategy' | 'revenue_optimization' | 'predictive_alert' | 'anomaly_detection';
          title: string;
          description: string;
          actionable: boolean;
          suggested_action: string | null;
          priority: 'low' | 'medium' | 'high' | 'critical';
          data: Json;
          status: 'new' | 'viewed' | 'actioned' | 'dismissed';
          viewed_at: string | null;
          actioned_at: string | null;
          estimated_impact: string | null;
          actual_impact: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          insight_type: 'lead_intelligence' | 'communication_performance' | 'content_strategy' | 'revenue_optimization' | 'predictive_alert' | 'anomaly_detection';
          title: string;
          description: string;
          actionable?: boolean;
          suggested_action?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'critical';
          data?: Json;
          status?: 'new' | 'viewed' | 'actioned' | 'dismissed';
          viewed_at?: string | null;
          actioned_at?: string | null;
          estimated_impact?: string | null;
          actual_impact?: string | null;
        };
        Update: {
          insight_type?: 'lead_intelligence' | 'communication_performance' | 'content_strategy' | 'revenue_optimization' | 'predictive_alert' | 'anomaly_detection';
          title?: string;
          description?: string;
          actionable?: boolean;
          suggested_action?: string | null;
          priority?: 'low' | 'medium' | 'high' | 'critical';
          data?: Json;
          status?: 'new' | 'viewed' | 'actioned' | 'dismissed';
          viewed_at?: string | null;
          actioned_at?: string | null;
          estimated_impact?: string | null;
          actual_impact?: string | null;
        };
      };
      contact_preferences: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          lead_id: string | null;
          email_enabled: boolean;
          email_frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
          sms_enabled: boolean;
          sms_opt_in_date: string | null;
          content_categories: string[] | null;
          marketing_enabled: boolean;
          gdpr_consent: boolean;
          gdpr_consent_date: string | null;
          unsubscribed: boolean;
          unsubscribed_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          lead_id?: string | null;
          email_enabled?: boolean;
          email_frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly';
          sms_enabled?: boolean;
          sms_opt_in_date?: string | null;
          content_categories?: string[] | null;
          marketing_enabled?: boolean;
          gdpr_consent?: boolean;
          gdpr_consent_date?: string | null;
          unsubscribed?: boolean;
          unsubscribed_at?: string | null;
        };
        Update: {
          lead_id?: string | null;
          email_enabled?: boolean;
          email_frequency?: 'immediate' | 'daily' | 'weekly' | 'monthly';
          sms_enabled?: boolean;
          sms_opt_in_date?: string | null;
          content_categories?: string[] | null;
          marketing_enabled?: boolean;
          gdpr_consent?: boolean;
          gdpr_consent_date?: string | null;
          unsubscribed?: boolean;
          unsubscribed_at?: string | null;
        };
      };
    };
  };
}

// Helper functions for common operations
export const db = {
  // ===== CLIENT OPERATIONS =====
  async getClient(id: string) {
    return supabase.from('clients').select('*').eq('id', id).single();
  },
  
  async createClient(client: Database['public']['Tables']['clients']['Insert']) {
    return supabase.from('clients').insert(client).select().single();
  },
  
  async getAllClients() {
    return supabase.from('clients').select('*').order('created_at', { ascending: false });
  },
  
  // ===== BOOKING OPERATIONS =====
  async createBooking(booking: Database['public']['Tables']['bookings']['Insert']) {
    return supabase.from('bookings').insert(booking).select().single();
  },
  
  async getBookingsInRange(start: Date, end: Date) {
    return supabase
      .from('bookings')
      .select('*, clients(*), services(*), locations(*)')
      .gte('start_time', start.toISOString())
      .lte('end_time', end.toISOString());
  },
  
  async getAllBookings() {
    return supabase
      .from('bookings')
      .select('*, clients(*), services(*), locations(*)')
      .order('start_time', { ascending: false });
  },

  async updateBookingStatus(id: string, status: Database['public']['Tables']['bookings']['Row']['status']) {
    return supabase.from('bookings').update({ status }).eq('id', id).select().single();
  },
  
  // ===== SERVICE OPERATIONS =====
  async getServices(activeOnly: boolean = true) {
    let query = supabase.from('services').select('*');
    if (activeOnly) {
      query = query.eq('active', true);
    }
    return query;
  },
  
  // ===== LOCATION OPERATIONS =====
  async getLocations(activeOnly: boolean = true) {
    let query = supabase.from('locations').select('*');
    if (activeOnly) {
      query = query.eq('active', true);
    }
    return query;
  },

  // ===== LEAD OPERATIONS =====
  async createLead(lead: Database['public']['Tables']['leads']['Insert']) {
    return supabase.from('leads').insert(lead).select().single();
  },

  async getLead(id: string) {
    return supabase.from('leads').select('*').eq('id', id).single();
  },

  async getLeadByEmail(email: string) {
    return supabase.from('leads').select('*').eq('email', email).single();
  },

  async getAllLeads() {
    return supabase.from('leads').select('*').order('created_at', { ascending: false });
  },

  async getLeadsByStage(stage: Database['public']['Tables']['leads']['Row']['lifecycle_stage']) {
    return supabase.from('leads').select('*').eq('lifecycle_stage', stage).order('lead_score', { ascending: false });
  },

  async getHotLeads(threshold: number = 70) {
    return supabase.from('leads').select('*').gte('lead_score', threshold).order('lead_score', { ascending: false });
  },

  async updateLead(id: string, updates: Database['public']['Tables']['leads']['Update']) {
    return supabase.from('leads').update(updates).eq('id', id).select().single();
  },

  async updateLeadScore(id: string, score: number) {
    return supabase.from('leads').update({ lead_score: score }).eq('id', id).select().single();
  },

  async updateLeadStage(id: string, stage: Database['public']['Tables']['leads']['Row']['lifecycle_stage']) {
    return supabase.from('leads').update({ lifecycle_stage: stage }).eq('id', id).select().single();
  },

  async getLeadsDueForFollowUp() {
    return supabase
      .from('leads')
      .select('*')
      .lte('next_follow_up_date', new Date().toISOString())
      .eq('lifecycle_stage', 'nurturing')
      .order('next_follow_up_date', { ascending: true });
  },

  // ===== LEAD ACTIVITY OPERATIONS =====
  async createActivity(activity: Database['public']['Tables']['lead_activities']['Insert']) {
    return supabase.from('lead_activities').insert(activity).select().single();
  },

  async getLeadActivities(leadId: string) {
    return supabase
      .from('lead_activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },

  // ===== LEAD SCORE HISTORY =====
  async createScoreHistory(history: Database['public']['Tables']['lead_score_history']['Insert']) {
    return supabase.from('lead_score_history').insert(history).select().single();
  },

  async getLeadScoreHistory(leadId: string) {
    return supabase
      .from('lead_score_history')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },

  // ===== CONTENT QUEUE OPERATIONS =====
  async createContent(content: Database['public']['Tables']['content_queue']['Insert']) {
    return supabase.from('content_queue').insert(content).select().single();
  },

  async getContentByStatus(status: Database['public']['Tables']['content_queue']['Row']['status']) {
    return supabase.from('content_queue').select('*').eq('status', status).order('created_at', { ascending: false });
  },

  async getPublishedContent() {
    return supabase
      .from('content_queue')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false });
  },

  async updateContentStatus(id: string, status: Database['public']['Tables']['content_queue']['Row']['status']) {
    return supabase.from('content_queue').update({ status }).eq('id', id).select().single();
  },

  async getContentForReview() {
    return supabase.from('content_queue').select('*').eq('status', 'review').order('created_at', { ascending: false });
  },

  // ===== CONTENT TOPICS =====
  async getTopicsByCategory(category: string) {
    return supabase
      .from('content_topics')
      .select('*')
      .eq('category', category)
      .eq('blacklisted', false)
      .order('performance_score', { ascending: false });
  },

  async getSeasonalTopics(month: number) {
    return supabase
      .from('content_topics')
      .select('*')
      .eq('seasonal', true)
      .contains('seasonal_months', [month])
      .eq('blacklisted', false);
  },

  async updateTopicUsage(topicId: string) {
    return supabase.rpc('increment_topic_usage', { topic_id: topicId });
  },

  // ===== EMAIL LOGS =====
  async createEmailLog(log: Database['public']['Tables']['email_logs']['Insert']) {
    return supabase.from('email_logs').insert(log).select().single();
  },

  async updateEmailStatus(id: string, updates: Database['public']['Tables']['email_logs']['Update']) {
    return supabase.from('email_logs').update(updates).eq('id', id).select().single();
  },

  async getEmailLogsByLead(leadId: string) {
    return supabase
      .from('email_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },

  async getRecentEmails(limit: number = 50) {
    return supabase.from('email_logs').select('*').order('created_at', { ascending: false }).limit(limit);
  },

  // ===== SMS LOGS =====
  async createSMSLog(log: Database['public']['Tables']['sms_logs']['Insert']) {
    return supabase.from('sms_logs').insert(log).select().single();
  },

  async updateSMSStatus(id: string, updates: Database['public']['Tables']['sms_logs']['Update']) {
    return supabase.from('sms_logs').update(updates).eq('id', id).select().single();
  },

  async getSMSLogsByLead(leadId: string) {
    return supabase
      .from('sms_logs')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },

  // ===== AUTOMATION QUEUE =====
  async queueTask(task: Database['public']['Tables']['automation_queue']['Insert']) {
    return supabase.from('automation_queue').insert(task).select().single();
  },

  async getPendingTasks(limit: number = 100) {
    return supabase
      .from('automation_queue')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', new Date().toISOString())
      .order('priority', { ascending: true })
      .order('scheduled_for', { ascending: true })
      .limit(limit);
  },

  async updateTaskStatus(id: string, status: Database['public']['Tables']['automation_queue']['Row']['status'], error?: string) {
    const updates: Database['public']['Tables']['automation_queue']['Update'] = {
      status,
      processed_at: new Date().toISOString(),
    };
    if (error) {
      updates.error_message = error;
    }
    return supabase.from('automation_queue').update(updates).eq('id', id).select().single();
  },

  async retryTask(id: string) {
    return supabase
      .from('automation_queue')
      .update({
        status: 'pending',
        retry_count: supabase.rpc('increment', { row_id: id, column_name: 'retry_count' }),
        next_retry_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // Retry in 1 hour
      })
      .eq('id', id)
      .select()
      .single();
  },

  // ===== NURTURING SEQUENCES =====
  async createSequence(sequence: Database['public']['Tables']['nurturing_sequences']['Insert']) {
    return supabase.from('nurturing_sequences').insert(sequence).select().single();
  },

  async getActiveSequences() {
    return supabase
      .from('nurturing_sequences')
      .select('*, leads(*)')
      .eq('status', 'active')
      .order('next_action_at', { ascending: true });
  },

  async getSequencesByLead(leadId: string) {
    return supabase
      .from('nurturing_sequences')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });
  },

  async updateSequence(id: string, updates: Database['public']['Tables']['nurturing_sequences']['Update']) {
    return supabase.from('nurturing_sequences').update(updates).eq('id', id).select().single();
  },

  async pauseSequence(id: string) {
    return supabase.from('nurturing_sequences').update({ status: 'paused' }).eq('id', id).select().single();
  },

  async completeSequence(id: string) {
    return supabase
      .from('nurturing_sequences')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();
  },

  // ===== AI INSIGHTS =====
  async createInsight(insight: Database['public']['Tables']['ai_insights']['Insert']) {
    return supabase.from('ai_insights').insert(insight).select().single();
  },

  async getNewInsights() {
    return supabase
      .from('ai_insights')
      .select('*')
      .eq('status', 'new')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });
  },

  async getInsightsByType(type: Database['public']['Tables']['ai_insights']['Row']['insight_type']) {
    return supabase.from('ai_insights').select('*').eq('insight_type', type).order('created_at', { ascending: false });
  },

  async updateInsightStatus(id: string, status: Database['public']['Tables']['ai_insights']['Row']['status']) {
    return supabase.from('ai_insights').update({ status, viewed_at: new Date().toISOString() }).eq('id', id).select().single();
  },

  // ===== CONTACT PREFERENCES =====
  async createPreferences(prefs: Database['public']['Tables']['contact_preferences']['Insert']) {
    return supabase.from('contact_preferences').insert(prefs).select().single();
  },

  async getPreferences(leadId: string) {
    return supabase.from('contact_preferences').select('*').eq('lead_id', leadId).single();
  },

  async updatePreferences(leadId: string, updates: Database['public']['Tables']['contact_preferences']['Update']) {
    return supabase.from('contact_preferences').update(updates).eq('lead_id', leadId).select().single();
  },

  async unsubscribe(leadId: string) {
    return supabase
      .from('contact_preferences')
      .update({
        unsubscribed: true,
        unsubscribed_at: new Date().toISOString(),
        email_enabled: false,
        sms_enabled: false,
      })
      .eq('lead_id', leadId)
      .select()
      .single();
  },
};
