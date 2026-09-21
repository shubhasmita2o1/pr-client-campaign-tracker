# PR Client & Campaign Tracker

Internal tool for a PR agency team: client/meeting tracking with call transcripts,
outbound campaign tracking with screenshot-based metric extraction.

> **Status:** Backend-first rebuild in progress. The `src/` React app in this repo
> is an early prototype running on mock data — it will be rebuilt once the
> Supabase backend below is finished. Don't build new frontend features against
> `src/` right now.

## Stack

- **Frontend (to be rebuilt):** React + TypeScript + Vite
- **Backend:** Supabase — Postgres, Auth, Storage, Edge Functions
- **Metric extraction:** Gemini Vision API (`gemini-2.0-flash`)
- **Deploy target:** Netlify

## Project structure

```
pr-client-campaign-tracker/
├── src/                                    # Prototype frontend (mock data, being replaced)
├── pr-client-campaign-tracker-backend/
│   └── supabase/                           # Source of truth for the backend
│       ├── config.toml
│       ├── migrations/                     # Schema, in order
│       │   ├── 20260917113532_initial_schema.sql
│       │   ├── 20260917122034_auth_profile_trigger.sql
│       │   └── 20260917122124_seed_sample_data.sql
│       └── functions/
│           └── gemini-extract-metrics/     # Screenshot → campaign metrics
└── README.md
```

There is only one `supabase/` directory that matters —
`pr-client-campaign-tracker-backend/supabase/`. If you see a second `supabase/`
folder at the repo root, it's stale; don't run commands from there.

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Deno](https://deno.land/) — required to edit/run the edge functions
  ```powershell
  irm https://deno.land/install.ps1 | iex
  ```
  Then restart your terminal and confirm with `deno --version`.
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
  ```powershell
  npm install -g supabase
  ```
- A Supabase project (local via Docker, or hosted) and a
  [Gemini API key](https://aistudio.google.com/apikey)

## Backend setup

All commands below run from `pr-client-campaign-tracker-backend/supabase/`.

```powershell
cd pr-client-campaign-tracker-backend/supabase
```

### 1. Link to your Supabase project

```powershell
supabase link --project-ref <your-project-ref>
```

### 2. Apply migrations

```powershell
supabase db push
```

This creates all tables (`profiles`, `clients`, `proposals`, `meetings`,
`meeting_attendees`, `transcripts`, `transcript_parts`, `transcript_segments`,
`transcript_action_items`, `campaigns`, `campaign_metrics`,
`campaign_screenshots`), enables RLS, and sets up the storage buckets.

### 3. Set edge function secrets

```powershell
supabase secrets set GEMINI_API_KEY=your_key_here
```

### 4. Deploy the edge function

```powershell
supabase functions deploy gemini-extract-metrics
```

To run it locally instead, for testing:

```powershell
supabase functions serve gemini-extract-metrics --env-file ./.env
```

## Editing edge functions in VS Code

The `functions/` directory uses Deno, not Node — its imports and globals
(`Deno.env`, remote `https://` imports) will show as errors in a normal
TypeScript setup unless the Deno extension is scoped to that folder.

Install the **Deno** extension (`denoland.vscode-deno`), then add
`.vscode/settings.json` at the project root:

```json
{
  "deno.enablePaths": [
    "pr-client-campaign-tracker-backend/supabase/functions"
  ],
  "deno.lint": true,
  "deno.unstable": true
}
```

Reload the window after saving. This keeps Deno scoped to the functions
folder only — the rest of the repo (`src/`) still uses normal Node tooling.

## Gemini extraction function

`gemini-extract-metrics` takes a `screenshotPath` and `campaignId`, downloads
the screenshot from the `campaign-screenshots` storage bucket, sends it to
Gemini for metric extraction (impressions, opens, clicks, replies, coverage),
and writes the result to `campaign_screenshots.extracted_metrics`.

```json
POST /functions/v1/gemini-extract-metrics
{
  "screenshotPath": "campaign-123/screenshot.png",
  "campaignId": "campaign-123"
}
```

## Roadmap

- [x] Schema + RLS + storage buckets
- [x] Gemini screenshot metric extraction
- [x] Idempotency constraints for webhook/sync sources
- [x] `webhook_events`, `integration_accounts`, `sync_state`, `import_batches` tables
- [x] Read AI webhook ingestion + transcript-to-meeting auto-matching
- [ ] Calendly sync
- [ ] Google Calendar sync
- [ ] XLSX historical data import
- [ ] Frontend rebuilt against the real backend
- [ ] Netlify deploy config
