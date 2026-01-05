-- Drop the existing composite unique constraint
ALTER TABLE public.ai_subscriptions DROP CONSTRAINT IF EXISTS ai_subscriptions_user_id_bundle_key;

-- Add a unique constraint on user_id alone (one subscription per user)
ALTER TABLE public.ai_subscriptions ADD CONSTRAINT ai_subscriptions_user_id_key UNIQUE (user_id);