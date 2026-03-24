# Wedding Site — RSVP Deployment Notes

**Date:** 2026-03-24 (updated: production-readiness pass)  
**Repo:** `wedding` (Next.js 14 App Router)

---

## Deployment truth (evidence-based)

### Git

| Fact | Evidence |
|------|----------|
| **Remote** | `origin` → `https://github.com/aluate/wedding.git` |
| **Branches** | `main`, `save-the-date-mode` (both on `origin`) |
| **`origin/main` tip** | `9889111` — *Merge pull request #1 from aluate/save-the-date-mode* — merges **`8ee2709` only** (save-the-date copy/nav), **not** the RSVP implementation commits |
| **RSVP commits** | `5599fd0`, `ea6ddeb` exist on **`origin/save-the-date-mode`** only — **`git rev-list origin/main..origin/save-the-date-mode` = 2 commits** |
| **Vercel production branch** | **Not stored in repo.** Standard setup + GitHub merge pattern → **assume `main` for production** until you confirm in **Vercel → Project → Settings → Git → Production Branch** |

### What is live on `britandkarl.com` (verified via HTTP, 2026-03-24)

| URL | Result |
|-----|--------|
| `GET /rsvp` | **Placeholder** copy: “RSVP details coming soon…” — **not** the new form |
| `POST /api/rsvp` | **404** (Next not-found page) — **API route not present** on current production build |

**Conclusion:** Production is still a **pre-RSVP** deployment. The RSVP work is **in git on `save-the-date-mode`** but **not merged to `main`** and therefore **not** what `britandkarl.com` serves.

### Preview deploys

- Non-`main` branches typically get **Vercel Preview** URLs per push — **exact URL is only in the Vercel dashboard** (not inferable from repo).

### What must happen for `britandkarl.com/rsvp` to serve the new code

1. **Merge** `save-the-date-mode` into **`main`** (or whatever branch Vercel uses for production — confirm in Vercel).  
2. **Push** `main` so Vercel builds.  
3. **Set** Supabase env vars on that deployment (see `docs/WEDDING_SITE_RSVP_ENV_SETUP.md`).  
4. **Run** migration in Supabase.  
5. **Redeploy** if env was added after first build.

---

## What changed (implementation summary)

- **`/rsvp`:** RSVP form (when deployed).  
- **`/rsvp/{code}`:** Redirects to `/rsvp?invite={code}`.  
- **`POST /api/rsvp`:** Validates, upserts by `email_normalized`.  
- **`GET /api/rsvp/export`:** CSV with `Authorization: Bearer <RSVP_EXPORT_SECRET>`.  
- **SQL:** `supabase/migrations/20260324160000_rsvp_submissions.sql`.

---

## Environment variables

See **`docs/WEDDING_SITE_RSVP_ENV_SETUP.md`** for exact names, required vs optional, and migration steps.

Summary:

| Variable | Required for RSVP save |
|----------|-------------------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes |
| `RSVP_EXPORT_SECRET` | Only for export |

`NEXT_PUBLIC_SUPABASE_ANON_KEY` is **not** used by current RSVP code paths.

---

## Git / deploy status

| Item | Status |
|------|--------|
| **RSVP code on `origin/save-the-date-mode`** | Yes (`ea6ddeb` and earlier) |
| **RSVP code on `origin/main`** | **No** (as of verification: `main` stops at merge of `8ee2709`) |
| **`britandkarl.com` serves RSVP implementation** | **No** (verified: placeholder UI + 404 on `POST /api/rsvp`) |
| **Vercel production branch** | **Confirm manually** in Vercel (not in repo) |

---

## Operator docs index

- **Env + migration:** `docs/WEDDING_SITE_RSVP_ENV_SETUP.md`  
- **Verification log:** `docs/WEDDING_SITE_RSVP_VERIFICATION.md`  
- **Launch steps:** `docs/WEDDING_SITE_RSVP_LAUNCH_CHECKLIST.md`

---

## Blockers if RSVP returns “not fully configured”

- Missing `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_SERVICE_ROLE_KEY` in Vercel **production** runtime.  
- Migration not applied.  
- **Old build still deployed** — merge `save-the-date-mode` → `main` (or production branch) first.
