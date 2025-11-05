-- =====================================================
-- AI NURTURING ENGINE SCHEMA
-- Comprehensive backend for lead management, automation, 
-- content generation, and communications tracking
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- =====================================================
-- LEADS & CONTACT MANAGEMENT
-- =====================================================

-- Enhanced leads table with lifecycle tracking
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Contact Information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    
    -- Lead Details
    course_interest TEXT, -- Which course they're interested in
    message TEXT, -- Their initial enquiry message
    source TEXT DEFAULT 'website', -- website, referral, social, etc.
    
    -- Lead Qualification
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    lifecycle_stage TEXT DEFAULT 'new' CHECK (lifecycle_stage IN ('new', 'contacted', 'qualified', 'nurturing', 'converted', 'lost')),
    
    -- Engagement Tracking
    last_contact_date TIMESTAMPTZ,
    next_follow_up_date TIMESTAMPTZ,
    last_activity_date TIMESTAMPTZ,
    
    -- Metadata
    tags TEXT[], -- Array of tags for categorization
    custom_fields JSONB DEFAULT '{}', -- Flexible storage for custom data
    notes TEXT,
    
    -- Conversion Tracking
    converted_at TIMESTAMPTZ,
    conversion_value DECIMAL(10, 2),
    
    CONSTRAINT unique_lead_email UNIQUE(email)
);

-- Lead activities - Complete timeline of interactions
CREATE TABLE IF NOT EXISTS public.lead_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Activity Details
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'email_sent', 'email_opened', 'email_clicked', 
        'sms_sent', 'sms_replied',
        'call_made', 'call_received',
        'meeting_scheduled', 'meeting_completed',
        'form_submitted', 'page_visited',
        'chat_initiated', 'chat_message',
        'booking_attempted', 'booking_completed',
        'content_viewed', 'link_clicked',
        'score_changed', 'stage_changed',
        'note_added'
    )),
    
    activity_data JSONB DEFAULT '{}', -- Flexible storage for activity-specific data
    
    -- Attribution
    automated BOOLEAN DEFAULT false, -- True if triggered by automation
    user_agent TEXT, -- Browser/device info
    ip_address TEXT,
    
    -- Scoring Impact
    score_impact INTEGER DEFAULT 0, -- How much this activity affected the lead score
    
    CONSTRAINT fk_lead FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE
);

-- Lead scoring history - Track score changes over time
CREATE TABLE IF NOT EXISTS public.lead_score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Score Details
    previous_score INTEGER NOT NULL,
    new_score INTEGER NOT NULL,
    score_change INTEGER NOT NULL,
    
    -- Reason
    reason TEXT NOT NULL, -- What triggered the score change
    activity_id UUID REFERENCES public.lead_activities(id),
    
    -- Score Breakdown (for transparency)
    behavioral_score INTEGER DEFAULT 0,
    engagement_score INTEGER DEFAULT 0,
    profile_score INTEGER DEFAULT 0
);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- Content requests - briefs, manual ideas, and AI-assisted prompts
CREATE TABLE IF NOT EXISTS public.content_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Request metadata
    requested_by TEXT,
    request_source TEXT NOT NULL DEFAULT 'manual' CHECK (request_source IN ('manual', 'ai_assist', 'automation')),
    request_type TEXT NOT NULL DEFAULT 'blog_post' CHECK (request_type IN ('blog_post', 'campaign', 'announcement', 'evergreen')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'generating', 'ready', 'completed', 'cancelled')),

    -- Brief
    title TEXT,
    topic TEXT NOT NULL,
    category TEXT,
    summary TEXT,
    brief TEXT,
    audience TEXT,
    tone TEXT,
    objectives TEXT,
    target_keywords TEXT[] DEFAULT '{}'::TEXT[],
    inspiration_links TEXT[] DEFAULT '{}'::TEXT[],
    notes TEXT,

    -- Scheduling preferences
    preferred_publish_date TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    auto_publish BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),

    -- AI context
    ai_context JSONB DEFAULT '{}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Content queue for AI-generated and curated posts
