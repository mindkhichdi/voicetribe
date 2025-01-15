import React, { useState, useRef } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { RecordingInterface } from './recording/RecordingInterface';
import { Button } from './ui/button';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: any) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const supabase = useSupabaseClient();
  const user = useUser();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        await processRecording(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processRecording = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      if (!user) {
        throw new Error('User must be logged in to record');
      }

      const fileName = `recording-${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(fileName, blob);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload recording');
      }

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(fileName);

      const { data: recordingData, error: dbError } = await supabase
        .from('recordings')
        .insert({
          blob_url: publicUrl,
          description: 'New Recording',
          user_id: user.id
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save recording');
      }

      onRecordingComplete(recordingData);
      setAudioBlob(null);
      toast.success('Recording saved successfully');
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      {isRecording ? (
        <RecordingInterface
          audioBlob={audioBlob}
          isRecording={isRecording}
          onStop={stopRecording}
          onPause={() => {}}
          onCancel={() => {
            stopRecording();
            setAudioBlob(null);
          }}
        />
      ) : (
        <Button 
          size="lg"
          className="fixed bottom-8 right-8 rounded-full bg-purple hover:bg-purple-vivid text-white px-6 animate-float"
          onClick={startRecording}
        >
          start recording
        </Button>
      )}
    </div>
  );
};