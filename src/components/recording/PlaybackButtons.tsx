import React from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '../ui/button';

interface PlaybackButtonsProps {
  isPlaying: boolean;
  playbackSpeed: number;
  onPlay: () => void;
  onSpeedChange: (value: number[]) => void;
}

export const PlaybackButtons = ({
  isPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
}: PlaybackButtonsProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={onPlay}
        className={`hover:bg-primary/10 ${isPlaying ? 'text-primary' : ''}`}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      {isPlaying && (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSpeedChange([Math.max(0.5, playbackSpeed - 0.25)])}
            className="hover:bg-primary/10"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSpeedChange([Math.min(2, playbackSpeed + 0.25)])}
            className="hover:bg-primary/10"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};