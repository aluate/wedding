# Wedding Site Status — 2026-03-25

## What Exists
- **Framework**: Next.js 14 + Tailwind CSS, deployed on Vercel
- **Domain**: britandkarl.com — live and serving the site
- **Pages**: Home (countdown), Details (FAQ), Schedule, Travel, Menu, Gallery, Photo Wall, RSVP, Admin
- **RSVP system**: Household code required, hotel nights collected, addresses collected, Supabase upsert
- **Admin dashboard**: Password-protected, real Supabase data, headcounts, hotel night counts, CSV export
- **Guest photo upload**: Photo Wall page with upload form, Supabase Storage backend, lightbox viewer
- **Export**: `GET /api/rsvp/export` returns CSV, bearer token protected
- **Photo gallery**: Masonry layout with lightbox, respects mixed aspect ratios
- **Global nav**: Sticky header with responsive mobile menu on all pages except home
- **Countdown**: Days/hours/minutes to ceremony on home page
- **Footer**: Consistent footer on all pages with hashtag and quick links

## RSVP Flow
1. Guest receives mailed invitation with QR code / link
2. QR points to `https://britandkarl.com/rsvp/CODE` (e.g. `/rsvp/smith3456`)
3. Code auto-fills from URL, or guest types it manually
4. Guest fills: name, email, phone, attending, guest count, names, dietary, hotel nights, address
5. Data upserts into Supabase on `email_normalized`
6. Admin views responses at `/admin` with password

## Env Vars Required (Vercel)
| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) |
| `RSVP_EXPORT_SECRET` | Bearer token for CSV export |
| `ADMIN_SECRET` | Password for admin dashboard |

## Migrations to Run
1. `supabase/migrations/20260324160000_rsvp_submissions.sql` — RSVP table
2. `supabase/migrations/20260325000000_add_hotel_nights.sql` — Add hotel nights + household_code (if table exists)
3. `supabase/migrations/20260325010000_guest_photos.sql` — Guest photos table
4. Create Supabase Storage bucket `guest-photos` (public, allow anonymous uploads)

## What's Next
- Address book / CRM feature (post-wedding reuse for parties)
- Mailing label printing from address data
- Add more photos of Brit & Karl (just drop in `public/photos/wedding/gallery/`)
