import React, { useState } from 'react';
import { PlaybackButtons } from '../recording/PlaybackButtons';
import { ShareDialog } from '../recording/ShareDialog';
import { CardHeader } from '../recording/CardHeader';
import { CardTitle } from '../recording/CardTitle';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Copy, Download, MoreVertical, Share2, Trash2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';
import { RecordingModal } from '../recording/RecordingModal';

interface Recording {
  id: string;
  blob_url: string;
  created_at: string;
  description?: string;
  title?: string;
  notes?: string;
  image_url?: string;
  tags?: string[];
}

interface RecordingCardProps {
  recording: Recording;
  index: number;
  currentlyPlaying: number | null;
  playbackSpeed: number;
  onPlay: (url: string, index: number) => void;
  onSpeedChange: (value: number[]) => void;
  onDelete: (id: string) => void;
  onTitleUpdate?: (id: string, newTitle: string) => void;
  isShared?: boolean;
}

const vibrantGradients = [
  'from-purple-400 via-pink-500 to-red-500',
  'from-blue-400 via-purple-500 to-pink-500',
  'from-green-400 via-blue-500 to-purple-600',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-pink-400 via-purple-500 to-indigo-500',
  'from-teal-400 via-cyan-500 to-blue-500',
  'from-orange-400 via-pink-500 to-purple-600',
  'from-emerald-400 via-teal-500 to-blue-500',
];

export const RecordingCard = ({
  recording,
  index,
  currentlyPlaying,
  playbackSpeed,
  onPlay,
  onSpeedChange,
  onDelete,
  onTitleUpdate,
  isShared = false,
}: RecordingCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recording.title || `Recording ${index + 1}`);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(recording.notes || '');
  const [newTag, setNewTag] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = useSupabaseClient();
  const isPlaying = currentlyPlaying === index;

  const gradientClass = vibrantGradients[index % vibrantGradients.length];

  const handleSaveTitle = async () => {
    try {
      const { error } = await supabase
        .from('recordings')
        .update({ title: editedTitle })
        .eq('id', recording.id);

      if (error) throw error;
      
      if (onTitleUpdate) {
        onTitleUpdate(recording.id, editedTitle);
      }
      
      toast.success('Title updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating title:', error);
      toast.error('Failed to update title');
    }
  };

  const handleSaveNotes = async () => {
    try {
      const { error } = await supabase
        .from('recordings')
        .update({ notes })
        .eq('id', recording.id);

      if (error) throw error;
      
      toast.success('Notes saved successfully');
      setIsEditingNotes(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = `${window.location.origin}/recording/${recording.id}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard');
    } catch (error) {
      console.error('Error copying link:', error);
      toast.error('Failed to copy link');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(recording.blob_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${recording.title || `Recording ${index + 1}`}.webm`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Download started');
    } catch (error) {
      console.error('Error downloading recording:', error);
      toast.error('Failed to download recording');
    }
  };

  return (
    <>
      <div 
        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Vibrant gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} rounded-xl opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Card content with glass effect */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-xl p-6 m-1 shadow-lg border border-white/50">
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-12 h-12 bg-white/20 rounded-full blur-xl" />
          <div className="absolute bottom-2 left-2 w-8 h-8 bg-white/30 rounded-full blur-lg" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-3 w-full">
              <CardHeader
                formattedDate={new Date(recording.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
                tags={recording.tags}
                onRemoveTag={async (tag) => {
                  const updatedTags = (recording.tags || []).filter(t => t !== tag);
                  const { error } = await supabase
                    .from('recordings')
                    .update({ tags: updatedTags })
                    .eq('id', recording.id);

                  if (error) {
                    toast.error('Failed to remove tag');
                    return;
                  }
                  toast.success('Tag removed successfully');
                }}
                newTag={newTag}
                onNewTagChange={(value) => setNewTag(value)}
                onNewTagKeyDown={async (e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    const updatedTags = [...(recording.tags || []), newTag.trim()];
                    const { error } = await supabase
                      .from('recordings')
                      .update({ tags: updatedTags })
                      .eq('id', recording.id);

                    if (error) {
                      toast.error('Failed to add tag');
                      return;
                    }
                    toast.success('Tag added successfully');
                    setNewTag('');
                  }
                }}
                isShared={isShared}
              />

              <CardTitle
                isEditing={isEditing}
                title={recording.title || `Recording ${index + 1}`}
                editedTitle={editedTitle}
                onEditedTitleChange={(value) => setEditedTitle(value)}
                onSaveTitle={handleSaveTitle}
                onCancelEdit={() => {
                  setEditedTitle(recording.title || `Recording ${index + 1}`);
                  setIsEditing(false);
                }}
                onStartEdit={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                isShared={isShared}
              />
            </div>

            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                <PlaybackButtons
                  isPlaying={isPlaying}
                  playbackSpeed={playbackSpeed}
                  onPlay={() => onPlay(recording.blob_url, index)}
                  onSpeedChange={onSpeedChange}
                />
              </div>
              {!isShared && (
                <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                  <ShareDialog recordingId={recording.id} />
                </div>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border-white/50">
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={(e) => {
                    e.preventDefault();
                    const shareDialog = document.querySelector(`button[aria-label="Share recording"]`);
                    if (shareDialog instanceof HTMLElement) {
                      shareDialog.click();
                    }
                  }}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  {!isShared && (
                    <DropdownMenuItem className="text-red-600" onClick={(e) => {
                      e.stopPropagation();
                      onDelete(recording.id);
                    }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Audio waveform visualization */}
          <div className="mt-4 flex items-center gap-1 opacity-60">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={`bg-gradient-to-t ${gradientClass} rounded-full transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  width: '3px',
                  height: `${Math.random() * 20 + 8}px`,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <RecordingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recording={recording}
        isEditingNotes={isEditingNotes}
        notes={notes}
        onNotesChange={setNotes}
        onSaveNotes={handleSaveNotes}
        onCancelEditNotes={() => {
          setNotes(recording.notes || '');
          setIsEditingNotes(false);
        }}
        onStartEditNotes={() => setIsEditingNotes(true)}
      />
    </>
  );
};
