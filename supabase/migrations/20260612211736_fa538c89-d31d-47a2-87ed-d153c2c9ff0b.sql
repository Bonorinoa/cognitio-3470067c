ALTER TABLE public.ai_bundle_waitlist
  ADD CONSTRAINT waitlist_email_len  CHECK (char_length(email) BETWEEN 3 AND 254),
  ADD CONSTRAINT waitlist_bundle_len CHECK (char_length(bundle) BETWEEN 1 AND 64),
  ADD CONSTRAINT waitlist_notes_len  CHECK (notes IS NULL OR char_length(notes) <= 1000);