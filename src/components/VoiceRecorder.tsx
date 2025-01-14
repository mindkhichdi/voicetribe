import React, { useState, useRef } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { RecordButton } from './recording/RecordButton';
import { RecordingInterface } from './recording/RecordingInterface';
import { RecordingActions } from './recording/RecordingActions';

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
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }

        // Get transcription
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe', {
          body: { audio: base64Audio }
        });

        if (transcriptionError) {
          console.error('Transcription error:', transcriptionError);
          throw new Error('Failed to transcribe audio');
        }

        // Upload to storage
        const fileName = `recording-${Date.now()}.webm`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('recordings')
          .upload(fileName, blob);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw new Error('Failed to upload recording');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('recordings')
          .getPublicUrl(fileName);

        // Save to database
        const { data: recordingData, error: dbError } = await supabase
          .from('recordings')
          .insert({
            blob_url: publicUrl,
            description: transcriptionData.text.split(' ').slice(0, 10).join(' ') + '...'
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
      };
    } catch (error) {
      console.error('Error processing recording:', error);
      toast.error('Failed to process recording');
    } finally {
      setIsProcessing(false);
    }
  };

  const discardRecording = () => {
    setAudioBlob(null);
  };

  return (
    <div className="space-y-4">
      {!audioBlob ? (
        <RecordButton
          isRecording={isRecording}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
        />
      ) : (
        <>
          <RecordingInterface
            audioBlob={audioBlob}
            isRecording={isRecording}
            onStop={stopRecording}
            onPause={() => {}}
            onCancel={discardRecording}
          />
          <RecordingActions
            onSave={() => processRecording(audioBlob)}
            onDiscard={discardRecording}
            isProcessing={isProcessing}
          />
        </>
      )}
    </div>
  );
};