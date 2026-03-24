# Wedding Site — RSVP Deployment Notes

**Date:** 2026-03-24  
**Repo:** `wedding` (Next.js 14 App Router)

---

## What changed

- **`/rsvp`:** Mobile-first RSVP form (guest info, attending yes/no, headcount, dietary, mailing address for thank-yous, notes/song request).
- **`/rsvp/{code}`:** Redirects to `/rsvp?invite={code}` for QR or per-invite links.
- **`POST /api/rsvp`:** Validates input, upserts by **normalized email** (same email updates the row — no duplicate chaos).
- **`GET /api/rsvp/export`:** Optional CSV export (Bearer token). Requires env vars below.
- **Supabase:** SQL migration `supabase/migrations/20260324160000_rsvp_submissions.sql` — run in Supabase SQL Editor on your project.
- **Docs:** `docs/WEDDING_SITE_RSVP_AUDIT.md`, `docs/WEDDING_SITE_RSVP_IMPLEMENTATION_PLAN.md`.
- **Other:** Home page RSVP column links to `/rsvp`; smoke test health parsing aligned with `api-helpers` JSON shape; `package-lock.json` added for `npm ci`.

---

## Environment variables (Vercel + local)

| Variable | Required for RSVP save | Purpose |
|----------|------------------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Recommended | Public anon key (reserved for future client-side use) |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only; `POST /api/rsvp` and export |
| `RSVP_EXPORT_SECRET` | No | If unset, CSV export returns 501 |
| `RSVP_EXPORT_SECRET` | Yes for export | `Authorization: Bearer <secret>` on `GET /api/rsvp/export` |

Do **not** expose `SUPABASE_SERVICE_ROLE_KEY` or `RSVP_EXPORT_SECRET` in client code.

---

## Supabase: apply schema

1. Open Supabase → **SQL Editor**.
2. Paste contents of `supabase/migrations/20260324160000_rsvp_submissions.sql`.
3. Run. Confirm table `public.rsvp_submissions` exists.

---

## Useful SQL (Supabase SQL Editor)

**Total attending guest count (headcount):**

```sql
SELECT COALESCE(SUM(guest_count), 0) AS total_guests
FROM public.rsvp_submissions
WHERE attending = true;
```

**List yes RSVPs:**

```sql
SELECT email, first_name, last_name, guest_count, updated_at
FROM public.rsvp_submissions
WHERE attending = true
ORDER BY updated_at DESC;
```

---

## Export CSV (curl)

```bash
curl -sS "https://YOUR_DOMAIN/api/rsvp/export" \
  -H "Authorization: Bearer YOUR_RSVP_EXPORT_SECRET" \
  -o rsvp-export.csv
```

---

## Build / preflight

- `npm install`
- `npm run build`
- `npm run lint` (if configured)
- `npm run smoke-test` (optional; uses `NEXT_PUBLIC_SITE_URL` or localhost for health check)

---

## Git / deploy status (fill when releasing)

| Item | Status |
|------|--------|
| **Committed** | Yes — `5599fd0` on `save-the-date-mode` |
| **Pushed branch** | `origin/save-the-date-mode` (2026-03-24) |
| **Production deploy** | **Not verified from this workspace** — Vercel may still track `main`; merge or change production branch to pick up this commit |
| **Public RSVP URL** | `https://britandkarl.com/rsvp` (per `config/wedding_config.json` primary domain) |

**Production branch:** Repo CI watches `main`, `master`, `develop` (`.github/workflows/ci.yml`). This push was to **`save-the-date-mode`** — confirm which branch Vercel deploys under **Project → Settings → Git**.

---

## Remaining manual tasks

1. Create or select Supabase project; run migration SQL.
2. Add env vars to **Vercel** → Project → Settings → Environment Variables; redeploy.
3. Optionally set `RSVP_EXPORT_SECRET` and test export.
4. Confirm which Git branch is **Production** on Vercel; merge and push accordingly.
5. Smoke-test live: submit one RSVP, verify row in Supabase Table Editor.

---

## Blockers if RSVP returns “not fully configured”

- Missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` in the **runtime** environment (e.g. Vercel).
- Migration not applied (insert fails with relation or column errors — check Vercel function logs).
