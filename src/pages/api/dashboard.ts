import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { student_id } = req.query;
    if (!student_id) return res.status(400).json({ error: 'student_id is required' });

    // Fetch progress
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('*')
      .eq('student_id', student_id as string);

    if (progressError) return res.status(500).json({ error: progressError.message });

    // Fetch recent quizzes
    const { data: recentQuizzes, error: quizError } = await supabase
      .from('quizzes')
      .select('id, subject, topic, score, total_questions, created_at')
      .eq('student_id', student_id as string)
      .order('created_at', { ascending: false })
      .limit(5);

    if (quizError) return res.status(500).json({ error: quizError.message });

    // Fetch recent notes
    const { data: recentNotes, error: notesError } = await supabase
      .from('notes')
      .select('id, subject, topic, created_at')
      .eq('student_id', student_id as string)
      .order('created_at', { ascending: false })
      .limit(5);

    if (notesError) return res.status(500).json({ error: notesError.message });

    return res.status(200).json({ 
      dashboard: {
        progress,
        recentQuizzes,
        recentNotes
      }
    });
  } 

  return res.status(405).json({ error: 'Method not allowed' });
}
