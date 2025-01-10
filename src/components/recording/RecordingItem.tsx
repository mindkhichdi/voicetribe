import React from 'react';
import { Play, Pause, RotateCcw, RotateCw, Trash2, Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

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
  const [shareEmail, setShareEmail] = React.useState('');
  const [isSharing, setIsSharing] = React.useState(false);
  const session = useSession();

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // Get user profile for sender name
      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', session?.user?.id)
        .single();

      const senderName = profile?.username || 'Someone';
      
      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: {
          to: shareEmail,
          recordingId: recording.id,
          senderName,
        },
      });

      if (emailError) {
        console.error('Error sending invitation:', emailError);
        toast.error('Failed to send invitation');
        return;
      }

      // Share recording
      const { error: shareError } = await supabase
        .from('shared_recordings')
        .insert({
          recording_id: recording.id,
          shared_with_id: null, // Will be updated when user signs up
          shared_by_id: session?.user?.id,
        });

      if (shareError) {
        console.error('Error sharing recording:', shareError);
        toast.error('Failed to share recording');
        return;
      }

      toast.success('Invitation sent successfully');
      setShareEmail('');
    } catch (error) {
      console.error('Error sharing recording:', error);
      toast.error('Failed to share recording');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="glass rounded-lg transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPlay(recording.blob_url, index)}
            className={`hover:bg-primary/10 ${currentlyPlaying === index ? 'text-primary' : ''}`}
          >
            {currentlyPlaying === index ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <span className="text-sm font-medium">
            {new Date(recording.created_at).toLocaleTimeString()}
          </span>
          {currentlyPlaying === index && (
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
        <div className="flex items-center space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-primary/10"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Recording</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                />
                <Button 
                  onClick={handleShare}
                  disabled={isSharing || !shareEmail}
                  className="w-full"
                >
                  {isSharing ? 'Sending Invitation...' : 'Send Invitation'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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