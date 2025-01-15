import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';

interface RecordingInterfaceProps {
  audioBlob: Blob | null;
  isRecording?: boolean;
  onStop?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
}

export const RecordingInterface = ({
  isRecording,
  onStop,
  onPause,
  onCancel,
}: RecordingInterfaceProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 flex items-center justify-center pb-8">
      <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg flex items-center space-x-4 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
          className="text-purple hover:text-purple-vivid"
        >
          <X className="h-4 w-4" />
          <span className="ml-2">Cancel</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          onClick={onStop}
          className="bg-purple hover:bg-purple-vivid text-white"
        >
          Stop recording
        </Button>
      </div>
    </div>
  );
};