import { createClient } from "npm:@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
}

// Gemini model
const model = "gemini-3.6-flash"

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    })
  }

  try {
    // Only allow POST
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({
          error: "Method not allowed. Use POST.",
        }),
        {
          status: 405,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    // ---------------------------------------------------------
    // 1. Read request body
    // ---------------------------------------------------------

    const body = await req.json()

    const screenshotPath = body?.screenshotPath
    const campaignId = body?.campaignId

    console.log("Starting metric extraction")
    console.log("Screenshot path:", screenshotPath)
    console.log("Campaign ID:", campaignId)

    if (!screenshotPath || !campaignId) {
      return new Response(
        JSON.stringify({
          error: "screenshotPath and campaignId are required",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      )
    }

    // ---------------------------------------------------------
    // 2. Get environment variables
    // ---------------------------------------------------------

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
    }

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set")
    }

    if (!SUPABASE_URL) {
      throw new Error("SUPABASE_URL is not set")
    }

    if (!SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
    }

    // ---------------------------------------------------------
    // 3. Create Supabase admin client
    // ---------------------------------------------------------

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
    )

    // ---------------------------------------------------------
    // 4. Download screenshot from Supabase Storage
    // ---------------------------------------------------------

    console.log(
      `Downloading ${screenshotPath} from campaign-screenshots`,
    )

    const { data: fileBlob, error: downloadError } =
      await supabase.storage
        .from("campaign-screenshots")
        .download(screenshotPath)

    if (downloadError || !fileBlob) {
      throw new Error(
        `Could not download screenshot: ${
          downloadError?.message ?? "unknown error"
        }`,
      )
    }

    console.log(
      `Screenshot downloaded successfully (${fileBlob.size} bytes)`,
    )

    // ---------------------------------------------------------
    // 5. Determine MIME type
    // ---------------------------------------------------------

    const mimeType =
      fileBlob.type && fileBlob.type.startsWith("image/")
        ? fileBlob.type
        : "image/png"

    console.log("MIME type:", mimeType)

    // ---------------------------------------------------------
    // 6. Convert image to Base64
    // ---------------------------------------------------------

    const arrayBuffer = await fileBlob.arrayBuffer()
    const base64Image = encodeBase64(arrayBuffer)

    console.log(
      `Image converted to Base64 (${base64Image.length} characters)`,
    )

    // ---------------------------------------------------------
    // 7. Gemini prompt
    // ---------------------------------------------------------

    const prompt = `
You are an expert at reading marketing and PR campaign dashboards from screenshots.

Analyze the provided screenshot carefully.

Extract the following metrics if they are visible:

- impressions
- pitched
- opens
- clicks
- replies
- coverageSecured

Rules:

1. Only extract values that are actually visible in the screenshot.
2. If a metric is not visible or cannot be determined reliably, return null.
3. Do not guess values.
4. Numbers should be returned as numbers, not strings.
5. confidenceScore must be a number between 0 and 100.
6. detectedChannel should be one of:
   - email
   - twitter
   - linkedin
   - other
   - unknown
7. notes should briefly explain what was detected.

Return ONLY a valid JSON object.

The JSON must have exactly this structure:

{
  "impressions": number or null,
  "pitched": number or null,
  "opens": number or null,
  "clicks": number or null,
  "replies": number or null,
  "coverageSecured": number or null,
  "confidenceScore": number,
  "notes": "short explanation",
  "detectedChannel": "email / twitter / linkedin / other / unknown"
}

Do not add markdown.
Do not add \`\`\`json.
Do not add explanations outside the JSON.
`

    // ---------------------------------------------------------
    // 8. Call Gemini Vision API
    // ---------------------------------------------------------

    console.log(`Calling Gemini model: ${model}`)

    const geminiUrl =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`

    const geminiRequestBody = {
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Image,
              },
            },
          ],
        },
      ],
    }

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geminiRequestBody),
    })

    // ---------------------------------------------------------
    // 9. Handle Gemini API errors
    // ---------------------------------------------------------

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text()

      console.error(
        `Gemini API error ${geminiResponse.status}:`,
        errText,
      )

      throw new Error(
        `Gemini API error (${geminiResponse.status}): ${errText}`,
      )
    }

    // ---------------------------------------------------------
    // 10. Read Gemini response
    // ---------------------------------------------------------

    const geminiData = await geminiResponse.json()

    console.log(
      "Gemini response received successfully",
    )

    // ---------------------------------------------------------
    // 11. Default extracted metrics
    // ---------------------------------------------------------

    let extracted = {
      impressions: null as number | null,
      pitched: null as number | null,
      opens: null as number | null,
      clicks: null as number | null,
      replies: null as number | null,
      coverageSecured: null as number | null,
      confidenceScore: 0,
      notes: "Could not fully parse the screenshot",
      detectedChannel: "unknown",
    }

    let parseSucceeded = false

    // ---------------------------------------------------------
    // 12. Extract text from Gemini response
    // ---------------------------------------------------------

    try {
      const text =
        geminiData?.candidates?.[0]?.content?.parts
          ?.map((part: any) => part?.text ?? "")
          .join("")
          .trim()

      console.log("Gemini raw text:", text)

      if (!text) {
        throw new Error("Gemini returned an empty response")
      }

      // -------------------------------------------------------
      // Remove markdown code fences if Gemini adds them
      // -------------------------------------------------------

      let cleanedText = text

      cleanedText = cleanedText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim()

      // -------------------------------------------------------
      // Parse JSON
      // -------------------------------------------------------

      const parsed = JSON.parse(cleanedText)

      // -------------------------------------------------------
      // Normalize values
      // -------------------------------------------------------

      extracted = {
        impressions:
          typeof parsed.impressions === "number"
            ? parsed.impressions
            : null,

        pitched:
          typeof parsed.pitched === "number"
            ? parsed.pitched
            : null,

        opens:
          typeof parsed.opens === "number"
            ? parsed.opens
            : null,

        clicks:
          typeof parsed.clicks === "number"
            ? parsed.clicks
            : null,

        replies:
          typeof parsed.replies === "number"
            ? parsed.replies
            : null,

        coverageSecured:
          typeof parsed.coverageSecured === "number"
            ? parsed.coverageSecured
            : null,

        confidenceScore:
          typeof parsed.confidenceScore === "number"
            ? Math.max(
                0,
                Math.min(100, parsed.confidenceScore),
              )
            : 0,

        notes:
          typeof parsed.notes === "string"
            ? parsed.notes
            : "Metrics extracted from screenshot",

        detectedChannel:
          typeof parsed.detectedChannel === "string"
            ? parsed.detectedChannel
            : "unknown",
      }

      parseSucceeded = true

      console.log(
        "Metrics extracted successfully:",
        JSON.stringify(extracted),
      )
    } catch (parseError) {
      console.error(
        "Failed to parse Gemini response:",
        parseError,
      )

      console.error(
        "Gemini response:",
        JSON.stringify(geminiData),
      )
    }

    // ---------------------------------------------------------
    // 13. Save metrics to campaign_screenshots
    // ---------------------------------------------------------

    console.log(
      "Saving extracted metrics to campaign_screenshots",
    )

    const { data: updatedRows, error: updateError } =
      await supabase
        .from("campaign_screenshots")
        .update({
          extracted_metrics: extracted,
        })
        .eq("file_path", screenshotPath)
        .eq("campaign_id", campaignId)
        .select("id")

    if (updateError) {
      throw new Error(
        `Failed to save extracted metrics: ${updateError.message}`,
      )
    }

    if (!updatedRows || updatedRows.length === 0) {
      throw new Error(
        `No campaign_screenshots row matched file_path="${screenshotPath}" campaign_id="${campaignId}"`,
      )
    }

    console.log(
      `Metrics saved successfully. Updated rows: ${updatedRows.length}`,
    )

    // ---------------------------------------------------------
    // 14. Return success response
    // ---------------------------------------------------------

    return new Response(
      JSON.stringify({
        success: true,
        parsed: parseSucceeded,
        metrics: extracted,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  } catch (error) {
    // ---------------------------------------------------------
    // Global error handler
    // ---------------------------------------------------------

    console.error("Function failed:", error)

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error
            ? error.message
            : String(error),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    )
  }
})

// -------------------------------------------------------------
// Safe Base64 encoder for large images
// -------------------------------------------------------------

function encodeBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)

  const chunkSize = 0x8000

  let binary = ""

  for (
    let i = 0;
    i < bytes.length;
    i += chunkSize
  ) {
    const chunk = bytes.subarray(
      i,
      Math.min(i + chunkSize, bytes.length),
    )

    binary += String.fromCharCode(...chunk)
  }

  return btoa(binary)
}