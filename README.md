# Wedding Website - Karl & Brit

**Status:** Initial Setup  
**Purpose:** Wedding website with RSVP system and admin kanban board

## Overview

A Next.js wedding website for Karl & Brit's Solstice of '26 wedding at Coeur d'Alene Casino.

## Features

- ✅ Public-facing wedding site
- ✅ RSVP system with household codes
- ✅ Admin dashboard with overview
- ✅ Task board (kanban) structure
- ✅ T-Rex style game (`/game` route)
- ✅ Mobile-responsive design
- ⏳ Real-time RSVP tracking (needs backend)
- ⏳ Full kanban drag-and-drop (needs implementation)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (planned)
- **Deployment:** Vercel

## Getting Started

```bash
cd apps/wedding
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home page
- `/schedule` - Event schedule
- `/travel` - Travel and lodging information
- `/rsvp/[code]` - RSVP form (requires household code)
- `/game` - Solstice Runner game
- `/admin` - Admin dashboard (overview, guests, kanban)

## Configuration

Edit `config/wedding_config.json` to customize:
- Couple names
- Wedding date and events
- Venue information
- RSVP settings
- Branding colors

## Deployment to Vercel

1. **Create GitHub repo** named `wedding`
2. **Push this code** to the repo
3. **Go to Vercel:** https://vercel.com/new
4. **Import repository:** `wedding`
5. **Configure:**
   - Root Directory: `apps/wedding` ⚠️ CRITICAL
   - Framework: Next.js (auto-detected)
6. **Deploy** - Click "Deploy"

The site will be live in 2-3 minutes!

## Next Steps

- [ ] Set up Supabase database for RSVPs
- [ ] Implement real-time RSVP tracking
- [ ] Build full kanban board with drag-and-drop
- [ ] Add email notifications
- [ ] Add SMS notifications (optional)
- [ ] Connect to actual venue data

## Project Structure

```
apps/wedding/
├── app/              # Next.js app router pages
│   ├── page.tsx      # Home page
│   ├── schedule/     # Schedule page
│   ├── travel/       # Travel page
│   ├── rsvp/[code]/  # RSVP form
│   ├── game/         # Game page
│   └── admin/        # Admin dashboard
├── components/       # React components (to be added)
├── lib/              # Utilities (to be added)
├── config/           # Configuration files
│   └── wedding_config.json
└── public/           # Static assets
```
