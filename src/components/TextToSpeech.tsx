
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const TextToSpeech = ({ onRecordingComplete }: { onRecordingComplete: (recording: any) => void }) => {
  const [text, setText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();

  const generateSpeech = async () => {
    if (!text.trim()) {
      toast.error('Please enter some text');
      return;
    }

    setIsGenerating(true);

    try {
      const { data: response, error: functionError } = await supabase.functions.invoke('text-to-speech', {
        body: { text: text.trim() }
      });

      if (functionError) throw functionError;
      if (!response.audioContent) throw new Error('No audio content received');

      // Convert base64 to blob
      const binaryStr = atob(response.audioContent);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });

      // Upload to Supabase Storage
      const fileName = `tts-${Date.now()}.mp3`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, audioBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      // Save to database
      const { data: recordingData, error: dbError } = await supabase
        .from('recordings')
        .insert({
          blob_url: publicUrl,
          title: `TTS: ${text.slice(0, 30)}...`,
          description: text,
          user_id: user?.id
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast.success('Speech generated successfully');
      onRecordingComplete(recordingData);
      setText('');
    } catch (error) {
      console.error('Error generating speech:', error);
      toast.error('Failed to generate speech');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 flex justify-center pb-8">
      <div className="w-full max-w-2xl px-4">
        <div className="bg-purple rounded-xl p-6 text-white shadow-lg">
          <div className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to convert to speech..."
              className="w-full h-24 bg-white/10 border-none text-white placeholder:text-white/50 focus:ring-white/30"
            />
            <Button
              onClick={generateSpeech}
              disabled={isGenerating}
              className="w-full bg-white text-purple hover:bg-white/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Speech...
                </>
              ) : (
                'Generate Speech'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
