import React from 'react';
import { PlaybackButtons } from '../recording/PlaybackButtons';
import { ShareDialog } from '../recording/ShareDialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Copy, Download, MoreVertical, Share2, Trash2 } from 'lucide-react';

interface Recording {
  id: string;
  blob_url: string;
  created_at: string;
  description?: string;
}

interface RecordingCardProps {
  recording: Recording;
  index: number;
  currentlyPlaying: number | null;
  playbackSpeed: number;
  onPlay: (url: string, index: number) => void;
  onSpeedChange: (value: number[]) => void;
  onDelete: (id: string) => void;
  isShared?: boolean;
}

export const RecordingCard = ({
  recording,
  index,
  currentlyPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
  onDelete,
  isShared = false,
}: RecordingCardProps) => {
  const isPlaying = currentlyPlaying === index;
  const formattedDate = new Date(recording.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="glass rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-purple-soft text-purple-vivid">NEW</Badge>
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <span className="text-sm text-gray-500">00:03</span>
          </div>
          <h3 className="text-lg font-semibold text-purple-dark dark:text-purple-light">Recording {index + 1}</h3>
          <p className="text-sm text-gray-500">{recording.description || 'No transcription available'}</p>
        </div>
        <div className="flex items-center gap-2">
          <PlaybackButtons
            isPlaying={isPlaying}
            playbackSpeed={playbackSpeed}
            onPlay={() => onPlay(recording.blob_url, index)}
            onSpeedChange={onSpeedChange}
          />
          {!isShared && <ShareDialog recordingId={recording.id} />}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-purple-soft/50">
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
              {!isShared && (
                <DropdownMenuItem className="text-red-600" onClick={() => onDelete(recording.id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};