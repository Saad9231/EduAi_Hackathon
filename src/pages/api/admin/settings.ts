import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { requireRole } from '../../../lib/supabase/api';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireRole(req, res, ['admin']);
  if (!user) return;

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');

    if (error) return res.status(500).json({ error: error.message });

    const settingsMap: Record<string, boolean> = {
      offline_mode: true,
      strict_rbac: true,
      emergency_halt: false
    };

    data?.forEach((s: { key: string; value: { enabled?: boolean } | null }) => {
      if (s.value && typeof s.value.enabled === 'boolean') {
        settingsMap[s.key] = s.value.enabled;
      }
    });

    return res.status(200).json({ settings: settingsMap });
  }

  if (req.method === 'POST') {
    const { key, enabled } = req.body;

    if (!key || typeof enabled !== 'boolean') {
      return res.status(400).json({ error: 'key and boolean enabled state are required' });
    }

    const { data, error } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value: { enabled },
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });

    // Also write an audit log
    await supabase.from('audit_logs').insert([{
      actor_id: user.id,
      action: `UPDATE_SETTING_${key.toUpperCase()}`,
      details: { enabled, timestamp: new Date().toISOString() }
    }]);

    return res.status(200).json({ setting: data });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
