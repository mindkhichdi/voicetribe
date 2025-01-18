import React, { useState, useRef } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { X } from 'lucide-react';

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
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  const stopRecording = async (shouldSave: boolean = true) => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      if (shouldSave) {
        // Wait for the ondataavailable event to finish
        await new Promise(resolve => setTimeout(resolve, 100));
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processRecording(audioBlob);
      } else {
        // Clear the audio chunks and blob if we're canceling
        audioChunks.current = [];
        setAudioBlob(null);
        toast.info('Recording cancelled');
      }
    }
  };

  const processRecording = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      if (!user) {
        throw new Error('User must be logged in to record');
      }

      const { count, error: countError } = await supabase
        .from('recordings')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) {
        throw new Error('Failed to get recording count');
      }

      const recordingNumber = (count || 0) + 1;
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
          description: `Recording ${recordingNumber}`,
          title: `Recording ${recordingNumber}`,
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
    <div className="fixed inset-x-0 bottom-0 flex justify-center pb-8">
      {!isRecording ? (
        <Button 
          size="lg"
          className="rounded-full bg-purple hover:bg-purple-vivid text-white px-6 animate-float"
          onClick={startRecording}
        >
          start recording
        </Button>
      ) : (
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => stopRecording(false)}
            className="text-purple hover:text-purple-vivid"
          >
            <X className="h-4 w-4" />
            <span className="ml-2">Cancel</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => stopRecording(true)}
            className="bg-purple hover:bg-purple-vivid text-white"
          >
            Stop recording
          </Button>
        </div>
      )}
    </div>
  );
};