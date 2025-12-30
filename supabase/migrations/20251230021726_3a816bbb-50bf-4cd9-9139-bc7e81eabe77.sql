-- Create instructor_services table
CREATE TABLE public.instructor_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  duration_minutes INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instructor_services ENABLE ROW LEVEL SECURITY;

-- Public can view active services
CREATE POLICY "Active services are viewable by everyone"
ON public.instructor_services
FOR SELECT
USING (is_active = true);

-- Instructors can view all their own services
CREATE POLICY "Instructors can view own services"
ON public.instructor_services
FOR SELECT
USING (auth.uid() = instructor_id);

-- Instructors can create services
CREATE POLICY "Instructors can create services"
ON public.instructor_services
FOR INSERT
WITH CHECK (auth.uid() = instructor_id AND has_role(auth.uid(), 'instructor'::app_role));

-- Instructors can update own services
CREATE POLICY "Instructors can update own services"
ON public.instructor_services
FOR UPDATE
USING (auth.uid() = instructor_id);

-- Instructors can delete own services
CREATE POLICY "Instructors can delete own services"
ON public.instructor_services
FOR DELETE
USING (auth.uid() = instructor_id);

-- Add updated_at trigger
CREATE TRIGGER update_instructor_services_updated_at
BEFORE UPDATE ON public.instructor_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();