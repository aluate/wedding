-- Tag guest photos by event (same keys as RSVP / site config)

ALTER TABLE public.guest_photos
  ADD COLUMN IF NOT EXISTS event_key text;

UPDATE public.guest_photos
SET event_key = 'wedding-2026'
WHERE event_key IS NULL OR trim(event_key) = '';

ALTER TABLE public.guest_photos
  ALTER COLUMN event_key SET DEFAULT 'wedding-2026';

ALTER TABLE public.guest_photos
  ALTER COLUMN event_key SET NOT NULL;

CREATE INDEX IF NOT EXISTS guest_photos_event_key_idx ON public.guest_photos (event_key);

COMMENT ON COLUMN public.guest_photos.event_key IS 'Site event slug (e.g. wedding-2026); used for filtering the photo wall.';
