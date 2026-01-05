-- Create feature_notify_requests table for coming soon feature notifications
CREATE TABLE IF NOT EXISTS public.feature_notify_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  feature_key TEXT NOT NULL,  -- e.g., 'academic_bundle', 'marketing_linkedin'
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- optional, if logged in
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ,  -- set when we notify them
  UNIQUE(email, feature_key)
);

-- Enable RLS
ALTER TABLE public.feature_notify_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (even anonymous for landing page)
CREATE POLICY "Anyone can request notification" ON public.feature_notify_requests
  FOR INSERT WITH CHECK (true);

-- Users can only see their own requests (not anonymous ones)
CREATE POLICY "Users can view own requests" ON public.feature_notify_requests
  FOR SELECT USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_feature_notify_requests_feature_key ON public.feature_notify_requests(feature_key);
CREATE INDEX IF NOT EXISTS idx_feature_notify_requests_email ON public.feature_notify_requests(email);
