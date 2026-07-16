CREATE TABLE IF NOT EXISTS pairup_signups (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(80) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  phone_normalized VARCHAR(15) NOT NULL UNIQUE,
  badge VARCHAR(32) NOT NULL,
  referral_code VARCHAR(12) NOT NULL UNIQUE,
  referred_by_id BIGINT,
  source VARCHAR(32) NOT NULL DEFAULT 'prelaunch',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE pairup_signups
  ADD COLUMN IF NOT EXISTS badge VARCHAR(32);

ALTER TABLE pairup_signups
  ADD COLUMN IF NOT EXISTS referral_code VARCHAR(12),
  ADD COLUMN IF NOT EXISTS referred_by_id BIGINT;

UPDATE pairup_signups
SET referral_code = 'PU' || UPPER(SUBSTRING(MD5(id::text || created_at::text), 1, 10))
WHERE referral_code IS NULL;

ALTER TABLE pairup_signups
  ALTER COLUMN referral_code SET NOT NULL;

ALTER TABLE pairup_signups
  DROP CONSTRAINT IF EXISTS pairup_signups_badge_check;

ALTER TABLE pairup_signups
  ADD CONSTRAINT pairup_signups_badge_check CHECK (
    badge IN (
      'diet-coke',
      'scrunchie',
      'lip-gloss',
      'jordan-wolf-grey',
      'porsche-911-gt3-rs',
      'koenigsegg-jesko',
      'claw-clip',
      'teddy',
      'burger',
      'eiffel-tower'
    )
  );

ALTER TABLE pairup_signups
  DROP CONSTRAINT IF EXISTS pairup_signups_badge_required;

ALTER TABLE pairup_signups
  ADD CONSTRAINT pairup_signups_badge_required CHECK (badge IS NOT NULL) NOT VALID;

ALTER TABLE pairup_signups
  DROP CONSTRAINT IF EXISTS pairup_signups_referral_code_check;

ALTER TABLE pairup_signups
  ADD CONSTRAINT pairup_signups_referral_code_check CHECK (
    referral_code ~ '^[A-Z0-9]{10,12}$'
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'pairup_signups_referred_by_fkey'
  ) THEN
    ALTER TABLE pairup_signups
      ADD CONSTRAINT pairup_signups_referred_by_fkey
      FOREIGN KEY (referred_by_id) REFERENCES pairup_signups(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS pairup_signups_referral_code_idx
  ON pairup_signups (referral_code);

CREATE INDEX IF NOT EXISTS pairup_signups_referred_by_idx
  ON pairup_signups (referred_by_id);

CREATE INDEX IF NOT EXISTS pairup_signups_created_at_idx
  ON pairup_signups (created_at DESC);
