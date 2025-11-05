-- =====================================================
-- EMERGENCY FIX: Apply all missing schema changes
-- Copy and paste this ENTIRE file into Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query -> Paste -> Run
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- STEP 1: Create content_requests table (if missing)
-- =====================================================
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

-- =====================================================
-- STEP 2: Fix content_queue table - Add ALL missing columns
-- =====================================================
DO $$ 
BEGIN
    -- Add content column (CRITICAL!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='content') THEN
        ALTER TABLE public.content_queue ADD COLUMN content TEXT NOT NULL DEFAULT '';
        RAISE NOTICE '✅ Added content column';
    END IF;

    -- Add source column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='source') THEN
        ALTER TABLE public.content_queue ADD COLUMN source TEXT DEFAULT 'automation';
        RAISE NOTICE '✅ Added source column';
    END IF;

    -- Add request_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='request_id') THEN
        ALTER TABLE public.content_queue ADD COLUMN request_id UUID 
            REFERENCES public.content_requests(id) ON DELETE SET NULL;
        RAISE NOTICE '✅ Added request_id column';
    END IF;

    -- Add ai_model column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_model') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_model TEXT DEFAULT 'gpt-4o-mini';
        RAISE NOTICE '✅ Added ai_model column';
    END IF;

    -- Add ai_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_generated BOOLEAN DEFAULT true;
        RAISE NOTICE '✅ Added ai_generated column';
    END IF;

    -- Add generation_prompt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='generation_prompt') THEN
        ALTER TABLE public.content_queue ADD COLUMN generation_prompt TEXT;
        RAISE NOTICE '✅ Added generation_prompt column';
    END IF;

    -- Add metadata column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='metadata') THEN
        ALTER TABLE public.content_queue ADD COLUMN metadata JSONB DEFAULT '{}'::JSONB;
        RAISE NOTICE '✅ Added metadata column';
    END IF;

    -- Add hero_alt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_alt') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_alt TEXT;
        RAISE NOTICE '✅ Added hero_alt column';
    END IF;

    -- Add hero_caption column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_caption') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_caption TEXT;
        RAISE NOTICE '✅ Added hero_caption column';
    END IF;

    -- Add seo_title column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='seo_title') THEN
        ALTER TABLE public.content_queue ADD COLUMN seo_title TEXT;
        RAISE NOTICE '✅ Added seo_title column';
    END IF;

    -- Add meta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='meta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN meta_description TEXT;
        RAISE NOTICE '✅ Added meta_description column';
    END IF;

    -- Add keywords column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='keywords') THEN
        ALTER TABLE public.content_queue ADD COLUMN keywords TEXT[];
        RAISE NOTICE '✅ Added keywords column';
    END IF;

    -- Add insight_tags column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='insight_tags') THEN
        ALTER TABLE public.content_queue ADD COLUMN insight_tags TEXT[] DEFAULT '{}'::TEXT[];
        RAISE NOTICE '✅ Added insight_tags column';
    END IF;

    -- Add cta_label column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_label') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_label TEXT;
        RAISE NOTICE '✅ Added cta_label column';
    END IF;

    -- Add cta_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_url') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_url TEXT;
        RAISE NOTICE '✅ Added cta_url column';
    END IF;

    -- Add cta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_description TEXT;
        RAISE NOTICE '✅ Added cta_description column';
    END IF;

    -- Add preview_html column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_html') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_html TEXT;
        RAISE NOTICE '✅ Added preview_html column';
    END IF;

    -- Add preview_generated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_generated_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_generated_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added preview_generated_at column';
    END IF;

    -- Add last_previewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added last_previewed_at column';
    END IF;

    -- Add last_previewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_by TEXT;
        RAISE NOTICE '✅ Added last_previewed_by column';
    END IF;

    -- Add editor_notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_notes') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_notes TEXT;
        RAISE NOTICE '✅ Added editor_notes column';
    END IF;

    -- Add views column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='views') THEN
        ALTER TABLE public.content_queue ADD COLUMN views INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added views column';
    END IF;

    -- Add clicks column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='clicks') THEN
        ALTER TABLE public.content_queue ADD COLUMN clicks INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added clicks column';
    END IF;

    -- Add leads_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='leads_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN leads_generated INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added leads_generated column';
    END IF;

    -- Add reviewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_by TEXT;
        RAISE NOTICE '✅ Added reviewed_by column';
    END IF;

    -- Add reviewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added reviewed_at column';
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='rejection_reason') THEN
        ALTER TABLE public.content_queue ADD COLUMN rejection_reason TEXT;
        RAISE NOTICE '✅ Added rejection_reason column';
    END IF;

    -- Add word_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='word_count') THEN
        ALTER TABLE public.content_queue ADD COLUMN word_count INTEGER DEFAULT 0 CHECK (word_count >= 0);
        RAISE NOTICE '✅ Added word_count column';
    END IF;

    -- Add reading_time_minutes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reading_time_minutes') THEN
        ALTER TABLE public.content_queue ADD COLUMN reading_time_minutes INTEGER 
            CHECK (reading_time_minutes IS NULL OR reading_time_minutes >= 0);
        RAISE NOTICE '✅ Added reading_time_minutes column';
    END IF;

    -- Add pinned_until column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='pinned_until') THEN
        ALTER TABLE public.content_queue ADD COLUMN pinned_until TIMESTAMPTZ;
        RAISE NOTICE '✅ Added pinned_until column';
    END IF;

    -- Add featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='featured') THEN
        ALTER TABLE public.content_queue ADD COLUMN featured BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Added featured column';
    END IF;

    -- Add outline column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='outline') THEN
        ALTER TABLE public.content_queue ADD COLUMN outline JSONB DEFAULT '[]'::JSONB;
        RAISE NOTICE '✅ Added outline column';
    END IF;

    -- Add editor_state column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_state') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_state JSONB DEFAULT '[]'::JSONB;
        RAISE NOTICE '✅ Added editor_state column';
    END IF;

    -- Update status check constraint
    ALTER TABLE public.content_queue DROP CONSTRAINT IF EXISTS content_queue_status_check;
    ALTER TABLE public.content_queue ADD CONSTRAINT content_queue_status_check 
        CHECK (status IN ('draft', 'queued', 'generating', 'review', 'scheduled', 'published', 'rejected', 'archived'));
    RAISE NOTICE '✅ Updated status constraint';

    -- Update source check constraint
    ALTER TABLE public.content_queue DROP CONSTRAINT IF EXISTS content_queue_source_check;
    ALTER TABLE public.content_queue ADD CONSTRAINT content_queue_source_check 
        CHECK (source IN ('automation', 'manual', 'ai_assist', 'repurposed'));
    RAISE NOTICE '✅ Updated source constraint';

    RAISE NOTICE '🎉 All content_queue columns added successfully!';
END $$;

-- =====================================================
-- STEP 3: Create content_analytics_events table
-- =====================================================
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

-- =====================================================
-- STEP 4: Create indexes
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON public.content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_analytics_created_at ON public.content_analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_content_queue_status ON public.content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled_for ON public.content_queue(scheduled_for);

-- =====================================================
-- STEP 5: Enable RLS and create policies
-- =====================================================
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_analytics_events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Enable all for content_requests" ON public.content_requests;
DROP POLICY IF EXISTS "Enable all for content_analytics_events" ON public.content_analytics_events;

-- Create permissive policies (adjust these based on your auth requirements)
CREATE POLICY "Enable all for content_requests" ON public.content_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for content_analytics_events" ON public.content_analytics_events FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- STEP 6: Force Supabase to reload schema cache
-- =====================================================
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- SUCCESS!
-- =====================================================
DO $$ 
BEGIN 
    RAISE NOTICE '✅✅✅ MIGRATION COMPLETED SUCCESSFULLY! ✅✅✅';
    RAISE NOTICE 'All missing columns have been added to content_queue';
    RAISE NOTICE 'Schema cache has been reloaded';
    RAISE NOTICE 'You can now restart your Next.js server and it should work!';
END $$;




