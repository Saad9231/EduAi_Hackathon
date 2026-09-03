import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { student_id, subject } = req.query;

    let query = supabase
      .from('flashcards')
      .select('*')
      .order('created_at', { ascending: true });

    if (student_id) {
      query = query.or(`student_id.eq.${student_id},student_id.is.null`);
    }
    if (subject) {
      query = query.eq('subject', subject as string);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ flashcards: data });
  }

  if (req.method === 'POST') {
    const { id, student_id, subject, topic, front_en, back_en, front_ur, back_ur, mastered } = req.body;

    // If ID provided, update mastery / spaced repetition review
    if (id) {
      const { data, error } = await supabase
        .from('flashcards')
        .update({ mastered, review_count: (req.body.review_count || 0) + 1 })
        .eq('id', id)
        .select()
        .single();

      if (error) return res.status(500).json({ error: error.message });
      return res.status(200).json({ flashcard: data });
    }

    // Otherwise create new flashcard
    if (!subject || !topic || !front_en || !back_en) {
      return res.status(400).json({ error: 'subject, topic, front_en, and back_en are required' });
    }

    const { data, error } = await supabase
      .from('flashcards')
      .insert([{ student_id, subject, topic, front_en, back_en, front_ur, back_ur, mastered: false }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ flashcard: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
