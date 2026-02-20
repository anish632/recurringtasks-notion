# RecurringTasks for Notion

> Automate recurring tasks in Notion — the #1 most requested feature

RecurringTasks is a Notion integration that automatically creates recurring task pages in your databases on a schedule. Set it once, let it run forever.

## 🚀 Features

- **OAuth Integration**: Securely connect to your Notion workspace
- **Flexible Scheduling**: Daily, weekly, monthly, or custom cron schedules
- **Template Support**: Clone existing pages with all properties intact
- **Multiple Workspaces**: Manage rules across different Notion workspaces
- **Task History**: Track all created tasks and monitor execution
- **Email Notifications**: Get notified when tasks are created (optional)

## 📋 Prerequisites

- Node.js 18+ and npm
- A Notion account
- A Supabase or PostgreSQL database
- Vercel account (for deployment)

## 🛠️ Setup Instructions

### 1. Create a Notion Integration

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: RecurringTasks
   - **Associated workspace**: Select your workspace
   - **Capabilities**: Read content, Update content, Insert content
4. Click **"Submit"**
5. Copy the **Client ID** and **Client Secret** (you'll need these later)
6. Add the redirect URL: `http://localhost:3000/api/auth/callback` (for local development)

### 2. Set Up Database

#### Using Supabase (Recommended)

1. Create a new project at [https://supabase.com](https://supabase.com)
2. Go to the SQL Editor
3. Copy and paste the contents of `schema.sql`
4. Click **"Run"**
5. Get your connection string from Settings → Database
6. Copy the **URL** and **anon key**

#### Using PostgreSQL

1. Run `schema.sql` in your PostgreSQL database
2. Get your connection string in the format: `postgresql://user:password@host:port/database`

### 3. Install Dependencies

```bash
cd /Users/anishdas/apps/recurringtasks-notion
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in your values:

```env
# Notion OAuth
NOTION_CLIENT_ID=your_notion_client_id
NOTION_CLIENT_SECRET=your_notion_client_secret
NOTION_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Database (Supabase)
DATABASE_URL=your_postgres_connection_string
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Cron (for scheduled execution)
CRON_SECRET=your_cron_secret

# Optional: Email notifications
SENDGRID_API_KEY=your_sendgrid_api_key
```

Generate a random secret for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Set Up Scheduled Execution

The app needs to run a cron job to execute scheduled tasks. You have two options:

#### Option A: Vercel Cron Jobs (Recommended for production)

Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/execute",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

This runs every 5 minutes. Vercel will automatically handle the scheduling.

#### Option B: External Cron Service

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com):

1. Create a new cron job
2. Set the URL: `https://your-app.vercel.app/api/cron/execute`
3. Add header: `Authorization: Bearer your_cron_secret`
4. Set schedule: `*/5 * * * *` (every 5 minutes)

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit"
gh repo create anish632/recurringtasks-notion --public --source=. --push
```

2. Go to [https://vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Add all environment variables from `.env.local`
5. Deploy!

### Update Notion Integration

After deployment, update your Notion integration:

1. Go to [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click on your integration
3. Add production redirect URL: `https://your-app.vercel.app/api/auth/callback`

## 📖 Usage

### Creating a Recurring Rule

1. Click **"Connect to Notion"** and authorize the integration
2. In the dashboard, click **"+ New Rule"**
3. Select a database from your workspace
4. Choose schedule type:
   - **Daily**: Every N days
   - **Weekly**: Every N weeks
   - **Monthly**: Every N months
   - **Custom**: Cron expression (e.g., `0 9 * * 1` for every Monday at 9am)
5. (Optional) Select a template page to clone properties from
6. Click **"Create Rule"**

### Managing Rules

- **Pause/Resume**: Click the status button to toggle
- **Delete**: Remove a rule permanently
- **View History**: See all tasks created by a rule

## 🔧 API Reference

### Authentication

- `GET /api/auth/notion` - Initiate OAuth flow
- `GET /api/auth/callback` - OAuth callback

### Databases

- `GET /api/databases` - List user's Notion databases

### Rules

- `GET /api/rules` - List all rules for current user
- `POST /api/rules` - Create a new recurring rule
- `PATCH /api/rules/[id]` - Update a rule
- `DELETE /api/rules/[id]` - Delete a rule

### Cron

- `POST /api/cron/execute` - Execute scheduled tasks (requires `CRON_SECRET`)

## 🏗️ Architecture

```
├── app/
│   ├── api/              # API routes
│   │   ├── auth/         # OAuth flow
│   │   ├── databases/    # Database operations
│   │   ├── rules/        # Rule CRUD
│   │   └── cron/         # Scheduled execution
│   ├── dashboard/        # Main dashboard UI
│   └── page.tsx          # Landing page
├── lib/
│   ├── db.ts            # Database client & helpers
│   ├── notion.ts        # Notion API wrapper
│   ├── scheduler.ts     # Schedule calculation
│   └── types.ts         # TypeScript types
└── schema.sql           # Database schema
```

## 💡 Pricing Tiers

- **Free**: 3 rules, 1 workspace
- **Pro** ($12/mo): Unlimited rules, multiple workspaces, templates
- **Team** ($29/mo): Team management, advanced scheduling, priority support

## 🐛 Troubleshooting

### "OAuth failed" error

- Check that `NOTION_CLIENT_ID` and `NOTION_CLIENT_SECRET` are correct
- Verify redirect URI matches in Notion integration settings

### Tasks not being created

- Check that the cron job is running (check Vercel logs)
- Verify `CRON_SECRET` is set correctly
- Ensure the database being accessed is shared with the integration

### Database connection errors

- Verify `DATABASE_URL` and Supabase credentials
- Check that `schema.sql` was run successfully
- Ensure database is accessible from your deployment

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 💬 Support

For questions or issues, please open a GitHub issue.

---

Built with ❤️ for Notion users
