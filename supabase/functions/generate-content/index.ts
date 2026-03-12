// Supabase Edge Function: generate-content
// Calls OpenAI with assembled brand prompt and returns structured content pieces

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const MODEL = 'gpt-4o'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not configured. Set it in Supabase Dashboard > Edge Functions > Secrets.')
    }

    const { prompt, request } = await req.json()

    if (!prompt) {
      throw new Error('Missing prompt in request body')
    }

    // Call OpenAI
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a content strategist AI. Return ONLY valid JSON arrays. No markdown, no explanation, just the JSON array of content pieces.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: 'json_object' },
      }),
    })

    if (!openaiResponse.ok) {
      const errBody = await openaiResponse.text()
      throw new Error(`OpenAI API error: ${openaiResponse.status} - ${errBody}`)
    }

    const completion = await openaiResponse.json()
    const rawContent = completion.choices?.[0]?.message?.content

    if (!rawContent) {
      throw new Error('No content returned from OpenAI')
    }

    // Parse the JSON response
    let parsed
    try {
      parsed = JSON.parse(rawContent)
    } catch {
      throw new Error(`Failed to parse OpenAI response as JSON: ${rawContent.substring(0, 200)}`)
    }

    // Normalize: handle both { pieces: [...] } and bare array
    const pieces = Array.isArray(parsed) ? parsed : (parsed.pieces || parsed.content || [])

    return new Response(
      JSON.stringify({
        pieces,
        usage: completion.usage,
        model: completion.model,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
