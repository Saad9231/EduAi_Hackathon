import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { student_id } = req.query;

    let query = supabase
      .from('progress')
      .select('student_id, subject, mastery_percentage, weak_topics, profiles:student_id(full_name)');

    if (student_id) {
      query = query.eq('student_id', student_id as string);
    }

    const { data: progressList, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    // Aggregate weak topics and critical alerts
    const alerts: { type: 'critical' | 'warning'; message: string }[] = [];
    const weakTopicCounts: Record<string, number> = {};

    progressList?.forEach((item: any) => {
      const studentName = item.profiles?.full_name || 'Student';
      if (item.mastery_percentage !== null && item.mastery_percentage < 50) {
        alerts.push({
          type: 'critical',
          message: `${studentName}'s mastery in ${item.subject} dropped below 50% (${item.mastery_percentage}%).`
        });
      }

      const topics = Array.isArray(item.weak_topics) ? item.weak_topics : [];
      topics.forEach((t: string) => {
        weakTopicCounts[t] = (weakTopicCounts[t] || 0) + 1;
      });
    });

    Object.entries(weakTopicCounts).forEach(([topic, count]) => {
      if (count >= 2) {
        alerts.push({
          type: 'warning',
          message: `${count} students are struggling with "${topic}".`
        });
      }
    });

    return res.status(200).json({
      alerts,
      weakTopicCounts,
      studentProgress: progressList
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
