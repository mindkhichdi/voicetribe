import React from 'react';
import { Slider } from '../ui/slider';

interface PlaybackControlsProps {
  playbackSpeed: number;
  onSpeedChange: (value: number[]) => void;
}

export const PlaybackControls = ({ playbackSpeed, onSpeedChange }: PlaybackControlsProps) => {
  return (
    <div className="mb-6 glass rounded-lg p-4">
      <p className="text-sm font-medium mb-2">Playback Speed</p>
      <Slider
        defaultValue={[1]}
        max={2}
        min={0.5}
        step={0.25}
        value={[playbackSpeed]}
        onValueChange={onSpeedChange}
        className="w-48 mx-auto"
      />
      <div className="text-xs text-center mt-1">{playbackSpeed}x</div>
    </div>
  );
};