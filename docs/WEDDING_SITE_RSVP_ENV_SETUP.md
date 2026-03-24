# Wedding Site — RSVP Environment Setup

**Purpose:** Exact env vars and Supabase migration steps for `POST /api/rsvp` and `GET /api/rsvp/export`.  
**Code references:** `lib/supabase/admin.ts`, `app/api/rsvp/route.ts`, `app/api/rsvp/export/route.ts`.

---

## Variables used in code (grep-verified)

| Variable | Used in | Required for |
|----------|---------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/admin.ts` | Any Supabase call from API routes |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase/admin.ts` | Same — **server only**, never expose to browser |
| `RSVP_EXPORT_SECRET` | `app/api/rsvp/export/route.ts` | CSV export only |

**Not referenced by current RSVP code:**

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Not imported anywhere in RSVP flow. Safe to add for future client-side Supabase; **not required** for current implementation. |

---

## Required vs optional

| Variable | RSVP save (`POST /api/rsvp`) | Export (`GET /api/rsvp/export`) |
|----------|-------------------------------|--------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Required** | **Required** (if export enabled) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Required** | **Required** |
| `RSVP_EXPORT_SECRET` | N/A | **Required** — if unset, route returns **501** with `NOT_CONFIGURED` |

---

## Format (examples only — not real secrets)

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9....
RSVP_EXPORT_SECRET=use-a-long-random-string-you-store-in-1password
```

- **URL:** Supabase Dashboard → Project Settings → API → Project URL  
- **Service role:** same page → `service_role` key (secret; never commit)  
- **Export secret:** generate locally (e.g. `openssl rand -hex 32`); store in Vercel only  

---

## Where to set (production)

1. **Vercel** → Project → Settings → Environment Variables  
2. Set for **Production** (and Preview if you test previews).  
3. **Redeploy** after changing vars (or trigger empty commit) so serverless functions pick up values.

---

## Migration: apply once per Supabase project

**File:** `supabase/migrations/20260324160000_rsvp_submissions.sql`

**Steps:**

1. Supabase Dashboard → **SQL Editor** → New query.  
2. Paste the full contents of that file.  
3. Run.  
4. **Table Editor** → confirm `public.rsvp_submissions` exists and columns match:

| Column | Matches API payload |
|--------|---------------------|
| `email`, `email_normalized` | From form; normalized for upsert |
| `first_name`, `last_name`, `phone` | Yes |
| `attending`, `guest_count` | Yes; DB CHECK matches validation rules |
| `guest_names`, `dietary_restrictions`, `notes` | Yes |
| `invite_code`, `household_name`, `mailing_address` | Yes |
| `thank_you_status` | Optional; not sent by form (remains null) |
| `created_at`, `updated_at` | Defaults / set on upsert |

**Extensions:** `gen_random_uuid()` is available on Supabase Postgres (no extra step).

**RLS:** Table has RLS enabled with **no policies** for anon/authenticated — only the **service role** (used in API routes) can read/write. This is intentional.

---

## Duplicate behavior

- **Unique key:** `email_normalized` (lowercased trimmed email).  
- **API:** `upsert(..., { onConflict: 'email_normalized' })` — same email **updates** the row; latest `updated_at` wins.  
- **Guest expectation:** Success screen states resubmit with same email updates the response.

---

## Failure behavior (guest-safe)

| Condition | HTTP | Guest-visible message (via `error` field) |
|-----------|------|-------------------------------------------|
| Bad JSON / validation | 400 | Specific validation string |
| Missing Supabase env | 500 | Honest “not fully configured” + support email (`app/api/rsvp/route.ts`) |
| Supabase insert error | 500 | Generic retry message (no DB internals) |
| Export without `RSVP_EXPORT_SECRET` | 501 | “Export is not configured” |
| Export wrong Bearer token | 401 | “Unauthorized” |

---

## Local development (optional)

1. Create `.env.local` (gitignored) with the three variables above from a Supabase project (or local Supabase if you use CLI — see `LOCAL_SUPABASE_SETUP.md`).  
2. `npm run dev`  
3. Submit `http://localhost:3000/rsvp` and check Supabase Table Editor.

There is **no** `supabase/` CLI project initialized in this repo; production path is **Dashboard SQL Editor** + Vercel env vars.
