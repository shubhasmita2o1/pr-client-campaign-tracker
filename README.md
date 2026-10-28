# PR Client & Campaign Tracker

A full-stack, production-ready internal platform for high-velocity PR agencies to manage client retainers, meetings, multi-part call transcripts with AI takeaways, outbound PR campaign performance with Google Gemini Vision metric extraction, proposal document storage, and historical bulk XLSX imports.

> **Status:** **Production Ready**. The frontend is fully wired to the live Supabase backend (Postgres, RLS, Auth, Storage, Edge Functions) using React Query and strictly typed database models. Built and configured for single-command deploy to **Netlify**.

---

## Tech Stack & Architecture

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + TypeScript | Desktop-first, clean agency aesthetic (Radix UI primitives + Tailwind CSS) |
| **Data Fetching & Cache** | TanStack React Query v5 | Automated cache invalidation, optimistic updates, loading skeletons |
| **Backend & Database** | Supabase (PostgreSQL 15+) | Row Level Security (RLS), custom triggers, idempotent tables |
| **Authentication** | Supabase Auth | Email + password team login, session persistence, automatic profile sync |
| **Storage Buckets** | Supabase Storage | `proposals` (PDFs), `campaign-screenshots` (Images), `imports` (XLSX/CSV) |
| **AI Metric Extraction** | Google Gemini Vision | Supabase Edge Function (`gemini-extract-metrics`) running Gemini Vision |
| **Edge Functions** | Deno / Supabase Functions | `gemini-extract-metrics`, `xlsx-import`, `read-ai-webhook`, `cal-com-webhook`, `google-calendar-webhook` |
| **Deployment Target** | Netlify | Zero-config deployment via `netlify.toml` and SPA `public/_redirects` |

---

## Key Features

1. **Supabase Authentication & Team Profiles**
   - Secure email and password login with session persistence.
   - Profile sync trigger creates team member profiles in `public.profiles` automatically upon user creation.
   - Route protection with redirect to `/login` for unauthenticated visitors.
   - Header user avatar, role badge, and sign-out dropdown.
   - Pre-configured demo quick-logins for agency leads and account specialists.

2. **Client Management & Proposals**
   - Full client directory with search, tier, status (`active`, `prospect`, `churned`), and monthly join date filters.
   - Detailed client drawer with retainer MRR, primary contact info, meeting history, and transcript associations.
   - Real PDF proposal and contract uploads to Supabase Storage (`proposals` bucket) with secure signed URL access.

3. **Meetings & Attendee Tracking**
   - Agenda management, attendee lists with agency/client badges, and meeting status.
   - Direct two-way linking between meetings, clients, and recorded transcripts.
   - Ready for automated scheduling webhooks (Cal.com and Google Calendar).

4. **Multi-Part Transcripts & Full-Text Search**
   - Multi-part call transcript viewer with speaker avatars, timestamps, and sentiment indicators (`positive`, `neutral`, `urgent`).
   - Action item checklist with real database toggles (`transcript_action_items`).
   - Deep search across transcript titles, key takeaways, and spoken segment dialogue.

5. **Campaigns & Gemini Vision Metric Extraction**
   - Outbound PR campaign tracking with channel-level metrics (sent, opened, clicks, replies, coverage secured).
   - Screenshot upload to Supabase Storage (`campaign-screenshots` bucket).
   - Instant extraction via the `gemini-extract-metrics` Edge Function powered by Google Gemini Vision.
   - One-click metric insertion from AI extraction results into the campaign's live metrics table.

6. **Historical XLSX Import**
   - Upload multi-sheet Excel workbooks (`.xlsx`) or `.csv` files to the `imports` Supabase storage bucket.
   - Calls the `xlsx-import` Edge Function with batch progress indicators and validation error logging.
   - Downloadable CSV template for client and campaign seeding.

7. **Executive Dashboard**
   - Real-time KPIs calculated directly from database tables: Active Clients, Monthly Retainer MRR, Win Rate, and Average Response Rate.
   - Live activity feed aggregating recent webhook events, proposal uploads, meetings, and campaign updates.
   - Global search bar indexing clients, meetings, campaigns, and spoken transcript dialogue.

---

## Project Structure

