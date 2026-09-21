import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-read-ai-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
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
    // ---------------------------------------------------------
    // 1. Optional shared-secret check
    // ---------------------------------------------------------
    const expectedSecret = Deno.env.get("READ_AI_WEBHOOK_SECRET")
    if (expectedSecret) {
      const incoming = req.headers.get("x-read-ai-secret")
      if (incoming !== expectedSecret) {
        return new Response(
          JSON.stringify({ error: "Invalid webhook secret" }),
          {
            status: 401,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }
    }

    // ---------------------------------------------------------
    // 2. Parse body
    // ---------------------------------------------------------
    const payload = await req.json()

    // Flexible field mapping – adjust names if your Read AI payload differs
    const externalEventId =
      payload?.id ||
      payload?.event_id ||
      payload?.transcript_id ||
      payload?.data?.id

    if (!externalEventId) {
      return new Response(
        JSON.stringify({
          error: "Missing external event id in payload (expected id / event_id / transcript_id)",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const eventType =
      payload?.event_type ||
      payload?.type ||
      payload?.event ||
      "transcript.completed"

    const title =
      payload?.title ||
      payload?.meeting_title ||
      payload?.data?.title ||
      "Untitled transcript"

    const dateRaw =
      payload?.date ||
      payload?.start_time ||
      payload?.meeting_date ||
      payload?.data?.date ||
      new Date().toISOString()

    const dateOnly = new Date(dateRaw).toISOString().slice(0, 10)

    const participants: string[] =
      payload?.participants ||
      payload?.attendees?.map((a: any) => a.name || a.email) ||
      payload?.data?.participants ||
      []

    const keyTakeaways: string[] =
      payload?.key_takeaways ||
      payload?.summary_points ||
      payload?.data?.key_takeaways ||
      []

    const totalDuration =
      payload?.duration ||
      payload?.total_duration ||
      payload?.data?.duration ||
      null

    const segments =
      payload?.segments ||
      payload?.transcript ||
      payload?.data?.segments ||
      []

    const actionItems =
      payload?.action_items ||
      payload?.actionItems ||
      payload?.data?.action_items ||
      []

    // Optional client hint from payload
    const clientHint =
      payload?.client_name ||
      payload?.client ||
      payload?.data?.client_name ||
      null

    // ---------------------------------------------------------
    // 3. Supabase admin client
    // ---------------------------------------------------------
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // ---------------------------------------------------------
    // 4. Idempotent insert into webhook_events
    // ---------------------------------------------------------
    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id, status, related_transcript_id")
      .eq("source", "read_ai")
      .eq("external_event_id", String(externalEventId))
      .maybeSingle()

    if (existingEvent) {
      // Already processed or received – return success so Read AI stops retrying
      return new Response(
        JSON.stringify({
          success: true,
          message: "Event already processed",
          webhook_event_id: existingEvent.id,
          transcript_id: existingEvent.related_transcript_id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const { data: webhookRow, error: webhookInsertError } = await supabase
      .from("webhook_events")
      .insert({
        source: "read_ai",
        external_event_id: String(externalEventId),
        event_type: eventType,
        payload,
        status: "processing",
      })
      .select("id")
      .single()

    if (webhookInsertError) {
      // Race condition: another invocation inserted first
      if (webhookInsertError.code === "23505") {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Event already being processed (race)",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }
      throw new Error(`webhook_events insert failed: ${webhookInsertError.message}`)
    }

    const webhookEventId = webhookRow.id

    // ---------------------------------------------------------
    // 5. Resolve client (simple name match for now)
    // ---------------------------------------------------------
    let clientId: string | null = null

    if (clientHint) {
      const { data: clientRow } = await supabase
        .from("clients")
        .select("id")
        .ilike("name", `%${clientHint}%`)
        .limit(1)
        .maybeSingle()

      if (clientRow) clientId = clientRow.id
    }

    // Fallback: first active client if we still have none (better than failing)
    if (!clientId) {
      const { data: fallback } = await supabase
        .from("clients")
        .select("id")
        .eq("status", "active")
        .limit(1)
        .maybeSingle()

      clientId = fallback?.id ?? null
    }

    if (!clientId) {
      await supabase
        .from("webhook_events")
        .update({
          status: "failed",
          error_message: "No client found to attach transcript",
        })
        .eq("id", webhookEventId)

      return new Response(
        JSON.stringify({ error: "No client available to attach transcript" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    // ---------------------------------------------------------
    // 6. Create transcript
    // ---------------------------------------------------------
    const { data: transcript, error: transcriptError } = await supabase
      .from("transcripts")
      .insert({
        client_id: clientId,
        title,
        date: dateOnly,
        total_duration: totalDuration,
        participants,
        key_takeaways: keyTakeaways,
        source: "read_ai",
        external_id: String(externalEventId),
      })
      .select("id")
      .single()

    if (transcriptError) {
      // Unique violation on (source, external_id) → already created
      if (transcriptError.code === "23505") {
        await supabase
          .from("webhook_events")
          .update({ status: "processed", processed_at: new Date().toISOString() })
          .eq("id", webhookEventId)

        return new Response(
          JSON.stringify({
            success: true,
            message: "Transcript already exists for this external_id",
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        )
      }

      await supabase
        .from("webhook_events")
        .update({
          status: "failed",
          error_message: transcriptError.message,
        })
        .eq("id", webhookEventId)

      throw new Error(`transcript insert failed: ${transcriptError.message}`)
    }

    const transcriptId = transcript.id

    // ---------------------------------------------------------
    // 7. Optional: single part + segments
    // ---------------------------------------------------------
    if (Array.isArray(segments) && segments.length > 0) {
      const { data: part, error: partError } = await supabase
        .from("transcript_parts")
        .insert({
          transcript_id: transcriptId,
          part_number: 1,
          title: "Full transcript",
          duration: totalDuration,
        })
        .select("id")
        .single()

      if (!partError && part) {
        const segmentRows = segments.map((s: any) => ({
          part_id: part.id,
          speaker: s.speaker || s.name || "Unknown",
          speaker_avatar: s.avatar || null,
          speaker_role: s.role || null,
          is_client: Boolean(s.is_client),
          timestamp: s.timestamp || s.time || null,
          text: s.text || s.content || "",
          sentiment: s.sentiment || "neutral",
        })).filter((r: any) => r.text)

        if (segmentRows.length > 0) {
          await supabase.from("transcript_segments").insert(segmentRows)
        }
      }
    }

    // ---------------------------------------------------------
    // 8. Action items
    // ---------------------------------------------------------
    if (Array.isArray(actionItems) && actionItems.length > 0) {
      const rows = actionItems.map((a: any) => ({
        transcript_id: transcriptId,
        task: typeof a === "string" ? a : (a.task || a.text || a.title || ""),
        assignee: typeof a === "object" ? (a.assignee || a.owner || null) : null,
        completed: typeof a === "object" ? Boolean(a.completed) : false,
      })).filter((r: any) => r.task)

      if (rows.length > 0) {
        await supabase.from("transcript_action_items").insert(rows)
      }
    }

    // ---------------------------------------------------------
    // 9. Auto-match to a meeting (same day ± 3 hours window)
    // ---------------------------------------------------------
    let matchedMeetingId: string | null = null

    const meetingStart = new Date(dateRaw)
    const windowStart = new Date(meetingStart.getTime() - 3 * 60 * 60 * 1000).toISOString()
    const windowEnd = new Date(meetingStart.getTime() + 3 * 60 * 60 * 1000).toISOString()

    const { data: candidateMeetings } = await supabase
      .from("meetings")
      .select("id, title, scheduled_at, client_id")
      .eq("client_id", clientId)
      .gte("scheduled_at", windowStart)
      .lte("scheduled_at", windowEnd)
      .order("scheduled_at", { ascending: true })
      .limit(5)

    if (candidateMeetings && candidateMeetings.length > 0) {
      // Prefer exact title match, otherwise take the closest in time
      const exact = candidateMeetings.find(
        (m) => m.title?.toLowerCase() === title.toLowerCase(),
      )
      matchedMeetingId = exact?.id || candidateMeetings[0].id

      await supabase
        .from("transcripts")
        .update({ meeting_id: matchedMeetingId })
        .eq("id", transcriptId)

      await supabase
        .from("meetings")
        .update({ transcript_status: "has_transcript" })
        .eq("id", matchedMeetingId)
    }

    // ---------------------------------------------------------
    // 10. Mark webhook as processed
    // ---------------------------------------------------------
    await supabase
      .from("webhook_events")
      .update({
        status: "processed",
        related_transcript_id: transcriptId,
        related_meeting_id: matchedMeetingId,
        related_client_id: clientId,
        processed_at: new Date().toISOString(),
      })
      .eq("id", webhookEventId)

    return new Response(
      JSON.stringify({
        success: true,
        webhook_event_id: webhookEventId,
        transcript_id: transcriptId,
        meeting_id: matchedMeetingId,
        client_id: clientId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("read-ai-webhook failed:", error)

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