-- Add is_active column for soft-delete of generation history
-- This allows us to track daily usage accurately while limiting visible history to 10 items

ALTER TABLE public.ai_generation_history 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add index for faster queries on active records
CREATE INDEX IF NOT EXISTS idx_ai_generation_history_active 
ON public.ai_generation_history (instructor_id, is_active, created_at DESC);