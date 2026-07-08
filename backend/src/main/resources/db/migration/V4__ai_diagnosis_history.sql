CREATE TABLE ai_diagnosis_history (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(1024) NOT NULL,
    appliance_type VARCHAR(100),
    brand VARCHAR(100),
    visible_problems TEXT,
    severity VARCHAR(20),
    possible_causes TEXT,
    recommended_actions TEXT,
    technician_required BOOLEAN,
    confidence DOUBLE PRECISION,
    timestamp TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_ai_diagnosis_history_user_id ON ai_diagnosis_history(user_id);
