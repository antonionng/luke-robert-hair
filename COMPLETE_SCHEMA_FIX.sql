-- =====================================================
-- COMPLETE SCHEMA FIX - Run this in Supabase SQL Editor
-- This fixes ALL missing tables and columns
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- PART 1: Create missing bookings table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Customer Information
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Booking Details
    service TEXT NOT NULL,
    location TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    
    -- Status
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
    
    -- Source Tracking
    source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'email', 'referral', 'external')),
    referral_salon TEXT,
    
    -- Notes
    notes TEXT,
    cancellation_reason TEXT,
    
    -- Lead linkage
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    
    -- Metadata
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON public.bookings(customer_email);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON public.bookings(lead_id);

-- Enable RLS on bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy for bookings
DROP POLICY IF EXISTS "Enable all for bookings" ON public.bookings;
CREATE POLICY "Enable all for bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- PART 2: Create content_requests table
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

-- Create indexes for content_requests
CREATE INDEX IF NOT EXISTS idx_content_requests_status ON public.content_requests(status);
CREATE INDEX IF NOT EXISTS idx_content_requests_created_at ON public.content_requests(created_at DESC);

-- Enable RLS
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Enable all for content_requests" ON public.content_requests;
CREATE POLICY "Enable all for content_requests" ON public.content_requests FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- PART 3: Fix content_queue table - Add ALL missing columns
-- =====================================================
DO $$ 
BEGIN
    RAISE NOTICE 'Starting content_queue column additions...';

    -- Add content column (CRITICAL!)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='content') THEN
        ALTER TABLE public.content_queue ADD COLUMN content TEXT NOT NULL DEFAULT '';
        RAISE NOTICE '✅ Added content column';
    ELSE
        RAISE NOTICE '⏭️  content column already exists';
    END IF;

    -- Add source column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='source') THEN
        ALTER TABLE public.content_queue ADD COLUMN source TEXT DEFAULT 'automation';
        RAISE NOTICE '✅ Added source column';
    ELSE
        RAISE NOTICE '⏭️  source column already exists';
    END IF;

    -- Add request_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='request_id') THEN
        ALTER TABLE public.content_queue ADD COLUMN request_id UUID 
            REFERENCES public.content_requests(id) ON DELETE SET NULL;
        RAISE NOTICE '✅ Added request_id column';
    ELSE
        RAISE NOTICE '⏭️  request_id column already exists';
    END IF;

    -- Add ai_model column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_model') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_model TEXT DEFAULT 'gpt-4o-mini';
        RAISE NOTICE '✅ Added ai_model column';
    ELSE
        RAISE NOTICE '⏭️  ai_model column already exists';
    END IF;

    -- Add ai_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_generated BOOLEAN DEFAULT true;
        RAISE NOTICE '✅ Added ai_generated column';
    ELSE
        RAISE NOTICE '⏭️  ai_generated column already exists';
    END IF;

    -- Add generation_prompt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='generation_prompt') THEN
        ALTER TABLE public.content_queue ADD COLUMN generation_prompt TEXT;
        RAISE NOTICE '✅ Added generation_prompt column';
    ELSE
        RAISE NOTICE '⏭️  generation_prompt column already exists';
    END IF;

    -- Add metadata column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='metadata') THEN
        ALTER TABLE public.content_queue ADD COLUMN metadata JSONB DEFAULT '{}'::JSONB;
        RAISE NOTICE '✅ Added metadata column';
    ELSE
        RAISE NOTICE '⏭️  metadata column already exists';
    END IF;

    -- Add hero_alt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_alt') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_alt TEXT;
        RAISE NOTICE '✅ Added hero_alt column';
    ELSE
        RAISE NOTICE '⏭️  hero_alt column already exists';
    END IF;

    -- Add hero_caption column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='hero_caption') THEN
        ALTER TABLE public.content_queue ADD COLUMN hero_caption TEXT;
        RAISE NOTICE '✅ Added hero_caption column';
    ELSE
        RAISE NOTICE '⏭️  hero_caption column already exists';
    END IF;

    -- Add seo_title column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='seo_title') THEN
        ALTER TABLE public.content_queue ADD COLUMN seo_title TEXT;
        RAISE NOTICE '✅ Added seo_title column';
    ELSE
        RAISE NOTICE '⏭️  seo_title column already exists';
    END IF;

    -- Add meta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='meta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN meta_description TEXT;
        RAISE NOTICE '✅ Added meta_description column';
    ELSE
        RAISE NOTICE '⏭️  meta_description column already exists';
    END IF;

    -- Add keywords column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='keywords') THEN
        ALTER TABLE public.content_queue ADD COLUMN keywords TEXT[];
        RAISE NOTICE '✅ Added keywords column';
    ELSE
        RAISE NOTICE '⏭️  keywords column already exists';
    END IF;

    -- Add insight_tags column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='insight_tags') THEN
        ALTER TABLE public.content_queue ADD COLUMN insight_tags TEXT[] DEFAULT '{}'::TEXT[];
        RAISE NOTICE '✅ Added insight_tags column';
    ELSE
        RAISE NOTICE '⏭️  insight_tags column already exists';
    END IF;

    -- Add cta_label column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_label') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_label TEXT;
        RAISE NOTICE '✅ Added cta_label column';
    ELSE
        RAISE NOTICE '⏭️  cta_label column already exists';
    END IF;

    -- Add cta_url column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_url') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_url TEXT;
        RAISE NOTICE '✅ Added cta_url column';
    ELSE
        RAISE NOTICE '⏭️  cta_url column already exists';
    END IF;

    -- Add cta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='cta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN cta_description TEXT;
        RAISE NOTICE '✅ Added cta_description column';
    ELSE
        RAISE NOTICE '⏭️  cta_description column already exists';
    END IF;

    -- Add preview_html column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_html') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_html TEXT;
        RAISE NOTICE '✅ Added preview_html column';
    ELSE
        RAISE NOTICE '⏭️  preview_html column already exists';
    END IF;

    -- Add preview_generated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='preview_generated_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN preview_generated_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added preview_generated_at column';
    ELSE
        RAISE NOTICE '⏭️  preview_generated_at column already exists';
    END IF;

    -- Add last_previewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added last_previewed_at column';
    ELSE
        RAISE NOTICE '⏭️  last_previewed_at column already exists';
    END IF;

    -- Add last_previewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='last_previewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN last_previewed_by TEXT;
        RAISE NOTICE '✅ Added last_previewed_by column';
    ELSE
        RAISE NOTICE '⏭️  last_previewed_by column already exists';
    END IF;

    -- Add editor_notes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_notes') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_notes TEXT;
        RAISE NOTICE '✅ Added editor_notes column';
    ELSE
        RAISE NOTICE '⏭️  editor_notes column already exists';
    END IF;

    -- Add views column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='views') THEN
        ALTER TABLE public.content_queue ADD COLUMN views INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added views column';
    ELSE
        RAISE NOTICE '⏭️  views column already exists';
    END IF;

    -- Add clicks column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='clicks') THEN
        ALTER TABLE public.content_queue ADD COLUMN clicks INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added clicks column';
    ELSE
        RAISE NOTICE '⏭️  clicks column already exists';
    END IF;

    -- Add leads_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='leads_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN leads_generated INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Added leads_generated column';
    ELSE
        RAISE NOTICE '⏭️  leads_generated column already exists';
    END IF;

    -- Add reviewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_by TEXT;
        RAISE NOTICE '✅ Added reviewed_by column';
    ELSE
        RAISE NOTICE '⏭️  reviewed_by column already exists';
    END IF;

    -- Add reviewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_at TIMESTAMPTZ;
        RAISE NOTICE '✅ Added reviewed_at column';
    ELSE
        RAISE NOTICE '⏭️  reviewed_at column already exists';
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='rejection_reason') THEN
        ALTER TABLE public.content_queue ADD COLUMN rejection_reason TEXT;
        RAISE NOTICE '✅ Added rejection_reason column';
    ELSE
        RAISE NOTICE '⏭️  rejection_reason column already exists';
    END IF;

    -- Add word_count column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='word_count') THEN
        ALTER TABLE public.content_queue ADD COLUMN word_count INTEGER DEFAULT 0 CHECK (word_count >= 0);
        RAISE NOTICE '✅ Added word_count column';
    ELSE
        RAISE NOTICE '⏭️  word_count column already exists';
    END IF;

    -- Add reading_time_minutes column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reading_time_minutes') THEN
        ALTER TABLE public.content_queue ADD COLUMN reading_time_minutes INTEGER 
            CHECK (reading_time_minutes IS NULL OR reading_time_minutes >= 0);
        RAISE NOTICE '✅ Added reading_time_minutes column';
    ELSE
        RAISE NOTICE '⏭️  reading_time_minutes column already exists';
    END IF;

    -- Add pinned_until column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='pinned_until') THEN
        ALTER TABLE public.content_queue ADD COLUMN pinned_until TIMESTAMPTZ;
        RAISE NOTICE '✅ Added pinned_until column';
    ELSE
        RAISE NOTICE '⏭️  pinned_until column already exists';
    END IF;

    -- Add featured column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='featured') THEN
        ALTER TABLE public.content_queue ADD COLUMN featured BOOLEAN DEFAULT false;
        RAISE NOTICE '✅ Added featured column';
    ELSE
        RAISE NOTICE '⏭️  featured column already exists';
    END IF;

    -- Add outline column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='outline') THEN
        ALTER TABLE public.content_queue ADD COLUMN outline JSONB DEFAULT '[]'::JSONB;
        RAISE NOTICE '✅ Added outline column';
    ELSE
        RAISE NOTICE '⏭️  outline column already exists';
    END IF;

    -- Add editor_state column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='editor_state') THEN
        ALTER TABLE public.content_queue ADD COLUMN editor_state JSONB DEFAULT '[]'::JSONB;
        RAISE NOTICE '✅ Added editor_state column';
    ELSE
        RAISE NOTICE '⏭️  editor_state column already exists';
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

    RAISE NOTICE '🎉 All content_queue columns added/verified successfully!';
