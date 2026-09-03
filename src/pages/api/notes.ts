import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { student_id } = req.query;
    if (!student_id) return res.status(400).json({ error: 'student_id is required' });

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('student_id', student_id as string)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ notes: data });
  } 
  
  if (req.method === 'POST') {
    const { student_id, subject, topic, content } = req.body;
    
    if (!student_id || !subject || !topic || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([{ student_id, subject, topic, content }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ notes: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
