-- RSVP submissions for wedding site (Supabase Postgres)
-- Apply in Supabase SQL Editor or via: supabase db push (when CLI linked)

CREATE TABLE IF NOT EXISTS public.rsvp_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  email_normalized text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  phone text,
  attending boolean NOT NULL,
  guest_count integer NOT NULL DEFAULT 0,
  guest_names text,
  meal_choice text,
  dietary_restrictions text,
  notes text,
  invite_code text,
  household_name text,
  mailing_address text,
  thank_you_status text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT rsvp_submissions_email_normalized_unique UNIQUE (email_normalized),
  CONSTRAINT rsvp_submissions_guest_count_non_negative CHECK (guest_count >= 0),
  CONSTRAINT rsvp_submissions_guest_count_attending CHECK (
    (NOT attending AND guest_count = 0) OR (attending AND guest_count >= 1)
  )
);

CREATE INDEX IF NOT EXISTS rsvp_submissions_created_at_idx ON public.rsvp_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS rsvp_submissions_attending_idx ON public.rsvp_submissions (attending);

ALTER TABLE public.rsvp_submissions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.rsvp_submissions IS 'Wedding RSVPs; accessed from Next.js API routes using service role.';

-- Headcount (attending guests): 
--   SELECT COALESCE(SUM(guest_count), 0) FROM public.rsvp_submissions WHERE attending = true;
