import React, { useState } from 'react';
import { Share2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShareDialogProps {
  recordingId: string;
}

export const ShareDialog = ({ recordingId }: ShareDialogProps) => {
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const session = useSession();

  const handleShare = async () => {
    try {
      setIsSharing(true);
      console.log('Starting share process for recording:', recordingId);

      const { error: shareError } = await supabase
        .from('shared_recordings')
        .insert({
          recording_id: recordingId,
          shared_by_id: session?.user?.id,
        });

      if (shareError) {
        console.error('Error creating share:', shareError);
        toast.error('Failed to share recording');
        return;
      }

      const { error: signInError } = await supabase.auth.signInWithOtp({
        email: shareEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (signInError) {
        console.error('Error sending magic link:', signInError);
        toast.error('Failed to send invitation');
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
          <DialogDescription>
            Enter an email address to share this recording.
          </DialogDescription>
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
  );
};