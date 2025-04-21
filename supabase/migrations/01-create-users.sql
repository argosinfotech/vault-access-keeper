
-- Users Table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin', 'manager', 'viewer')),
  created_at timestamptz not null default now(),
  last_login timestamptz
);

-- Enable Row Level Security (RLS)
alter table public.users enable row level security;

-- Example RLS: Only allow a user to read their own user row
create policy "Users: Self access"
  on public.users for select
  using (auth.uid() = id);
