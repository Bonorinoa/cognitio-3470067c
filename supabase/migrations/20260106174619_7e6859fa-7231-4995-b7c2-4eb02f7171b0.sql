-- Phase 1: AI Tutor Discussion Forum Database Schema

-- ============================================
-- Table: platform_settings (Admin configuration)
-- ============================================
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS for platform_settings
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (needed to check if AI tutor is enabled)
CREATE POLICY "Anyone can read platform settings"
ON public.platform_settings FOR SELECT
USING (true);

-- Only admins can update settings
CREATE POLICY "Admins can manage platform settings"
ON public.platform_settings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Insert default AI tutor settings
INSERT INTO public.platform_settings (key, value) VALUES
('ai_tutor_enabled', 'true'::jsonb),
('ai_tutor_system_prompt', '"You are CognitioAI, a Socratic learning assistant for the Cognitio academic platform. Your role is to guide students toward understanding, not to provide direct answers.\n\nGuidelines:\n- Ask probing questions that help students discover insights themselves\n- Break complex problems into smaller, manageable parts\n- Encourage students to explain their reasoning\n- Validate correct thinking and gently redirect misconceptions\n- Reference specific parts of the video when relevant (use timestamps)\n- Be warm, patient, and encouraging\n- Keep responses concise (2-3 paragraphs max)\n- If the student is clearly stuck after multiple exchanges, provide a hint rather than the full answer"'::jsonb),
('ai_tutor_model', '"google/gemini-2.5-flash"'::jsonb),
('ai_tutor_temperature', '0.7'::jsonb),
('ai_tutor_max_tokens', '1024'::jsonb);

-- ============================================
-- Table: chapter_transcripts (Mux auto-generated)
-- ============================================
CREATE TABLE public.chapter_transcripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE UNIQUE NOT NULL,
  transcript_vtt TEXT,
  transcript_json JSONB,
  language_code TEXT DEFAULT 'en',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'ready', 'error')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add show_transcript to courses table
ALTER TABLE public.courses ADD COLUMN show_transcript BOOLEAN DEFAULT true;

-- RLS for chapter_transcripts
ALTER TABLE public.chapter_transcripts ENABLE ROW LEVEL SECURITY;

-- Transcripts viewable based on course visibility and show_transcript setting
CREATE POLICY "Transcripts viewable based on course access"
ON public.chapter_transcripts FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.courses c ON c.id = ch.course_id
    WHERE ch.id = chapter_transcripts.chapter_id
    AND (
      c.instructor_id = auth.uid()
      OR (c.visibility = 'public' AND c.is_published = true AND c.show_transcript = true)
      OR (c.visibility = 'private' AND c.is_published = true AND c.show_transcript = true AND has_course_access(auth.uid(), c.id))
    )
  )
);

-- Instructors can manage transcripts for their courses
CREATE POLICY "Instructors can manage own course transcripts"
ON public.chapter_transcripts FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.courses c ON c.id = ch.course_id
    WHERE ch.id = chapter_transcripts.chapter_id
    AND c.instructor_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.courses c ON c.id = ch.course_id
    WHERE ch.id = chapter_transcripts.chapter_id
    AND c.instructor_id = auth.uid()
  )
);

-- Service role can insert/update transcripts (for webhook)
CREATE POLICY "Service role can manage transcripts"
ON public.chapter_transcripts FOR ALL
USING (true)
WITH CHECK (true);

-- ============================================
-- Table: discussions (Thread posts)
-- ============================================
CREATE TABLE public.discussions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  course_id UUID NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  video_timestamp_seconds INT,
  is_resolved BOOLEAN DEFAULT false,
  has_ai_response BOOLEAN DEFAULT false,
  upvote_count INT DEFAULT 0,
  reply_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discussions_chapter ON public.discussions(chapter_id, created_at DESC);
CREATE INDEX idx_discussions_course ON public.discussions(course_id);
CREATE INDEX idx_discussions_user ON public.discussions(user_id);

-- RLS for discussions
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

