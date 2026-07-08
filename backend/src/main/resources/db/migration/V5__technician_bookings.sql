CREATE TABLE technician_bookings (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    appliance_id UUID NOT NULL REFERENCES appliances(id) ON DELETE CASCADE,
    technician_name VARCHAR(140),
    technician_phone VARCHAR(30),
    service_type VARCHAR(100) NOT NULL,
    problem_description TEXT NOT NULL,
    booking_date DATE NOT NULL,
    booking_time VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL,
    estimated_cost DOUBLE PRECISION,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_technician_bookings_user_id ON technician_bookings(user_id);
CREATE INDEX idx_technician_bookings_appliance_id ON technician_bookings(appliance_id);
