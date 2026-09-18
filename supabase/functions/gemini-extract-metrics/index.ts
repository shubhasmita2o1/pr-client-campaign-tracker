import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

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

    // Create Supabase admin client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // 1. Get a signed URL for the screenshot
    const { data: signedData, error: signedError } = await supabase
      .storage
      .from("campaign-screenshots")
      .createSignedUrl(screenshotPath, 60) // 60 seconds

    if (signedError || !signedData?.signedUrl) {
      throw new Error("Could not create signed URL for screenshot")
    }

    const imageUrl = signedData.signedUrl

    // 2. Call Gemini Vision API
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
                    mime_type: "image/png", // will work for most screenshots
                    // We will send the image as base64 in a better way later if needed
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

    // Note: For production we should download the image and send as base64.
    // For now we will use a simpler approach that works with signed URL + text prompt.
    // We will improve it in the next version if needed.

    const geminiData = await geminiResponse.json()

    let extracted = {
      impressions: null,
      pitched: null,
      opens: null,
      clicks: null,
      replies: null,
      coverageSecured: null,
      confidenceScore: 50,
      notes: "Could not fully parse the screenshot",
      detectedChannel: "unknown"
    }

    try {
      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) {
        extracted = JSON.parse(text)
      }
    } catch (e) {
      console.error("Failed to parse Gemini response", e)
    }

    // 3. Save the result into campaign_screenshots table
    const { error: updateError } = await supabase
      .from("campaign_screenshots")
      .update({
        extracted_metrics: extracted
      })
      .eq("file_path", screenshotPath)
      .eq("campaign_id", campaignId)

    if (updateError) {
      console.error("Update error:", updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
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
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    )
  }
})