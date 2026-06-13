
CREATE OR REPLACE FUNCTION public.get_admin_ai_overview()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  WITH today AS (
    SELECT
      COUNT(*) AS calls,
      COALESCE(SUM(total_tokens), 0) AS tokens
    FROM public.ai_usage_logs
    WHERE created_at >= date_trunc('day', now())
  ),
  last7 AS (
    SELECT
      COUNT(*) AS calls,
      COALESCE(SUM(total_tokens), 0) AS tokens
    FROM public.ai_usage_logs
    WHERE created_at >= now() - interval '7 days'
  ),
  by_function AS (
    SELECT COALESCE(function_name, content_type) AS fn,
           COUNT(*) AS calls,
           COALESCE(SUM(total_tokens), 0) AS tokens
    FROM public.ai_usage_logs
    WHERE created_at >= now() - interval '7 days'
    GROUP BY 1
    ORDER BY calls DESC
  ),
  top_users AS (
    SELECT l.user_id,
           p.full_name,
           p.email,
           COUNT(*) AS calls,
           COALESCE(SUM(l.total_tokens), 0) AS tokens
    FROM public.ai_usage_logs l
    LEFT JOIN public.profiles p ON p.id = l.user_id
    WHERE l.created_at >= now() - interval '7 days'
    GROUP BY l.user_id, p.full_name, p.email
    ORDER BY tokens DESC NULLS LAST, calls DESC
    LIMIT 10
  )
  SELECT jsonb_build_object(
    'today', (SELECT to_jsonb(today.*) FROM today),
    'last_7_days', (SELECT to_jsonb(last7.*) FROM last7),
    'by_function', COALESCE((SELECT jsonb_agg(to_jsonb(by_function.*)) FROM by_function), '[]'::jsonb),
    'top_users', COALESCE((SELECT jsonb_agg(to_jsonb(top_users.*)) FROM top_users), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_admin_ai_overview() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_ai_overview() TO authenticated;


CREATE OR REPLACE FUNCTION public.get_instructor_ai_insights()
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.has_role(auth.uid(), 'instructor') THEN
    RAISE EXCEPTION 'forbidden' USING ERRCODE = '42501';
  END IF;

  WITH my_courses AS (
    SELECT id, title FROM public.courses WHERE instructor_id = auth.uid()
  ),
  per_chapter AS (
    SELECT c.id AS chapter_id,
           c.title AS chapter_title,
           co.id AS course_id,
           co.title AS course_title,
           COUNT(u.*) AS tutor_calls
    FROM public.chapters c
    INNER JOIN my_courses co ON co.id = c.course_id
    LEFT JOIN public.ai_tutor_usage u ON u.chapter_id = c.id
    GROUP BY c.id, c.title, co.id, co.title
    HAVING COUNT(u.*) > 0
    ORDER BY tutor_calls DESC
    LIMIT 50
  ),
  totals AS (
    SELECT
      COUNT(*) AS total_tutor_sessions,
      COUNT(DISTINCT user_id) AS unique_students
    FROM public.ai_tutor_usage u
    WHERE u.chapter_id IN (
      SELECT c.id FROM public.chapters c
      INNER JOIN my_courses co ON co.id = c.course_id
    )
  )
  SELECT jsonb_build_object(
    'totals', (SELECT to_jsonb(totals.*) FROM totals),
    'per_chapter', COALESCE((SELECT jsonb_agg(to_jsonb(per_chapter.*)) FROM per_chapter), '[]'::jsonb)
  ) INTO result;

  RETURN result;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_instructor_ai_insights() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_instructor_ai_insights() TO authenticated;
