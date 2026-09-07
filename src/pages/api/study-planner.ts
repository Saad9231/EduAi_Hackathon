import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireUser } from '../../lib/supabase/api';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    const { plan_date } = req.query;

    const targetDate = (plan_date as string) || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('student_id', user.id)
      .eq('plan_date', targetDate)
      .maybeSingle();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ plan: data });
  }

  if (req.method === 'POST') {
    const { plan_date, tasks } = req.body;

    if (!tasks) {
      return res.status(400).json({ error: 'tasks are required' });
    }

    const targetDate = plan_date || new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('study_plans')
      .upsert(
        {
          student_id: user.id,
          plan_date: targetDate,
          tasks,
          created_at: new Date().toISOString()
        },
        { onConflict: 'student_id, plan_date' }
      )
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ plan: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
