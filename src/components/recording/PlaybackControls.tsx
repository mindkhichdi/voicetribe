import React from 'react';
import { Slider } from '../ui/slider';

interface PlaybackControlsProps {
  playbackSpeed: number;
  onSpeedChange: (value: number[]) => void;
}

export const PlaybackControls = ({ playbackSpeed, onSpeedChange }: PlaybackControlsProps) => {
  return (
    <div className="w-full max-w-md mx-auto glass rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium">Playback Speed: {playbackSpeed}x</span>
        <div className="flex-1">
          <Slider
            value={[playbackSpeed]}
            onValueChange={onSpeedChange}
            min={0.5}
            max={2}
            step={0.25}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};