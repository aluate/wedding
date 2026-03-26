-- Add event_key for multi-event support and update uniqueness
-- Safe to run multiple times

ALTER TABLE public.rsvp_submissions
  ADD COLUMN IF NOT EXISTS event_key text;

UPDATE public.rsvp_submissions
SET event_key = 'wedding-2026'
WHERE event_key IS NULL OR event_key = '';

ALTER TABLE public.rsvp_submissions
  ALTER COLUMN event_key SET NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'rsvp_submissions'
      AND constraint_name = 'rsvp_submissions_email_normalized_unique'
  ) THEN
    ALTER TABLE public.rsvp_submissions DROP CONSTRAINT rsvp_submissions_email_normalized_unique;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS rsvp_submissions_event_email_unique_idx
  ON public.rsvp_submissions (event_key, email_normalized);

CREATE INDEX IF NOT EXISTS rsvp_submissions_event_key_idx
  ON public.rsvp_submissions (event_key);
