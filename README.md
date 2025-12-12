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

- `/` - Home page (with photo slideshow)
- `/schedule` - Event schedule (with photo strip)
- `/travel` - Travel and lodging information (with venue photo)
- `/gallery` - Photo gallery
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

## Adding Photos

### Quick Start
1. **Drop images** into `/public/photos/wedding/gallery/`
2. **Name them** `photo-01.jpg`, `photo-02.jpg`, etc. (or any name)
3. **Update** `lib/photos.ts` to include your new photos in the array
4. **Photos automatically appear** in:
   - Home page slideshow (first 3-4 photos)
   - Gallery page (all photos)
   - Schedule page (photo strip)
   - Travel page (first photo as venue image)

### Photo Organization
- **Gallery photos:** `/public/photos/wedding/gallery/` - All photos for the gallery page
- **Hero photos:** First 3-4 photos are used in the home page slideshow
- **Featured photos:** Mark photos with `featured: true` in `lib/photos.ts` to prioritize them

### Photo Components
- **`<PhotoGrid />`** - Responsive grid layout (used on gallery page)
- **`<PhotoSlideshow />`** - Auto-playing slideshow with navigation (used on home page)
- **`<PhotoStrip />`** - Horizontal scrolling strip (used on schedule page)

### Customizing Photos
Edit `lib/photos.ts` to:
- Add/remove photos
- Set alt text
- Mark photos as featured
- Categorize photos (for filtering)

**Note:** For production, you can create a build script to auto-generate the photo list by scanning the folder.

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
