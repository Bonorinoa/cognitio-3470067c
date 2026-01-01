-- Create enums for AI Studio
CREATE TYPE public.document_type AS ENUM ('academic_paper', 'cv_bio', 'methodology', 'writing_sample', 'syllabus', 'other');
CREATE TYPE public.context_role AS ENUM ('style_reference', 'topic_source', 'background_context');
CREATE TYPE public.writing_tone AS ENUM ('formal', 'conversational', 'academic', 'journalistic');
CREATE TYPE public.length_preference AS ENUM ('concise', 'moderate', 'detailed');
CREATE TYPE public.language_preference AS ENUM ('es', 'en', 'bilingual');
CREATE TYPE public.generation_status AS ENUM ('pending', 'completed', 'failed');
CREATE TYPE public.content_type AS ENUM ('blog', 'newsletter');

-- Table 1: instructor_style_profile (one per instructor)
CREATE TABLE public.instructor_style_profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  tone writing_tone DEFAULT 'conversational',
  target_audience TEXT,
  preferred_length length_preference DEFAULT 'moderate',
  language_preference language_preference DEFAULT 'en',
  include_citations BOOLEAN DEFAULT false,
  use_examples BOOLEAN DEFAULT true,
  include_call_to_action BOOLEAN DEFAULT false,
  custom_instructions TEXT,
  setup_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT unique_instructor_style UNIQUE (instructor_id)
);

-- Table 2: instructor_knowledge_base (documents with context roles)
CREATE TABLE public.instructor_knowledge_base (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  document_type document_type NOT NULL DEFAULT 'other',
  context_role context_role NOT NULL DEFAULT 'background_context',
  content TEXT NOT NULL,
  content_tokens INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table 3: ai_generation_history (tracks generations)
CREATE TABLE public.ai_generation_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type content_type NOT NULL,
  topic TEXT NOT NULL,
  additional_instructions TEXT,
  selected_document_ids UUID[] DEFAULT '{}',
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  status generation_status NOT NULL DEFAULT 'pending',
  generated_content TEXT,
  error_message TEXT,
  model_used TEXT DEFAULT 'google/gemini-2.5-flash',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.instructor_style_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructor_knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_generation_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for instructor_style_profile
CREATE POLICY "Instructors can view own style profile"
  ON public.instructor_style_profile FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create own style profile"
  ON public.instructor_style_profile FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND has_role(auth.uid(), 'instructor'::app_role));

CREATE POLICY "Instructors can update own style profile"
  ON public.instructor_style_profile FOR UPDATE
  USING (auth.uid() = instructor_id);

-- RLS Policies for instructor_knowledge_base
CREATE POLICY "Instructors can view own knowledge base"
  ON public.instructor_knowledge_base FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create knowledge base entries"
  ON public.instructor_knowledge_base FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND has_role(auth.uid(), 'instructor'::app_role));

CREATE POLICY "Instructors can update own knowledge base"
  ON public.instructor_knowledge_base FOR UPDATE
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can delete own knowledge base entries"
  ON public.instructor_knowledge_base FOR DELETE
  USING (auth.uid() = instructor_id);

-- RLS Policies for ai_generation_history
CREATE POLICY "Instructors can view own generation history"
  ON public.ai_generation_history FOR SELECT
  USING (auth.uid() = instructor_id);

CREATE POLICY "Instructors can create generation history"
  ON public.ai_generation_history FOR INSERT
  WITH CHECK (auth.uid() = instructor_id AND has_role(auth.uid(), 'instructor'::app_role));

CREATE POLICY "Instructors can update own generation history"
  ON public.ai_generation_history FOR UPDATE
  USING (auth.uid() = instructor_id);

-- Create indexes for performance
CREATE INDEX idx_knowledge_base_instructor ON public.instructor_knowledge_base(instructor_id);
CREATE INDEX idx_knowledge_base_active ON public.instructor_knowledge_base(instructor_id, is_active);
CREATE INDEX idx_generation_history_instructor ON public.ai_generation_history(instructor_id);
CREATE INDEX idx_generation_history_status ON public.ai_generation_history(instructor_id, status);

-- Add updated_at triggers
CREATE TRIGGER update_instructor_style_profile_updated_at
  BEFORE UPDATE ON public.instructor_style_profile
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_instructor_knowledge_base_updated_at
  BEFORE UPDATE ON public.instructor_knowledge_base
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_generation_history_updated_at
  BEFORE UPDATE ON public.ai_generation_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();