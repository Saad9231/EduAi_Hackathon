import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { role } = req.query;

    let query = supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (role && role !== 'all') {
      query = query.eq('role', role as string);
    }

    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ users: data });
  }

  if (req.method === 'POST') {
    const { full_name, role, email } = req.body;

    if (!full_name || !role) {
      return res.status(400).json({ error: 'full_name and role are required' });
    }

    // Insert into profiles (using gen_random_uuid)
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: req.body.id || undefined,
        full_name,
        role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ user: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
