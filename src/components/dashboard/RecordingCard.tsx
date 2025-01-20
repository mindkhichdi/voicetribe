import React, { useState } from 'react';
import { PlaybackButtons } from '../recording/PlaybackButtons';
import { ShareDialog } from '../recording/ShareDialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Copy, Download, MoreVertical, Share2, Trash2, Pencil, Check, X, Image as ImageIcon, StickyNote, Tag } from 'lucide-react';
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

  const handleCancelEdit = () => {
    setEditedTitle(recording.title || `Recording ${index + 1}`);
    setIsEditing(false);
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

  return (
    <div className="glass rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-purple-soft text-purple-vivid">NEW</Badge>
            <span className="text-sm text-gray-500">{formattedDate}</span>
            <span className="text-sm text-gray-500">00:03</span>
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 mb-2">
            {recording.tags?.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="flex items-center gap-1 cursor-pointer hover:bg-purple-soft/50"
                onClick={() => !isShared && handleRemoveTag(tag)}
              >
                <Tag className="h-3 w-3" />
                {tag}
                {!isShared && <X className="h-3 w-3 ml-1" />}
              </Badge>
            ))}
            {!isShared && (
              <Input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Add tag..."
                className="w-24 h-6 text-sm"
              />
            )}
          </div>

          {isEditing ? (
            <div className="flex items-center gap-2">
              <Input
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="text-lg font-semibold"
                autoFocus
              />
              <Button size="icon" variant="ghost" onClick={handleSaveTitle} className="h-8 w-8">
                <Check className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={handleCancelEdit} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-purple-dark dark:text-purple-light">
                {recording.title || `Recording ${index + 1}`}
              </h3>
              {!isShared && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-8 w-8 hover:bg-purple-soft/50"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
          <p className="text-sm text-gray-500">{recording.description || 'No transcription available'}</p>
          
          {/* Notes Section */}
          <div className="mt-2">
            {isEditingNotes ? (
              <div className="space-y-2">
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNotes}>Save Notes</Button>
                  <Button size="sm" variant="ghost" onClick={() => {
                    setNotes(recording.notes || '');
                    setIsEditingNotes(false);
                  }}>Cancel</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {recording.notes && <p className="text-sm">{recording.notes}</p>}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditingNotes(true)}
                  className="flex items-center gap-2"
                >
                  <StickyNote className="h-4 w-4" />
                  {recording.notes ? 'Edit Notes' : 'Add Notes'}
                </Button>
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className="mt-2">
            {recording.image_url && (
              <img
                src={recording.image_url}
                alt="Recording attachment"
                className="max-w-xs rounded-lg mb-2"
              />
            )}
            <label className="cursor-pointer">
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => document.getElementById(`image-upload-${recording.id}`)?.click()}
              >
                <ImageIcon className="h-4 w-4" />
                {recording.image_url ? 'Change Image' : 'Add Image'}
              </Button>
              <input
                type="file"
                id={`image-upload-${recording.id}`}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>
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
