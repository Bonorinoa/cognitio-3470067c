INSERT INTO public.platform_settings (key, value, updated_at)
VALUES (
  'founder_user_ids',
  '["1c52c631-c5dc-4f45-9a61-b7b6ca6dc96c","dfd5e06a-2598-4d7b-9e93-bb24652ebb25","4bb7aa32-e336-4000-b390-078199334dc7"]'::jsonb,
  now()
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();