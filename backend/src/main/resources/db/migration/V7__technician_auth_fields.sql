ALTER TABLE technicians ADD COLUMN password_hash VARCHAR(255);
ALTER TABLE technicians ADD COLUMN service_radius DOUBLE PRECISION;
ALTER TABLE technicians ADD COLUMN bio VARCHAR(1000);
ALTER TABLE technicians ADD COLUMN languages VARCHAR(255);
ALTER TABLE technicians ADD COLUMN inspection_charge DOUBLE PRECISION;