CREATE TABLE IF NOT EXISTS public.content_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Linkage
    request_id UUID REFERENCES public.content_requests(id) ON DELETE SET NULL,

    -- Content Details
    title TEXT NOT NULL,
    slug TEXT UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (char_length(category) > 0),

    -- Media
    image_url TEXT,
    image_prompt TEXT, -- DALL-E prompt used
    hero_alt TEXT,
    hero_caption TEXT,

    -- Publishing
    status TEXT DEFAULT 'queued' CHECK (status IN ('draft', 'queued', 'generating', 'review', 'scheduled', 'published', 'rejected', 'archived')),
    source TEXT DEFAULT 'automation' CHECK (source IN ('automation', 'manual', 'ai_assist', 'repurposed')),
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    pinned_until TIMESTAMPTZ,
    featured BOOLEAN DEFAULT false,

    -- AI Metadata
    ai_generated BOOLEAN DEFAULT true,
    ai_model TEXT DEFAULT 'gpt-4o-mini',
    generation_prompt TEXT,
    outline JSONB DEFAULT '[]'::JSONB,
    editor_state JSONB DEFAULT '[]'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB,

    -- SEO
    seo_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    insight_tags TEXT[] DEFAULT '{}'::TEXT[],

    -- CTAs
    cta_label TEXT,
    cta_url TEXT,
    cta_description TEXT,

    -- Preview & Editing
    preview_html TEXT,
    preview_generated_at TIMESTAMPTZ,
    last_previewed_at TIMESTAMPTZ,
    last_previewed_by TEXT,
    editor_notes TEXT,

    -- Performance Indicators
    word_count INTEGER DEFAULT 0 CHECK (word_count >= 0),
    reading_time_minutes INTEGER CHECK (reading_time_minutes IS NULL OR reading_time_minutes >= 0),

    -- Tracking
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,

    -- Approval
    reviewed_by TEXT,
    reviewed_at TIMESTAMPTZ,
    rejection_reason TEXT
);

-- Content analytics events - granular tracking for insights
CREATE TABLE IF NOT EXISTS public.content_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    content_id UUID NOT NULL REFERENCES public.content_queue(id) ON DELETE CASCADE,
    session_id TEXT,

    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'cta_click', 'share', 'impression')),
    event_value INTEGER DEFAULT 1,

    source TEXT,
    medium TEXT,
    campaign TEXT,
    referrer TEXT,

    user_agent TEXT,
    device TEXT,
    ip_address TEXT,

    metadata JSONB DEFAULT '{}'::JSONB
);

-- Content topics - Track what's been written about
CREATE TABLE IF NOT EXISTS public.content_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    topic TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    last_used TIMESTAMPTZ,
    usage_count INTEGER DEFAULT 0,
    
    -- Topic intelligence
    performance_score DECIMAL(5, 2) DEFAULT 0, -- Based on views, leads generated
    seasonal BOOLEAN DEFAULT false,
    seasonal_months INTEGER[], -- Array of months (1-12) when relevant
    
    blacklisted BOOLEAN DEFAULT false -- Topics to avoid
);

-- =====================================================
-- COMMUNICATION LOGS
-- =====================================================

-- Email logs - Track all email communications
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recipient
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    to_email TEXT NOT NULL,
    to_name TEXT,
    
    -- Email Details
    subject TEXT NOT NULL,
    body_html TEXT,
    body_text TEXT,
    
    -- Type
    email_type TEXT NOT NULL CHECK (email_type IN ('transactional', 'nurturing', 'marketing')),
    template_name TEXT,
    
    -- AI Generation
    ai_generated BOOLEAN DEFAULT false,
    personalization_data JSONB DEFAULT '{}',
    
    -- Resend Integration
    resend_id TEXT UNIQUE, -- Resend's email ID
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    
    -- Engagement
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    
    -- Error Handling
    error_message TEXT
);

-- SMS logs - Track all SMS communications
CREATE TABLE IF NOT EXISTS public.sms_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Recipient
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    to_phone TEXT NOT NULL,
    
    -- SMS Details
    message TEXT NOT NULL,
    
    -- Type
    sms_type TEXT NOT NULL CHECK (sms_type IN ('transactional', 'nurturing', 'marketing')),
    
    -- Twilio Integration
    twilio_sid TEXT UNIQUE,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'undelivered')),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    -- Engagement
    replied BOOLEAN DEFAULT false,
    reply_message TEXT,
    replied_at TIMESTAMPTZ,
    
    -- Error Handling
    error_code TEXT,
    error_message TEXT,
    
    -- Compliance
    opt_in_confirmed BOOLEAN DEFAULT true
);

-- =====================================================
-- AUTOMATION SYSTEM
-- =====================================================

