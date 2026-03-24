# Wedding Site — RSVP Implementation Plan

**Date:** 2026-03-24  
**Depends on:** `docs/WEDDING_SITE_RSVP_AUDIT.md`

---

## A. User flow

1. Guest receives save-the-date / invitation (print or email).
2. Guest scans QR or opens direct link: **`https://britandkarl.com/rsvp`** or **`https://britandkarl.com/rsvp/{invite_code}`** (redirects to `/rsvp` with invite context).
3. Guest lands on **`/rsvp`**, completes the form, submits.
4. Guest sees **inline confirmation** (success state; no fake “email sent” unless email is implemented).
5. Later: **email updates** — export or sync from DB to a mailing tool (Mailchimp, Resend lists, etc.); not part of MVP storage-only scope.

---

## B. Data model

**Table `public.rsvp_submissions`** (Supabase Postgres)

| Column | Type | Notes |
|--------|------|--------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `first_name` | `text` | Required |
| `last_name` | `text` | Required |
| `email` | `text` | Required; **unique** on `lower(trim(email))` for deduping |
| `phone` | `text` | Nullable |
| `attending` | `boolean` | Required |
| `guest_count` | `int` | Total guests if attending (≥ 1); **0** if not attending |
| `guest_names` | `text` | Nullable; names of additional guests |
| `dietary_restrictions` | `text` | Nullable |
| `notes` | `text` | Nullable (song requests, messages) |
| `invite_code` | `text` | Nullable; from QR path or `?invite=` |
| `household_name` | `text` | Nullable; mailing label / grouping |
| `mailing_address` | `text` | Nullable; thank-you / card workflow |
| `thank_you_status` | `text` | Nullable; reserved for later (`pending` / `sent` / …) |
| `created_at` | `timestamptz` | Default `now()` |
| `updated_at` | `timestamptz` | Maintained on upsert |

**Headcount:** Sum `guest_count` where `attending = true` (and optionally validate `guest_count` vs names).

---

## C. Architecture decision

**Chosen: Supabase-backed RSVP via Next.js Route Handlers**

**Why (grounded in repo):**

- `README.md`, `ENV_SETUP.md`, and `LOCAL_SUPABASE_SETUP.md` already assume Supabase for RSVPs.
- Next.js 14 App Router supports `app/api/rsvp/route.ts` for server-side validation and **service role** inserts (keeps secrets off the client).
- Avoids external form SaaS unless we could not add a DB; here we can add `@supabase/supabase-js` and SQL migrations cleanly.

**Not chosen:**

- **Client-only anon Supabase insert without RLS review** — avoided; server Route Handler + service role is simpler to secure for MVP.
- **External form embed only** — would work but diverges from documented stack and export story.

---

## D. Delivery phases

| Phase | Deliverable |
|-------|-------------|
| 1 | `/rsvp` route: real page shell + optional invite from query / `[code]` redirect |
| 2 | Mobile-first form UI matching Tailwind tokens (`primary`, `accent`, `background`) |
| 3 | Client + server validation (required fields, email shape, guest_count rules) |
| 4 | `POST /api/rsvp` → Supabase upsert by normalized email |
| 5 | Success / error states (no mock success on failure) |
| 6 | **Admin/export:** documented SQL + optional `GET /api/rsvp/export` guarded by `RSVP_EXPORT_SECRET` |
| 7 | **Email readiness:** store `email`, `updated_at`; document CSV export for Mailchimp/import |
| 8 | **QR:** document URLs `/rsvp` and `/rsvp/{code}`; generation is external (printer/design tool) |

---

## E. Deployment plan

**How changes go live (from repo evidence):**

1. Vercel project linked to GitHub (`control/CONTROL_DEPLOYMENT.md`); production deploys on push to the branch configured in **Vercel → Project → Git → Production Branch** (commonly `main` — **verify in dashboard**).
2. **Commands:** `npm install` (or `npm ci` once `package-lock.json` exists), `npm run build` locally; push to the production-tracking branch.
3. **Vercel env:** set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (for any future client use), `SUPABASE_SERVICE_ROLE_KEY` (server), and `RSVP_EXPORT_SECRET` (optional export).
4. **Supabase:** run SQL migration in Supabase SQL editor (or CLI if adopted later).
5. **Manual checks before live:** build passes, `/rsvp` submits against production DB (one test row), export or SQL headcount matches, `/admin` still loads (mock until wired).

**Branch note:** Local audit showed active branch `save-the-date-mode`; **merge to the branch Vercel deploys** before expecting production updates.
