import React from 'react';
import { Button } from '../ui/button';
import { X, Pause, Check } from 'lucide-react';

interface PlaybackControlsProps {
  onCancel: () => void;
  onPause: () => void;
  onDone: () => void;
  isRecording: boolean;
  duration: string;
}

export const PlaybackControls = ({ onCancel, onPause, onDone, isRecording, duration }: PlaybackControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="relative">
        <div className="absolute top-2 right-2 text-red-500">{duration}</div>
        <div className="waveform h-12 w-full"></div>
      </div>
      
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={onCancel}
          variant="ghost"
          className="flex-1 bg-red-50 text-red-500 hover:bg-red-100"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        
        <Button
          onClick={onPause}
          variant="ghost"
          className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <Pause className="w-4 h-4 mr-2" />
          Pause
        </Button>
        
        <Button
          onClick={onDone}
          variant="ghost"
          className="flex-1 bg-green-50 text-green-500 hover:bg-green-100"
        >
          <Check className="w-4 h-4 mr-2" />
          Done
        </Button>
      </div>
    </div>
  );
};