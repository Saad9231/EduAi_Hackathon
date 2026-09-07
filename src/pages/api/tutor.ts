import type { NextApiRequest, NextApiResponse } from 'next';
import { callTutorAI } from '../../lib/serverAI';
import { requireUser } from '../../lib/supabase/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = await requireUser(req, res);
  if (!user) return;

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, language } = req.body as { prompt?: string; language?: 'EN' | 'UR' };
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const aiRes = await callTutorAI({ prompt, language });

    return res.status(200).json({ data: aiRes });
  } catch (err: any) {
    console.error('Tutor API error', err?.message || err);

    // Return the actual error message so the frontend can display something helpful
    const message = err?.message || 'Internal error';

    // Distinguish between config errors (no key) and runtime errors (API down)
    if (message.includes('No AI API key')) {
      return res.status(503).json({ error: message, code: 'NO_API_KEY' });
    }

    return res.status(500).json({ error: message, code: 'AI_ERROR' });
  }
}
