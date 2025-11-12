-- ============================================================================
-- FIX EMAIL LOGS TABLE - Add Missing Columns
-- ============================================================================
-- This migration adds columns that the application code expects but are
-- missing from the email_logs table schema
-- ============================================================================

-- Add ai_generated column (used to track if email content was AI-generated)
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT FALSE;

-- Add personalization_data column (used to store email personalization variables)
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS personalization_data JSONB DEFAULT '{}';

-- Add clicked_at column (used to track first click timestamp)
ALTER TABLE email_logs 
ADD COLUMN IF NOT EXISTS clicked_at TIMESTAMPTZ;

-- Create index for ai_generated for filtering AI vs manual emails
CREATE INDEX IF NOT EXISTS idx_email_logs_ai_generated ON email_logs(ai_generated);

-- ============================================================================
-- COMPLETED: Email Logs Table Fix
-- ============================================================================
-- Added columns:
-- - ai_generated (BOOLEAN) - tracks AI-generated email content
-- - personalization_data (JSONB) - stores template variables
-- - clicked_at (TIMESTAMPTZ) - tracks first link click
-- ============================================================================

