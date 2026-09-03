import type { NextApiRequest, NextApiResponse } from 'next';
import { callTutorAI } from '../../lib/serverAI';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, language } = req.body as { prompt?: string; language?: 'EN' | 'UR' };
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    const aiRes = await callTutorAI({ prompt, language });

    return res.status(200).json({ data: aiRes });
  } catch (err) {
    console.error('Tutor API error', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
