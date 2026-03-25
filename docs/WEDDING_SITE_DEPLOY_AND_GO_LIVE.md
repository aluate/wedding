# Deploy & Go Live

## 1. Branch that must deploy
`main` — push to `main` and Vercel auto-deploys.

## 2. Env vars required (Vercel)
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RSVP_EXPORT_SECRET` (any strong random string you choose)

## 3. Migration to run
In Supabase SQL Editor, run:
```sql
-- If table doesn't exist yet, run the full migration:
-- supabase/migrations/20260324160000_rsvp_submissions.sql

-- If table already exists, just add the meal_choice column:
-- supabase/migrations/20260325000000_add_meal_choice.sql
```

## 4. How to verify deploy
1. Visit https://britandkarl.com — confirm the nav bar appears
2. Visit https://britandkarl.com/details — confirm FAQ section is visible
3. Visit https://britandkarl.com/rsvp — confirm meal choice dropdown exists

## 5. One live RSVP test
1. Go to https://britandkarl.com/rsvp
2. Fill in: test name, test@example.com, attending yes, 1 guest, select a meal
3. Submit → see "Thank you" confirmation
4. Check Supabase table → row exists
5. Submit again with same email → row is updated (not duplicated)
6. Delete the test row from Supabase when done

## 6. QR URL to use
```
https://britandkarl.com/rsvp
```
Or with an invite code:
```
https://britandkarl.com/rsvp/YOUR_CODE
```
Generate the QR code with any generator pointing to the URL above.

## 7. Safe to send invites?
**YES AFTER THESE STEPS:**
1. Push latest `main` to trigger Vercel deploy
2. Run the `meal_choice` migration in Supabase
3. Verify env vars are set in Vercel
4. Complete one successful test RSVP end-to-end
5. Then you are clear to send save-the-dates and invites
