-- =====================================================
-- SIMPLE FIX: Add only the most critical missing columns
-- Run this in Supabase SQL Editor if the full fix failed
-- =====================================================

-- Add image_prompt (currently failing)
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS image_prompt TEXT;

-- Add content (critical)
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS content TEXT NOT NULL DEFAULT '';

-- Add ai_model  
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gpt-4o-mini';

-- Add other essential columns
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT true;
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS generation_prompt TEXT;
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::JSONB;
ALTER TABLE public.content_queue ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'automation';

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Success
DO $$ 
BEGIN 
    RAISE NOTICE '✅ Essential columns added! Try content generation now.';
END $$;




