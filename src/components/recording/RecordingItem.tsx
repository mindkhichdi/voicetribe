import React from 'react';
import { Trash2, MoreVertical, Copy, Share2, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { ShareDialog } from './ShareDialog';
import { PlaybackButtons } from './PlaybackButtons';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
  const formattedDate = new Date(recording.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">NEW</Badge>
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <span className="text-sm text-gray-500">00:03</span>
          </div>
          <h3 className="text-lg font-semibold">Recording {index + 1}</h3>
          <p className="text-sm text-gray-500">Hello. Hello. Recording, recording.</p>
        </div>
        <div className="flex items-center gap-2">
          <PlaybackButtons
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={() => onPlay(recording.blob_url, index)}
            onSpeedChange={onSpeedChange}
          />
          <ShareDialog recordingId={recording.id} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Copy className="h-4 w-4 mr-2" />
                Copy link
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onClick={() => onDelete(recording.id)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};