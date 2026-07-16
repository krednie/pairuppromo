# PairUp Production Backend Runbook

This is the current deployment procedure for PairUp. The Vercel project and
Neon database already exist. Do not create another database or integration.

The current signup flow saves one complete record only after a builder has:

1. Entered a valid name and phone number.
2. Selected one founding charm.
3. Reached the final optional referral-code field.
4. Accepted the card a second time.

Each completed builder receives a permanent referral code. When another
builder enters that code, the new row stores the original builder in
`referred_by_id`.

## Release Order

Run the database migration before deploying the new API. The old deployment
continues to work after the migration, so this order avoids downtime:

1. Confirm the production database connection.
2. Back up or inspect the existing rows.
3. Run `db/schema.sql` in Neon.
4. Verify the migrated schema and existing data.
5. Push the code and deploy it on Vercel.
6. Test one normal signup and one referred signup.

Do not remove the new database columns when rolling back application code.
They are backward-compatible with the previous deployment.

## 1. Confirm The Production Database

1. Open the PairUp project in Vercel.
2. Go to **Settings > Environment Variables**.
3. Confirm `DATABASE_URL` exists for **Production**.
4. Enable it for **Preview** only if preview deployments should write to this
   database. A separate Neon branch is safer for previews.
5. Open the connected Neon project and select the branch/database referenced
   by `DATABASE_URL`.

Use a pooled Neon connection string. Never paste it into source files, commit
it, or expose it in browser environment variables such as `VITE_*`.

## 2. Inspect Existing Data

In the Neon SQL Editor, run:

```sql
SELECT COUNT(*)::int AS existing_signups
FROM pairup_signups;

SELECT id, name, phone_normalized, badge, created_at
FROM pairup_signups
ORDER BY created_at DESC
LIMIT 20;
```

Export the table from Neon before migration if these records are important and
no recent backup exists.

## 3. Run The Migration

1. Open [`db/schema.sql`](db/schema.sql) from this repository.
2. Copy the entire file into the Neon SQL Editor.
3. Confirm the editor is connected to the production branch and database.
4. Run the complete file once.

The migration is repeatable. It:

- Keeps existing signups.
- Adds and validates the ten allowed charm identifiers.
- Adds `referral_code` and `referred_by_id`.
- Backfills a unique referral code for every existing builder.
- Requires referral codes for all rows.
- Requires charms for new or updated rows.
- Adds the referral foreign key and lookup indexes.

Existing rows without a charm remain readable. The charm-required constraint
is created with `NOT VALID`, which still enforces the rule for every new or
updated row without deleting legacy records.

## 4. Verify The Migration

Run all three checks.

### Required columns

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'pairup_signups'
  AND column_name IN (
    'badge',
    'referral_code',
    'referred_by_id'
  )
ORDER BY column_name;
```

Expected: three rows. `referral_code` must have `is_nullable = NO`.

### Backfill and uniqueness

```sql
SELECT
  COUNT(*) FILTER (WHERE referral_code IS NULL)::int AS missing_codes,
  COUNT(*)::int AS total_rows,
  COUNT(DISTINCT referral_code)::int AS unique_codes,
  COUNT(*) FILTER (WHERE badge IS NULL)::int AS legacy_rows_without_charm
FROM pairup_signups;
```

Expected:

- `missing_codes` is `0`.
- `total_rows` equals `unique_codes`.
- `legacy_rows_without_charm` may be greater than zero for old signups.

### Foreign key and indexes

```sql
SELECT indexname
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'pairup_signups'
ORDER BY indexname;

