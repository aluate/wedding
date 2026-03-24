# RSVP Launch Checklist (Operator)

**Goal:** `https://britandkarl.com/rsvp` saves to Supabase and you can export CSV.

---

## 1. Merge and deploy

- [ ] Merge **`save-the-date-mode` → `main`** (PR or local merge + `git push origin main`).  
  **Evidence:** `origin/main` currently lacks commits `5599fd0` / `ea6ddeb`; production HTML still shows RSVP placeholder and `/api/rsvp` 404.  
- [ ] Confirm Vercel production tracks **`main`** (Dashboard → Settings → Git).  
- [ ] Wait for production deployment green.

---

## 2. Env vars (Vercel → Production)

- [ ] `NEXT_PUBLIC_SUPABASE_URL`  
- [ ] `SUPABASE_SERVICE_ROLE_KEY`  
- [ ] (Optional) `RSVP_EXPORT_SECRET` — required only if you use export  

Redeploy after saving.

---

## 3. Migration

- [ ] Run `supabase/migrations/20260324160000_rsvp_submissions.sql` in Supabase SQL Editor.  
- [ ] Confirm table `rsvp_submissions` in Table Editor.

---

## 4. One test RSVP

- [ ] Open `https://britandkarl.com/rsvp` — must show **full form** (not “coming soon”).  
- [ ] Submit **Yes** + guest count **1**.  
- [ ] Row appears in Supabase.

---

## 5. One export test (if using export)

```bash
curl -sS "https://britandkarl.com/api/rsvp/export" \
  -H "Authorization: Bearer YOUR_RSVP_EXPORT_SECRET" \
  -o rsvp-export.csv
```

- [ ] CSV opens; includes test row.

---

## 6. QR / link URL

Use **`https://britandkarl.com/rsvp`**  
Per-invite: **`https://britandkarl.com/rsvp/{code}`** → redirects to `?invite={code}`.

---

## Safe to send invites?

**YES AFTER THESE 2–3 THINGS:**

1. **Merge to `main` (or whatever branch Vercel production uses)** so the new `/rsvp` + `/api/rsvp` are live.  
2. **Env vars + migration** so submissions persist.  
3. **One successful test RSVP** in Supabase.

Until (1)–(3): **NO** — live site still served pre-RSVP build at verification time.

---

## Single next action

**Merge RSVP commits into `main` and let Vercel deploy production** (then env + migration + test).
