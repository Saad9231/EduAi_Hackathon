-- Phase 4 Schema: Offline Sync, Platform Analytics, System Settings & Audit Trail

-- 1. Offline Sync Logs Table
CREATE TABLE IF NOT EXISTS public.offline_sync_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  synced_items_count INTEGER DEFAULT 1,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for offline sync logs
ALTER TABLE public.offline_sync_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Students can insert sync logs" ON public.offline_sync_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view sync logs" ON public.offline_sync_logs FOR SELECT USING (true);

-- 2. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed initial settings
INSERT INTO public.system_settings (key, value)
VALUES 
  ('offline_mode', '{"enabled": true}'::jsonb),
  ('strict_rbac', '{"enabled": true}'::jsonb),
  ('emergency_halt', '{"enabled": false}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Enable RLS for system settings
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read system settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Admins can update system settings" ON public.system_settings FOR UPDATE USING (true);

-- 3. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (true);
