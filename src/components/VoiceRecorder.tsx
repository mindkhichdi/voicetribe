import React, { useState, useRef } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { X, RotateCcw } from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: any) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = useSupabaseClient();
  const user = useUser();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
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

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (shouldSave) {
        await new Promise(resolve => setTimeout(resolve, 100));
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        await processRecording(audioBlob);
      } else {
        audioChunks.current = [];
        setAudioBlob(null);
        setRecordingTime(0);
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

      console.log('Recording saved successfully:', recordingData);
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
        <div className="bg-purple rounded-xl p-6 w-96 text-white shadow-lg animate-fade-in">
          <div className="flex flex-col items-center space-y-4">
            <div className="text-4xl font-bold font-display">
              {formatTime(recordingTime)}
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold">Say Something Awesome!</h3>
              <p className="text-sm text-purple-light">
                What are your plans for today?<br />
                Don't be shy to express your thoughts!
              </p>
            </div>

            <div className="w-full h-16 relative overflow-hidden">
              <div className="waveform absolute inset-0"></div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => stopRecording(false)}
                className="rounded-full hover:bg-purple-light/20"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => stopRecording(true)}
                className="rounded-full w-12 h-12 border-2 border-white hover:bg-purple-light/20"
              >
                <div className="w-4 h-4 bg-white rounded-sm" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => stopRecording(false)}
                className="rounded-full hover:bg-purple-light/20"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
