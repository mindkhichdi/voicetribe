import React from 'react';
import { Mic } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordButtonProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export const RecordButton = ({ 
  isRecording, 
  onStartRecording, 
  onStopRecording 
}: RecordButtonProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex justify-center pb-8">
      <Button
        onClick={onStartRecording}
        size="lg"
        className="rounded-full bg-purple hover:bg-purple-vivid text-white px-6 animate-float"
      >
        <div className="flex items-center space-x-2">
          <Mic className="w-4 h-4" />
          <span>Record</span>
        </div>
      </Button>
    </div>
  );
};