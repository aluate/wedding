-- Guest room count for the wedding block (in addition to which nights are selected)

ALTER TABLE public.rsvp_submissions
  ADD COLUMN IF NOT EXISTS hotel_rooms integer;

COMMENT ON COLUMN public.rsvp_submissions.hotel_rooms IS
  'Number of guest rooms needed in the wedding room block (optional; typically one number for the whole stay).';
