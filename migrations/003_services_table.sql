-- ============================================================================
-- SERVICES TABLE MIGRATION
-- Add services table to store salon services in database
-- ============================================================================

-- Create services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Service details
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    duration INTEGER NOT NULL CHECK (duration > 0), -- Duration in minutes
    
    -- Deposit requirements
    requires_deposit BOOLEAN DEFAULT FALSE,
    deposit_amount DECIMAL(10, 2) DEFAULT 0 CHECK (deposit_amount >= 0),
    
    -- Service status
    active BOOLEAN DEFAULT TRUE,
    
    -- Display order
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    category TEXT, -- e.g., 'cut', 'colour', 'styling', 'treatment'
    image_url TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(active);
CREATE INDEX IF NOT EXISTS idx_services_display_order ON public.services(display_order);
CREATE INDEX IF NOT EXISTS idx_services_category ON public.services(category);

-- Auto-update updated_at timestamp
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED DATA - Initial Services
-- Based on existing bookingConfig.ts services
-- ============================================================================

INSERT INTO public.services (name, description, price, duration, requires_deposit, deposit_amount, active, display_order, category) VALUES
    ('Precision Cut', 'Perfect for maintaining shape and creating wearable styles that last 8-10 weeks', 79.00, 60, FALSE, 0, TRUE, 1, 'cut'),
    ('Ladies Restyle', 'Significant changes, new looks, and transformations', 89.00, 90, TRUE, 25.00, TRUE, 2, 'cut'),
    ('Gents Restyle', 'Professional restyle for gentlemen', 49.00, 60, FALSE, 0, TRUE, 3, 'cut'),
    ('Cut & Finish', 'Full cut and styling service', 85.00, 90, FALSE, 0, TRUE, 4, 'cut'),
    ('Colour Service', 'Professional colour application', 120.00, 120, TRUE, 30.00, TRUE, 5, 'colour'),
    ('Balayage', 'Hand-painted highlights for natural, sun-kissed look', 180.00, 180, TRUE, 50.00, TRUE, 6, 'colour'),
    ('Highlights', 'Traditional foil highlights', 150.00, 150, TRUE, 40.00, TRUE, 7, 'colour'),
    ('Styling', 'Professional blow-dry and styling', 45.00, 45, FALSE, 0, TRUE, 8, 'styling'),
    ('Treatment', 'Deep conditioning and repair treatment', 35.00, 30, FALSE, 0, TRUE, 9, 'treatment')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMPLETED: Services Table Migration
-- ============================================================================




