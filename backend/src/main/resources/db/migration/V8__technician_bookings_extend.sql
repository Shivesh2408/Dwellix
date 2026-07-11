ALTER TABLE technician_bookings ADD COLUMN assigned_technician_id UUID;
ALTER TABLE technician_bookings ADD COLUMN booking_status VARCHAR(30);
ALTER TABLE technician_bookings ADD COLUMN accepted_at TIMESTAMPTZ;
ALTER TABLE technician_bookings ADD COLUMN started_at TIMESTAMPTZ;
ALTER TABLE technician_bookings ADD COLUMN completed_at TIMESTAMPTZ;
ALTER TABLE technician_bookings ADD COLUMN estimated_arrival TIMESTAMPTZ;
ALTER TABLE technician_bookings ADD COLUMN service_charge DOUBLE PRECISION;
ALTER TABLE technician_bookings ADD COLUMN inspection_charge DOUBLE PRECISION;
