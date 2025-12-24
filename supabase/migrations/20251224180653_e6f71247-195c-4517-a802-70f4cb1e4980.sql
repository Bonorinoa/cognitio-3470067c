-- Add is_featured column to courses table
ALTER TABLE public.courses ADD COLUMN is_featured boolean DEFAULT false;

-- Create policy for admins to update is_featured
CREATE POLICY "Admins can update any course featured status"
ON public.courses
FOR UPDATE
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));