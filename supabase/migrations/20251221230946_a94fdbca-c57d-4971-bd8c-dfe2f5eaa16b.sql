-- Add mux_asset_id and upload_status columns to chapters table
ALTER TABLE public.chapters 
ADD COLUMN IF NOT EXISTS mux_asset_id text,
ADD COLUMN IF NOT EXISTS upload_status text DEFAULT 'pending';