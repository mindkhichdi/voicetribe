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
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();

  const handleShare = async () => {
    try {
      setIsSharing(true);
      console.log('Starting share process for recording:', recordingId);

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-invite', {
        body: {
          email: shareEmail,
          recordingId: recordingId,
          sharedById: session?.user?.id,
        },
      });

      if (emailError) {
        console.error('Error sending invitation:', emailError);
        toast.error('Failed to send invitation');
        return;
      }

      toast.success('Invitation sent successfully');
      setShareEmail('');
      setIsOpen(false);
    } catch (error) {
      console.error('Error sharing recording:', error);
      toast.error('Failed to share recording');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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