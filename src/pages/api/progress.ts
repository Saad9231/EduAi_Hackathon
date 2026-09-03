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
      .from('progress')
      .select('*')
      .eq('student_id', student_id as string);

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ progress: data });
  } 
  
  if (req.method === 'PUT') {
    const { student_id, subject, mastery_percentage, weak_topics } = req.body;
    
    if (!student_id || !subject) {
      return res.status(400).json({ error: 'student_id and subject are required' });
    }

    const { data, error } = await supabase
      .from('progress')
      .upsert(
        { student_id, subject, mastery_percentage, weak_topics, updated_at: new Date().toISOString() },
        { onConflict: 'student_id, subject' }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ progress: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
