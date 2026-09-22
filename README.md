# PR Client & Campaign Tracker

Internal tool for a PR agency team: client and meeting tracking, call transcripts, and outbound campaign performance (including screenshot-based metric extraction).

> **Status:** Backend phase complete. The `src/` React app is an early prototype on mock data and will be rebuilt against the live Supabase backend next. Deploy target: Netlify.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend (next) | React + TypeScript + Vite |
| Backend | Supabase (Postgres, Auth, Storage, Edge Functions) |
| Metric extraction | Google Gemini Vision (`gemini-3.6-flash`) |
| Scheduling | Cal.com (webhooks) |
| Transcripts | Read AI (webhooks) |
| Calendar | Google Calendar (webhook / sync helper) |
| Historical import | XLSX via Edge Function |
| Deploy | Netlify (frontend, upcoming) |

## Project structure

```
pr-client-campaign-tracker/
├── src/                                      # Prototype frontend (mock data — to be rebuilt)
├── pr-client-campaign-tracker-backend/
│   └── supabase/                             # Source of truth for the backend
│       ├── config.toml
│       ├── migrations/
│       │   ├── 20260917113532_initial_schema.sql
│       │   ├── 20260917122034_auth_profile_trigger.sql
│       │   ├── 20260917122124_seed_sample_data.sql
│       │   └── 20260921134700_idempotency_and_webhook_tables.sql
│       └── functions/
│           ├── gemini-extract-metrics/       # Screenshot → campaign metrics
│           ├── read-ai-webhook/              # Read AI transcript ingestion
│           ├── cal-com-webhook/              # Cal.com booking → meetings
│           ├── google-calendar-webhook/      # Google Calendar → meetings
│           └── xlsx-import/                  # Historical XLSX import
└── README.md
```

Use only `pr-client-campaign-tracker-backend/supabase/` for Supabase CLI commands.

## Backend capabilities (done)

- **Clients** — records, status, contacts, tags
- **Meetings** — history, attendees, Cal.com + Google Calendar sync
- **Transcripts** — multi-part, segments, action items; Read AI webhook + auto-match to meetings
- **Proposals** — PDF metadata + `proposals` storage bucket
- **Campaigns** — copy, status, metrics channels
- **Screenshot metrics** — upload to `campaign-screenshots` → Gemini Vision → `extracted_metrics`
- **Idempotency** — `webhook_events`, `integration_accounts`, `sync_state`, `import_batches`
- **XLSX import** — Clients, Meetings, Campaigns (+ optional metrics rows)

## Edge Functions

| Function | Purpose | Secrets |
|----------|---------|---------|
| `gemini-extract-metrics` | Extract metrics from campaign screenshots | `GEMINI_API_KEY` |
| `read-ai-webhook` | Ingest Read AI transcripts | `READ_AI_WEBHOOK_SECRET` (optional) |
| `cal-com-webhook` | Create/update/cancel meetings from Cal.com | `CAL_COM_WEBHOOK_SECRET` |
| `google-calendar-webhook` | Upsert meetings from Google Calendar | `GOOGLE_CALENDAR_CHANNEL_TOKEN` (optional `GOOGLE_CALENDAR_ACCESS_TOKEN`, `GOOGLE_CALENDAR_ID`) |
| `xlsx-import` | Bulk / historical import from Storage | Service role |

### Function base URL

```
https://<project-ref>.supabase.co/functions/v1/<function-name>
```

## Prerequisites

- Node.js 18+
- [Deno](https://deno.land/) (for editing Edge Functions)
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project
- A [Gemini API key](https://aistudio.google.com/apikey)

## Backend setup

```powershell
cd pr-client-campaign-tracker-backend
supabase link --project-ref <your-project-ref>
supabase db push
```

### Secrets

```powershell
supabase secrets set GEMINI_API_KEY=your_gemini_key
supabase secrets set READ_AI_WEBHOOK_SECRET=your_read_ai_secret
supabase secrets set CAL_COM_WEBHOOK_SECRET=your_cal_com_secret
supabase secrets set GOOGLE_CALENDAR_CHANNEL_TOKEN=your_gcal_token
```

Optional (live Google Calendar API pull):

```powershell
supabase secrets set GOOGLE_CALENDAR_ACCESS_TOKEN=ya29.your_token
supabase secrets set GOOGLE_CALENDAR_ID=primary
```

### Deploy functions

```powershell
supabase functions deploy gemini-extract-metrics
supabase functions deploy read-ai-webhook
supabase functions deploy cal-com-webhook
supabase functions deploy google-calendar-webhook
supabase functions deploy xlsx-import
```

### Storage buckets

| Bucket | Use |
|--------|-----|
| `proposals` | PDF proposals / contracts |
| `campaign-screenshots` | Screenshots for Gemini metric extraction |
| `imports` | XLSX files for historical import |

## XLSX import

1. Upload an `.xlsx` file to the `imports` storage bucket.
2. Call the function:

```json
{
  "filePath": "historical-data.xlsx",
  "fileName": "historical-data.xlsx"
}
```

Supported sheets (sheet name can contain the keyword):

| Sheet keyword | Imports into |
|---------------|--------------|
| Clients | `clients` |
| Meetings / Calls | `meetings` |
| Campaigns | `campaigns` + optional `campaign_metrics` |

Column headers are matched flexibly (for example `client_name` or `Client Name`).

## VS Code / Cursor setup for Edge Functions

Install the **Deno** extension, then use this `.vscode/settings.json`:

```json
{
  "deno.enable": true,
  "deno.enablePaths": [
    "./pr-client-campaign-tracker-backend/supabase/functions"
  ],
  "deno.lint": true,
  "deno.unstable": true,
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  }
}
```

## Roadmap

- [x] Schema + RLS + storage buckets
- [x] Gemini screenshot metric extraction
- [x] Idempotency + webhook foundation tables
- [x] Read AI webhook + transcript-to-meeting auto-match
- [x] Cal.com webhook (used instead of Calendly in this build)
- [x] Google Calendar webhook / sync helper
- [x] XLSX historical import (clients, meetings, campaigns)
- [ ] Frontend rebuilt against live Supabase
- [ ] Global search + month/status filters (UI)
- [ ] Netlify deploy config
- [ ] Production Auth (team login)

## Notes

- The original brief mentioned Claude and Calendly. This project uses **Gemini** for vision metrics and **Cal.com** for scheduling webhooks.
- `meetings.cal_com_booking_uid` stores Cal.com booking IDs.
- `meetings.gcal_event_id` stores Google Calendar event IDs.
- Edge Functions use the service role. If you add new tables, grant `service_role` access as needed.

## License

Private — internal PR agency use.
