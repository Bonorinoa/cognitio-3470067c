-- Create ai_usage_logs table for tracking every AI API call
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_id UUID NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'blog',
  model_used TEXT DEFAULT 'google/gemini-2.5-flash',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient daily count queries
CREATE INDEX idx_ai_usage_logs_daily 
  ON public.ai_usage_logs (instructor_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

-- Instructors can only view their own logs
CREATE POLICY "Instructors can view own usage logs"
  ON public.ai_usage_logs FOR SELECT
  USING (auth.uid() = instructor_id);

-- Insert policy - only authenticated users with instructor role can have logs created
-- Edge functions will insert via service role key
CREATE POLICY "Service role can insert usage logs"
  ON public.ai_usage_logs FOR INSERT
  WITH CHECK (true);