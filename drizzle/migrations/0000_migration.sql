CREATE TABLE public.stripe_customers (
  user_id uuid PRIMARY KEY,
  stripe_customer_id text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.stripe_customers TO service_role;
ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;

-- Backfill from existing subscriptions
INSERT INTO public.stripe_customers (user_id, stripe_customer_id)
SELECT DISTINCT ON (user_id) user_id, stripe_customer_id
FROM public.ai_subscriptions
WHERE stripe_customer_id IS NOT NULL
ORDER BY user_id, created_at DESC
ON CONFLICT DO NOTHING;

CREATE TABLE public.mux_signing_keys (
  id text PRIMARY KEY,
  private_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.mux_signing_keys TO service_role;
ALTER TABLE public.mux_signing_keys ENABLE ROW LEVEL SECURITY;