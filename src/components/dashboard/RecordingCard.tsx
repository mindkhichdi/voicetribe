import React, { useState } from 'react';
import { PlaybackButtons } from '../recording/PlaybackButtons';
import { ShareDialog } from '../recording/ShareDialog';
import { CardHeader } from '../recording/CardHeader';
import { CardTitle } from '../recording/CardTitle';
import { CardNotes } from '../recording/CardNotes';
import { CardImage } from '../recording/CardImage';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Copy, Download, MoreVertical, Share2, Trash2 } from 'lucide-react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'sonner';

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
  const supabase = useSupabaseClient();
  const isPlaying = currentlyPlaying === index;

  const formattedDate = new Date(recording.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const filePath = `${recording.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('recordings')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('recordings')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('recordings')
        .update({ image_url: publicUrl })
        .eq('id', recording.id);

      if (updateError) throw updateError;

      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleAddTag = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      try {
        const updatedTags = [...(recording.tags || []), newTag.trim()];
        const { error } = await supabase
          .from('recordings')
          .update({ tags: updatedTags })
          .eq('id', recording.id);

        if (error) throw error;
        
        toast.success('Tag added successfully');
        setNewTag('');
      } catch (error) {
        console.error('Error adding tag:', error);
        toast.error('Failed to add tag');
      }
    }
  };

  const handleRemoveTag = async (tagToRemove: string) => {
    try {
      const updatedTags = (recording.tags || []).filter(tag => tag !== tagToRemove);
      const { error } = await supabase
        .from('recordings')
        .update({ tags: updatedTags })
        .eq('id', recording.id);

      if (error) throw error;
      
      toast.success('Tag removed successfully');
    } catch (error) {
      console.error('Error removing tag:', error);
      toast.error('Failed to remove tag');
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
    <div className="bg-purple text-white rounded-xl p-3 hover:shadow-lg shadow-md transition-all duration-200 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 w-full">
          <CardHeader
            formattedDate={formattedDate}
            tags={recording.tags}
            onRemoveTag={handleRemoveTag}
            newTag={newTag}
            onNewTagChange={(value) => setNewTag(value)}
            onNewTagKeyDown={handleAddTag}
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
            onStartEdit={() => setIsEditing(true)}
            isShared={isShared}
          />

          <p className="text-sm text-gray-200">{recording.description || 'No transcription available'}</p>
          
          <CardNotes
            isEditingNotes={isEditingNotes}
            notes={notes}
            onNotesChange={(value) => setNotes(value)}
            onSaveNotes={handleSaveNotes}
            onCancelEditNotes={() => {
              setNotes(recording.notes || '');
              setIsEditingNotes(false);
            }}
            onStartEditNotes={() => setIsEditingNotes(true)}
          />

          <CardImage
            recordingId={recording.id}
            imageUrl={recording.image_url}
            onImageUpload={handleImageUpload}
          />
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
