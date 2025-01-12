import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import { useSession } from '@supabase/auth-helpers-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RecordButton } from './recording/RecordButton';

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const session = useSession();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (blob: Blob) => {
      const fileName = `${crypto.randomUUID()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      const { error: dbError } = await supabase
        .from('recordings')
        .insert({
          blob_url: publicUrl,
          user_id: session!.user.id,
        });

      if (dbError) throw dbError;

      return publicUrl;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordings'] });
      toast.success('Recording saved successfully');
    },
    onError: (error) => {
      console.error('Error saving recording:', error);
      toast.error('Failed to save recording');
    },
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        uploadMutation.mutate(blob);
        chunksRef.current = [];
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <RecordButton
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
      </div>
    </div>
  );
};