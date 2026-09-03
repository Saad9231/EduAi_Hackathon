import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { teacher_id, subject } = req.query;

    let query = supabase
      .from('assignments')
      .select('*')
      .order('created_at', { ascending: false });

    if (teacher_id) {
      query = query.eq('teacher_id', teacher_id as string);
    }
    if (subject) {
      query = query.eq('subject', subject as string);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ assignments: data });
  }

  if (req.method === 'POST') {
    const { teacher_id, title, subject, description, due_date, type } = req.body;

    if (!title || !subject || !type) {
      return res.status(400).json({ error: 'title, subject, and type are required' });
    }

    const { data, error } = await supabase
      .from('assignments')
      .insert([{ teacher_id, title, subject, description, due_date, type }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ assignment: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
