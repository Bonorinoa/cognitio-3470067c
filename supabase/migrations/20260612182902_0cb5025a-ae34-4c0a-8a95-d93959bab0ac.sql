DROP POLICY "Anyone can submit an inquiry" ON public.institution_inquiries;

CREATE POLICY "Anyone can submit an inquiry"
  ON public.institution_inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new');