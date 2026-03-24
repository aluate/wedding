# Wedding Site — RSVP System Audit

**Audited:** 2026-03-24  
**Repo:** `c:\dev\repos\wedding` (Git remote: `https://github.com/aluate/wedding.git`)  
**Method:** File inspection, `package.json`, `vercel.json`, build output, `git` state, documented deployment references.

---

## 1. Framework

| Item | Evidence |
|------|----------|
| **Stack** | Next.js **14.0.0** (`package.json` dependencies). |
| **Router** | **App Router** — routes live under `app/` (e.g. `app/page.tsx`, `app/layout.tsx`). No `pages/` router tree. |
| **Language** | TypeScript (`tsconfig.json`, `**/*.tsx`). |
| **Styling** | Tailwind CSS (`tailwind.config.js`, `app/globals.css`). Design tokens: `primary` `#81D8D0`, `accent` `#000000`, `background` `#F7F7F7`; fonts via `next/font` in `app/layout.tsx` (Inter body, Playfair Display heading). |
| **Public routes (from `next build` route table)** | `/`, `/details`, `/gallery`, `/game`, `/menu`, `/schedule`, `/travel`, `/admin`, `/rsvp` (static), `/rsvp/[code]` (dynamic SSR), `/api/health`. |

---

## 2. Current RSVP status

| Item | Evidence |
|------|----------|
| **RSVP index** | `app/rsvp/page.tsx` — placeholder copy only (“RSVP details coming soon…”), mailto/tel. **No form, no submission.** |
| **RSVP with code** | `app/rsvp/[code]/page.tsx` — **duplicate** of index content; **does not read `params.code`**. |
| **Forms elsewhere** | No other guest-facing RSVP form located. |
| **Storage / backend** | No database client in `package.json`. **No `supabase/` directory** in repo. |
| **API** | `app/api/health/route.ts` — health check only. |
| **Admin** | `app/admin/page.tsx` — **mock RSVPs** (`mockRSVPs`, `totalInvited = 50`); comment: “in production this would come from an API”. |

---

## 3. Deployment

| Item | Evidence |
|------|----------|
| **Platform** | `vercel.json`: `"framework": "nextjs"`, `buildCommand` / `installCommand`, region `iad1`. |
| **Docs** | `control/CONTROL_DEPLOYMENT.md`: Vercel + GitHub, auto-deploy. `docs/PRODUCTION_STATUS.md`: Vercel URL `https://wedding-lsaypp9dl-aluates-projects.vercel.app`, custom domain `britandkarl.com` (checklist items “needs verification”). |
| **Repo linkage** | `.vercel` is **gitignored** (`.gitignore`); no committed Vercel project ID in-repo. |
| **CI** | `.github/workflows/ci.yml`: runs on `push`/`pull_request` to **`main`, `master`, `develop` only** — not `save-the-date-mode`. Uses `npm ci` (see risks). |
| **Production branch (inferred)** | `remotes/origin/main` exists; docs and CI assume **`main`** as the usual integration branch. **Not verified against Vercel dashboard** (which branch is “Production” is project settings). |
| **Current git state** | Branch `save-the-date-mode` (tracking `origin/save-the-date-mode`); large set of **uncommitted / untracked** files per `git status` at audit time — **push safety depends on what is committed and which branch Vercel watches.** |

---

## 4. Data / backend / env

| Item | Evidence |
|------|----------|
| **Supabase** | **Not installed** (`@supabase/supabase-js` absent from `package.json`). Documented as **planned** in `README.md`, `ENV_SETUP.md`, `LOCAL_SUPABASE_SETUP.md`. |
| **Env files** | `.env` / `.env*.local` gitignored; **no committed `.env.example`** at audit time. `ENV_SETUP.md` lists future `NEXT_PUBLIC_SUPABASE_*` and `SUPABASE_SERVICE_ROLE_KEY`. |
| **Server actions** | None found for RSVP; only standard pages and `app/api/health`. |

---

## 5. DNS / domain / QR-safe routes

| Item | Evidence |
|------|----------|
| **Primary domain (config)** | `config/wedding_config.json` → `site.primaryDomain`: `https://britandkarl.com`. |
| **QR / deep link** | **`/rsvp`** is static and suitable as canonical RSVP URL. **`/rsvp/[code]`** exists for per-invite paths but currently ignores `code`; intended pattern is documented in `README.md` (`/rsvp/[code]`). |

---

## 6. Risk check

| Risk | Severity | Notes |
|------|----------|--------|
| **RSVP is placeholder** | Guest-facing | Replacing copy with a real form + API changes behavior; test mobile and links from home/nav. |
| **`/rsvp` vs `/rsvp/[code]` duplication** | Maintenance / UX | Two files with identical content; easy to ship inconsistent updates. |
| **Admin shows mock data** | Trust | `/admin` could be mistaken for real counts; clarify or wire to data later. |
| **No `package-lock.json` in repo** | CI / reproducibility | `npm ci` in `.github/workflows/ci.yml` **will fail** until a lockfile is committed. |
| **Next.js 14.0.0** | Security | `npm install` reported deprecation / security advisory for this Next version — plan upgrade separately from RSVP. |
| **Branch vs Vercel** | Deploy | Pushing `save-the-date-mode` may not deploy production if Vercel is tied only to `main`. **Confirm in Vercel.** |
| **Secrets for Supabase** | Blocker until set | Production RSVP persistence requires Supabase (or other backend) env vars in Vercel; without them, API must not fake success. |

---

## 7. Recommended build path (preview)

1. **Single RSVP surface** — one canonical `/rsvp` form; optional `invite` query or `/rsvp/[code]` redirect for QR/deep links.  
2. **Supabase** — aligns with existing docs; add migration SQL in repo, server-only writes via Route Handler + service role (or strict RLS if using anon — document either way).  
3. **Deduping** — normalize email + unique constraint + upsert or explicit “update my RSVP” behavior.  
4. **Admin/export** — SQL + optional secured export route; avoid shipping mock numbers as “production” without labeling.  
5. **Lockfile + CI** — add `package-lock.json` so `npm ci` matches local installs.  
6. **Deploy** — merge to branch Vercel uses for production; set env vars; verify `https://britandkarl.com/rsvp` (or Vercel URL).

---

## 8. Unknowns / blockers

| Unknown | Why it matters |
|---------|----------------|
| **Which Git branch triggers Vercel production** | Determines safe push target; not in repo files. |
| **Whether `britandkarl.com` DNS → Vercel is complete** | `docs/PRODUCTION_STATUS.md` lists verification unchecked. |
| **Supabase project created?** | Required for live DB; no project IDs in repo. |
| **Email provider for “guest updates”** | Out of scope for minimal RSVP storage; needs provider + secrets later. |

---

## 9. Local verification run

- **`npm install`** then **`node_modules/.bin/next build`** (Next **14.0.0** from `package.json`): **succeeded** (2026-03-24).  
- **`npm ci`**: **not run** — no `package-lock.json` present at audit time.
