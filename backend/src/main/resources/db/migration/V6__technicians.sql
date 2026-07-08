CREATE TABLE technicians (
    id UUID PRIMARY KEY,
    name VARCHAR(140) NOT NULL,
    photo_url VARCHAR(255),
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL,
    rating DOUBLE PRECISION NOT NULL,
    total_reviews INT NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    availability VARCHAR(100) NOT NULL,
    hourly_rate DOUBLE PRECISION NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

-- Seed Technicians
INSERT INTO technicians (id, name, photo_url, specialization, experience_years, rating, total_reviews, phone, email, city, availability, hourly_rate, verified, created_at, updated_at) VALUES 
('a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d', 'Ramesh Kumar', 'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,g_face/r_max/dpr_auto/f_auto/q_auto/v1/sample.jpg', 'AC & Cooling Specialist', 8, 4.9, 124, '+91 98765 43210', 'ramesh.kumar@dwellix.in', 'Delhi', 'Mon - Sat (09:00 AM - 06:00 PM)', 800.00, true, NOW(), NOW()),
('b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e', 'Vikram Singh', 'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,g_face/r_max/dpr_auto/f_auto/q_auto/v1/sample.jpg', 'Refrigerator & Washing Machine Repair', 6, 4.8, 98, '+91 98765 43211', 'vikram.singh@dwellix.in', 'Mumbai', 'Mon - Sun (08:00 AM - 08:00 PM)', 950.00, true, NOW(), NOW()),
('c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f', 'Amit Patel', 'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,g_face/r_max/dpr_auto/f_auto/q_auto/v1/sample.jpg', 'Plumbing & Kitchen Appliance Expert', 10, 4.7, 142, '+91 98765 43212', 'amit.patel@dwellix.in', 'Bangalore', 'Tue - Sun (09:00 AM - 07:00 PM)', 600.00, true, NOW(), NOW()),
('d4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a', 'Sanjay Rao', 'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_fill,g_face/r_max/dpr_auto/f_auto/q_auto/v1/sample.jpg', 'Electrical Systems & Smart Appliances', 12, 4.9, 210, '+91 98765 43213', 'sanjay.rao@dwellix.in', 'Pune', 'Mon - Sat (08:00 AM - 05:00 PM)', 1200.00, true, NOW(), NOW());
