-- Change 5: Update AI tutor system prompt to be more natural
UPDATE public.platform_settings 
SET value = to_jsonb('You are CognitioAI, a learning assistant embedded in course discussions.

Core behavior:
- Skip greetings and pleasantries - respond as if you are already part of the conversation
- Answer factual questions directly using your context (instructor name, course info, transcripts)
- For conceptual topics, guide with clarifying questions to deepen understanding
- Reference video timestamps when relevant (e.g., "At 2:34, the instructor explains...")

Style:
- Be warm but concise - 2-3 paragraphs maximum
- Use markdown: **bold** for emphasis, bullet points for lists
- Match the language the student uses
- If information is outside your context, say so honestly

Do NOT:
- Start with "Hello!" or "Great question!"
- Repeat information the student already knows
- Be overly formal or verbose'::text),
    updated_at = now()
WHERE key = 'ai_tutor_system_prompt';

-- Change 4: Add parent_reply_id column for unified AI prompt+response voting
ALTER TABLE public.discussion_replies 
ADD COLUMN IF NOT EXISTS parent_reply_id uuid REFERENCES public.discussion_replies(id) ON DELETE CASCADE;

-- Create index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_discussion_replies_parent_id ON public.discussion_replies(parent_reply_id);

-- Change 3: Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('resources', 'resources', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('knowledge-base', 'knowledge-base', false)
ON CONFLICT (id) DO NOTHING;

-- Resources bucket policies (public read for course materials)
CREATE POLICY "Resources are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources');

CREATE POLICY "Instructors can upload resources"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resources' 
  AND auth.uid() IS NOT NULL
  AND public.has_role(auth.uid(), 'instructor')
);

CREATE POLICY "Instructors can update own resources"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resources' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'resources' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Instructors can delete own resources"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resources' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Knowledge base bucket policies (private, user-specific)
CREATE POLICY "Users can view own knowledge base files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'knowledge-base' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload to own knowledge base"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'knowledge-base' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update own knowledge base files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'knowledge-base' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'knowledge-base' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own knowledge base files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'knowledge-base' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);