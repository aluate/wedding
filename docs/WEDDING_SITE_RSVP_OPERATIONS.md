# RSVP Operations Guide

## Environment Variables

Set in Vercel (Settings → Environment Variables):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) |
| `RSVP_EXPORT_SECRET` | Bearer token for CSV export |
| `ADMIN_SECRET` | Password for `/admin` dashboard |

## Household Code System

Each invited household gets a code: **lastname + address numbers**
- Jason Smith at 3456 Street Ln → `smith3456`
- The code is case-insensitive and spaces are stripped
- Put the code on mailed invitations
- QR code / link: `https://britandkarl.com/rsvp/smith3456`

## Admin Dashboard

1. Go to `https://britandkarl.com/admin`
2. Enter the `ADMIN_SECRET` password
3. See: total responses, attending count, total heads, hotel night counts
4. Filter by attending / declined
5. Export CSV directly from the dashboard

## How to Get Headcount

Via admin dashboard, or via SQL:
```sql
SELECT
  COUNT(*) FILTER (WHERE attending = true) AS yes_parties,
  COUNT(*) FILTER (WHERE attending = false) AS no_parties,
  COALESCE(SUM(guest_count) FILTER (WHERE attending = true), 0) AS total_heads
FROM public.rsvp_submissions;
```

## Hotel Night Counts (for room block)
```sql
SELECT
  COUNT(*) FILTER (WHERE staying_friday AND attending) AS friday_rooms,
  COUNT(*) FILTER (WHERE staying_saturday AND attending) AS saturday_rooms
FROM public.rsvp_submissions;
```

## Export RSVP Data

### Option 1: Admin dashboard
Click "Export CSV" button at `/admin`.

### Option 2: API
```bash
curl -H "Authorization: Bearer YOUR_RSVP_EXPORT_SECRET" \
  https://britandkarl.com/api/rsvp/export -o rsvp-export.csv
```

### Option 3: Supabase Dashboard
Table Editor → `rsvp_submissions` → Export to CSV

## Duplicate Handling
RSVPs upsert on `email_normalized`. Same email = update, not duplicate.

## Following Up on Non-Responders
Compare your mailed invite list against the admin dashboard. Anyone who hasn't submitted can be followed up with directly.

## Using Data Later

### Email updates
Export CSV → import into Mailchimp/SendGrid. Fields: `email`, `first_name`, `last_name`, `attending`.

### Thank-you tracking
```sql
UPDATE public.rsvp_submissions
SET thank_you_status = 'sent', updated_at = now()
WHERE email_normalized = 'guest@example.com';
```

### Addresses for thank-you notes
The `mailing_address` and `household_name` fields give you everything for mailing labels.
