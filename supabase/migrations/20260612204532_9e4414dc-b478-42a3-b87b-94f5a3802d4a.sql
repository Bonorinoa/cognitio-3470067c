-- 1) Drafts: pinned flag + composite index
ALTER TABLE public.ai_generation_history
  ADD COLUMN IF NOT EXISTS pinned boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_ai_generation_history_drafts
  ON public.ai_generation_history (user_id, content_type, is_active, created_at DESC);

-- 2) Waitlist table
CREATE TABLE public.ai_bundle_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bundle text NOT NULL,
  email text NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX ai_bundle_waitlist_bundle_email_key
  ON public.ai_bundle_waitlist (bundle, lower(email));

GRANT INSERT ON public.ai_bundle_waitlist TO anon, authenticated;
GRANT SELECT ON public.ai_bundle_waitlist TO authenticated;
GRANT ALL ON public.ai_bundle_waitlist TO service_role;

ALTER TABLE public.ai_bundle_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON public.ai_bundle_waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view waitlist"
  ON public.ai_bundle_waitlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));