# Go live now — operator steps

## 1. Git action to take

- **Confirm:** `main` on GitHub includes the RSVP merge (`git log main -1` on origin should show merge of `save-the-date-mode`).  
- **If missing:** from a clone with the merge: `git push origin main`.  
- **Otherwise:** `git checkout main && git pull origin main`.

---

## 2. Vercel settings to verify

- **Project → Settings → Git → Production Branch** = **`main`** (or the branch you deploy to production).
- After env vars change: **Deployments →** latest production deployment **succeeded** (or **Redeploy** with “Use existing Build Cache” off if env was added late).

---

## 3. Env vars to add

In **Vercel → Project → Settings → Environment Variables** (for **Production**):

| Name | Value source |
|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → same page → **service_role** (secret) |
| `RSVP_EXPORT_SECRET` | Optional — long random string for CSV export only |

---

## 4. Migration to run

1. Supabase → **SQL Editor** → New query.  
2. Paste full file: **`supabase/migrations/20260324160000_rsvp_submissions.sql`**.  
3. Run.  
4. **Table Editor** → confirm **`public.rsvp_submissions`**.

---

## 5. Test RSVP to submit

1. Open **`https://britandkarl.com/rsvp`** (after deploy).  
2. **Yes** — attend, **1** guest, use a **real email you control** (e.g. yours + `+test` alias).  
3. Submit.

---

## 6. Exact success criteria

- Page shows the **full RSVP form** (not “coming soon”).  
- Submit returns **thank-you** state (no error banner).  
- **Supabase Table Editor** → `rsvp_submissions` has **one new row** with matching email.  
- **`POST /api/rsvp`** no longer 404 (optional: browser Network tab → 200 on submit).

---

## 7. Final QR URL to use

**`https://britandkarl.com/rsvp`**

Per-invite: **`https://britandkarl.com/rsvp/{code}`** (redirects with `invite` query).