-- View discussions based on course visibility
CREATE POLICY "Discussions viewable based on course access"
ON public.discussions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.courses c ON c.id = ch.course_id
    WHERE ch.id = discussions.chapter_id
    AND (
      c.instructor_id = auth.uid()
      OR (c.visibility = 'public' AND c.is_published = true AND ch.is_free_preview = true)
      OR (c.visibility = 'public' AND c.is_published = true AND auth.uid() IS NOT NULL AND has_course_access(auth.uid(), c.id))
      OR (c.visibility = 'private' AND c.is_published = true AND has_course_access(auth.uid(), c.id))
    )
  )
);

-- Create discussions only with course access
CREATE POLICY "Users with access can create discussions"
ON public.discussions FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.chapters ch
    JOIN public.courses c ON c.id = ch.course_id
    WHERE ch.id = discussions.chapter_id
    AND discussions.course_id = c.id
    AND (c.instructor_id = auth.uid() OR has_course_access(auth.uid(), c.id))
  )
);

-- Update own discussions or if instructor
CREATE POLICY "Users can update own discussions"
ON public.discussions FOR UPDATE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.courses c
    WHERE c.id = discussions.course_id
    AND c.instructor_id = auth.uid()
  )
);

-- Delete own discussions
CREATE POLICY "Users can delete own discussions"
ON public.discussions FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- Table: discussion_replies
-- ============================================
CREATE TABLE public.discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  is_accepted_answer BOOLEAN DEFAULT false,
  upvote_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_replies_discussion ON public.discussion_replies(discussion_id, created_at ASC);
CREATE INDEX idx_replies_user ON public.discussion_replies(user_id);

-- RLS for discussion_replies
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

-- View replies if can view discussion
CREATE POLICY "Replies viewable if discussion is viewable"
ON public.discussion_replies FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.discussions d
    JOIN public.chapters ch ON ch.id = d.chapter_id
    JOIN public.courses c ON c.id = ch.course_id
    WHERE d.id = discussion_replies.discussion_id
    AND (
      c.instructor_id = auth.uid()
      OR (c.visibility = 'public' AND c.is_published = true AND ch.is_free_preview = true)
      OR (c.visibility = 'public' AND c.is_published = true AND auth.uid() IS NOT NULL AND has_course_access(auth.uid(), c.id))
      OR (c.visibility = 'private' AND c.is_published = true AND has_course_access(auth.uid(), c.id))
    )
  )
);

-- Create replies with course access
CREATE POLICY "Users with access can create replies"
ON public.discussion_replies FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (
    SELECT 1 FROM public.discussions d
    JOIN public.courses c ON c.id = d.course_id
    WHERE d.id = discussion_replies.discussion_id
    AND (c.instructor_id = auth.uid() OR has_course_access(auth.uid(), c.id))
  )
);

-- Update own replies or mark accepted if OP/instructor
CREATE POLICY "Users can update own replies or mark accepted"
ON public.discussion_replies FOR UPDATE
USING (
  auth.uid() = user_id OR
  EXISTS (
    SELECT 1 FROM public.discussions d
    JOIN public.courses c ON c.id = d.course_id
    WHERE d.id = discussion_replies.discussion_id
    AND (d.user_id = auth.uid() OR c.instructor_id = auth.uid())
  )
);

-- Delete own replies
CREATE POLICY "Users can delete own replies"
ON public.discussion_replies FOR DELETE
USING (auth.uid() = user_id);

-- Service role can insert AI replies
CREATE POLICY "Service role can insert AI replies"
ON public.discussion_replies FOR INSERT
WITH CHECK (true);

-- ============================================
-- Table: discussion_votes (unified)
-- ============================================
CREATE TABLE public.discussion_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('discussion', 'reply')),
  target_id UUID NOT NULL,
  vote INT NOT NULL CHECK (vote IN (1, -1)),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX idx_votes_target ON public.discussion_votes(target_type, target_id);

-- RLS for discussion_votes
ALTER TABLE public.discussion_votes ENABLE ROW LEVEL SECURITY;

-- View own votes
CREATE POLICY "Users can view own votes"
ON public.discussion_votes FOR SELECT
USING (auth.uid() = user_id);

