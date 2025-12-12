# PROJECT SUMMARY — wedding

## 1. Purpose
- **What this project is for:** Wedding website for Karl & Brit's Solstice of '26 wedding at Coeur d'Alene Casino. Features RSVP system, photo gallery, admin dashboard, and a T-Rex style game.
- **Who/what it serves:** Personal wedding event - guests can RSVP, view photos, see schedule and travel info.

## 2. Tech Stack
- **Framework(s):** Next.js 14 (App Router)
- **Language(s):** TypeScript
- **ORM / DB:** None currently (Supabase planned but not implemented)
- **Auth:** None currently
- **Styling:** TailwindCSS
- **Hosting / deployment hints found:** Vercel (configured, `vercel.json` present)

## 3. Structure
- **Key directories:**
  - `app/` - Next.js pages (gallery, rsvp, schedule, travel, game, admin)
  - `components/` - React components (GameBanner, KanbanBoard, PhotoGrid, PhotoSlideshow, PhotoStrip)
  - `lib/` - Utilities (dateUtils, photos)
  - `public/photos/wedding/gallery/` - Wedding photos (12 photos)
  - `config/` - Wedding configuration JSON
- **Monorepo elements:** No (standalone app)

## 4. Environment & Config
- **Config files:**
  - `package.json` - Dependencies and scripts
  - `next.config.js` - Next.js configuration
  - `tsconfig.json` - TypeScript configuration
  - `tailwind.config.js` - TailwindCSS configuration
  - `postcss.config.js` - PostCSS configuration
  - `vercel.json` - Vercel deployment configuration
  - `config/wedding_config.json` - Wedding-specific configuration
- **Environment variables referenced in code:**
  - None currently (static site)
  - If Supabase is added later: Supabase URL and anon key

## 5. Current Status (Best Guess)
- **Status:** Active / Production
- **Build status hints:**
  - `npm run dev` - Development server
  - `npm run build` - Production build
  - `npm run start` - Production server
- **Known TODOs:**
  - Extensive deployment troubleshooting docs suggest DNS/Cloudflare setup issues were resolved
  - Photo management system implemented
  - Admin kanban board structure exists but may need full implementation
  - Real-time RSVP tracking mentioned as "needs backend" in README

## 6. Migration Notes
- **Database:** None currently (static site)
- **External dependencies:**
  - Vercel account for deployment
  - Cloudflare for DNS (if custom domain used)
- **Currently deployed to:** Vercel (based on deployment docs)
- **Special considerations:**
  - Contains 26 JPG files in root and `public/photos/` - consider Git LFS or external storage for large images
  - Multiple deployment troubleshooting docs suggest DNS/domain configuration complexity
  - Admin features may require backend if real-time RSVP tracking is added

