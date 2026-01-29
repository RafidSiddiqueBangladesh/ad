import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productName, productDescription, targetAudience, platform, tone } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
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
**Target Audience:** ${targetAudience}
**Platform:** ${platform}
**Tone:** ${tone}

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
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Usage limit reached. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    console.log("Streaming response from AI Gateway");

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Error in generate-ad function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
