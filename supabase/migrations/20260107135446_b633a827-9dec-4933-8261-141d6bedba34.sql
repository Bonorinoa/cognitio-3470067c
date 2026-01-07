-- Add Liliana as admin
INSERT INTO user_roles (user_id, role)
VALUES ('4bb7aa32-e336-4000-b390-078199334dc7', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;