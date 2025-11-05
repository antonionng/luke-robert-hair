-- =====================================================
-- FIX: Add missing columns to existing content_queue table
-- Run this if you get "column does not exist" errors
-- =====================================================

-- STEP 1: Create content_requests table FIRST (needed for foreign key)
CREATE TABLE IF NOT EXISTS public.content_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    -- Request Source
    requested_by TEXT,
    request_source TEXT NOT NULL DEFAULT 'manual' CHECK (request_source IN ('manual', 'ai_assist', 'automation')),
    request_type TEXT NOT NULL DEFAULT 'blog_post' CHECK (request_type IN ('blog_post', 'campaign', 'announcement', 'evergreen')),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'queued', 'generating', 'ready', 'completed', 'cancelled')),

    -- Content Brief
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

    -- Scheduling
    preferred_publish_date TIMESTAMPTZ,
    scheduled_for TIMESTAMPTZ,
    auto_publish BOOLEAN DEFAULT false,
    priority INTEGER DEFAULT 3 CHECK (priority >= 1 AND priority <= 5),

    -- Metadata
    ai_context JSONB DEFAULT '{}'::JSONB,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- STEP 2: Add missing columns to content_queue
DO $$ 
BEGIN
    -- Add source column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='source') THEN
        ALTER TABLE public.content_queue ADD COLUMN source TEXT DEFAULT 'automation' 
            CHECK (source IN ('automation', 'manual', 'ai_assist', 'repurposed'));
    END IF;

    -- Add request_id column (NOW content_requests exists)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='request_id') THEN
        ALTER TABLE public.content_queue ADD COLUMN request_id UUID 
            REFERENCES public.content_requests(id) ON DELETE SET NULL;
    END IF;

    -- Add hero_alt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_alt') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_alt TEXT;
    END IF;

    -- Add hero_caption column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_caption') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_caption TEXT;
    END IF;

    -- Add seo_title column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='seo_title') THEN
        ALTER TABLE public.content_queue ADD COLUMN seo_title TEXT;
    END IF;

    -- Add insight_tags column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='insight_tags') THEN
        ALTER TABLE public.content_queue ADD COLUMN insight_tags TEXT[] DEFAULT '{}'::TEXT[];
    END IF;

    -- Add cta_label column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_label') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_label TEXT;
    END IF;

    -- Add cta_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_url') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_url TEXT;
    END IF;

    -- Add cta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_description TEXT;
    END IF;

    -- Add preview_html column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_html') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_html TEXT;
    END IF;

    -- Add preview_generated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_generated_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_generated_at TIMESTAMPTZ;
    END IF;

    -- Add last_previewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_at TIMESTAMPTZ;
    END IF;

    -- Add last_previewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_by TEXT;
    END IF;

    -- Add editor_notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_notes') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_notes TEXT;
    END IF;

    -- Add word_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='word_count') THEN
        ALTER TABLE public.content_queue ADD COLUMN word_count INTEGER DEFAULT 0 CHECK (word_count >= 0);
    END IF;

    -- Add reading_time_minutes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reading_time_minutes') THEN
        ALTER TABLE public.content_queue ADD COLUMN reading_time_minutes INTEGER 
            CHECK (reading_time_minutes IS NULL OR reading_time_minutes >= 0);
    END IF;

    -- Add pinned_until column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='pinned_until') THEN
        ALTER TABLE public.content_queue ADD COLUMN pinned_until TIMESTAMPTZ;
    END IF;

    -- Add featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='featured') THEN
        ALTER TABLE public.content_queue ADD COLUMN featured BOOLEAN DEFAULT false;
    END IF;

    -- Add outline column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='outline') THEN
        ALTER TABLE public.content_queue ADD COLUMN outline JSONB DEFAULT '[]'::JSONB;
    END IF;

    -- Add editor_state column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_state') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_state JSONB DEFAULT '[]'::JSONB;
    END IF;

    -- Update status check constraint to include new statuses
    ALTER TABLE public.content_queue DROP CONSTRAINT IF EXISTS content_queue_status_check;
    ALTER TABLE public.content_queue ADD CONSTRAINT content_queue_status_check 
        CHECK (status IN ('draft', 'queued', 'generating', 'review', 'scheduled', 'published', 'rejected', 'archived'));

END $$;

-- STEP 3: Create content_analytics_events table
CREATE TABLE IF NOT EXISTS public.content_analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Content Reference
    content_id UUID NOT NULL REFERENCES public.content_queue(id) ON DELETE CASCADE,
    session_id TEXT,

    -- Event Type
    event_type TEXT NOT NULL CHECK (event_type IN ('view', 'click', 'cta_click', 'share', 'impression')),
    event_value INTEGER DEFAULT 1,

    -- UTM & Source Tracking
    source TEXT,
    medium TEXT,
    campaign TEXT,
    referrer TEXT,

    -- User Context
    user_agent TEXT,
    device TEXT,
    ip_address TEXT,

    -- Additional Data
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON public.content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_analytics_created_at ON public.content_analytics_events(created_at);

-- Add RLS policies (enable if not already)
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all for content_requests" ON public.content_requests;
DROP POLICY IF EXISTS "Enable all for content_analytics_events" ON public.content_analytics_events;

-- Create permissive policies
CREATE POLICY "Enable all for content_requests" ON public.content_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for content_analytics_events" ON public.content_analytics_events FOR ALL USING (true) WITH CHECK (true);

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Migration completed successfully! All missing columns added.';
END $$;

