ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS transcript_language text NOT NULL DEFAULT 'es';