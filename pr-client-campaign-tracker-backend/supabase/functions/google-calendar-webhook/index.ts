import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-goog-channel-id, x-goog-resource-state, x-goog-resource-id, x-goog-channel-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  // Google push notifications sometimes send sync handshake
  const resourceState = req.headers.get("x-goog-resource-state")
  if (resourceState === "sync") {
    return new Response("ok", { status: 200, headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST." }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }

  try {
    // Optional shared secret (set as channel token when creating the watch)
    const expectedToken = Deno.env.get("GOOGLE_CALENDAR_CHANNEL_TOKEN")
    if (expectedToken) {
      const incoming = req.headers.get("x-goog-channel-token")
      if (incoming !== expectedToken) {
        return new Response(
          JSON.stringify({ error: "Invalid channel token" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const GOOGLE_ACCESS_TOKEN = Deno.env.get("GOOGLE_CALENDAR_ACCESS_TOKEN")
    const GOOGLE_CALENDAR_ID =
      Deno.env.get("GOOGLE_CALENDAR_ID") || "primary"

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing Supabase env vars")
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Google Calendar push body is often empty; notification means "something changed".
    // We fetch recent events via Calendar API when a token is configured.
    let events: any[] = []

    if (GOOGLE_ACCESS_TOKEN) {
      const timeMin = new Date(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      ).toISOString()
      const timeMax = new Date(
        Date.now() + 90 * 24 * 60 * 60 * 1000,
      ).toISOString()

      const url =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(GOOGLE_CALENDAR_ID)}/events` +
        `?singleEvents=true&orderBy=startTime&timeMin=${encodeURIComponent(timeMin)}` +
        `&timeMax=${encodeURIComponent(timeMax)}&maxResults=50`

      const gRes = await fetch(url, {
        headers: { Authorization: `Bearer ${GOOGLE_ACCESS_TOKEN}` },
      })

      if (!gRes.ok) {
        const errText = await gRes.text()
        throw new Error(`Google Calendar API error (${gRes.status}): ${errText}`)
      }

      const gData = await gRes.json()
      events = gData.items || []
    } else {
      // Fallback: accept a manual/test payload with events array
      const body = await req.json().catch(() => ({}))
      events = body?.events || (body?.id ? [body] : [])
    }

    const results: {
      gcal_event_id: string
      meeting_id?: string
      action: string
    }[] = []

    for (const ev of events) {
      const gcalId = ev.id
      if (!gcalId) continue

      const status = ev.status // confirmed | tentative | cancelled
      const title = ev.summary || "Google Calendar event"
      const start =
        ev.start?.dateTime ||
        (ev.start?.date ? `${ev.start.date}T09:00:00.000Z` : null)
      const end =
        ev.end?.dateTime ||
        (ev.end?.date ? `${ev.end.date}T10:00:00.000Z` : null)

      if (!start) continue

      let durationMinutes = 30
      if (end) {
        const ms = new Date(end).getTime() - new Date(start).getTime()
        if (ms > 0) durationMinutes = Math.round(ms / 60000)
      }

      const location = ev.location || ev.hangoutLink || null
      const description = ev.description || null

      // Idempotent webhook log
      const externalEventId = `gcal:${gcalId}:${ev.updated || ev.etag || "v1"}`
      const { data: existingWh } = await supabase
        .from("webhook_events")
        .select("id")
        .eq("source", "google_calendar")
        .eq("external_event_id", externalEventId)
        .maybeSingle()

      if (existingWh) {
        results.push({ gcal_event_id: gcalId, action: "skipped_duplicate" })
        continue
      }

      await supabase.from("webhook_events").insert({
        source: "google_calendar",
        external_event_id: externalEventId,
        event_type: status === "cancelled" ? "event.cancelled" : "event.upsert",
        payload: ev,
        status: "processing",
      })

      const { data: existingMeeting } = await supabase
        .from("meetings")
        .select("id")
        .eq("gcal_event_id", gcalId)
        .maybeSingle()

      // Resolve client: try description/title match, else first active
      let clientId: string | null = null
      const { data: clients } = await supabase
        .from("clients")
        .select("id, name, company")
        .eq("status", "active")

      if (clients?.length) {
        const blob = `${title} ${description || ""}`.toLowerCase()
        const match = clients.find(
          (c) =>
            blob.includes((c.name || "").toLowerCase()) ||
            blob.includes((c.company || "").toLowerCase()),
        )
        clientId = match?.id || clients[0].id
      }

      if (!clientId) {
        results.push({ gcal_event_id: gcalId, action: "no_client" })
        continue
      }

      if (status === "cancelled" && existingMeeting) {
        await supabase
          .from("meetings")
          .update({
            notes: `Cancelled in Google Calendar`,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMeeting.id)

        results.push({
          gcal_event_id: gcalId,
          meeting_id: existingMeeting.id,
          action: "cancelled",
        })
        continue
      }

      if (existingMeeting) {
        await supabase
          .from("meetings")
          .update({
            title,
            scheduled_at: start,
            duration_minutes: durationMinutes,
            location,
            notes: description,
            client_id: clientId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingMeeting.id)

        results.push({
          gcal_event_id: gcalId,
          meeting_id: existingMeeting.id,
          action: "updated",
        })
      } else if (status !== "cancelled") {
        const { data: created, error } = await supabase
          .from("meetings")
          .insert({
            client_id: clientId,
            title,
            scheduled_at: start,
            duration_minutes: durationMinutes,
            location,
            notes: description,
            type: "Google Calendar",
            gcal_event_id: gcalId,
            transcript_status: "none",
          })
          .select("id")
          .single()

        if (error) {
          results.push({
            gcal_event_id: gcalId,
            action: `error: ${error.message}`,
          })
        } else {
          results.push({
            gcal_event_id: gcalId,
            meeting_id: created.id,
            action: "created",
          })
        }
      }
    }

    // Mark recent processing webhooks processed (best-effort)
    await supabase
      .from("webhook_events")
      .update({
        status: "processed",
        processed_at: new Date().toISOString(),
      })
      .eq("source", "google_calendar")
      .eq("status", "processing")

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.length,
        results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("google-calendar-webhook failed:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  }
})