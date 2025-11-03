-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    notes TEXT,
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Services table
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- in minutes
    price DECIMAL(10, 2) NOT NULL,
    requires_deposit BOOLEAN DEFAULT false,
    deposit_amount DECIMAL(10, 2),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT positive_duration CHECK (duration > 0),
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT valid_deposit CHECK (
        (requires_deposit = false AND deposit_amount IS NULL) OR 
        (requires_deposit = true AND deposit_amount IS NOT NULL AND deposit_amount >= 0)
    )
);

-- Locations table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    postcode TEXT NOT NULL,
    phone TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE RESTRICT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    price DECIMAL(10, 2) NOT NULL,
    deposit_paid BOOLEAN DEFAULT false,
    deposit_amount DECIMAL(10, 2),
    CONSTRAINT valid_time_range CHECK (end_time > start_time),
    CONSTRAINT positive_price CHECK (price >= 0),
    CONSTRAINT valid_deposit_amount CHECK (
        (deposit_amount IS NULL) OR 
        (deposit_amount IS NOT NULL AND deposit_amount >= 0 AND deposit_amount <= price)
    )
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_client_id ON public.bookings(client_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_location_id ON public.bookings(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_time_range ON public.bookings(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_clients_email ON public.clients(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at
BEFORE UPDATE ON public.locations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check for booking conflicts
CREATE OR REPLACE FUNCTION check_booking_conflict()
RETURNS TRIGGER AS $$
DECLARE
    conflict_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM public.bookings
        WHERE location_id = NEW.location_id
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000')
        AND status != 'cancelled'
        AND (
            (start_time < NEW.end_time AND end_time > NEW.start_time)
        )
    ) INTO conflict_exists;
    
    IF conflict_exists THEN
        RAISE EXCEPTION 'Booking conflict: Another booking exists for this time slot';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to prevent double bookings
CREATE TRIGGER prevent_double_booking
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
WHEN (NEW.status != 'cancelled')
EXECUTE FUNCTION check_booking_conflict();

-- Function to calculate end time based on service duration
CREATE OR REPLACE FUNCTION calculate_end_time()
RETURNS TRIGGER AS $$
BEGIN
    SELECT NEW.start_time + (duration * INTERVAL '1 minute')
    INTO NEW.end_time
    FROM public.services
    WHERE id = NEW.service_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate end time
CREATE TRIGGER set_booking_end_time
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION calculate_end_time();

-- Function to set price and deposit based on service
CREATE OR REPLACE FUNCTION set_booking_pricing()
RETURNS TRIGGER AS $$
BEGIN
    SELECT 
        price,
        CASE WHEN requires_deposit THEN deposit_amount ELSE NULL END
    INTO 
        NEW.price,
        NEW.deposit_amount
    FROM public.services
    WHERE id = NEW.service_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to set pricing
CREATE TRIGGER set_booking_pricing_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION set_booking_pricing();
