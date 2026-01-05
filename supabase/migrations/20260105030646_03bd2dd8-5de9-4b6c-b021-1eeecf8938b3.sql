-- Phase 1: AI Studio Commercialization - Database Schema Changes

-- 1. Create new enums for subscription system
CREATE TYPE public.ai_bundle AS ENUM ('marketing', 'academic', 'pro');
CREATE TYPE public.subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

-- 2. Rename instructor_knowledge_base to user_knowledge_base
ALTER TABLE public.instructor_knowledge_base RENAME TO user_knowledge_base;

-- 3. Rename instructor_id to user_id in user_knowledge_base
ALTER TABLE public.user_knowledge_base RENAME COLUMN instructor_id TO user_id;

-- 4. Rename instructor_style_profile to user_style_profile
ALTER TABLE public.instructor_style_profile RENAME TO user_style_profile;

-- 5. Rename instructor_id to user_id in user_style_profile
ALTER TABLE public.user_style_profile RENAME COLUMN instructor_id TO user_id;

-- 6. Rename instructor_id to user_id in ai_generation_history
ALTER TABLE public.ai_generation_history RENAME COLUMN instructor_id TO user_id;

-- 7. Rename instructor_id to user_id in ai_usage_logs
ALTER TABLE public.ai_usage_logs RENAME COLUMN instructor_id TO user_id;

-- 8. Create ai_tier_limits configuration table
CREATE TABLE public.ai_tier_limits (
  tier_name TEXT PRIMARY KEY,
  daily_limit INTEGER NOT NULL,
  requests_per_minute INTEGER NOT NULL DEFAULT 5,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default tier limits
INSERT INTO public.ai_tier_limits (tier_name, daily_limit, requests_per_minute, description) VALUES
  ('free', 10, 3, 'Free registered user'),
  ('instructor', 50, 10, 'Instructor perk tier'),
  ('marketing', 200, 15, 'Marketing bundle subscriber'),
  ('academic', 200, 15, 'Academic bundle subscriber'),
  ('pro', 500, 20, 'Pro bundle subscriber');

-- 9. Create ai_subscriptions table
CREATE TABLE public.ai_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bundle public.ai_bundle NOT NULL,
  status public.subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, bundle)
);

-- 10. Enable RLS on new tables
ALTER TABLE public.ai_tier_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_subscriptions ENABLE ROW LEVEL SECURITY;

-- 11. RLS policies for ai_tier_limits (public read)
CREATE POLICY "Anyone can read tier limits"
  ON public.ai_tier_limits
  FOR SELECT
  USING (true);

-- 12. RLS policies for ai_subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON public.ai_subscriptions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage subscriptions"
  ON public.ai_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- 13. Drop old RLS policies on renamed tables and recreate for any authenticated user

-- user_knowledge_base policies (drop old instructor-specific policies)
DROP POLICY IF EXISTS "Instructors can view own knowledge base" ON public.user_knowledge_base;
DROP POLICY IF EXISTS "Instructors can create knowledge base entries" ON public.user_knowledge_base;
DROP POLICY IF EXISTS "Instructors can update own knowledge base" ON public.user_knowledge_base;
DROP POLICY IF EXISTS "Instructors can delete own knowledge base entries" ON public.user_knowledge_base;

-- Recreate policies for any authenticated user
CREATE POLICY "Users can view own knowledge base"
  ON public.user_knowledge_base
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create knowledge base entries"
  ON public.user_knowledge_base
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own knowledge base"
  ON public.user_knowledge_base
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own knowledge base entries"
  ON public.user_knowledge_base
  FOR DELETE
  USING (auth.uid() = user_id);

-- user_style_profile policies (drop old instructor-specific policies)
DROP POLICY IF EXISTS "Instructors can view own style profile" ON public.user_style_profile;
DROP POLICY IF EXISTS "Instructors can create own style profile" ON public.user_style_profile;
DROP POLICY IF EXISTS "Instructors can update own style profile" ON public.user_style_profile;

-- Recreate policies for any authenticated user
CREATE POLICY "Users can view own style profile"
  ON public.user_style_profile
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own style profile"
  ON public.user_style_profile
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own style profile"
  ON public.user_style_profile
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ai_generation_history policies (drop old instructor-specific policies)
DROP POLICY IF EXISTS "Instructors can view own generation history" ON public.ai_generation_history;
DROP POLICY IF EXISTS "Instructors can create generation history" ON public.ai_generation_history;
DROP POLICY IF EXISTS "Instructors can update own generation history" ON public.ai_generation_history;
DROP POLICY IF EXISTS "Instructors can delete own generation history" ON public.ai_generation_history;

-- Recreate policies for any authenticated user
CREATE POLICY "Users can view own generation history"
  ON public.ai_generation_history
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create generation history"
  ON public.ai_generation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generation history"
  ON public.ai_generation_history
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generation history"
  ON public.ai_generation_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- ai_usage_logs policies (drop old instructor-specific policies)
DROP POLICY IF EXISTS "Instructors can view own usage logs" ON public.ai_usage_logs;
DROP POLICY IF EXISTS "Service role can insert usage logs" ON public.ai_usage_logs;

-- Recreate policies for any authenticated user
CREATE POLICY "Users can view own usage logs"
  ON public.ai_usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can insert usage logs"
  ON public.ai_usage_logs
  FOR INSERT
  WITH CHECK (true);

-- 14. Create trigger for updating ai_subscriptions.updated_at
CREATE TRIGGER update_ai_subscriptions_updated_at
  BEFORE UPDATE ON public.ai_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();