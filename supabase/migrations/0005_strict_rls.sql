-- Phase 5: replace permissive policies with ownership and role checks.
-- API routes use the service role only after verifying the Supabase session.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'EduAI User'),
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Students can view their own quizzes." ON public.quizzes;
DROP POLICY IF EXISTS "Students can insert their own quizzes." ON public.quizzes;
DROP POLICY IF EXISTS "Students can update their own quizzes." ON public.quizzes;
CREATE POLICY "Students own quizzes" ON public.quizzes FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view their own notes." ON public.notes;
DROP POLICY IF EXISTS "Students can insert their own notes." ON public.notes;
CREATE POLICY "Students own notes" ON public.notes FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Students can view their own progress." ON public.progress;
DROP POLICY IF EXISTS "Students can insert their own progress." ON public.progress;
DROP POLICY IF EXISTS "Students can update their own progress." ON public.progress;
CREATE POLICY "Students own progress" ON public.progress FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Users can view their own notifications." ON public.notifications;
DROP POLICY IF EXISTS "Users can update their own notifications." ON public.notifications;
CREATE POLICY "Users own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone authenticated can view assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can insert assignments" ON public.assignments;
DROP POLICY IF EXISTS "Teachers can update their assignments" ON public.assignments;
CREATE POLICY "Authenticated users can view assignments" ON public.assignments FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers own assignments" ON public.assignments FOR INSERT WITH CHECK (
  auth.uid() = teacher_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers can update own assignments" ON public.assignments FOR UPDATE USING (auth.uid() = teacher_id);

DROP POLICY IF EXISTS "Students can view own submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Students can create submissions" ON public.assignment_submissions;
DROP POLICY IF EXISTS "Teachers can grade submissions" ON public.assignment_submissions;
CREATE POLICY "Students own submissions" ON public.assignment_submissions FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Teachers view class submissions" ON public.assignment_submissions FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_id AND teacher_id = auth.uid())
);
CREATE POLICY "Students create own submissions" ON public.assignment_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers grade class submissions" ON public.assignment_submissions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.assignments WHERE id = assignment_id AND teacher_id = auth.uid())
);

DROP POLICY IF EXISTS "Anyone can view attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers can record attendance" ON public.attendance;
DROP POLICY IF EXISTS "Teachers can update attendance" ON public.attendance;
CREATE POLICY "Students view own attendance" ON public.attendance FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Teachers view attendance" ON public.attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers record attendance" ON public.attendance FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);
CREATE POLICY "Teachers update attendance" ON public.attendance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);

DROP POLICY IF EXISTS "Students can view own study plans" ON public.study_plans;
DROP POLICY IF EXISTS "Students or system can manage study plans" ON public.study_plans;
CREATE POLICY "Students own study plans" ON public.study_plans FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Parents can view their links" ON public.parent_child_links;
DROP POLICY IF EXISTS "Parents can create links" ON public.parent_child_links;
CREATE POLICY "Parents view own links" ON public.parent_child_links FOR SELECT USING (auth.uid() = parent_id OR auth.uid() = student_id);
CREATE POLICY "Parents create own links" ON public.parent_child_links FOR INSERT WITH CHECK (auth.uid() = parent_id);

DROP POLICY IF EXISTS "Anyone can view flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can create flashcards" ON public.flashcards;
DROP POLICY IF EXISTS "Users can update flashcard status" ON public.flashcards;
CREATE POLICY "Users own flashcards" ON public.flashcards FOR ALL USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Anyone can view digital library" ON public.digital_library;
DROP POLICY IF EXISTS "Admins or Teachers can add library items" ON public.digital_library;
CREATE POLICY "Authenticated users view library" ON public.digital_library FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Teachers add library items" ON public.digital_library FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('teacher', 'admin'))
);

DROP POLICY IF EXISTS "Students can view own doubts" ON public.doubts;
DROP POLICY IF EXISTS "Students can submit doubts" ON public.doubts;
DROP POLICY IF EXISTS "Teachers can view escalated doubts" ON public.doubts;
CREATE POLICY "Students own doubts" ON public.doubts FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students submit own doubts" ON public.doubts FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Teachers update escalated doubts" ON public.doubts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'teacher')
);

DROP POLICY IF EXISTS "Students can insert sync logs" ON public.offline_sync_logs;
DROP POLICY IF EXISTS "Admins can view sync logs" ON public.offline_sync_logs;
CREATE POLICY "Students insert own sync logs" ON public.offline_sync_logs FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins view sync logs" ON public.offline_sync_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone can read system settings" ON public.system_settings;
DROP POLICY IF EXISTS "Admins can update system settings" ON public.system_settings;
CREATE POLICY "Authenticated users read settings" ON public.system_settings FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Admins update settings" ON public.system_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Anyone authenticated can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Admins can view audit logs" ON public.audit_logs;
CREATE POLICY "Users insert own audit logs" ON public.audit_logs FOR INSERT WITH CHECK (auth.uid() = actor_id);
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
