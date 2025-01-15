import React from 'react';
import { RecordingCard } from './RecordingCard';

interface Recording {
  id: string;
  blob_url: string;
  created_at: string;
  description?: string;
  title?: string;
}

interface RecordingsListProps {
  recordings: Recording[];
  currentlyPlaying: number | null;
  playbackSpeed: number;
  onPlay: (url: string, index: number) => void;
  onSpeedChange: (value: number[]) => void;
  onDelete: (id: string) => void;
  onTitleUpdate?: (id: string, newTitle: string) => void;
  isShared?: boolean;
  viewMode?: 'list' | 'grid';
}

export const RecordingsList = ({
  recordings,
  currentlyPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
  onDelete,
  onTitleUpdate,
  isShared = false,
  viewMode = 'list',
}: RecordingsListProps) => {
  if (recordings.length === 0) {
    return null;
  }

  return (
    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
      {isShared && recordings.length > 0 && (
        <h2 className="text-2xl font-bold mb-4 col-span-full">Shared With You</h2>
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
          onTitleUpdate={onTitleUpdate}
          isShared={isShared}
        />
      ))}
    </div>
  );
};