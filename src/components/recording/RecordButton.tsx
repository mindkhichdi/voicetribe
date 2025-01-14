import React from 'react';
import { Mic, Square } from 'lucide-react';
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
        onClick={isRecording ? onStopRecording : onStartRecording}
        size="lg"
        className={`rounded-full ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-purple hover:bg-purple-vivid'
        } text-white px-6 animate-float`}
      >
        {isRecording ? (
          <div className="flex items-center space-x-2">
            <Square className="w-4 h-4" />
            <span>Stop</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>Record</span>
          </div>
        )}
      </Button>
    </div>
  );
};