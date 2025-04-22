
-- Create table for user application permissions
create table if not exists public.user_application_permissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  application_id uuid not null references applications(id) on delete cascade,
  permission text not null check (permission in ('admin', 'viewer')),
  category_permissions jsonb not null default '[]'::jsonb, -- Store category permissions as JSON array
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Ensure each user can only have one permission entry per application
  unique (user_id, application_id)
);

alter table public.user_application_permissions enable row level security;

-- RLS policies for application permissions
create policy "Application Permissions: admins can manage all"
  on public.user_application_permissions for all
  using (EXISTS (
    select 1 from users u
    where u.id = auth.uid()
    and u.role = 'admin'
  ));

create policy "Application Permissions: managers can view all"
  on public.user_application_permissions for select
  using (EXISTS (
    select 1 from users u
    where u.id = auth.uid()
    and u.role = 'manager'
  ));

-- Users can view their own permissions
create policy "Application Permissions: users can view their own"
  on public.user_application_permissions for select
  using (user_id = auth.uid());
