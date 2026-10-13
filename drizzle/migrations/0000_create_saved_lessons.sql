CREATE TABLE public.saved_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  lesson_id text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT saved_lessons_user_lesson_unique UNIQUE (user_id, lesson_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_lessons TO authenticated;
GRANT ALL ON public.saved_lessons TO service_role;
ALTER TABLE public.saved_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Learners can view their own saved lessons"
  ON public.saved_lessons FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Learners can save their own lessons"
  ON public.saved_lessons FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Learners can remove their own saved lessons"
  ON public.saved_lessons FOR DELETE TO authenticated
  USING (auth.uid() = user_id);