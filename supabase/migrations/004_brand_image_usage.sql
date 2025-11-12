-- Brand Image Usage Tracking
-- Tracks usage of brand images for rotation system

CREATE TABLE IF NOT EXISTS brand_image_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_path TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups by category
CREATE INDEX IF NOT EXISTS idx_brand_image_usage_category ON brand_image_usage(category);

-- Create index for rotation queries (by usage_count and last_used)
CREATE INDEX IF NOT EXISTS idx_brand_image_usage_rotation ON brand_image_usage(category, usage_count, last_used);

-- Add RLS policies (admin only for now)
ALTER TABLE brand_image_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role to manage image usage
CREATE POLICY "Service role can manage brand_image_usage"
  ON brand_image_usage
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Update timestamp on modification
CREATE OR REPLACE FUNCTION update_brand_image_usage_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_image_usage_timestamp
  BEFORE UPDATE ON brand_image_usage
  FOR EACH ROW
  EXECUTE FUNCTION update_brand_image_usage_updated_at();


