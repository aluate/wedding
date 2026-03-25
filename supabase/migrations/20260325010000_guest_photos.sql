-- Guest photo uploads
-- Apply in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.guest_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  filename text NOT NULL,
  url text NOT NULL,
  uploader_name text,
  caption text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guest_photos_created_at_idx ON public.guest_photos (created_at DESC);

ALTER TABLE public.guest_photos ENABLE ROW LEVEL SECURITY;

-- Also create the storage bucket (run separately in Supabase Dashboard → Storage):
-- 1. Create bucket named "guest-photos"
-- 2. Set it to PUBLIC
-- 3. Add a policy allowing anonymous uploads (insert) and public reads (select)
