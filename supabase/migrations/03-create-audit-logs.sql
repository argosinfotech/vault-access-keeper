
-- Audit Logs Table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  target_id uuid,
  target_type text,
  details text,
  timestamp timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

-- RLS: Allow all users to select audit logs
create policy "Audit Logs: read access"
  on public.audit_logs for select
  using (true);

-- Only allow admins to insert logs
create policy "Audit Logs: insert access"
  on public.audit_logs for insert
  using (
    EXISTS (
      select 1 from users u
      where u.id = auth.uid()
      and u.role = 'admin'
    )
  );
