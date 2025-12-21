-- Add stripe_price_id column to courses table
ALTER TABLE public.courses ADD COLUMN stripe_price_id text;

-- Add stripe_product_id column to courses table
ALTER TABLE public.courses ADD COLUMN stripe_product_id text;