-- =====================================================
-- Add the remaining missing columns to content_queue
-- Copy and paste this entire file into Supabase SQL Editor
-- =====================================================

DO $$ 
BEGIN
    -- Add ai_model column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_model') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_model TEXT DEFAULT 'gpt-4o-mini';
        RAISE NOTICE 'Added ai_model column';
    END IF;

    -- Add ai_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='ai_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN ai_generated BOOLEAN DEFAULT true;
        RAISE NOTICE 'Added ai_generated column';
    END IF;

    -- Add generation_prompt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='generation_prompt') THEN
        ALTER TABLE public.content_queue ADD COLUMN generation_prompt TEXT;
        RAISE NOTICE 'Added generation_prompt column';
    END IF;

    -- Add metadata column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='metadata') THEN
        ALTER TABLE public.content_queue ADD COLUMN metadata JSONB DEFAULT '{}'::JSONB;
        RAISE NOTICE 'Added metadata column';
    END IF;

    -- Add meta_description column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='meta_description') THEN
        ALTER TABLE public.content_queue ADD COLUMN meta_description TEXT;
        RAISE NOTICE 'Added meta_description column';
    END IF;

    -- Add keywords column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='keywords') THEN
        ALTER TABLE public.content_queue ADD COLUMN keywords TEXT[];
        RAISE NOTICE 'Added keywords column';
    END IF;

    -- Add views column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='views') THEN
        ALTER TABLE public.content_queue ADD COLUMN views INTEGER DEFAULT 0;
        RAISE NOTICE 'Added views column';
    END IF;

    -- Add clicks column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='clicks') THEN
        ALTER TABLE public.content_queue ADD COLUMN clicks INTEGER DEFAULT 0;
        RAISE NOTICE 'Added clicks column';
    END IF;

    -- Add leads_generated column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='leads_generated') THEN
        ALTER TABLE public.content_queue ADD COLUMN leads_generated INTEGER DEFAULT 0;
        RAISE NOTICE 'Added leads_generated column';
    END IF;

    -- Add reviewed_by column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_by') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_by TEXT;
        RAISE NOTICE 'Added reviewed_by column';
    END IF;

    -- Add reviewed_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='reviewed_at') THEN
        ALTER TABLE public.content_queue ADD COLUMN reviewed_at TIMESTAMPTZ;
        RAISE NOTICE 'Added reviewed_at column';
    END IF;

    -- Add rejection_reason column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='content_queue' AND column_name='rejection_reason') THEN
        ALTER TABLE public.content_queue ADD COLUMN rejection_reason TEXT;
        RAISE NOTICE 'Added rejection_reason column';
    END IF;

    -- Update source check constraint if it exists
    ALTER TABLE public.content_queue DROP CONSTRAINT IF EXISTS content_queue_source_check;
    ALTER TABLE public.content_queue ADD CONSTRAINT content_queue_source_check 
        CHECK (source IN ('automation', 'manual', 'ai_assist', 'repurposed'));

    RAISE NOTICE '✅ All missing columns added successfully!';
END $$;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';




