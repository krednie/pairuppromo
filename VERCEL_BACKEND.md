# PairUp Signup Persistence

The profile form sends only the builder's name and phone number to
POST /api/signup. Phone numbers are normalized for duplicate detection.
Submitting the same number again updates the existing record.

## Before You Start

You need:

1. The PairUp project already deployed on Vercel.
2. Permission to install integrations for the Vercel team that owns it.
3. Access to the Neon project that will hold production signup data.

The repository already contains:

- api/signup.ts: the Vercel Function.
- db/schema.sql: the database table and index.
- DATABASE_URL support in the function.
- @neondatabase/serverless in package.json.

## Option A: Create Neon Through Vercel

Use this option when PairUp does not already have a Neon database.

### 1. Install Neon

1. Sign in to https://vercel.com/dashboard.
2. Select the team that owns the PairUp project.
3. Open **Integrations** in the left sidebar.
4. Select **Browse Marketplace**.
5. Search for **Neon**.
6. Open **Neon Postgres** and select **Install**.
7. Review the requested permissions and select **Install** again.
8. Choose **Create New Neon Account** when asked which integration mode to use.

Official integration page:
https://vercel.com/marketplace/neon/neon

### 2. Create the Database

1. Select the free plan unless PairUp already needs a paid Neon plan.
2. Choose a region close to the Vercel Function region. For users in India,
   select the closest available Asian region.
3. Set the database or resource name to **pairup-production**.
4. Select **Create**.
5. When Vercel asks which project to connect, choose the deployed PairUp
   project.
6. Enable the connection for:
   - Production
   - Preview
   - Development
7. Finish the connection.

Vercel should now inject the database credentials into the selected project.

### 3. Confirm DATABASE_URL

1. Open the PairUp project in Vercel.
2. Open **Settings**.
3. Open **Environment Variables**.
4. Search for **DATABASE_URL**.
5. Confirm it exists for Production, Preview, and Development.
6. Do not reveal, paste into chat, or commit its value.

If DATABASE_URL is missing, use the manual fallback later in this document.

### 4. Create the Signup Table

1. Return to the PairUp project in Vercel.
2. Open **Storage**.
3. Select the connected Neon database.
4. Select **Open in Neon Console**.
5. In Neon, select the production branch, normally named **main**.
6. Open **SQL Editor**.
7. Confirm the selected database is the database connected to PairUp.
8. Paste and run the following SQL:

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

9. Wait for the SQL Editor to report success.
10. Run this query to verify the table exists:

    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'pairup_signups';

The result must contain one row named pairup_signups.

### 5. Redeploy PairUp

Environment variables are available only to new deployments.

1. Return to the PairUp project in Vercel.
2. Open **Deployments**.
3. Open the menu for the latest production deployment.
4. Select **Redeploy**.
5. Keep the existing production domain selected.
6. Confirm the redeploy.
7. Wait until the deployment status is **Ready**.

### 6. Test a Real Signup

1. Open the production PairUp URL.
2. Scroll to the Founding Builder profile card.
3. Enter a test name and a phone number you control.
4. Press the green check button or swipe the card right.
5. Confirm the success card appears.
6. Return to Neon's SQL Editor.
7. Run:

    SELECT id, name, phone, source, created_at, updated_at
    FROM pairup_signups
    ORDER BY created_at DESC
    LIMIT 20;

8. Confirm the test signup is the first row.
9. Submit the same phone number again with a changed name.
10. Run the query again. The same row should have the new name and a newer
    updated_at value; a duplicate row should not be created.

Delete the test row if it should not remain:

    DELETE FROM pairup_signups
    WHERE phone_normalized = '919876543210';

Replace the example number with the normalized test number before running the
delete query. Indian ten-digit numbers are stored with 91 prefixed.

## Option B: Link an Existing Neon Project

Use this option when a Neon account and database already exist.

1. Install Neon from the Vercel Marketplace using the steps above.
2. Choose **Link Existing Neon Account** instead of Create New Neon Account.
3. Authorize Vercel in Neon.
4. Select the existing Neon project, branch, database, and role.
5. Connect it to the PairUp Vercel project.
6. Enable Production, Preview, and Development.
7. Confirm DATABASE_URL under Vercel project **Settings > Environment
   Variables**.
8. Run db/schema.sql in that Neon database's SQL Editor.
9. Redeploy and complete the real-signup verification above.

## Manual DATABASE_URL Fallback

Use this only if the integration did not inject DATABASE_URL.

1. Open the Neon Console.
2. Open the PairUp Neon project.
3. Select **Connect**.
4. Select the production branch, database, and role.
5. Copy the pooled Postgres connection string.
6. In Vercel, open the PairUp project.
7. Go to **Settings > Environment Variables**.
8. Select **Add New**.
9. Set the name to **DATABASE_URL**.
10. Paste the Neon connection string as the value.
11. Enable Production, Preview, and Development.
12. Mark it sensitive if Vercel presents that option.
13. Select **Save**.
14. Redeploy the production deployment.

Never place the real connection string in .env.example or commit it to Git.

## Local End-to-End Test

Plain Vite does not execute files in api/. Use Vercel's local runtime:

1. From the repository root, run:

    npx vercel login

2. Link the local folder to the existing PairUp project:

    npx vercel link

3. Choose the correct Vercel team and PairUp project when prompted.
4. Start the full frontend and API runtime:

    npx vercel dev

5. Open the local URL printed by Vercel.
6. Submit the profile card.
7. Verify the row in Neon with the SELECT query above.

Vercel dev downloads Development environment variables into its runtime. Do
not use npm run dev for a database-write test because it starts Vite only.

## Troubleshooting

### The form says signup is temporarily unavailable

The function cannot see DATABASE_URL.

1. Check **Vercel Project > Settings > Environment Variables**.
2. Confirm DATABASE_URL is enabled for the environment being tested.
3. Redeploy after adding or changing it.

### The form says it could not save the profile

The function reached the database but the query failed.

1. Confirm db/schema.sql was run against the connected database.
2. Confirm pairup_signups exists in Neon's **Tables** view.
3. Open **Vercel Project > Logs**.
4. Filter for /api/signup and inspect the newest failed request.
5. Confirm the Neon project is active and DATABASE_URL points to the intended
   branch and database.

### The frontend returns 404 for /api/signup locally

The site was started with Vite. Stop it and use:

    npx vercel dev

### Production works but Preview fails

DATABASE_URL is enabled for Production but not Preview. Edit the environment
variable in Vercel, enable Preview, and redeploy the preview.

## Security And Data Handling

- Treat phone numbers as personal data.
- Do not expose a signup-list API publicly.
- Do not log request bodies or full phone numbers.
- Restrict Neon and Vercel project access to the PairUp team.
- Export or delete signup data only through authenticated Neon access.
- Add a privacy notice and retention policy before public promotion.

## Official References

- Vercel Marketplace storage:
  https://vercel.com/docs/marketplace-storage
- Installing a Vercel native integration:
  https://vercel.com/docs/integrations/install-an-integration/product-integration
- Neon integration for Vercel:
  https://vercel.com/marketplace/neon/neon
- Manual Neon and Vercel connection:
  https://neon.com/docs/guides/vercel-manual
- Neon serverless driver:
  https://neon.com/docs/serverless/serverless-driver
