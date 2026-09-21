-- =============================================
-- Idempotency + Webhook / Sync foundation
-- =============================================

-- 1. Integration accounts (Read AI, Calendly, Google Calendar, etc.)
create table public.integration_accounts (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('read_ai', 'calendly', 'google_calendar', 'other')),
  account_name text,
  external_account_id text,
  access_token text,          -- store encrypted / via vault later if needed
  refresh_token text,
  token_expires_at timestamptz,
  scopes text[] default '{}',
  is_active boolean default true,
  metadata jsonb default '{}',
  created_by uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (provider, external_account_id)
);

-- 2. Webhook events (raw inbound payloads + processing status)
create table public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('read_ai', 'calendly', 'google_calendar', 'manual', 'other')),
  external_event_id text not null,          -- the ID from the provider
  event_type text,                          -- e.g. 'transcript.completed', 'invitee.created'
  payload jsonb not null default '{}',
  status text not null default 'received'
    check (status in ('received', 'processing', 'processed', 'failed', 'ignored')),
  error_message text,
  related_meeting_id uuid references public.meetings(id) on delete set null,
  related_transcript_id uuid references public.transcripts(id) on delete set null,
  related_client_id uuid references public.clients(id) on delete set null,
  processed_at timestamptz,
  created_at timestamptz default now(),
  -- Idempotency: same source + external event ID can only appear once
  unique (source, external_event_id)
);

create index webhook_events_status_idx on public.webhook_events (status);
create index webhook_events_created_at_idx on public.webhook_events (created_at desc);

-- 3. Sync state (cursors / last sync time per integration)
create table public.sync_state (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('read_ai', 'calendly', 'google_calendar', 'other')),
  integration_account_id uuid references public.integration_accounts(id) on delete cascade,
  resource text not null,                   -- e.g. 'events', 'transcripts', 'calendars'
  cursor text,                              -- provider-specific cursor / page token
  last_synced_at timestamptz,
  last_success_at timestamptz,
  last_error text,
  metadata jsonb default '{}',
  updated_at timestamptz default now(),
  unique (provider, integration_account_id, resource)
);

-- 4. Import batches (for XLSX / historical bulk imports)
create table public.import_batches (
  id uuid primary key default gen_random_uuid(),
  source text not null default 'xlsx' check (source in ('xlsx', 'csv', 'manual', 'other')),
  file_name text,
  file_path text,                           -- path in storage if uploaded
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed', 'partial')),
  total_rows integer default 0,
  success_rows integer default 0,
  error_rows integer default 0,
  error_log jsonb default '[]',
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz default now()
);

-- =============================================
-- Extra unique indexes on existing tables
-- (prevents duplicate external events even without webhook_events)
-- =============================================

-- Transcripts: one external_id per source
create unique index transcripts_source_external_id_uidx
  on public.transcripts (source, external_id)
  where external_id is not null;

-- Meetings: one Calendly event ID
create unique index meetings_calendly_event_id_uidx
  on public.meetings (calendly_event_id)
  where calendly_event_id is not null;

-- Meetings: one Google Calendar event ID
create unique index meetings_gcal_event_id_uidx
  on public.meetings (gcal_event_id)
  where gcal_event_id is not null;

-- =============================================
-- RLS
-- =============================================
alter table public.integration_accounts enable row level security;
alter table public.webhook_events enable row level security;
alter table public.sync_state enable row level security;
alter table public.import_batches enable row level security;

create policy "Authenticated users full access" on public.integration_accounts
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.webhook_events
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.sync_state
  for all using (auth.role() = 'authenticated');

create policy "Authenticated users full access" on public.import_batches
  for all using (auth.role() = 'authenticated');

-- updated_at trigger for integration_accounts
create trigger integration_accounts_updated_at
  before update on public.integration_accounts
  for each row execute function public.handle_updated_at();