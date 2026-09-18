import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

const GEMINI_MODEL = "gemini-2.0-flash"

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { screenshotPath, campaignId } = await req.json()

    if (!screenshotPath || !campaignId) {
      return new Response(
        JSON.stringify({ error: "screenshotPath and campaignId are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set")
    }

    // Create Supabase admin client (bypasses RLS — this function runs server-side only)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Download the screenshot directly from storage.
    //    (A signed URL is not usable here — Gemini's inline_data needs actual
    //    base64 bytes, not a link it can fetch itself.)
    const { data: fileBlob, error: downloadError } = await supabase
      .storage
      .from("campaign-screenshots")
      .download(screenshotPath)

    if (downloadError || !fileBlob) {
      throw new Error(`Could not download screenshot: ${downloadError?.message ?? "unknown error"}`)
    }

    // Detect mime type from the blob itself rather than assuming PNG
    const mimeType = fileBlob.type && fileBlob.type.startsWith("image/")
      ? fileBlob.type
      : "image/png"

    const arrayBuffer = await fileBlob.arrayBuffer()
    const base64Image = encodeBase64(arrayBuffer)

    // 2. Call Gemini Vision API with the actual image bytes attached
    const prompt = `
You are an expert at reading marketing / PR campaign dashboards from screenshots.

Extract the following metrics from the image (if available):
- impressions
- pitched
- opens
- clicks
- replies
- coverageSecured

Return ONLY a valid JSON object in this exact format:
{
  "impressions": number or null,
  "pitched": number or null,
  "opens": number or null,
  "clicks": number or null,
  "replies": number or null,
  "coverageSecured": number or null,
  "confidenceScore": number between 0-100,
  "notes": "short explanation of what you found",
  "detectedChannel": "email / twitter / linkedin / other / unknown"
}

Do not add any extra text outside the JSON.
`

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: base64Image,
                  }
                }
              ]
            }
          ],
          generationConfig: {
            response_mime_type: "application/json"
          }
        })
      }
    )

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()
      throw new Error(`Gemini API error (${geminiResponse.status}): ${errText}`)
    }

    const geminiData = await geminiResponse.json()

    let extracted = {
      impressions: null,
      pitched: null,
      opens: null,
      clicks: null,
      replies: null,
      coverageSecured: null,
      confidenceScore: 0,
      notes: "Could not fully parse the screenshot",
      detectedChannel: "unknown"
    }

    let parseSucceeded = false
    try {
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        extracted = JSON.parse(text)
        parseSucceeded = true
      }
    } catch (e) {
      console.error("Failed to parse Gemini response", e, geminiData)
    }

    // 3. Save the result into campaign_screenshots table
    //    .select() added so a zero-row match (bad path/id) is caught instead of
    //    silently returning success with nothing actually saved.
    const { data: updatedRows, error: updateError } = await supabase
      .from("campaign_screenshots")
      .update({
        extracted_metrics: extracted
      })
      .eq("file_path", screenshotPath)
      .eq("campaign_id", campaignId)
      .select("id")

    if (updateError) {
      throw new Error(`Failed to save extracted metrics: ${updateError.message}`)
    }
    if (!updatedRows || updatedRows.length === 0) {
      throw new Error(
        `No campaign_screenshots row matched file_path="${screenshotPath}" campaign_id="${campaignId}"`
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        parsed: parseSucceeded,
        metrics: extracted
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    )

  } catch (error) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : String(error) }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})

// Encode an ArrayBuffer to base64 in chunks, to avoid call-stack limits on
// large images that String.fromCharCode(...bytes) would hit.
function encodeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  const chunkSize = 0x8000
  let binary = ""
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}