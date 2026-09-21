import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cal-secret, cal-signature",
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
    const expectedSecret = Deno.env.get("CAL_COM_WEBHOOK_SECRET")
    if (expectedSecret) {
      const incoming =
        req.headers.get("x-cal-secret") ||
        req.headers.get("cal-signature") ||
        req.headers.get("x-cal-signature")

      // Simple shared-secret match (Cal.com can also send HMAC; extend later if needed)
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
    const body = await req.json()

    // Cal.com usually sends { triggerEvent, createdAt, payload }
    const triggerEvent =
      body?.triggerEvent ||
      body?.trigger ||
      body?.event ||
      body?.type ||
      "BOOKING_CREATED"

    const payload = body?.payload || body?.data || body

    const bookingUid =
      payload?.uid ||
      payload?.bookingUid ||
      payload?.id ||
      payload?.booking_id ||
      body?.uid

    if (!bookingUid) {
      return new Response(
        JSON.stringify({
          error: "Missing booking uid in Cal.com payload",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const title =
      payload?.title ||
      payload?.eventTitle ||
      payload?.event_type?.title ||
      "Cal.com meeting"

    const startTime =
      payload?.startTime ||
      payload?.start ||
      payload?.start_time ||
      new Date().toISOString()

    const endTime =
      payload?.endTime ||
      payload?.end ||
      payload?.end_time ||
      null

    let durationMinutes = 30
    if (startTime && endTime) {
      const ms = new Date(endTime).getTime() - new Date(startTime).getTime()
      if (ms > 0) durationMinutes = Math.round(ms / 60000)
    } else if (payload?.length || payload?.duration) {
      durationMinutes = Number(payload.length || payload.duration) || 30
    }

    const location =
      payload?.location ||
      payload?.metadata?.videoCallUrl ||
      payload?.videoCallUrl ||
      payload?.additionalNotes ||
      null

    const attendees = payload?.attendees || payload?.responses || []
    const attendeeNames: string[] = Array.isArray(attendees)
      ? attendees.map((a: any) => a.name || a.email || String(a)).filter(Boolean)
      : []

    const clientHint =
      payload?.metadata?.client_name ||
      payload?.client_name ||
      attendeeNames[0] ||
      null

    const isCancelled =
      String(triggerEvent).toUpperCase().includes("CANCEL") ||
      String(triggerEvent).toUpperCase().includes("REJECT") ||
      payload?.status === "CANCELLED" ||
      payload?.status === "rejected"

    const isReschedule =
      String(triggerEvent).toUpperCase().includes("RESCHEDULE")

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
    // 4. Idempotent webhook_events insert
    // ---------------------------------------------------------
    const externalEventId = `${triggerEvent}:${bookingUid}`

    const { data: existingEvent } = await supabase
      .from("webhook_events")
      .select("id, status, related_meeting_id")
      .eq("source", "cal_com") // Cal.com stored as 'other' until we extend the check constraint
      .eq("external_event_id", externalEventId)
      .maybeSingle()

    if (existingEvent && !isReschedule) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Event already processed",
          webhook_event_id: existingEvent.id,
          meeting_id: existingEvent.related_meeting_id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    let webhookEventId: string | null = existingEvent?.id ?? null

    if (!webhookEventId) {
      const { data: webhookRow, error: webhookInsertError } = await supabase
        .from("webhook_events")
        .insert({
          source: "cal_com",
          external_event_id: externalEventId,
          event_type: triggerEvent,
          payload: body,
          status: "processing",
        })
        .select("id")
        .single()

      if (webhookInsertError) {
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

      webhookEventId = webhookRow.id
    }

    // ---------------------------------------------------------
    // 5. Resolve client
    // ---------------------------------------------------------
    let clientId: string | null = null

    if (clientHint) {
      const { data: clientRow } = await supabase
        .from("clients")
        .select("id")
        .or(`name.ilike.%${clientHint}%,company.ilike.%${clientHint}%`)
        .limit(1)
        .maybeSingle()

      if (clientRow) clientId = clientRow.id
    }

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
          error_message: "No client available to attach meeting",
        })
        .eq("id", webhookEventId)

      return new Response(
        JSON.stringify({ error: "No client available to attach meeting" }),
        {
          status: 422,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    // ---------------------------------------------------------
    // 6. Upsert meeting by calendly_event_id (stores Cal.com booking uid)
    // ---------------------------------------------------------
    const { data: existingMeeting } = await supabase
      .from("meetings")
      .select("id")
      .eq("cal_com_booking_uid", String(bookingUid))
      .maybeSingle()

    let meetingId: string | null = existingMeeting?.id ?? null

    if (isCancelled && meetingId) {
      // Soft-handle cancel: update notes / leave row (or delete if you prefer)
      await supabase
        .from("meetings")
        .update({
          notes: `Cancelled via Cal.com (${triggerEvent})`,
          updated_at: new Date().toISOString(),
        })
        .eq("id", meetingId)
    } else if (meetingId) {
      // Update existing (reschedule or re-delivery)
      await supabase
        .from("meetings")
        .update({
          title,
          scheduled_at: startTime,
          duration_minutes: durationMinutes,
          location,
          client_id: clientId,
          updated_at: new Date().toISOString(),
        })
        .eq("id", meetingId)
    } else if (!isCancelled) {
      // Create new meeting
      const { data: newMeeting, error: meetingError } = await supabase
        .from("meetings")
        .insert({
          client_id: clientId,
          title,
          scheduled_at: startTime,
          duration_minutes: durationMinutes,
          location,
          type: "Cal.com",
          cal_com_booking_uid: String(bookingUid), // Cal.com booking uid stored here
          transcript_status: "none",
          notes: attendeeNames.length
            ? `Attendees: ${attendeeNames.join(", ")}`
            : null,
        })
        .select("id")
        .single()

      if (meetingError) {
        await supabase
          .from("webhook_events")
          .update({
            status: "failed",
            error_message: meetingError.message,
          })
          .eq("id", webhookEventId)

        throw new Error(`meeting insert failed: ${meetingError.message}`)
      }

      meetingId = newMeeting.id

      // Optional: create attendee rows
      if (Array.isArray(attendees) && attendees.length > 0 && meetingId) {
        const rows = attendees.map((a: any) => ({
          meeting_id: meetingId,
          name: a.name || a.email || "Guest",
          email: a.email || null,
          role: a.role || null,
          is_client: true,
        }))

        await supabase.from("meeting_attendees").insert(rows)
      }
    }

    // ---------------------------------------------------------
    // 7. Mark webhook processed
    // ---------------------------------------------------------
    await supabase
      .from("webhook_events")
      .update({
        status: "processed",
        related_meeting_id: meetingId,
        related_client_id: clientId,
        processed_at: new Date().toISOString(),
      })
      .eq("id", webhookEventId)

    return new Response(
      JSON.stringify({
        success: true,
        trigger: triggerEvent,
        webhook_event_id: webhookEventId,
        meeting_id: meetingId,
        client_id: clientId,
        cancelled: isCancelled,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("cal-com-webhook failed:", error)

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