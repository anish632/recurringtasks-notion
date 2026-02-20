# Deployment Checklist

## Pre-Deployment

- [ ] Create Notion Integration at https://www.notion.so/my-integrations
  - Note down Client ID and Client Secret
  - Set initial redirect URI: `http://localhost:3000/api/auth/callback`

- [ ] Set up Supabase Database
  - Create new project
  - Run `schema.sql` in SQL Editor
  - Copy connection URL and anon key

- [ ] Test locally
  - Set up `.env.local` with all credentials
  - Run `npm run dev`
  - Test OAuth flow
  - Create a test recurring rule
  - Verify database connections work

## Deploy to Vercel

1. **Push to GitHub** (already done)
   ```bash
   gh repo create anish632/recurringtasks-notion --public --source=. --push
   ```

2. **Import to Vercel**
   - Go to https://vercel.com/new
   - Select the GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   
   Add all variables from `.env.local`:
   
   ```
   NOTION_CLIENT_ID=xxx
   NOTION_CLIENT_SECRET=xxx
   NOTION_REDIRECT_URI=https://your-app.vercel.app/api/auth/callback
   DATABASE_URL=postgresql://...
   SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_ANON_KEY=xxx
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=xxx (generate with: openssl rand -base64 32)
   CRON_SECRET=xxx (generate with: openssl rand -base64 32)
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## Post-Deployment

- [ ] Update Notion Integration redirect URI
  - Go to https://www.notion.so/my-integrations
  - Add production redirect: `https://your-app.vercel.app/api/auth/callback`

- [ ] Test production deployment
  - Visit your deployed URL
  - Complete OAuth flow
  - Create a test rule
  - Wait 5 minutes and verify cron job executed

- [ ] Monitor Vercel logs
  - Check for any errors
  - Verify cron job is running every 5 minutes

## Optional: Custom Domain

- [ ] Add custom domain in Vercel settings
- [ ] Update `NEXT_PUBLIC_APP_URL` environment variable
- [ ] Update Notion integration redirect URI again

## Monitoring

- **Vercel Dashboard**: https://vercel.com/dashboard
  - Check deployment status
  - View logs
  - Monitor function usage

- **Supabase Dashboard**: https://supabase.com/dashboard
  - Monitor database performance
  - Check for errors
  - View table data

## Troubleshooting

### Cron not executing
- Check Vercel logs for errors
- Verify `vercel.json` is in root directory
- Ensure cron job is enabled in Vercel dashboard

### OAuth errors
- Double-check redirect URIs match exactly
- Verify Client ID and Secret are correct
- Check browser console for error messages

### Database errors
- Verify connection string is correct
- Check Supabase dashboard for connection issues
- Ensure schema was applied correctly

## Security Checklist

- [ ] All secrets are in environment variables (not in code)
- [ ] `.env.local` is in `.gitignore`
- [ ] Production uses HTTPS only
- [ ] CRON_SECRET is set and strong
- [ ] NEXTAUTH_SECRET is random and secure

## Next Steps

Once deployed:

1. Share with beta testers
2. Set up analytics (PostHog, Mixpanel, etc.)
3. Add error monitoring (Sentry)
4. Implement email notifications (SendGrid)
5. Add payment processing (Stripe)
6. Create marketing materials
7. Launch on Product Hunt / Hacker News
