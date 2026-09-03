import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { assignment_id, student_id } = req.query;

    let query = supabase
      .from('assignment_submissions')
      .select('*, profiles:student_id(full_name)')
      .order('submitted_at', { ascending: false });

    if (assignment_id) {
      query = query.eq('assignment_id', assignment_id as string);
    }
    if (student_id) {
      query = query.eq('student_id', student_id as string);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ submissions: data });
  }

  if (req.method === 'POST') {
    const { assignment_id, student_id, content, file_url, status, score, feedback } = req.body;

    if (!assignment_id || !student_id) {
      return res.status(400).json({ error: 'assignment_id and student_id are required' });
    }

    const { data, error } = await supabase
      .from('assignment_submissions')
      .upsert({
        assignment_id,
        student_id,
        content,
        file_url,
        status: status || 'submitted',
        score,
        feedback,
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ submission: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
