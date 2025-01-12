import React from 'react';
import { RecordingCard } from './RecordingCard';

interface Recording {
  id: string;
  blob_url: string;
  created_at: string;
}

interface RecordingsListProps {
  recordings: Recording[];
  currentlyPlaying: number | null;
  playbackSpeed: number;
  onPlay: (url: string, index: number) => void;
  onSpeedChange: (value: number[]) => void;
  onDelete: (id: string) => void;
  isShared?: boolean;
}

export const RecordingsList = ({
  recordings,
  currentlyPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
  onDelete,
  isShared = false,
}: RecordingsListProps) => {
  if (recordings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {isShared && recordings.length > 0 && (
        <h2 className="text-2xl font-bold mb-4">Shared With You</h2>
      )}
      {recordings.map((recording, index) => (
        <RecordingCard
          key={recording.id}
          recording={recording}
          index={index}
          currentlyPlaying={currentlyPlaying}
          playbackSpeed={playbackSpeed}
          onPlay={onPlay}
          onSpeedChange={onSpeedChange}
          onDelete={onDelete}
          isShared={isShared}
        />
      ))}
    </div>
  );
};