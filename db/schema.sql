CREATE TABLE IF NOT EXISTS pairup_signups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  phone_normalized VARCHAR(15) NOT NULL UNIQUE,
  source VARCHAR(32) NOT NULL DEFAULT 'prelaunch',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS pairup_signups_created_at_idx
  ON pairup_signups (created_at DESC);
