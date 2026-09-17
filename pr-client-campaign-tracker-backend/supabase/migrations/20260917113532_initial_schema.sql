-- =============================================
-- PR Agency Tracker - Initial Schema
-- Matches the frontend TypeScript types
-- =============================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- =============================================
-- 1. PROFILES (Team members)
-- =============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text default 'member' check (role in ('admin', 'member')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- 2. CLIENTS
-- =============================================
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  logo text,
  status text not null default 'prospect' check (status in ('active', 'prospect', 'churned')),
  industry text,
  tier text check (tier in ('Enterprise', 'Growth', 'Boutique')),
  owner_id uuid references public.profiles(id),
  primary_contact_name text,
  primary_contact_email text,
  primary_contact_phone text,
  primary_contact_title text,
  retainer_monthly numeric(12,2) default 0,
  joined_date date,
  website text,
  tags text[] default '{}',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- 3. PROPOSALS (PDF attachments)
-- =============================================
create table public.proposals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  file_path text not null,          -- path in Supabase Storage
  file_size text,
  type text check (type in ('proposal', 'contract', 'brief', 'report')),
  status text default 'draft' check (status in ('signed', 'review', 'draft')),
  uploaded_by uuid references public.profiles(id),
  uploaded_at timestamptz default now()
);

-- =============================================
-- 4. MEETINGS
-- =============================================
create table public.meetings (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  duration_minutes integer default 30,
  type text,
  location text,
  agenda text[],
  notes text,
  transcript_status text default 'none' check (transcript_status in ('has_transcript', 'pending', 'none')),
  calendly_event_id text,
  gcal_event_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Meeting attendees (junction table)
create table public.meeting_attendees (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid not null references public.meetings(id) on delete cascade,
  name text not null,
  email text,
  avatar_url text,
  role text,
  is_client boolean default false
);

-- =============================================
-- 5. TRANSCRIPTS (multi-part)
-- =============================================
create table public.transcripts (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references public.meetings(id) on delete set null,
  client_id uuid not null references public.clients(id) on delete cascade,
  title text not null,
  date date not null,
  total_duration text,
  participants text[] default '{}',
  key_takeaways text[] default '{}',
  source text default 'manual', -- 'read_ai' | 'manual'
  external_id text,             -- for Read AI idempotency
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Transcript parts
create table public.transcript_parts (
  id uuid primary key default gen_random_uuid(),
  transcript_id uuid not null references public.transcripts(id) on delete cascade,
  part_number integer not null,
  title text,
  duration text,
  created_at timestamptz default now()
);

-- Transcript segments (individual speaker lines)
create table public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  part_id uuid not null references public.transcript_parts(id) on delete cascade,
  speaker text not null,
  speaker_avatar text,
  speaker_role text,
  is_client boolean default false,
  timestamp text,               -- e.g. "04:12"
  text text not null,
  sentiment text check (sentiment in ('positive', 'neutral', 'urgent'))
);

-- Action items from transcripts
create table public.transcript_action_items (
  id uuid primary key default gen_random_uuid(),
  transcript_id uuid not null references public.transcripts(id) on delete cascade,
  task text not null,
  assignee text,
  completed boolean default false
);

-- =============================================
-- 6. CAMPAIGNS
-- =============================================
create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  client_id uuid references public.clients(id) on delete set null,
  status text not null default 'draft' check (status in ('draft', 'active', 'completed', 'paused')),
  type text,
  start_date date,
  end_date date,
  owner_id uuid references public.profiles(id),
  target_outlets text[] default '{}',
  copy_text text,
  tags text[] default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Campaign metrics rows
create table public.campaign_metrics (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  channel text,
  pitched integer default 0,
  impressions integer default 0,
  opens integer default 0,
  clicks integer default 0,
  replies integer default 0,
  coverage_secured integer default 0,
  response_rate numeric(5,4) default 0,
  created_at timestamptz default now()
);

-- Campaign screenshots (for Claude extraction)
create table public.campaign_screenshots (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  file_name text not null,
  file_path text not null,          -- Storage path
  thumbnail_url text,
  file_size text,
  extracted_metrics jsonb,          -- Claude result
  uploaded_at timestamptz default now()
);

-- =============================================
-- INDEXES (important for search & filters)
-- =============================================
create index clients_status_idx on public.clients(status);
create index clients_owner_id_idx on public.clients(owner_id);
create index clients_name_trgm_idx on public.clients using gin (name gin_trgm_ops);
create index clients_company_trgm_idx on public.clients using gin (company gin_trgm_ops);

create index meetings_client_id_idx on public.meetings(client_id);
create index meetings_scheduled_at_idx on public.meetings(scheduled_at);
create index meetings_transcript_status_idx on public.meetings(transcript_status);

create index transcripts_client_id_idx on public.transcripts(client_id);
create index transcripts_meeting_id_idx on public.transcripts(meeting_id);
create index transcript_segments_text_trgm_idx on public.transcript_segments using gin (text gin_trgm_ops);

create index campaigns_status_idx on public.campaigns(status);
create index campaigns_client_id_idx on public.campaigns(client_id);

-- =============================================
-- UPDATED_AT TRIGGER
-- =============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.handle_updated_at();

create trigger meetings_updated_at
  before update on public.meetings
  for each row execute function public.handle_updated_at();

create trigger transcripts_updated_at
  before update on public.transcripts
  for each row execute function public.handle_updated_at();

create trigger campaigns_updated_at
  before update on public.campaigns
  for each row execute function public.handle_updated_at();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Internal tool → all authenticated users can access everything
-- =============================================
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.proposals enable row level security;
alter table public.meetings enable row level security;
alter table public.meeting_attendees enable row level security;
alter table public.transcripts enable row level security;
alter table public.transcript_parts enable row level security;
alter table public.transcript_segments enable row level security;
alter table public.transcript_action_items enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.campaign_screenshots enable row level security;

-- Simple policy: any authenticated user can do everything
-- (We can make it stricter later if needed)
create policy "Authenticated users full access" on public.profiles
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.clients
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.proposals
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.meetings
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.meeting_attendees
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.transcripts
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.transcript_parts
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.transcript_segments
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.transcript_action_items
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.campaigns
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.campaign_metrics
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.campaign_screenshots
  for all using (auth.role() = 'authenticated');

-- =============================================
-- STORAGE BUCKETS
-- =============================================
insert into storage.buckets (id, name, public)
values 
  ('proposals', 'proposals', false),
  ('campaign-screenshots', 'campaign-screenshots', false);

-- Storage policies
create policy "Authenticated users can upload proposals"
  on storage.objects for insert
  with check (bucket_id = 'proposals' and auth.role() = 'authenticated');

create policy "Authenticated users can read proposals"
  on storage.objects for select
  using (bucket_id = 'proposals' and auth.role() = 'authenticated');

create policy "Authenticated users can upload screenshots"
  on storage.objects for insert
  with check (bucket_id = 'campaign-screenshots' and auth.role() = 'authenticated');

create policy "Authenticated users can read screenshots"
  on storage.objects for select
  using (bucket_id = 'campaign-screenshots' and auth.role() = 'authenticated');