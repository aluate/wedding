# Deploy & Go Live

## 1. Branch
`main` — push to trigger Vercel auto-deploy.

## 2. Env vars (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RSVP_EXPORT_SECRET` — any strong random string
- `ADMIN_SECRET` — password you'll use at `/admin`

## 3. Migrations (Supabase SQL Editor)
Run in order:
1. `supabase/migrations/20260324160000_rsvp_submissions.sql`
2. `supabase/migrations/20260325000000_add_hotel_nights.sql` (only if table already existed)
3. `supabase/migrations/20260325010000_guest_photos.sql`

## 4. Supabase Storage
1. Create bucket named `guest-photos`
2. Set to **Public**
3. Add policy: allow anonymous INSERT and SELECT

## 5. Verify deploy
1. Visit https://britandkarl.com — countdown visible, nav works
2. Visit https://britandkarl.com/rsvp — household code field is first
3. Visit https://britandkarl.com/admin — password prompt appears
4. Visit https://britandkarl.com/photos — upload form visible

## 6. Test RSVP end-to-end
1. Go to https://britandkarl.com/rsvp/test1234
2. Fill in: test name, test@example.com, code auto-filled, attending yes, 2 guests
3. Check Friday + Saturday hotel nights
4. Submit → "Thank you" confirmation
5. Go to `/admin` → see the test entry
6. Delete test row from Supabase

## 7. QR URLs
```
https://britandkarl.com/rsvp              (generic)
https://britandkarl.com/rsvp/smith3456    (per-household)
```

## 8. Safe to send invites?
**YES AFTER:**
1. Push latest code
2. Run all migrations
3. Set up storage bucket
4. Set all env vars
5. Complete one test RSVP end-to-end
6. Then print invitations with household-specific QR codes
