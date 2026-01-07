-- Function to update upvote_count on discussions
CREATE OR REPLACE FUNCTION public.update_discussion_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.target_type = 'discussion' THEN
      UPDATE discussions SET upvote_count = upvote_count + NEW.vote WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'reply' THEN
      UPDATE discussion_replies SET upvote_count = upvote_count + NEW.vote WHERE id = NEW.target_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.target_type = 'discussion' THEN
      UPDATE discussions SET upvote_count = upvote_count - OLD.vote + NEW.vote WHERE id = NEW.target_id;
    ELSIF NEW.target_type = 'reply' THEN
      UPDATE discussion_replies SET upvote_count = upvote_count - OLD.vote + NEW.vote WHERE id = NEW.target_id;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.target_type = 'discussion' THEN
      UPDATE discussions SET upvote_count = upvote_count - OLD.vote WHERE id = OLD.target_id;
    ELSIF OLD.target_type = 'reply' THEN
      UPDATE discussion_replies SET upvote_count = upvote_count - OLD.vote WHERE id = OLD.target_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger on discussion_votes table
CREATE TRIGGER on_discussion_vote_change
  AFTER INSERT OR UPDATE OR DELETE ON public.discussion_votes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_discussion_vote_count();

-- Recalculate existing vote counts to fix any discrepancies
UPDATE discussions d
SET upvote_count = COALESCE((
  SELECT SUM(vote) FROM discussion_votes 
  WHERE target_id = d.id AND target_type = 'discussion'
), 0);

UPDATE discussion_replies r
SET upvote_count = COALESCE((
  SELECT SUM(vote) FROM discussion_votes 
  WHERE target_id = r.id AND target_type = 'reply'
), 0);