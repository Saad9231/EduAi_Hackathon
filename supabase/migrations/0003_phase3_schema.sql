-- Phase 3 Schema: Parent Links, Flashcards, Digital Library, and Doubt Solver

-- 1. Parent-Child Linking Table
CREATE TABLE IF NOT EXISTS public.parent_child_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(parent_id, student_id)
);

-- Enable RLS for parent_child_links
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view their links" ON public.parent_child_links FOR SELECT USING (true);
CREATE POLICY "Parents can create links" ON public.parent_child_links FOR INSERT WITH CHECK (true);

-- 2. Flashcards Table (Spaced Repetition)
CREATE TABLE IF NOT EXISTS public.flashcards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  front_en TEXT NOT NULL,
  back_en TEXT NOT NULL,
  front_ur TEXT,
  back_ur TEXT,
  mastered BOOLEAN DEFAULT FALSE,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for flashcards
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view flashcards" ON public.flashcards FOR SELECT USING (true);
CREATE POLICY "Users can create flashcards" ON public.flashcards FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update flashcard status" ON public.flashcards FOR UPDATE USING (true);

-- 3. Digital Library Table (PTB & FBISE Textbooks / Past Papers)
CREATE TABLE IF NOT EXISTS public.digital_library (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  board TEXT NOT NULL CHECK (board IN ('PTB', 'FBISE', 'National', 'General')),
  grade TEXT NOT NULL DEFAULT '10',
  subject TEXT NOT NULL,
  file_url TEXT,
  size TEXT DEFAULT '10 MB',
  type TEXT NOT NULL CHECK (type IN ('book', 'resource')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for digital library
ALTER TABLE public.digital_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view digital library" ON public.digital_library FOR SELECT USING (true);
CREATE POLICY "Admins or Teachers can add library items" ON public.digital_library FOR INSERT WITH CHECK (true);

-- 4. Doubts & Step-by-Step Solver Table
CREATE TABLE IF NOT EXISTS public.doubts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  question_text TEXT NOT NULL,
  image_url TEXT,
  solution_text TEXT,
  status TEXT NOT NULL DEFAULT 'resolved' CHECK (status IN ('resolved', 'escalated', 'pending')),
  escalated_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for doubts
ALTER TABLE public.doubts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can view own doubts" ON public.doubts FOR SELECT USING (true);
CREATE POLICY "Students can submit doubts" ON public.doubts FOR INSERT WITH CHECK (true);
CREATE POLICY "Teachers can view escalated doubts" ON public.doubts FOR UPDATE USING (true);
