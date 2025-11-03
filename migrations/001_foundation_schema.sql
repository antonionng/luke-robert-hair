-- ============================================================================
-- FOUNDATION TIER DATABASE SCHEMA (£4,000 package)
-- ============================================================================
-- This migration creates the core CRM and content infrastructure
-- for the Foundation package WITHOUT Growth/Scale tier features
--
-- Included: Lead capture, basic scoring, transactional emails, content drafts
-- NOT included: Automated nurturing, SMS, AI insights, automation queues
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- LEADS TABLE
-- Core lead/contact management for all sources (salon, education, CPD)
-- ============================================================================
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  
  -- Lead classification
  source TEXT NOT NULL, -- 'cpd_partnership', 'education', 'salon', 'ai_chat_cpd', 'ai_chat', 'contact_form'
  lead_type TEXT, -- 'individual', 'institution'
  lifecycle_stage TEXT DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  
  -- Lead quality
  lead_score INTEGER DEFAULT 0, -- 0-100 score
  
  -- Interest tracking
  course_interest TEXT,
  
  -- Flexible data storage for CPD (institution, jobTitle, studentNumbers) or other custom data
  custom_fields JSONB DEFAULT '{}',
  
  -- Admin notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_activity_date TIMESTAMPTZ,
  last_contact_date TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_source ON leads(source);
CREATE INDEX idx_leads_lifecycle_stage ON leads(lifecycle_stage);
CREATE INDEX idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- ============================================================================
-- LEAD ACTIVITIES TABLE
-- Track all lead interactions for scoring and history
-- ============================================================================
CREATE TABLE lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Activity classification
  activity_type TEXT NOT NULL, 
  -- Types: 'form_submitted', 'chat_opened', 'chat_message', 'email_opened', 
  --        'email_clicked', 'page_visited', 'booking_completed', 'booking_attempted'
  
  -- Activity details (flexible JSON storage)
  activity_data JSONB DEFAULT '{}',
  
  -- Scoring impact
  score_impact INTEGER DEFAULT 0,
  
  -- Automated vs manual
  automated BOOLEAN DEFAULT FALSE,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_type ON lead_activities(activity_type);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at DESC);

-- ============================================================================
-- LEAD SCORE HISTORY TABLE
-- Track score changes over time for transparency
-- ============================================================================
CREATE TABLE lead_score_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  
  -- Score change
  previous_score INTEGER,
  new_score INTEGER,
  score_change INTEGER,
  reason TEXT,
  
  -- Score breakdown (for debugging/transparency)
  behavioral_score INTEGER,
  engagement_score INTEGER,
  profile_score INTEGER,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_lead_score_history_lead_id ON lead_score_history(lead_id);
CREATE INDEX idx_lead_score_history_created_at ON lead_score_history(created_at DESC);

-- ============================================================================
-- EMAIL LOGS TABLE
-- Track TRANSACTIONAL emails only (Foundation tier)
-- Growth tier adds nurturing/marketing email tracking
-- ============================================================================
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Lead association (optional - some emails might not be lead-related)
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  
  -- Email details
  to_email TEXT NOT NULL,
  to_name TEXT,
  subject TEXT NOT NULL,
  body_html TEXT,
  body_text TEXT,
  
  -- Email classification
  email_type TEXT NOT NULL DEFAULT 'transactional', -- Foundation: always 'transactional'
  template_name TEXT, -- e.g., 'booking_confirmation', 'contact_acknowledgment', 'cpd_enquiry_received'
  
  -- External service tracking
  resend_id TEXT, -- Resend email ID
  
  -- Status tracking
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'bounced', 'failed'
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  bounced_at TIMESTAMPTZ,
  
  -- Engagement metrics
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  
  -- Error tracking
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_logs_lead_id ON email_logs(lead_id);
CREATE INDEX idx_email_logs_to_email ON email_logs(to_email);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_template_name ON email_logs(template_name);

-- ============================================================================
-- CONTENT QUEUE TABLE
-- AI-generated blog post drafts for manual review/publishing
-- ============================================================================
CREATE TABLE content_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Content details
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  body TEXT NOT NULL,
  excerpt TEXT,
  category TEXT, -- e.g., 'hair care', 'education', 'business', 'techniques'
  
  -- Media
  image_url TEXT,
  image_alt TEXT,
  
  -- Publishing status
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  ai_generated BOOLEAN DEFAULT FALSE,
  
  -- SEO
  meta_description TEXT,
  keywords TEXT[],
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_content_queue_status ON content_queue(status);
CREATE INDEX idx_content_queue_category ON content_queue(category);
CREATE INDEX idx_content_queue_published_at ON content_queue(published_at DESC NULLS LAST);
CREATE INDEX idx_content_queue_created_at ON content_queue(created_at DESC);

-- ============================================================================
-- CONTACT PREFERENCES TABLE
-- Manage email opt-in/out preferences for compliance
-- ============================================================================
CREATE TABLE contact_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE UNIQUE,
  
  -- Preferences
  email_enabled BOOLEAN DEFAULT TRUE,
  marketing_enabled BOOLEAN DEFAULT FALSE, -- Foundation: always false (no marketing emails)
  
  -- Tracking
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index
CREATE UNIQUE INDEX idx_contact_preferences_lead_id ON contact_preferences(lead_id);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_queue_updated_at
  BEFORE UPDATE ON content_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_preferences_updated_at
  BEFORE UPDATE ON contact_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETED: Foundation Tier Database Schema
-- ============================================================================
-- Total tables: 6
-- Missing from Growth: automation_queue, nurturing_sequences
-- Missing from Scale: sms_logs
-- Missing from Growth: ai_insights
-- 
-- Ready for: Lead capture, basic scoring, transactional emails, content drafts
-- Ready to upgrade to: Growth tier (add automation tables)
-- ============================================================================



