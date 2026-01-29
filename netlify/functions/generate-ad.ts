import { Handler } from "@netlify/functions";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { productName, productDescription, targetAudience, platform, tone } = JSON.parse(
      event.body || "{}"
    );

    if (!productName || !productDescription) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing required fields: productName, productDescription" }),
      };
    }

    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating ad for:", { productName, platform, tone });

    const systemPrompt = `You are an expert digital marketing copywriter who creates high-converting ad copy. 
You specialize in creating ads for Google Ads, Facebook/Instagram, and other platforms.
Always output in a structured format with clear sections.
Be creative, persuasive, and follow best practices for the specified platform.`;

    const userPrompt = `Create compelling ad copy for the following:

**Product/Service:** ${productName}
**Description:** ${productDescription}
**Target Audience:** ${targetAudience || "General audience"}
**Platform:** ${platform || "Google Ads"}
**Tone:** ${tone || "Professional"}

Generate the following ad components:

1. **Primary Headlines** (3 variations, max 30 chars each for Google, 40 for social)
2. **Secondary Headlines** (2 variations)
3. **Primary Text/Description** (compelling body copy, 90 chars for Google, 125 for social)
4. **Call-to-Action** (3 options)
5. **Hashtags** (5 relevant hashtags if for social media)

Format the output clearly with headers and bullet points. Make each variation unique and test different angles (emotional, rational, urgency-based).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("AI Gateway error:", response.status, errorData);

      if (response.status === 429) {
        return {
          statusCode: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
        };
      }

      if (response.status === 402) {
        return {
          statusCode: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          body: JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
        };
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content || "";

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        content: generatedContent,
      }),
    };
  } catch (error) {
    console.error("Error in generate-ad function:", error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
