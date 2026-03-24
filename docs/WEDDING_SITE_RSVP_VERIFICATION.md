# Wedding Site — RSVP Verification Log

**Date:** 2026-03-24  
**Method:** Repo inspection, `npm run build` / `npm run verify-rsvp`, HTTP checks against `https://britandkarl.com` where applicable. **No Vercel dashboard or Supabase credentials in this environment.**

---

## Legend

| Status | Meaning |
|--------|---------|
| **PASS** | Verified in this pass |
| **FAIL** | Observed incorrect behavior |
| **BLOCKED** | Needs secrets, dashboard, or deploy not available here |

---

## Deployment / live code

| Check | Status | Evidence |
|-------|--------|----------|
| `origin/main` exists; merge PR #1 merged `save-the-date-mode` at `8ee2709` | PASS | `git log origin/main` — `9889111 Merge pull request #1` |
| RSVP commits (`5599fd0`, `ea6ddeb`) on `origin/save-the-date-mode`, **not** on `origin/main` | PASS | `git rev-list origin/main..origin/save-the-date-mode` shows 2 commits |
| Production `https://britandkarl.com/rsvp` shows **placeholder** (“RSVP details coming soon”), not new form | PASS | HTTP fetch of page body (2026-03-24) |
| Production `POST https://britandkarl.com/api/rsvp` returns **404** (route missing on deployed build) | PASS | Response body is Next.js `not-found` HTML |
| Vercel “Production Branch” setting | **BLOCKED** | Not in repo; inferred **`main`** from GitHub merge pattern |
| Preview URL for `save-the-date-mode` | **BLOCKED** | Requires Vercel dashboard |

---

## Build / static checks

| Check | Status | Evidence |
|-------|--------|----------|
| `npm run verify-rsvp` (validator unit tests) | PASS | All 8 checks passed |
| `npm run build` | PASS | `next build` completed successfully (2026-03-24, Next 14.0.0) |

---

## Form / validation (offline)

| Check | Status | Evidence |
|-------|--------|----------|
| Yes + guest_count ≥ 1 | PASS | `scripts/rsvp-validation-selftest.ts` |
| No → guest_count coerced to 0 | PASS | Same |
| Bad email rejected | PASS | Same |
| Missing attending rejected | PASS | Same |
| Yes + guest_count 0 rejected | PASS | Same |

---

## API behavior (needs deploy + env)

| Check | Status | Evidence |
|-------|--------|----------|
| `POST /api/rsvp` persists row when env + migration OK | **BLOCKED** | Requires Supabase + merged deploy |
| Duplicate email upserts | **BLOCKED** | Code review: `onConflict: 'email_normalized'` |
| Invalid payload 400 | **BLOCKED** | Code review: `validateRsvpPayload` |
| Missing env 500 honest message | **BLOCKED** | Code review: `app/api/rsvp/route.ts` |
| `GET /api/rsvp/export` 501 without secret | **ASSUMED** | Code path in `export/route.ts` — not hit on production (404 for route) |

---

## Export route

| Check | Status | Evidence |
|-------|--------|----------|
| Bearer `RSVP_EXPORT_SECRET` required | ASSUMED | `export/route.ts` |
| CSV columns match table | ASSUMED | `select(...)` list matches migration |

---

## Mobile / styling

| Check | Status | Evidence |
|-------|--------|----------|
| No regression scan on device | **BLOCKED** | Not run; form uses same Tailwind patterns as other pages |

---

## Summary

- **Verified without secrets:** Validator logic; **git lineage** (RSVP not on `main`); **live site** still on pre-RSVP UI and **no `/api/rsvp`** on production.  
- **Blocked:** End-to-end save/export until **merge to production branch**, **Vercel env**, **migration**, and **redeploy**.  
- **Assumed from code review:** Upsert, export auth, error messages — **re-verify after first production deploy.**
