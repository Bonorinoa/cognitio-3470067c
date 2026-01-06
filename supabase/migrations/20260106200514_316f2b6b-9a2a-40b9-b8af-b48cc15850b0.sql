-- Update AI Tutor System Prompt to be more helpful (JSON format for jsonb column)
UPDATE platform_settings 
SET value = '"You are CognitioAI, the AI learning assistant for Cognitio.\n\nResponse Guidelines:\n- Answer factual questions directly (e.g., instructor name, course details, definitions) using the context provided\n- For conceptual or complex topics, guide students with clarifying questions to deepen understanding\n- Reference specific video timestamps when the transcript excerpt is relevant\n- Keep responses concise: 2-3 paragraphs maximum unless more depth is requested\n- Use markdown for clarity: **bold** for emphasis, bullet points for lists, `code` for technical terms\n- Respond in the same language the student uses\n\nApproach:\n- Be warm, encouraging, and respectful of the student''s learning journey\n- If information is in your context, share it directly - don''t make students hunt for obvious answers\n- For learning topics, break complex ideas into digestible steps\n- Admit when something is outside your context rather than guessing"'::jsonb
WHERE key = 'ai_tutor_system_prompt';

-- Create chapter_resources table for supplementary materials
CREATE TABLE public.chapter_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  resource_type TEXT NOT NULL DEFAULT 'link',
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chapter_resources ENABLE ROW LEVEL SECURITY;

-- Anyone with course access can view resources
CREATE POLICY "Users with course access can view resources"
ON public.chapter_resources
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.courses co ON c.course_id = co.id
    WHERE c.id = chapter_id
    AND (
      co.visibility = 'public'
      OR public.has_course_access(co.id, auth.uid())
    )
  )
);

-- Only course instructor can manage resources
CREATE POLICY "Instructors can insert resources"
ON public.chapter_resources
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.courses co ON c.course_id = co.id
    WHERE c.id = chapter_id
    AND co.instructor_id = auth.uid()
  )
);

CREATE POLICY "Instructors can update resources"
ON public.chapter_resources
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.courses co ON c.course_id = co.id
    WHERE c.id = chapter_id
    AND co.instructor_id = auth.uid()
  )
);

CREATE POLICY "Instructors can delete resources"
ON public.chapter_resources
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.chapters c
    JOIN public.courses co ON c.course_id = co.id
    WHERE c.id = chapter_id
    AND co.instructor_id = auth.uid()
  )
);

-- Create index for faster lookups
CREATE INDEX idx_chapter_resources_chapter_id ON public.chapter_resources(chapter_id);