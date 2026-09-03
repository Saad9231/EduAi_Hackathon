import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { board, type, query, grade } = req.query;

    let dbQuery = supabase
      .from('digital_library')
      .select('*')
      .order('title', { ascending: true });

    if (board && board !== 'all') {
      dbQuery = dbQuery.eq('board', board as string);
    }
    if (type && type !== 'all') {
      dbQuery = dbQuery.eq('type', type as string);
    }
    if (grade) {
      dbQuery = dbQuery.eq('grade', grade as string);
    }
    if (query) {
      dbQuery = dbQuery.ilike('title', `%${query}%`);
    }

    const { data, error } = await dbQuery;
    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({ items: data });
  }

  if (req.method === 'POST') {
    const { title, board, grade, subject, file_url, size, type } = req.body;

    if (!title || !board || !type) {
      return res.status(400).json({ error: 'title, board, and type are required' });
    }

    const { data, error } = await supabase
      .from('digital_library')
      .insert([{
        title,
        board,
        grade: grade || '10',
        subject: subject || 'General',
        file_url: file_url || '#',
        size: size || '12 MB',
        type
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json({ item: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
