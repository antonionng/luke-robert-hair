-- ============================================================================
-- CLIENT REFERRAL SYSTEM - Database Schema
-- ============================================================================
-- Enables client-to-client referrals with unique codes, discount tracking,
-- and comprehensive analytics without requiring user accounts
-- ============================================================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- REFERRAL CODES TABLE
-- Stores unique referral codes that clients can share with friends
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Unique referral code (e.g., "LUKE-SARAH-ABC123")
  code TEXT UNIQUE NOT NULL,
  
  -- Referrer information (person who owns the code)
  referrer_email TEXT NOT NULL,
  referrer_name TEXT NOT NULL,
  referrer_phone TEXT,
  
  -- Code lifecycle
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Optional expiry (e.g., 6 months)
  
  -- Usage limits
  total_uses INTEGER DEFAULT 0, -- How many times code has been used
  max_uses INTEGER DEFAULT 10, -- Maximum allowed uses (10 friends)
  
  -- Discount configuration
  discount_type TEXT DEFAULT 'fixed' CHECK (discount_type IN ('fixed', 'percentage')),
  discount_value DECIMAL(10, 2) DEFAULT 10.00, -- £10 off or 10%
  
  -- Metadata
  notes TEXT, -- Admin notes
  last_used_at TIMESTAMPTZ
);

