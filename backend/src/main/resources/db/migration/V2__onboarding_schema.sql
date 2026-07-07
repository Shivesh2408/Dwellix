CREATE TABLE homes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
  home_name VARCHAR(140) NOT NULL,
  home_type VARCHAR(40) NOT NULL,
  address VARCHAR(255) NOT NULL,
  city VARCHAR(120) NOT NULL,
  state VARCHAR(120) NOT NULL,
  pincode VARCHAR(12) NOT NULL,
  setup_completed BOOLEAN NOT NULL DEFAULT FALSE,
  setup_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  home_id UUID NOT NULL REFERENCES homes (id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  notes VARCHAR(240),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE appliances (
  id UUID PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES rooms (id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  brand VARCHAR(120) NOT NULL,
  model VARCHAR(120) NOT NULL,
  purchase_date DATE NOT NULL,
  warranty_expiry DATE NOT NULL,
  photo_file_name VARCHAR(255),
  invoice_file_name VARCHAR(255),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_rooms_home_id ON rooms (home_id);
CREATE INDEX idx_appliances_room_id ON appliances (room_id);
