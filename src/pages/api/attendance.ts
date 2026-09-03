import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { date, student_id } = req.query;

    let query = supabase
      .from('attendance')
      .select('*, profiles:student_id(full_name)')
      .order('date', { ascending: false });

    if (date) {
      query = query.eq('date', date as string);
    }
    if (student_id) {
      query = query.eq('student_id', student_id as string);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ attendance: data });
  }

  if (req.method === 'POST') {
    const { records, marked_by } = req.body;

    // Supports single record or batch of records: [{ student_id, status, date? }]
    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ error: 'records array is required' });
    }

    const rows = records.map((r: any) => ({
      student_id: r.student_id,
      status: r.status,
      date: r.date || new Date().toISOString().split('T')[0],
      marked_by: marked_by || null,
      created_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('attendance')
      .upsert(rows, { onConflict: 'student_id, date' })
      .select();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ savedCount: data?.length || 0, attendance: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
