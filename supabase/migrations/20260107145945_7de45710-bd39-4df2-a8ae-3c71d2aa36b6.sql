-- Part 1: Recalculate all upvote_count values to fix corrupted data
-- Fix discussions upvote_count
UPDATE discussions d
SET upvote_count = COALESCE((
  SELECT SUM(vote) 
  FROM discussion_votes 
  WHERE target_type = 'discussion' AND target_id = d.id
), 0);

-- Fix discussion_replies upvote_count
UPDATE discussion_replies r
SET upvote_count = COALESCE((
  SELECT SUM(vote) 
  FROM discussion_votes 
  WHERE target_type = 'reply' AND target_id = r.id
), 0);

-- Part 2: Course Ratings System
CREATE TABLE IF NOT EXISTS course_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(course_id, user_id)
);

-- Add average_rating and rating_count to courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS average_rating NUMERIC(2,1) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rating_count INTEGER DEFAULT 0;

-- Enable RLS on course_ratings
ALTER TABLE course_ratings ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view all ratings (public)
CREATE POLICY "Anyone can view course ratings"
ON course_ratings FOR SELECT
USING (true);

-- RLS: Users can create ratings for courses they purchased
CREATE POLICY "Users can rate purchased courses"
ON course_ratings FOR INSERT
WITH CHECK (
  auth.uid() = user_id AND
  has_course_access(course_id, auth.uid())
);

-- RLS: Users can update their own ratings
CREATE POLICY "Users can update own ratings"
ON course_ratings FOR UPDATE
USING (auth.uid() = user_id);

-- RLS: Users can delete their own ratings
CREATE POLICY "Users can delete own ratings"
ON course_ratings FOR DELETE
USING (auth.uid() = user_id);

-- Create function to update course rating stats
CREATE OR REPLACE FUNCTION update_course_rating_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE courses
    SET 
      average_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM course_ratings WHERE course_id = OLD.course_id),
      rating_count = (SELECT COUNT(*) FROM course_ratings WHERE course_id = OLD.course_id)
    WHERE id = OLD.course_id;
    RETURN OLD;
  ELSE
    UPDATE courses
    SET 
      average_rating = (SELECT ROUND(AVG(rating)::numeric, 1) FROM course_ratings WHERE course_id = NEW.course_id),
      rating_count = (SELECT COUNT(*) FROM course_ratings WHERE course_id = NEW.course_id)
    WHERE id = NEW.course_id;
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for automatic rating stats updates
DROP TRIGGER IF EXISTS on_course_rating_change ON course_ratings;
CREATE TRIGGER on_course_rating_change
AFTER INSERT OR UPDATE OR DELETE ON course_ratings
FOR EACH ROW
EXECUTE FUNCTION update_course_rating_stats();

-- Part 3: Featured Course Limit (max 3 per instructor)
CREATE OR REPLACE FUNCTION check_featured_course_limit()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  featured_count INTEGER;
BEGIN
  -- Only check when setting is_featured to true
  IF NEW.is_featured = true AND (OLD IS NULL OR OLD.is_featured = false) THEN
    SELECT COUNT(*) INTO featured_count
    FROM courses
    WHERE instructor_id = NEW.instructor_id
      AND is_featured = true
      AND id != NEW.id;
    
    IF featured_count >= 3 THEN
      RAISE EXCEPTION 'Maximum of 3 featured courses per instructor allowed';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to enforce featured limit
DROP TRIGGER IF EXISTS enforce_featured_course_limit ON courses;
CREATE TRIGGER enforce_featured_course_limit
BEFORE INSERT OR UPDATE ON courses
FOR EACH ROW
EXECUTE FUNCTION check_featured_course_limit();