CREATE TABLE reviews (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES technician_bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    rating INT NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES technician_bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(10) NOT NULL,
    status VARCHAR(30) NOT NULL,
    payment_provider VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) NOT NULL,
    paid_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE technician_earnings (
    id UUID PRIMARY KEY,
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    today DOUBLE PRECISION NOT NULL,
    this_week DOUBLE PRECISION NOT NULL,
    this_month DOUBLE PRECISION NOT NULL,
    lifetime DOUBLE PRECISION NOT NULL,
    pending DOUBLE PRECISION NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_reviews_technician ON reviews(technician_id);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_earnings_technician ON technician_earnings(technician_id);
