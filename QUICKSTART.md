# Quick Start Guide

Get RecurringTasks running in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- A Notion account
- A Supabase account (free tier is fine)

## Step 1: Create Notion Integration (3 min)

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Fill in:
   - Name: `RecurringTasks Dev`
   - Workspace: Select your workspace
   - Capabilities: Check all three (Read, Update, Insert)
4. Click **Submit**
5. **Copy these values** (you'll need them next):
   - Client ID
   - Client Secret
6. Click **"Show more"** and add redirect URL:
   ```
   http://localhost:3000/api/auth/callback
   ```

## Step 2: Set Up Database (2 min)

1. Go to https://supabase.com and create a new project
2. Wait for it to initialize (~2 min)
3. Go to **SQL Editor** (left sidebar)
4. Click **"+ New Query"**
5. Copy the entire contents of `schema.sql` from this project
6. Paste and click **"Run"**
7. Go to **Settings → Database** and copy:
   - Connection string (change `[YOUR-PASSWORD]` to your actual password)
8. Go to **Settings → API** and copy:
   - Project URL
   - anon/public key

## Step 3: Configure Environment (1 min)

```bash
cd /Users/anishdas/apps/recurringtasks-notion
cp .env.example .env.local
```

Edit `.env.local` and paste your values:

```env
# From Notion
NOTION_CLIENT_ID=paste_here
NOTION_CLIENT_SECRET=paste_here
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback

# From Supabase
DATABASE_URL=paste_connection_string_here
SUPABASE_URL=paste_project_url_here
SUPABASE_ANON_KEY=paste_anon_key_here

# Generate random secrets
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=run_this_command: openssl rand -base64 32
CRON_SECRET=run_this_command: openssl rand -base64 32
```

Generate secrets:
```bash
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)"
echo "CRON_SECRET=$(openssl rand -base64 32)"
```

Copy the output and paste into `.env.local`.

## Step 4: Install & Run (2 min)

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Step 5: Test It Out (2 min)

1. Click **"Connect to Notion"**
2. Authorize the integration
3. You'll be redirected to the dashboard
4. Click **"+ New Rule"**
5. Select a database (you need at least one database in your Notion workspace)
   - Don't have one? Create a simple task database in Notion first
6. Set schedule to **Daily** with value **1**
7. Click **"Create Rule"**

## Step 6: Test Cron Execution (Optional)

To test that scheduled tasks actually get created:

1. Temporarily modify the rule's `next_run` in the database to be in the past:
   ```sql
   UPDATE recurring_rules 
   SET next_run = NOW() - INTERVAL '1 hour' 
   WHERE id = 'your-rule-id';
   ```

2. Manually trigger the cron:
   ```bash
   curl -X POST http://localhost:3000/api/cron/execute \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

3. Check your Notion database - a new page should appear!

## Troubleshooting

### "OAuth failed"
- Double-check Client ID and Secret
- Verify redirect URI is exactly `http://localhost:3000/api/auth/callback`
- Make sure you're using the OAuth credentials, not the Internal Integration Token

### "Database connection failed"
- Verify your DATABASE_URL is correct
- Check that you replaced `[YOUR-PASSWORD]` with actual password
- Make sure `schema.sql` ran without errors

### "No databases found"
- Create a database in Notion first (any database will work)
- Make sure the integration has been added to that page:
  - Open the database in Notion
  - Click "..." → "Add connections"
  - Select your integration

### Cron not working locally
- Run it manually using curl (see Step 6)
- Check that CRON_SECRET matches in `.env.local` and your curl command
- For production, Vercel handles cron automatically

## Next Steps

- Read [README.md](README.md) for complete documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) to understand the architecture

## Need Help?

- Open an issue on GitHub
- Check existing issues for solutions
- Review the code comments

Happy automating! 🚀