-- Indexes for referral_codes
CREATE INDEX IF NOT EXISTS idx_referral_codes_code ON public.referral_codes(code);
CREATE INDEX IF NOT EXISTS idx_referral_codes_email ON public.referral_codes(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referral_codes_status ON public.referral_codes(status);
CREATE INDEX IF NOT EXISTS idx_referral_codes_created_at ON public.referral_codes(created_at DESC);

-- ============================================================================
-- REFERRAL REDEMPTIONS TABLE
-- Tracks when someone uses a referral code
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.referral_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Link to referral code
  referral_code_id UUID NOT NULL REFERENCES public.referral_codes(id) ON DELETE CASCADE,
  
  -- Referee information (person who used the code)
  referee_email TEXT NOT NULL,
  referee_name TEXT NOT NULL,
  referee_phone TEXT,
  
  -- Booking tracking
  booking_id UUID, -- May be NULL if they haven't booked yet
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  
  -- Status tracking
  redeemed_at TIMESTAMPTZ DEFAULT NOW(),
  booking_completed BOOLEAN DEFAULT FALSE,
  booking_completed_at TIMESTAMPTZ,
  
  -- Discount amounts
  referee_discount_amount DECIMAL(10, 2), -- Discount given to the friend
  referrer_credit_amount DECIMAL(10, 2), -- Credit earned by the referrer
  
  -- Metadata
  redemption_source TEXT DEFAULT 'booking', -- 'booking', 'landing_page', etc.
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes for referral_redemptions
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_code_id ON public.referral_redemptions(referral_code_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_referee_email ON public.referral_redemptions(referee_email);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_booking_id ON public.referral_redemptions(booking_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_lead_id ON public.referral_redemptions(lead_id);
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_redeemed_at ON public.referral_redemptions(redeemed_at DESC);

-- Composite index for checking if email already used a code
CREATE INDEX IF NOT EXISTS idx_referral_redemptions_code_email 
  ON public.referral_redemptions(referral_code_id, referee_email);

-- ============================================================================
-- EXTEND BOOKINGS TABLE
-- Add referral tracking to existing bookings
-- ============================================================================

-- Check if columns already exist before adding them
DO $$ 
BEGIN
  -- Add referral_code_applied column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'referral_code_applied'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN referral_code_applied TEXT;
  END IF;

  -- Add discount_amount column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'discount_amount'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN discount_amount DECIMAL(10, 2) DEFAULT 0;
  END IF;

  -- Add original_price column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'bookings' 
    AND column_name = 'original_price'
  ) THEN
    ALTER TABLE public.bookings ADD COLUMN original_price DECIMAL(10, 2);
  END IF;
END $$;

-- Create index on referral_code_applied for analytics
CREATE INDEX IF NOT EXISTS idx_bookings_referral_code ON public.bookings(referral_code_applied);

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to update total_uses and last_used_at when a code is redeemed
CREATE OR REPLACE FUNCTION update_referral_code_usage()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.referral_codes
  SET 
    total_uses = total_uses + 1,
    last_used_at = NOW()
  WHERE id = NEW.referral_code_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update usage stats
DROP TRIGGER IF EXISTS trigger_update_referral_usage ON public.referral_redemptions;
CREATE TRIGGER trigger_update_referral_usage
AFTER INSERT ON public.referral_redemptions
FOR EACH ROW
EXECUTE FUNCTION update_referral_code_usage();

-- Function to check if code has reached max uses
CREATE OR REPLACE FUNCTION check_referral_code_limit()
RETURNS TRIGGER AS $$
DECLARE
  current_uses INTEGER;
  max_allowed INTEGER;
BEGIN
  SELECT total_uses, max_uses 
  INTO current_uses, max_allowed
  FROM public.referral_codes
  WHERE id = NEW.referral_code_id;
  
  IF current_uses >= max_allowed THEN
    RAISE EXCEPTION 'Referral code has reached maximum uses';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent over-use of codes
DROP TRIGGER IF EXISTS trigger_check_referral_limit ON public.referral_redemptions;
CREATE TRIGGER trigger_check_referral_limit
BEFORE INSERT ON public.referral_redemptions
FOR EACH ROW
EXECUTE FUNCTION check_referral_code_limit();

-- ============================================================================
-- VIEWS FOR ANALYTICS
-- ============================================================================

-- View: Referral leaderboard with stats
CREATE OR REPLACE VIEW referral_leaderboard AS
SELECT 
  rc.id,
  rc.code,
  rc.referrer_name,
  rc.referrer_email,
  rc.total_uses,
  rc.max_uses,
  rc.status,
  rc.created_at,
  COUNT(rr.id) AS total_redemptions,
  COUNT(rr.id) FILTER (WHERE rr.booking_completed = TRUE) AS completed_bookings,
  SUM(rr.referee_discount_amount) FILTER (WHERE rr.booking_completed = TRUE) AS total_discounts_given,
  SUM(rr.referrer_credit_amount) FILTER (WHERE rr.booking_completed = TRUE) AS total_credits_earned,
  CASE 
    WHEN COUNT(rr.id) > 0 
    THEN ROUND(100.0 * COUNT(rr.id) FILTER (WHERE rr.booking_completed = TRUE) / COUNT(rr.id), 2)
    ELSE 0 
  END AS conversion_rate
FROM public.referral_codes rc
LEFT JOIN public.referral_redemptions rr ON rc.id = rr.referral_code_id
GROUP BY rc.id, rc.code, rc.referrer_name, rc.referrer_email, rc.total_uses, rc.max_uses, rc.status, rc.created_at
ORDER BY completed_bookings DESC, total_uses DESC;

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_redemptions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for service role (backend)
DROP POLICY IF EXISTS "Enable all for service role - referral_codes" ON public.referral_codes;
CREATE POLICY "Enable all for service role - referral_codes" 
ON public.referral_codes FOR ALL 
USING (true);

DROP POLICY IF EXISTS "Enable all for service role - referral_redemptions" ON public.referral_redemptions;
CREATE POLICY "Enable all for service role - referral_redemptions" 
ON public.referral_redemptions FOR ALL 
USING (true);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Uncomment to insert sample referral code
-- INSERT INTO public.referral_codes (code, referrer_email, referrer_name, discount_type, discount_value, max_uses)
-- VALUES ('LUKE-SARAH-ABC123', 'sarah@example.com', 'Sarah Johnson', 'fixed', 10.00, 10);

-- ============================================================================
-- COMPLETED: Referral System Schema
-- ============================================================================
-- Total new tables: 2 (referral_codes, referral_redemptions)
-- Extended tables: 1 (bookings)
-- Views: 1 (referral_leaderboard)
-- Functions: 2 (usage tracking, limit checking)
-- Triggers: 2 (auto-update stats, prevent over-use)
-- ============================================================================