```
pr-client-campaign-tracker/
├── public/
│   ├── _redirects                            # Netlify SPA rewrite rule (/* -> /index.html 200)
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── campaigns/                        # Screenshot modal, metrics editor, campaign card
│   │   ├── clients/                          # Client drawer, filters, proposal upload list
│   │   ├── layout/                           # AppLayout, Sidebar, Header with user dropdown
│   │   ├── shared/                           # ErrorBoundary, PageHeader, SearchBar, StatusBadge
│   │   ├── transcripts/                      # MultiPartViewer, transcript details
│   │   └── ui/                               # Radix UI primitives (Button, Dialog, Dropdown, etc.)
│   ├── contexts/
│   │   └── AuthContext.tsx                   # Supabase Auth provider and session synchronization
│   ├── features/
│   │   ├── auth/                             # LoginPage with team credentials & demo logins
│   │   ├── dashboard/                        # KPI metrics, recent activity, quick actions
│   │   ├── imports/                          # Historical XLSX/CSV dropzone and batch audit log
│   │   └── settings/                         # Agency profiles and webhook integrations
│   ├── hooks/                                # React Query hooks (useClients, useMeetings, etc.)
│   ├── lib/
│   │   ├── supabase.ts                       # Typed Supabase client & Storage/Edge Function helpers
│   │   └── utils.ts                          # Formatting and class merging utilities
│   ├── pages/                                # Route pages (Clients, Meetings, Transcripts, Campaigns)
│   ├── services/                             # Real Supabase query/mutation service layer
│   │   ├── clientService.ts
│   │   ├── meetingService.ts
│   │   ├── transcriptService.ts
│   │   ├── campaignService.ts
│   │   ├── importService.ts
│   │   ├── dashboardService.ts
│   │   └── searchService.ts
│   ├── types/
│   │   └── database.ts                       # Strict TypeScript database types matching Supabase schema
│   ├── App.tsx                               # Router configuration with ErrorBoundary
│   └── main.tsx
├── pr-client-campaign-tracker-backend/
│   └── supabase/                             # Source of truth for database and functions
│       ├── migrations/
│       │   ├── 20260917113532_initial_schema.sql
│       │   ├── 20260917122034_auth_profile_trigger.sql
│       │   ├── 20260917122124_seed_sample_data.sql
│       │   └── 20260921134700_idempotency_and_webhook_tables.sql
│       └── functions/
│           ├── gemini-extract-metrics/       # Google Gemini Vision extraction
│           ├── xlsx-import/                  # Bulk XLSX parsing
│           ├── read-ai-webhook/              # Read AI transcript ingestion
│           ├── cal-com-webhook/              # Cal.com meeting booking
│           └── google-calendar-webhook/      # Google Calendar synchronization
├── netlify.toml                              # Netlify build and redirect configuration
├── .env.example                              # Environment variable reference
├── package.json
└── vite.config.ts
```

---

## Getting Started

### 1. Prerequisites

- **Node.js** 18+ (tested on Node.js 20 and 24)
- **npm** or **pnpm**
- A [Supabase](https://supabase.com) project (or local Supabase instance)

### 2. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your Supabase project credentials in `.env`:

```env
# Supabase Project URL
VITE_SUPABASE_URL=https://your-project-ref.supabase.co

# Supabase Public Anon Key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Note:** The client requires only the public anon key (`VITE_SUPABASE_ANON_KEY`). Never expose your service role key in frontend environment variables.

### 3. Install Dependencies & Run Locally

```bash
# Install dependencies
npm install

# Start Vite local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Build for Production

```bash
# Type check and build bundle
npm run build

# Preview production build locally
npm run preview
```

---

## Supabase Backend Setup

If deploying a fresh Supabase project:

### 1. Run Migrations

From the `pr-client-campaign-tracker-backend` directory:

```bash
cd pr-client-campaign-tracker-backend
supabase link --project-ref <your-project-ref>
supabase db push
```

The migrations set up:
- Core tables (`profiles`, `clients`, `proposals`, `meetings`, `meeting_attendees`, `transcripts`, `transcript_parts`, `transcript_segments`, `transcript_action_items`, `campaigns`, `campaign_metrics`, `campaign_screenshots`).
- Idempotency & integration tables (`integration_accounts`, `webhook_events`, `sync_state`, `import_batches`).
- Storage buckets (`proposals`, `campaign-screenshots`, `imports`) with proper RLS storage policies.
- Automatic profile trigger on `auth.users` insert.
- Rich seed data with sample clients, meetings, transcripts, and campaigns.

### 2. Configure Edge Function Secrets

```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
supabase secrets set READ_AI_WEBHOOK_SECRET=your_read_ai_secret
supabase secrets set CAL_COM_WEBHOOK_SECRET=your_cal_com_secret
supabase secrets set GOOGLE_CALENDAR_CHANNEL_TOKEN=your_gcal_token
```

### 3. Deploy Edge Functions

```bash
supabase functions deploy gemini-extract-metrics
supabase functions deploy xlsx-import
supabase functions deploy read-ai-webhook
supabase functions deploy cal-com-webhook
supabase functions deploy google-calendar-webhook
```

---

## Netlify Deployment

The project is pre-configured for seamless Netlify deployment:

1. **Connect Repository:** Link this Git repository in the Netlify dashboard.
2. **Build Settings:** Automatically detected from `netlify.toml`:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. **Environment Variables:**
   Under **Site configuration > Environment variables**, add:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
4. **Deploy:** Click **Deploy site**. SPA routing is handled automatically via `public/_redirects` and `netlify.toml`.

---

## Demo Credentials

When running against the seed database, the following team credentials can be used for quick login:

| Role | Email | Password |
|---|---|---|
| **Agency Lead (Admin)** | `elena@prestige-pr.com` | `Agency123!` |
| **PR Specialist (Member)** | `marcus@prestige-pr.com` | `Agency123!` |
| **Media Director (Admin)** | `sarah@prestige-pr.com` | `Agency123!` |

*(The login screen also provides quick-fill demo buttons for instantaneous testing).*

---

## License

Private — For internal PR agency operations.
