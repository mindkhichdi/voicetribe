import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { transcription } = await req.json()
    
    if (!transcription) {
      throw new Error('No transcription provided')
    }

    console.log('Generating summary for transcription:', transcription.substring(0, 100) + '...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that generates three different types of summaries from transcribed audio: a bullet point summary, a detailed summary, and a simple one-line summary. Format your response as JSON with three keys: bulletPoints, detailed, and simple.'
          },
          {
            role: 'user',
            content: `Generate three summaries for this transcription: ${transcription}`
          }
        ],
      }),
    })

    const result = await response.json()
    console.log('OpenAI API response:', result);

    const summaryText = result.choices[0].message.content
    console.log('Generated summary text:', summaryText);

    // Parse the JSON response from GPT
    const summaries = JSON.parse(summaryText)

    return new Response(
      JSON.stringify(summaries),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in generate-summary function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})