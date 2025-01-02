import React, { useState, useRef } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

export const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ blob: Blob; timestamp: Date }[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setRecordings(prev => [...prev, { blob, timestamp: new Date() }]);
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
      toast.success('Recording saved');
    }
  };

  const deleteRecording = (index: number) => {
    setRecordings(prev => prev.filter((_, i) => i !== index));
    toast.success('Recording deleted');
  };

  const playRecording = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="flex justify-center mb-8">
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          className={`rounded-full p-8 ${
            isRecording 
              ? 'bg-accent hover:bg-accent/90 animate-recording-pulse' 
              : 'bg-primary hover:bg-primary/90'
          }`}
        >
          {isRecording ? (
            <Square className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
        </Button>
      </div>

      <div className="space-y-4">
        {recordings.map((recording, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-secondary rounded-lg"
          >
            <button
              onClick={() => playRecording(recording.blob)}
              className="flex items-center space-x-4 hover:opacity-80 transition-opacity"
            >
              <span className="text-sm font-medium">
                {recording.timestamp.toLocaleTimeString()}
              </span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteRecording(index)}
              className="hover:text-accent"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};