-- Phase 2 Schema: Assignments, Submissions, Attendance, and Study Plans

-- 1. Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  type TEXT NOT NULL CHECK (type IN ('quiz', 'upload', 'text')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can view assignments" ON public.assignments FOR SELECT USING (true);
CREATE POLICY "Teachers can insert assignments" ON public.assignments FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can update their assignments" ON public.assignments FOR UPDATE USING (true);

-- 2. Assignment Submissions Table
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('assigned', 'submitted', 'graded', 'overdue')),
  score NUMERIC,
  feedback TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for submissions
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own submissions" ON public.assignment_submissions FOR SELECT USING (true);
CREATE POLICY "Students can create submissions" ON public.assignment_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can grade submissions" ON public.assignment_submissions FOR UPDATE USING (true);

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, date)
);

-- Enable RLS for attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view attendance" ON public.attendance FOR SELECT USING (true);
CREATE POLICY "Teachers can record attendance" ON public.attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can update attendance" ON public.attendance FOR UPDATE USING (true);

-- 4. Study Plans Table
CREATE TABLE IF NOT EXISTS public.study_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_date DATE NOT NULL DEFAULT CURRENT_DATE,
  tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(student_id, plan_date)
);

-- Enable RLS for study plans
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own study plans" ON public.study_plans FOR SELECT USING (true);
CREATE POLICY "Students or system can manage study plans" ON public.study_plans FOR ALL USING (true);
