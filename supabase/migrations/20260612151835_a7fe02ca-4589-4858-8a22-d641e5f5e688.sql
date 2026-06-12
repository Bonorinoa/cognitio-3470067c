
-- 1. Tighten two permissive RLS policies (restrict to service_role)
DROP POLICY IF EXISTS "Service role can insert usage logs" ON public.ai_usage_logs;
CREATE POLICY "Service role can insert usage logs"
  ON public.ai_usage_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role can manage subscriptions" ON public.ai_subscriptions;
CREATE POLICY "Service role can manage subscriptions"
  ON public.ai_subscriptions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- 2. Revoke EXECUTE on trigger-only SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.check_featured_course_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_discussion_reply_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_discussion_upvote_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_reply_upvote_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_discussion_vote_count() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_course_rating_stats() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 3. Tighten RLS-helper functions: only signed-in users may call them (anon revoked)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.has_course_access(uuid, uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_course_access(uuid, uuid) TO authenticated, service_role;

-- 4. Public-facing RPCs: keep callable by anon + authenticated (instructor discovery / public profiles)
GRANT EXECUTE ON FUNCTION public.get_instructor_catalog() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_profile(uuid) TO anon, authenticated;

-- 5. Remove public SELECT on resources bucket; signed-in users may read, edge function uses service role
DROP POLICY IF EXISTS "Resources are publicly accessible" ON storage.objects;
CREATE POLICY "Authenticated users can read resources"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'resources');
