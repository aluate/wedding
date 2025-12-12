# Wedding Website - Deployment Guide

## Quick Deploy to Vercel (5 minutes)

### Step 1: Create GitHub Repository

1. Go to GitHub and create a new repository named `wedding`
2. Make it public (or private, your choice)
3. Don't initialize with README (we already have one)

### Step 2: Push Code to GitHub

```bash
cd apps/wedding
git init
git add .
git commit -m "Initial wedding website setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/wedding.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. **Go to:** https://vercel.com/new
2. **Sign in** with GitHub
3. **Import** repository: `YOUR_USERNAME/wedding`
4. **Configure:**
   - **Root Directory:** `apps/wedding` ⚠️ CRITICAL - This is the most important setting!
   - **Framework:** Next.js (auto-detected)
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
5. **Add Environment Variables** (if needed later):
   - `NEXT_PUBLIC_SITE_URL` (will be your Vercel URL)
6. **Deploy** - Click "Deploy"

The site will be live in 2-3 minutes!

### Step 4: Custom Domain (Optional)

After deployment:
1. Go to your Vercel project settings
2. Add your custom domain (e.g., `solsticeof26.com`)
3. Follow DNS configuration instructions

## Post-Deployment

### Next Steps:

1. **Set up Supabase** (for RSVP database):
   - Create Supabase project
   - Set up tables: `households`, `guests`, `events`
   - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel env vars

2. **Configure Notifications**:
   - Set up email service (SendGrid, Resend, etc.)
   - Add API keys to Vercel env vars

3. **Test RSVP Flow**:
   - Create test household codes
   - Test RSVP submission
   - Verify admin dashboard updates

4. **Enhance Kanban**:
   - Connect to database for persistent tasks
   - Add task creation/editing
   - Add due dates and reminders

## Troubleshooting

**Build fails?**
- Check that Root Directory is set to `apps/wedding`
- Verify all dependencies are in `package.json`
- Check build logs in Vercel dashboard

**404 errors?**
- Verify Next.js routing is correct
- Check that pages are in `app/` directory
- Ensure `next.config.js` is correct

**Styling issues?**
- Verify Tailwind is configured correctly
- Check that `globals.css` imports Tailwind
- Ensure `tailwind.config.js` is in root of `apps/wedding`

## Environment Variables

Add these in Vercel project settings → Environment Variables:

- `NEXT_PUBLIC_SITE_URL` - Your site URL (for links)
- `SUPABASE_URL` - Supabase project URL (when ready)
- `SUPABASE_ANON_KEY` - Supabase anonymous key (when ready)
- `EMAIL_API_KEY` - Email service API key (when ready)

## Support

If you run into issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify all file paths are correct
4. Ensure TypeScript compiles without errors