-- Create votes with course access
CREATE POLICY "Users with access can vote"
ON public.discussion_votes FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  (
    (target_type = 'discussion' AND EXISTS (
      SELECT 1 FROM public.discussions d
      JOIN public.courses c ON c.id = d.course_id
      WHERE d.id = discussion_votes.target_id
      AND (c.instructor_id = auth.uid() OR has_course_access(auth.uid(), c.id))
    ))
    OR
    (target_type = 'reply' AND EXISTS (
      SELECT 1 FROM public.discussion_replies r
      JOIN public.discussions d ON d.id = r.discussion_id
      JOIN public.courses c ON c.id = d.course_id
      WHERE r.id = discussion_votes.target_id
      AND (c.instructor_id = auth.uid() OR has_course_access(auth.uid(), c.id))
    ))
  )
);

-- Update own votes
CREATE POLICY "Users can update own votes"
ON public.discussion_votes FOR UPDATE
USING (auth.uid() = user_id);

-- Delete own votes
CREATE POLICY "Users can delete own votes"
ON public.discussion_votes FOR DELETE
USING (auth.uid() = user_id);

-- ============================================
-- Table: ai_tutor_usage (rate limiting)
-- ============================================
CREATE TABLE public.ai_tutor_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE NOT NULL,
  discussion_id UUID REFERENCES public.discussions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tutor_usage ON public.ai_tutor_usage(user_id, chapter_id);

-- RLS for ai_tutor_usage
ALTER TABLE public.ai_tutor_usage ENABLE ROW LEVEL SECURITY;

-- Users can view own usage
CREATE POLICY "Users can view own AI tutor usage"
ON public.ai_tutor_usage FOR SELECT
USING (auth.uid() = user_id);

-- Service role can insert usage records
CREATE POLICY "Service role can insert usage"
ON public.ai_tutor_usage FOR INSERT
WITH CHECK (true);

-- ============================================
-- Triggers: Update counts and timestamps
-- ============================================

-- Update reply_count on discussions
CREATE OR REPLACE FUNCTION public.update_discussion_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.discussions SET reply_count = reply_count + 1, updated_at = now()
    WHERE id = NEW.discussion_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.discussions SET reply_count = GREATEST(0, reply_count - 1), updated_at = now()
    WHERE id = OLD.discussion_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_reply_count
AFTER INSERT OR DELETE ON public.discussion_replies
FOR EACH ROW EXECUTE FUNCTION public.update_discussion_reply_count();

-- Update upvote_count on discussions
CREATE OR REPLACE FUNCTION public.update_discussion_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'discussion' THEN
    UPDATE public.discussions SET upvote_count = upvote_count + NEW.vote
    WHERE id = NEW.target_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'discussion' THEN
    UPDATE public.discussions SET upvote_count = upvote_count - OLD.vote
    WHERE id = OLD.target_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND NEW.target_type = 'discussion' THEN
    UPDATE public.discussions SET upvote_count = upvote_count - OLD.vote + NEW.vote
    WHERE id = NEW.target_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_discussion_upvote
AFTER INSERT OR UPDATE OR DELETE ON public.discussion_votes
FOR EACH ROW EXECUTE FUNCTION public.update_discussion_upvote_count();

-- Update upvote_count on replies
CREATE OR REPLACE FUNCTION public.update_reply_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'reply' THEN
    UPDATE public.discussion_replies SET upvote_count = upvote_count + NEW.vote
    WHERE id = NEW.target_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'reply' THEN
    UPDATE public.discussion_replies SET upvote_count = upvote_count - OLD.vote
    WHERE id = OLD.target_id;
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' AND NEW.target_type = 'reply' THEN
    UPDATE public.discussion_replies SET upvote_count = upvote_count - OLD.vote + NEW.vote
    WHERE id = NEW.target_id;
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trigger_update_reply_upvote
AFTER INSERT OR UPDATE OR DELETE ON public.discussion_votes
FOR EACH ROW EXECUTE FUNCTION public.update_reply_upvote_count();

-- Update updated_at on chapter_transcripts
CREATE TRIGGER update_chapter_transcripts_updated_at
BEFORE UPDATE ON public.chapter_transcripts
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update updated_at on discussions
CREATE TRIGGER update_discussions_updated_at
BEFORE UPDATE ON public.discussions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();