SELECT conname, contype, convalidated
FROM pg_constraint
WHERE conrelid = 'pairup_signups'::regclass
ORDER BY conname;
```

Expected indexes include:

- `pairup_signups_phone_normalized_key`
- `pairup_signups_referral_code_idx`
- `pairup_signups_referred_by_idx`
- `pairup_signups_created_at_idx`

`pairup_signups_badge_required` may show `convalidated = false` while legacy
rows have no charm. This is intentional. Once every old row has a valid charm,
it can be fully validated with:

```sql
ALTER TABLE pairup_signups
VALIDATE CONSTRAINT pairup_signups_badge_required;
```

Do not run that command until `legacy_rows_without_charm` is zero.

## 5. Deploy On Vercel

From the repository root, verify the exact revision being pushed:

```bash
npm ci
npm run build
npm run audit:ui
git status --short
```

Then commit and push the intended files. Vercel should build the connected
branch automatically. In the Vercel deployment page, confirm:

- Build command: `npm run build`
- Output directory: `dist`
- The deployment status is **Ready**
- `DATABASE_URL` is available to the deployment environment
- `/api/signup` appears in the Functions list

Do not set an Install Command that installs a global or prerelease TypeScript
version. The project pins TypeScript in `devDependencies`, and `npm ci` should
use the committed lockfile.

## 6. Test The Production Flow

Use phone numbers you control.

### Builder A

1. Open `https://pairuppromo.vercel.app/`.
2. Enter a name and phone number in the final profile card.
3. Select a charm.
4. Press the coral check button or swipe right.
5. Confirm the optional referral field appears only now.
6. Leave it empty and accept again.
7. Record the referral code shown on the success card.

No database request should occur before step 6.

### Builder B

1. Repeat the flow with a different phone number.
2. Enter Builder A's code in the final referral field.
3. Accept the card.

Verify both rows in Neon:

```sql
SELECT
  id,
  name,
  phone_normalized,
  badge,
  referral_code,
  referred_by_id,
  created_at,
  updated_at
FROM pairup_signups
ORDER BY created_at DESC
LIMIT 20;
```

Builder B's `referred_by_id` must equal Builder A's `id`. Both builders must
have a valid charm and their own distinct referral code.

Test duplicate handling by submitting Builder A's phone number again with a
different name or charm. The existing row should update without changing its
`id`, `referral_code`, or existing `referred_by_id`.

## Referral Reporting

Use this query for referral totals:

```sql
SELECT
  owner.id,
  owner.name,
  owner.referral_code,
  COUNT(referred.id)::int AS referrals
FROM pairup_signups AS owner
LEFT JOIN pairup_signups AS referred
  ON referred.referred_by_id = owner.id
GROUP BY owner.id
ORDER BY referrals DESC, owner.created_at ASC;
```

One signup can credit only one referrer. Re-submitting the same phone number
does not create another referral or replace an existing attribution.

## Data Correction And Deletion

PairUp accepts requests at `krednie@gmail.com`. Verify ownership before
changing or deleting a record. Search by normalized phone number:

```sql
SELECT id, name, phone, phone_normalized, badge, referral_code, created_at
FROM pairup_signups
WHERE phone_normalized = '919876543210';
```

Delete only after confirming the exact row:

```sql
DELETE FROM pairup_signups
WHERE id = 12345
RETURNING id, phone_normalized;
```

Deleting a referrer sets their referrals' `referred_by_id` to `NULL`; it does
not delete those other builders.

## Troubleshooting

### `Signup is temporarily unavailable`

The function cannot read `DATABASE_URL`. Confirm the variable is enabled for
the failing Vercel environment, then redeploy.

### `Could not save your profile`

1. Open **Vercel > Deployments > Logs**.
2. Filter for `/api/signup`.
3. Confirm `db/schema.sql` ran against the same database used by Vercel.
4. Re-run the migration verification queries.
5. Confirm the Neon project is active and the connection string is pooled.

Errors mentioning missing `badge`, `referral_code`, or `referred_by_id` mean
the API was deployed before the production migration completed.

### Referral code is rejected

Codes are case-insensitive in the UI and stored uppercase. The API rejects
unknown codes and self-referrals with the same generic message. Verify the
code directly in Neon without exposing the owner's phone number:

```sql
SELECT id, referral_code
FROM pairup_signups
WHERE referral_code = 'PUXXXXXXXX';
```

### Local `/api/signup` returns 404

`npm run dev` starts Vite only. For a real local function test:

```bash
npx vercel link
npx vercel dev
```

Use a separate Neon development branch where possible.

## Operational Rules

- Treat names, phone numbers, and referral relationships as personal data.
- Never expose a public endpoint that lists signups.
- Never log request bodies or complete phone numbers.
- Restrict Neon and Vercel access to the PairUp team.
- Keep production and preview databases separate where practical.
- Review failed function requests and Neon usage after each release.
- Replace unlicensed prototype product imagery before commercial launch; see
  [`BADGE_ASSETS.md`](BADGE_ASSETS.md).
