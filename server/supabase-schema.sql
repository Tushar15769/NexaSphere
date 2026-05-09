create extension if not exists pgcrypto;

create table if not exists events (
  id text primary key,
  name text not null,
  short_name text,
  date_text text not null,
  description text not null,
  status text not null default 'upcoming',
  icon text default '📌',
  tags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists activity_events (
  id text primary key,
  activity_key text not null,
  name text not null,
  date_text text not null,
  tagline text,
  description text not null,
  status text not null default 'completed',
  created_by_name text,
  created_by_email text,
  created_by_phone text,
  created_at timestamptz not null default now()
);

create index if not exists idx_activity_events_key_created on activity_events (activity_key, created_at desc);

create table if not exists core_team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  year text not null,
  branch text not null,
  section text not null,
  email text not null,
  whatsapp text not null,
  linkedin text,
  instagram text,
  photo_url text,
  created_at timestamptz not null default now()
);

create table if not exists form_submissions (
  id uuid primary key default gen_random_uuid(),
  form_type text not null,
  full_name text,
  college_email text,
  whatsapp text,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

-- User authentication tables
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  full_name text,
  verified_email boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists idx_users_email on users(email);

create table if not exists email_verification_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_verification_user_id on email_verification_tokens(user_id);

create table if not exists refresh_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_refresh_tokens_user_id on refresh_tokens(user_id);

create table if not exists password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token text not null unique,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_password_reset_user_id on password_reset_tokens(user_id);
