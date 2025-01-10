import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { ShareDialog } from './ShareDialog';
import { PlaybackButtons } from './PlaybackButtons';

interface RecordingItemProps {
  recording: {
    id: string;
    blob_url: string;
    created_at: string;
  };
  index: number;
  currentlyPlaying: number | null;
  playbackSpeed: number;
  onPlay: (url: string, index: number) => void;
  onSpeedChange: (value: number[]) => void;
  onDelete: (id: string) => void;
}

export const RecordingItem = ({
  recording,
  index,
  currentlyPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
  onDelete,
}: RecordingItemProps) => {
  const isPlaying = currentlyPlaying === index;

  return (
    <div className="glass rounded-lg transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <PlaybackButtons
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={() => onPlay(recording.blob_url, index)}
            onSpeedChange={onSpeedChange}
          />
          <span className="text-sm font-medium">
            {new Date(recording.created_at).toLocaleTimeString()}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <ShareDialog recordingId={recording.id} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(recording.id)}
            className="hover:bg-primary/10 hover:text-accent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};