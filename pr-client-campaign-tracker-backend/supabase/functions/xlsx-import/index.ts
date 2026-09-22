import { createClient } from "npm:@supabase/supabase-js@2"
import * as XLSX from "npm:xlsx@0.18.5"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

type ImportResult = {
  sheet: string
  success: number
  errors: { row: number; message: string }[]
}

function norm(v: unknown): string {
  if (v === null || v === undefined) return ""
  return String(v).trim()
}

function pick(row: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const found = Object.keys(row).find(
      (h) => h.toLowerCase().replace(/\s+/g, "_") === k.toLowerCase(),
    )
    if (found && norm(row[found])) return norm(row[found])
  }
  // also try exact header match ignoring case
  for (const k of keys) {
    const found = Object.keys(row).find(
      (h) => h.toLowerCase() === k.toLowerCase(),
    )
    if (found && norm(row[found])) return norm(row[found])
  }
  return ""
}

function parseDate(v: string): string | null {
  if (!v) return null
  // Excel serial number
  if (/^\d+(\.\d+)?$/.test(v)) {
    const n = Number(v)
    if (n > 20000 && n < 80000) {
      const epoch = new Date(Date.UTC(1899, 11, 30))
      const d = new Date(epoch.getTime() + n * 86400000)
      return d.toISOString()
    }
  }
  const d = new Date(v)
  if (!isNaN(d.getTime())) return d.toISOString()
  return null
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
    const body = await req.json()
    const filePath = body?.filePath || body?.file_path
    const fileName = body?.fileName || body?.file_name || filePath

    if (!filePath) {
      return new Response(
        JSON.stringify({
          error: "filePath is required (path inside the 'imports' storage bucket)",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      )
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // ---------------------------------------------------------
    // 1. Create import batch
    // ---------------------------------------------------------
    const { data: batch, error: batchError } = await supabase
      .from("import_batches")
      .insert({
        source: "xlsx",
        file_name: fileName,
        file_path: filePath,
        status: "processing",
        started_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (batchError) {
      throw new Error(`import_batches insert failed: ${batchError.message}`)
    }

    const batchId = batch.id

    // ---------------------------------------------------------
    // 2. Download file from storage
    // ---------------------------------------------------------
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from("imports")
      .download(filePath)

    if (downloadError || !fileBlob) {
      await supabase
        .from("import_batches")
        .update({
          status: "failed",
          error_log: [{ message: downloadError?.message || "download failed" }],
          completed_at: new Date().toISOString(),
        })
        .eq("id", batchId)

      throw new Error(
        `Could not download file: ${downloadError?.message ?? "unknown"}`,
      )
    }

    const buffer = await fileBlob.arrayBuffer()
    const workbook = XLSX.read(buffer, { type: "array", cellDates: true })

    const results: ImportResult[] = []
    let totalRows = 0
    let successRows = 0
    let errorRows = 0
    const allErrors: { sheet: string; row: number; message: string }[] = []

    // ---------------------------------------------------------
    // 3. Import CLIENTS sheet (if present)
    // ---------------------------------------------------------
    const clientSheetName = workbook.SheetNames.find((n) =>
      /client/i.test(n),
    )

    if (clientSheetName) {
      const sheet = workbook.Sheets[clientSheetName]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      })
      totalRows += rows.length
      const sheetResult: ImportResult = {
        sheet: clientSheetName,
        success: 0,
        errors: [],
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const name = pick(row, ["name", "client", "client_name", "client name"])
        const company = pick(row, [
          "company",
          "company_name",
          "organisation",
          "organization",
        ]) || name
        const statusRaw = pick(row, ["status"]).toLowerCase()
        const status = ["active", "prospect", "churned"].includes(statusRaw)
          ? statusRaw
          : "prospect"
        const industry = pick(row, ["industry", "sector"]) || null
        const tierRaw = pick(row, ["tier"])
        const tier = ["Enterprise", "Growth", "Boutique"].includes(tierRaw)
          ? tierRaw
          : null
        const primary_contact_name =
          pick(row, [
            "primary_contact_name",
            "contact_name",
            "contact",
            "primary contact",
          ]) || null
        const primary_contact_email =
          pick(row, [
            "primary_contact_email",
            "email",
            "contact_email",
          ]) || null
        const website = pick(row, ["website", "url", "site"]) || null
        const notes = pick(row, ["notes", "note", "comments"]) || null

        if (!name) {
          const msg = "Missing client name"
          sheetResult.errors.push({ row: i + 2, message: msg })
          allErrors.push({ sheet: clientSheetName, row: i + 2, message: msg })
          errorRows++
          continue
        }

        // Upsert-ish: skip if same name+company already exists
        const { data: existing } = await supabase
          .from("clients")
          .select("id")
          .ilike("name", name)
          .ilike("company", company)
          .maybeSingle()

        if (existing) {
          sheetResult.success++
          successRows++
          continue
        }

        const { error } = await supabase.from("clients").insert({
          name,
          company,
          status,
          industry,
          tier,
          primary_contact_name,
          primary_contact_email,
          website,
          notes,
        })

        if (error) {
          sheetResult.errors.push({ row: i + 2, message: error.message })
          allErrors.push({
            sheet: clientSheetName,
            row: i + 2,
            message: error.message,
          })
          errorRows++
        } else {
          sheetResult.success++
          successRows++
        }
      }

      results.push(sheetResult)
    }

    // ---------------------------------------------------------
    // 4. Import MEETINGS sheet (if present)
    // ---------------------------------------------------------
    const meetingSheetName = workbook.SheetNames.find((n) =>
      /meeting|call|appointment/i.test(n),
    )

    if (meetingSheetName) {
      const sheet = workbook.Sheets[meetingSheetName]
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      })
      totalRows += rows.length
      const sheetResult: ImportResult = {
        sheet: meetingSheetName,
        success: 0,
        errors: [],
      }

      // Cache clients by name for faster lookup
      const { data: allClients } = await supabase
        .from("clients")
        .select("id, name, company")

      const findClientId = (hint: string): string | null => {
        if (!hint || !allClients) return null
        const h = hint.toLowerCase()
        const match = allClients.find(
          (c) =>
            c.name?.toLowerCase() === h ||
            c.company?.toLowerCase() === h ||
            c.name?.toLowerCase().includes(h) ||
            c.company?.toLowerCase().includes(h),
        )
        return match?.id ?? null
      }

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        const title =
          pick(row, ["title", "meeting", "meeting_title", "subject"]) ||
          "Imported meeting"
        const clientHint = pick(row, [
          "client",
          "client_name",
          "company",
          "account",
        ])
        const scheduledRaw = pick(row, [
          "scheduled_at",
          "date",
          "datetime",
          "start",
          "start_time",
          "meeting_date",
        ])
        const scheduled_at = parseDate(scheduledRaw)
        const durationRaw = pick(row, [
          "duration",
          "duration_minutes",
          "mins",
        ])
        const duration_minutes = durationRaw
          ? Number(durationRaw) || 30
          : 30
        const type = pick(row, ["type", "meeting_type"]) || null
        const location = pick(row, ["location", "venue", "link"]) || null
        const notes = pick(row, ["notes", "note", "comments"]) || null

        if (!scheduled_at) {
          const msg = "Missing or invalid meeting date"
          sheetResult.errors.push({ row: i + 2, message: msg })
          allErrors.push({ sheet: meetingSheetName, row: i + 2, message: msg })
          errorRows++
          continue
        }

        let clientId = findClientId(clientHint)

        if (!clientId) {
          // fallback: first active client
          const { data: fallback } = await supabase
            .from("clients")
            .select("id")
            .eq("status", "active")
            .limit(1)
            .maybeSingle()
          clientId = fallback?.id ?? null
        }

        if (!clientId) {
          const msg = "No client found for meeting"
          sheetResult.errors.push({ row: i + 2, message: msg })
          allErrors.push({ sheet: meetingSheetName, row: i + 2, message: msg })
          errorRows++
          continue
        }

        const { error } = await supabase.from("meetings").insert({
          client_id: clientId,
          title,
          scheduled_at,
          duration_minutes,
          type,
          location,
          notes,
          transcript_status: "none",
        })

        if (error) {
          sheetResult.errors.push({ row: i + 2, message: error.message })
          allErrors.push({
            sheet: meetingSheetName,
            row: i + 2,
            message: error.message,
          })
          errorRows++
        } else {
          sheetResult.success++
          successRows++
        }
      }

      results.push(sheetResult)
    }

    // ---------------------------------------------------------
    // 5. Finalize batch
    // ---------------------------------------------------------
    const status =
      errorRows === 0
        ? "completed"
        : successRows === 0
        ? "failed"
        : "partial"

    await supabase
      .from("import_batches")
      .update({
        status,
        total_rows: totalRows,
        success_rows: successRows,
        error_rows: errorRows,
        error_log: allErrors,
        completed_at: new Date().toISOString(),
      })
      .eq("id", batchId)

    return new Response(
      JSON.stringify({
        success: true,
        batch_id: batchId,
        status,
        total_rows: totalRows,
        success_rows: successRows,
        error_rows: errorRows,
        sheets: results,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("xlsx-import failed:", error)
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