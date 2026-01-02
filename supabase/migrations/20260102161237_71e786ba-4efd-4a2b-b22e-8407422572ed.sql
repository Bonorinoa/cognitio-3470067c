-- Add DELETE policy for ai_generation_history table
CREATE POLICY "Instructors can delete own generation history" 
ON public.ai_generation_history 
FOR DELETE 
USING (auth.uid() = instructor_id);