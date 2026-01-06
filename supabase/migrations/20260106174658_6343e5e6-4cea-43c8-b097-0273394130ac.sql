-- Fix service role policies to be more explicit about requiring service role context
-- These policies are intentionally permissive for edge function use with service_role key

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Service role can manage transcripts" ON public.chapter_transcripts;
DROP POLICY IF EXISTS "Service role can insert AI replies" ON public.discussion_replies;
DROP POLICY IF EXISTS "Service role can insert usage" ON public.ai_tutor_usage;

-- Recreate with service role check using current_setting
-- These will only work when called with service_role key (edge functions)
CREATE POLICY "Service role can manage transcripts"
ON public.chapter_transcripts FOR ALL
USING (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
)
WITH CHECK (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

CREATE POLICY "Service role can insert AI replies"
ON public.discussion_replies FOR INSERT
WITH CHECK (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);

CREATE POLICY "Service role can insert usage records"
ON public.ai_tutor_usage FOR INSERT
WITH CHECK (
  (current_setting('request.jwt.claims', true)::json->>'role') = 'service_role'
);