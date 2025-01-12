import React from 'react';
import { X, Pause } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordingInterfaceProps {
  isRecording: boolean;
  duration: string;
  onStop: () => void;
  onPause: () => void;
  onCancel: () => void;
}

export const RecordingInterface = ({
  isRecording,
  duration,
  onStop,
  onPause,
  onCancel,
}: RecordingInterfaceProps) => {
  return (
    <div className="fixed inset-x-0 top-0 bg-white dark:bg-gray-900 p-4 shadow-lg z-50 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
            <span className="ml-2">Cancel</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={onPause}
            className="text-gray-500 hover:text-gray-700"
          >
            <Pause className="h-5 w-5" />
            <span className="ml-2">Pause</span>
          </Button>

          <span className="text-sm font-mono">{duration}</span>

          <Button
            variant="destructive"
            size="sm"
            onClick={onStop}
            className="bg-red-500 hover:bg-red-600 text-white px-4"
          >
            stop recording
          </Button>
        </div>

        <div className="mt-4">
          <div className="waveform animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};