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
      className={`rounded-full px-4 py-2 ${
        isRecording 
          ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' 
          : 'bg-black text-white hover:bg-black/90'
      }`}
    >
      {isRecording ? (
        <div className="flex items-center space-x-2">
          <Square className="w-4 h-4" />
          <span>Record</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Mic className="w-4 h-4" />
          <span>Record</span>
        </div>
      )}
    </Button>
  );
};