-- Automation queue - Task queue for all automated actions
CREATE TABLE IF NOT EXISTS public.automation_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Scheduling
    scheduled_for TIMESTAMPTZ NOT NULL,
    
    -- Task Details
    task_type TEXT NOT NULL CHECK (task_type IN (
        'send_email', 'send_sms', 
        'score_lead', 'update_stage',
        'generate_content', 'generate_email',
        'send_notification', 'create_activity'
    )),
    
    -- Payload
    payload JSONB NOT NULL, -- All data needed to execute the task
    
    -- Execution
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    processed_at TIMESTAMPTZ,
    
    -- Retry Logic
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    next_retry_at TIMESTAMPTZ,
    
    -- Error Handling
    error_message TEXT,
    error_stack TEXT,
    
    -- Priority (1 = highest, 5 = lowest)
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),
    
    -- Related Records
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Execution Time Tracking
    execution_time_ms INTEGER
);

-- Nurturing sequences - Track which leads are in which sequences
CREATE TABLE IF NOT EXISTS public.nurturing_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Sequence Details
    sequence_type TEXT NOT NULL CHECK (sequence_type IN ('high_intent', 'warm', 'cold', 'reengagement', 'booking_reminders')),
    current_step INTEGER DEFAULT 1,
    total_steps INTEGER NOT NULL,
    
    -- Status
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
    
    -- Timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    next_action_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    
    -- Performance
    emails_sent INTEGER DEFAULT 0,
    emails_opened INTEGER DEFAULT 0,
    links_clicked INTEGER DEFAULT 0,
    sms_sent INTEGER DEFAULT 0,
    sms_replied INTEGER DEFAULT 0,
    
    -- Metadata
    sequence_data JSONB DEFAULT '{}' -- Store sequence-specific configuration
);

-- =====================================================
-- AI INSIGHTS & ANALYTICS
-- =====================================================

-- AI insights - Store AI-generated business insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Insight Details
    insight_type TEXT NOT NULL CHECK (insight_type IN (
        'lead_intelligence', 'communication_performance', 
        'content_strategy', 'revenue_optimization', 
        'predictive_alert', 'anomaly_detection'
    )),
    
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    
    -- Actionability
    actionable BOOLEAN DEFAULT true,
    suggested_action TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    
    -- Supporting Data
    data JSONB DEFAULT '{}', -- Charts, numbers, evidence
    
    -- Status
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'actioned', 'dismissed')),
    viewed_at TIMESTAMPTZ,
    actioned_at TIMESTAMPTZ,
    
    -- Impact Tracking
    estimated_impact TEXT, -- "15% increase in conversions"
    actual_impact TEXT -- Measured after action taken
);

-- Contact preferences - User notification preferences
CREATE TABLE IF NOT EXISTS public.contact_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    lead_id UUID UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
    
    -- Email Preferences
    email_enabled BOOLEAN DEFAULT true,
    email_frequency TEXT DEFAULT 'immediate' CHECK (email_frequency IN ('immediate', 'daily', 'weekly', 'monthly')),
    
    -- SMS Preferences
    sms_enabled BOOLEAN DEFAULT false,
    sms_opt_in_date TIMESTAMPTZ,
    
    -- Content Preferences
    content_categories TEXT[] DEFAULT ARRAY['Salon Tips', 'Education Insights', 'Product Highlights'],
    
    -- Marketing
    marketing_enabled BOOLEAN DEFAULT true,
    
    -- Compliance
    gdpr_consent BOOLEAN DEFAULT false,
    gdpr_consent_date TIMESTAMPTZ,
    unsubscribed BOOLEAN DEFAULT false,
    unsubscribed_at TIMESTAMPTZ
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Leads indexes
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_lifecycle_stage ON public.leads(lifecycle_stage);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON public.leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_next_follow_up ON public.leads(next_follow_up_date) WHERE next_follow_up_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_tags ON public.leads USING gin(tags);

-- Lead activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_lead_id ON public.lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_activities_type ON public.lead_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_activities_created ON public.lead_activities(created_at DESC);

