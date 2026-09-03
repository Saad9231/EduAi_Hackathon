import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { student_id, events } = req.body;

    // events: array of offline items [{ type: 'quiz' | 'note' | 'progress', payload: {...} }]
    if (!events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'events array is required' });
    }

    const studentId = student_id || '00000000-0000-0000-0000-000000000000';

    // Log the synchronization event
    const { data: logData, error: logError } = await supabase
      .from('offline_sync_logs')
      .insert([{
        student_id: studentId,
        event_type: 'BATCH_OFFLINE_SYNC',
        synced_items_count: events.length,
        payload: { count: events.length, sample: events[0] || {} }
      }])
      .select()
      .single();

    if (logError) return res.status(500).json({ error: logError.message });

    return res.status(200).json({
      success: true,
      syncedCount: events.length,
      syncId: logData?.id,
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
