# Wedding Site Status — 2026-03-25

## What Exists
- **Framework**: Next.js 14 + Tailwind CSS, deployed on Vercel
- **Domain**: britandkarl.com — live and serving the site
- **Pages**: Home, Details, Schedule, Travel & Stay, Menu, Gallery, RSVP, Game, Admin
- **RSVP system**: Full form → API route → Supabase upsert (on `email_normalized`)
- **RSVP export**: `GET /api/rsvp/export` returns CSV, protected by bearer token
- **Migration**: `supabase/migrations/20260324160000_rsvp_submissions.sql` (create table)
- **Config**: `config/wedding_config.json` — all wedding details, events, FAQ, meal choices, etc.
- **Photos**: 13 gallery photos in `public/photos/wedding/gallery/`
- **Global nav**: Sticky header with responsive mobile menu on all pages except home
- **Meal choice**: RSVP form collects meal preference (beef / chicken / vegetarian)

## What Is Verified
- Build passes (`next build` succeeds, no TS errors)
- Site is live at https://britandkarl.com
- RSVP form is publicly accessible at https://britandkarl.com/rsvp
- Home page renders correctly with slideshow, quick info, nav links
- Schedule, travel, gallery pages have real content
- QR code route works: `/rsvp/INVITE_CODE` redirects to `/rsvp?invite=INVITE_CODE`

## What Is Assumed (Not Verified)
- Supabase project exists and table is created (no local `.env.local` to test against)
- Vercel env vars (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are set
- `RSVP_EXPORT_SECRET` is set in Vercel for the export endpoint
- The `meal_choice` column exists in the Supabase table (migration added, needs to be run)

## What Was Missing (Now Fixed)
- Details page had "coming soon" placeholder → now has full event overview + FAQ
- Menu page was bare → now shows meal choices and dietary info
- No global navigation → added sticky nav header with mobile menu
- RSVP form missing meal choice → added meal preference dropdown
- RSVP deadline said "early June" → now says "May 20, 2026" (matches config)
- Game banner was on every page in layout → removed (game still at /game)
- Redundant "← Back to Home" links on every page → removed (nav handles it)

## Shortest Path to Launch Readiness
1. Run the `meal_choice` migration in Supabase SQL Editor
2. Verify env vars are set in Vercel
3. Push this code to `main` → Vercel auto-deploys
4. Submit one test RSVP and confirm it appears in Supabase
5. Test the export endpoint
6. Generate QR code pointing to `https://britandkarl.com/rsvp`
