import React from 'react';
import { X, Pause } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordingInterfaceProps {
  audioBlob: Blob | null;
  isRecording?: boolean;
  duration?: string;
  onStop?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
}

export const RecordingInterface = ({
  isRecording,
  duration = "00:00/01:00",
  onStop,
  onPause,
  onCancel,
}: RecordingInterfaceProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex items-center justify-center pb-8">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex items-center gap-4 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4" />
          <span className="ml-2">Cancel</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onPause}
          className="text-gray-500 hover:text-gray-700"
        >
          <Pause className="h-4 w-4" />
          <span className="ml-2">Pause</span>
        </Button>

        <span className="text-sm font-mono">{duration}</span>

        <Button
          variant="default"
          size="sm"
          onClick={onStop}
          className="bg-black hover:bg-black/90 text-white"
        >
          Stop recording
        </Button>
      </div>
    </div>
  );
};