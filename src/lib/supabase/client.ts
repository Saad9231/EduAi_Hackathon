import { createClient } from '@/lib/supabase/client'
import { createBrowserClient } from '@supabase/ssr/dist/module/createBrowserClient'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )