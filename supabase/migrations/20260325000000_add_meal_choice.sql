-- Add meal_choice column if it doesn't exist (safe to re-run)
-- Run this in Supabase SQL Editor if the table already exists

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'rsvp_submissions'
      AND column_name = 'meal_choice'
  ) THEN
    ALTER TABLE public.rsvp_submissions ADD COLUMN meal_choice text;
  END IF;
END $$;