END $$;

-- =====================================================
-- PART 4: Create content_analytics_events table
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

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_content_analytics_content_id ON public.content_analytics_events(content_id);
CREATE INDEX IF NOT EXISTS idx_content_analytics_created_at ON public.content_analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_content_analytics_event_type ON public.content_analytics_events(event_type);

-- Enable RLS
ALTER TABLE public.content_analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policy
DROP POLICY IF EXISTS "Enable all for content_analytics_events" ON public.content_analytics_events;
CREATE POLICY "Enable all for content_analytics_events" ON public.content_analytics_events FOR ALL USING (true) WITH CHECK (true);

-- =====================================================
-- PART 5: Create additional indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_content_queue_status ON public.content_queue(status);
CREATE INDEX IF NOT EXISTS idx_content_queue_scheduled_for ON public.content_queue(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_content_queue_published_at ON public.content_queue(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_queue_created_at ON public.content_queue(created_at DESC);

-- =====================================================
-- PART 6: Force Supabase to reload schema cache
-- =====================================================
NOTIFY pgrst, 'reload schema';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$ 
BEGIN 
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '✅✅✅ COMPLETE SCHEMA FIX APPLIED SUCCESSFULLY! ✅✅✅';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Created/verified bookings table';
    RAISE NOTICE '✅ Created/verified content_requests table';  
    RAISE NOTICE '✅ Added/verified all content_queue columns';
    RAISE NOTICE '✅ Created/verified content_analytics_events table';
    RAISE NOTICE '✅ Created all necessary indexes';
    RAISE NOTICE '✅ Schema cache reloaded';
    RAISE NOTICE '';
    RAISE NOTICE '🚀 Next steps:';
    RAISE NOTICE '   1. Restart your Next.js dev server: pkill -f "next dev" && npm run dev';
    RAISE NOTICE '   2. Clear your browser cache and refresh';
    RAISE NOTICE '   3. Try generating content again!';
    RAISE NOTICE '';
    RAISE NOTICE '═══════════════════════════════════════════════════════════';
END $$;




