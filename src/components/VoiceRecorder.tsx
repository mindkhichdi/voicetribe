import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, Square } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

interface VoiceRecorderProps {
  onRecordingComplete: (recording: { url: string; blob: Blob }) => void;
}

export const VoiceRecorder = ({ onRecordingComplete }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = useSupabaseClient();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        onRecordingComplete({ url, blob });

        // Clean up
        stream.getTracks().forEach(track => track.stop());
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-8 right-8 flex flex-col items-center justify-center z-50">
      {!isRecording ? (
        <Button
          className="rounded-full bg-purple hover:bg-purple-vivid text-white px-6 animate-float"
          onClick={startRecording}
        >
          Start recording
        </Button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div className="glass rounded-full p-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-20 animate-recording-pulse" />
              <Button
                size="icon"
                className="bg-red-500 hover:bg-red-600 rounded-full relative z-10"
                onClick={stopRecording}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <span className="text-sm font-mono bg-background/80 px-2 py-1 rounded">
            {formatTime(recordingTime)}
          </span>
        </div>
      )}
    </div>
  );
};