
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
    const { audioUrl, recordingId } = await req.json()
    
    if (!audioUrl) {
      throw new Error('No audio URL provided')
    }

    console.log('Transcribing audio from URL:', audioUrl);

    // Fetch the audio file content
    const audioResponse = await fetch(audioUrl);
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file');
    }
    
    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });

    // Prepare form data for ElevenLabs API
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    // Call ElevenLabs Speech-to-Text API
    const elevenlabsResponse = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
      method: 'POST',
      headers: {
        'xi-api-key': Deno.env.get('ELEVEN_LABS_API_KEY') || '',
      },
      body: formData,
    });

    if (!elevenlabsResponse.ok) {
      const errorData = await elevenlabsResponse.text();
      console.error('ElevenLabs API error:', errorData);
      throw new Error(`ElevenLabs API error: ${elevenlabsResponse.status}`);
    }

    const transcriptionResult = await elevenlabsResponse.json();
    const transcriptionText = transcriptionResult.text;
    
    console.log('Transcription completed:', transcriptionText.substring(0, 100) + '...');

    // Update the recording in the database with the transcription
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const updateResponse = await fetch(`${supabaseUrl}/rest/v1/recordings?id=eq.${recordingId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal',
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
      body: JSON.stringify({
        description: transcriptionText,
      }),
    });

    if (!updateResponse.ok) {
      throw new Error(`Failed to update recording: ${updateResponse.status}`);
    }

    console.log('Recording description updated with transcription');

    return new Response(
      JSON.stringify({ 
        transcription: transcriptionText,
        message: 'Transcription completed and saved successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-audio function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
