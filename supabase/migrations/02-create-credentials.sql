
-- Applications Table
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  category text not null check (
    category in ('application', 'database', 'hosting', 'api', 'email', 'other')
  ),
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.applications enable row level security;

-- Application RLS policies
create policy "Applications: read access"
  on public.applications for select
  using (true);

create policy "Applications: write access"
  on public.applications for all
  using (EXISTS (
    select 1 from users u
    where u.id = auth.uid()
    and u.role in ('admin', 'manager')
  ));

-- Credentials Table
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  username text not null,
  password text not null,
  url text,
  environment text not null check (environment in ('production', 'staging', 'development', 'testing')),
  category text not null check (
    category in ('application', 'database', 'hosting', 'api', 'email', 'other')
  ),
  application_id uuid references applications(id) on delete set null,
  notes text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_accessed_by uuid references users(id),
  last_accessed_at timestamptz
);

alter table public.credentials enable row level security;

-- RLS Example: Only admins/managers can insert/update/delete, all users can select
create policy "Credentials: read access"
  on public.credentials for select
  using (true);

create policy "Credentials: write access"
  on public.credentials for all
  using (EXISTS (
    select 1 from users u
    where u.id = auth.uid()
    and u.role in ('admin', 'manager')
  ));
