# RSVP Operations Guide

## Environment Variables

Set these in Vercel (Settings → Environment Variables) for production:

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Vercel | Supabase project URL (e.g. `https://xyz.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel | Service role key (bypasses RLS, server-side only) |
| `RSVP_EXPORT_SECRET` | Vercel | Bearer token for CSV export endpoint |

## Database Migration

### If creating the table fresh
Run the full migration in Supabase SQL Editor:
```
supabase/migrations/20260324160000_rsvp_submissions.sql
```

### If the table already exists (add meal_choice column)
Run in Supabase SQL Editor:
```
supabase/migrations/20260325000000_add_meal_choice.sql
```

## How to Verify a Real RSVP

1. Go to https://britandkarl.com/rsvp
2. Fill out the form with a test email
3. Submit — you should see the "Thank you" confirmation
4. In Supabase Dashboard → Table Editor → `rsvp_submissions`, confirm the row exists
5. Submit again with the same email — the row should be **updated** (upsert), not duplicated

## How to Get Headcount

Run in Supabase SQL Editor:
```sql
-- Total attending guests
SELECT COALESCE(SUM(guest_count), 0) AS total_attending
FROM public.rsvp_submissions
WHERE attending = true;

-- Breakdown
SELECT
  COUNT(*) FILTER (WHERE attending = true) AS yes_count,
  COUNT(*) FILTER (WHERE attending = false) AS no_count,
  COALESCE(SUM(guest_count) FILTER (WHERE attending = true), 0) AS total_heads
FROM public.rsvp_submissions;

-- Meal choice breakdown
SELECT meal_choice, COUNT(*) AS count
FROM public.rsvp_submissions
WHERE attending = true AND meal_choice IS NOT NULL
GROUP BY meal_choice;
```

## How to Export RSVP Data

### Option 1: API endpoint (CSV)
```bash
curl -H "Authorization: Bearer YOUR_RSVP_EXPORT_SECRET" \
  https://britandkarl.com/api/rsvp/export \
  -o rsvp-export.csv
```

### Option 2: Supabase Dashboard
1. Go to Supabase Dashboard → Table Editor → `rsvp_submissions`
2. Click "Export to CSV"

### Option 3: Direct SQL
```sql
SELECT * FROM public.rsvp_submissions ORDER BY created_at;
```

## Duplicate Handling

RSVPs are keyed on `email_normalized` (lowercased, trimmed email). If a guest submits twice with the same email, the second submission **replaces** the first (upsert). The `updated_at` timestamp reflects the latest submission.

## Using RSVP Data Later

### Email updates / drip emails
Export CSV → import into Mailchimp, SendGrid, etc. Key fields:
- `email` — for sending
- `first_name`, `last_name` — for personalization
- `attending` — filter yes/no
- `household_name` — for group addressing

### Thank-you tracking
The `thank_you_status` column is available for manual tracking. Update via SQL:
```sql
UPDATE public.rsvp_submissions
SET thank_you_status = 'sent', updated_at = now()
WHERE email_normalized = 'guest@example.com';
```

### Seating / catering
- `guest_count` — total heads per RSVP
- `meal_choice` — beef / chicken / veg
- `dietary_restrictions` — free-text allergies/needs
- `guest_names` — names of additional guests in party
