-- Add hotel night + household_code columns if they don't exist (safe to re-run)
-- Run this in Supabase SQL Editor if the table already exists

DO $$
BEGIN
  -- Remove meal_choice if it was added previously
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvp_submissions' AND column_name = 'meal_choice'
  ) THEN
    ALTER TABLE public.rsvp_submissions DROP COLUMN meal_choice;
  END IF;

  -- Remove old invite_code if exists (replaced by household_code)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvp_submissions' AND column_name = 'invite_code'
  ) THEN
    ALTER TABLE public.rsvp_submissions RENAME COLUMN invite_code TO household_code;
  END IF;

  -- Add household_code if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvp_submissions' AND column_name = 'household_code'
  ) THEN
    ALTER TABLE public.rsvp_submissions ADD COLUMN household_code text;
  END IF;

  -- Add staying_friday
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvp_submissions' AND column_name = 'staying_friday'
  ) THEN
    ALTER TABLE public.rsvp_submissions ADD COLUMN staying_friday boolean DEFAULT false;
  END IF;

  -- Add staying_saturday
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'rsvp_submissions' AND column_name = 'staying_saturday'
  ) THEN
    ALTER TABLE public.rsvp_submissions ADD COLUMN staying_saturday boolean DEFAULT false;
  END IF;
END $$;

-- Add index on household_code for lookup
CREATE INDEX IF NOT EXISTS rsvp_submissions_household_code_idx ON public.rsvp_submissions (household_code);
