import React from 'react';
import { Mic, Square } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordButton = ({ isRecording, onStartRecording, onStopRecording }: RecordButtonProps) => {
  return (
    <Button
      onClick={isRecording ? onStopRecording : onStartRecording}
      className={`rounded-full p-8 transition-all duration-300 ${
        isRecording 
          ? 'bg-gradient-to-r from-accent to-primary animate-recording-pulse' 
          : 'bg-gradient-to-r from-primary to-secondary hover:opacity-90'
      }`}
    >
      {isRecording ? (
        <Square className="w-8 h-8" />
      ) : (
        <Mic className="w-8 h-8" />
      )}
    </Button>
  );
};