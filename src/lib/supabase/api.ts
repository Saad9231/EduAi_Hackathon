import type { NextApiRequest, NextApiResponse } from 'next';
import { createServerClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';

type ApiResponse = NextApiResponse;

function createApiSupabaseClient(req: NextApiRequest, res: ApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => Object.entries(req.cookies).flatMap(([name, value]) =>
          typeof value === 'string' ? [{ name, value }] : []
        ),
        setAll: (cookies) => {
          res.setHeader(
            'Set-Cookie',
            cookies.map(({ name, value, options }) => {
              const parts = [`${name}=${encodeURIComponent(value)}`];
              if (options?.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);
              if (options?.path) parts.push(`Path=${options.path}`);
              if (options?.sameSite) parts.push(`SameSite=${options.sameSite}`);
              if (options?.secure) parts.push('Secure');
              if (options?.httpOnly) parts.push('HttpOnly');
              return parts.join('; ');
            })
          );
        },
      },
    }
  );
}

export async function requireUser(
  req: NextApiRequest,
  res: ApiResponse
): Promise<User | null> {
  const { data, error } = await createApiSupabaseClient(req, res).auth.getUser();
  if (error || !data.user) {
    res.status(401).json({ error: 'Authentication required' });
    return null;
  }
  return data.user;
}

export async function requireRole(
  req: NextApiRequest,
  res: ApiResponse,
  roles: string[]
): Promise<User | null> {
  const user = await requireUser(req, res);
  if (!user) return null;

  const { data: profile, error } = await createApiSupabaseClient(req, res)
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error || !profile || !roles.includes(profile.role)) {
    res.status(403).json({ error: 'Insufficient permissions' });
    return null;
  }
  return user;
}