-- Content requests indexes
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON public.content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_requests_scheduled ON public.content_requests(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_content_requests_source ON public.content_requests(request_source);
CREATE INDEX IF NOT EXISTS idx_content_requests_priority ON public.content_requests(priority DESC);

-- Content queue indexes
CREATE INDEX IF NOT EXISTS idx_content_status ON public.content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_scheduled ON public.content_queue(scheduled_for) WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_content_category ON public.content_queue(category);
CREATE INDEX IF NOT EXISTS idx_content_published ON public.content_queue(published_at DESC) WHERE status = 'published';
CREATE INDEX IF NOT EXISTS idx_content_source ON public.content_queue(source);
CREATE INDEX IF NOT EXISTS idx_content_request_id ON public.content_queue(request_id);
CREATE INDEX IF NOT EXISTS idx_content_featured ON public.content_queue(featured) WHERE featured = true;

-- Content analytics indexes
CREATE INDEX IF NOT EXISTS idx_content_events_content ON public.content_analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_content_events_type ON public.content_analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_content_events_created ON public.content_analytics_events(created_at DESC);

-- Email logs indexes
CREATE INDEX IF NOT EXISTS idx_email_lead_id ON public.email_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_email_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_created ON public.email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_resend_id ON public.email_logs(resend_id) WHERE resend_id IS NOT NULL;

-- SMS logs indexes
CREATE INDEX IF NOT EXISTS idx_sms_lead_id ON public.sms_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_sms_status ON public.sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_created ON public.sms_logs(created_at DESC);

-- Automation queue indexes
CREATE INDEX IF NOT EXISTS idx_automation_status ON public.automation_queue(status);
CREATE INDEX IF NOT EXISTS idx_automation_scheduled ON public.automation_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_automation_priority ON public.automation_queue(priority, scheduled_for);
CREATE INDEX IF NOT EXISTS idx_automation_lead_id ON public.automation_queue(lead_id);

-- Nurturing sequences indexes
CREATE INDEX IF NOT EXISTS idx_sequences_lead_id ON public.nurturing_sequences(lead_id);
CREATE INDEX IF NOT EXISTS idx_sequences_status ON public.nurturing_sequences(status);
CREATE INDEX IF NOT EXISTS idx_sequences_next_action ON public.nurturing_sequences(next_action_at) WHERE status = 'active';

-- AI insights indexes
CREATE INDEX IF NOT EXISTS idx_insights_type ON public.ai_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insights_status ON public.ai_insights(status);
CREATE INDEX IF NOT EXISTS idx_insights_priority ON public.ai_insights(priority, created_at DESC);

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_requests_updated_at BEFORE UPDATE ON public.content_requests
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.content_queue
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automation_updated_at BEFORE UPDATE ON public.automation_queue
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON public.nurturing_sequences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON public.contact_preferences
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update lead's last_activity_date when activity is created
CREATE OR REPLACE FUNCTION update_lead_last_activity()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.leads
    SET last_activity_date = NEW.created_at
    WHERE id = NEW.lead_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_activity
AFTER INSERT ON public.lead_activities
FOR EACH ROW EXECUTE FUNCTION update_lead_last_activity();

-- Function to automatically create slug from title
CREATE OR REPLACE FUNCTION generate_content_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL THEN
        NEW.slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
        NEW.slug := regexp_replace(NEW.slug, '-+', '-', 'g');
        NEW.slug := trim(both '-' from NEW.slug);
        -- Add timestamp to ensure uniqueness
        NEW.slug := NEW.slug || '-' || extract(epoch from NOW())::text;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_slug
BEFORE INSERT ON public.content_queue
FOR EACH ROW EXECUTE FUNCTION generate_content_slug();

-- =====================================================
-- ROW LEVEL SECURITY (Future: Multi-tenant support)
-- =====================================================

-- Enable RLS on all tables (can be configured later for multi-tenancy)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_score_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nurturing_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_preferences ENABLE ROW LEVEL SECURITY;

-- For now, create a permissive policy (can be restricted later)
CREATE POLICY "Enable all access for service role" ON public.leads FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.lead_activities FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.lead_score_history FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.content_queue FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.content_requests FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.content_topics FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.content_analytics_events FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.email_logs FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.sms_logs FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.automation_queue FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.nurturing_sequences FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.ai_insights FOR ALL USING (true);
CREATE POLICY "Enable all access for service role" ON public.contact_preferences FOR ALL USING (true);

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Seed content topics (starter topics for AI to use)
INSERT INTO public.content_topics (topic, category, seasonal, seasonal_months) VALUES
('Precision Cutting Techniques', 'Education Insights', false, NULL),
('Summer Hair Care Tips', 'Salon Tips', true, ARRAY[6,7,8]),
('Product Recommendations for Fine Hair', 'Product Highlights', false, NULL),
('Wedding Hair Preparation', 'Salon Tips', true, ARRAY[5,6,7,8,9]),
('Balayage vs Highlights', 'Salon Tips', false, NULL),
('Building Confidence as a Stylist', 'Education Insights', false, NULL),
('Autumn Hair Color Trends', 'Salon Tips', true, ARRAY[9,10,11]),
('Essential Tools for Stylists', 'Product Highlights', false, NULL),
('Hair Health in Winter', 'Salon Tips', true, ARRAY[12,1,2]),
('Advanced Layering Techniques', 'Education Insights', false, NULL)
ON CONFLICT (topic) DO NOTHING;



