CREATE TABLE public.institution_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  organization text NOT NULL,
  role text,
  inquiry_type text NOT NULL DEFAULT 'general',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT institution_inquiries_name_len CHECK (char_length(name) BETWEEN 1 AND 120),
  CONSTRAINT institution_inquiries_email_len CHECK (char_length(email) BETWEEN 3 AND 255),
  CONSTRAINT institution_inquiries_org_len CHECK (char_length(organization) BETWEEN 1 AND 200),
  CONSTRAINT institution_inquiries_role_len CHECK (role IS NULL OR char_length(role) <= 120),
  CONSTRAINT institution_inquiries_message_len CHECK (char_length(message) BETWEEN 10 AND 4000),
  CONSTRAINT institution_inquiries_type_chk CHECK (inquiry_type IN ('general','lms','ai_workflows','custom_build','training','other')),
  CONSTRAINT institution_inquiries_status_chk CHECK (status IN ('new','contacted','closed','archived'))
);

GRANT INSERT ON public.institution_inquiries TO anon, authenticated;
GRANT SELECT, UPDATE ON public.institution_inquiries TO authenticated;
GRANT ALL ON public.institution_inquiries TO service_role;

ALTER TABLE public.institution_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.institution_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read all inquiries"
  ON public.institution_inquiries
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update inquiries"
  ON public.institution_inquiries
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_institution_inquiries_updated_at
  BEFORE UPDATE ON public.institution_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();