
ALTER TABLE public.ai_usage_logs
  ADD COLUMN IF NOT EXISTS prompt_tokens integer,
  ADD COLUMN IF NOT EXISTS completion_tokens integer,
  ADD COLUMN IF NOT EXISTS total_tokens integer,
  ADD COLUMN IF NOT EXISTS latency_ms integer,
  ADD COLUMN IF NOT EXISTS function_name text,
  ADD COLUMN IF NOT EXISTS course_id uuid,
  ADD COLUMN IF NOT EXISTS chapter_id uuid;

UPDATE public.ai_usage_logs
SET function_name = CASE
  WHEN content_type = 'discussion_assist' THEN 'ai-discussion-reply'
  WHEN content_type IN ('blog', 'newsletter', 'linkedin', 'literature_review') THEN 'generate-content'
  WHEN content_type = 'refine' THEN 'refine-content'
  ELSE content_type
END
WHERE function_name IS NULL;

CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_created
  ON public.ai_usage_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_function_created
  ON public.ai_usage_logs (function_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_user_function_created
  ON public.ai_usage_logs (user_id, function_name, created_at DESC);

INSERT INTO public.platform_settings (key, value)
VALUES
  ('ai_default_model', '"google/gemini-3-flash-preview"'::jsonb),
  ('ai_default_temperature', '0.7'::jsonb),
  ('ai_default_max_tokens', '1024'::jsonb)
ON CONFLICT (key) DO NOTHING;

UPDATE public.ai_tier_limits
SET description = 'Archived: marketing bundle (de-prioritized)'
WHERE tier_name = 'marketing';
