
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Mic, PenLine, Users } from 'lucide-react';
import { CardNotes } from './CardNotes';
import { SummarySection } from './SummarySection';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  recording: {
    id: string;
    title?: string;  // Made optional to match Recording interface
    description?: string;
    notes?: string;
    created_at: string;
  };
  isEditingNotes: boolean;
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
  onCancelEditNotes: () => void;
  onStartEditNotes: () => void;
}

export const RecordingModal = ({
  isOpen,
  onClose,
  recording,
  isEditingNotes,
  notes,
  onNotesChange,
  onSaveNotes,
  onCancelEditNotes,
  onStartEditNotes,
}: RecordingModalProps) => {
  const supabase = useSupabaseClient();
  const [currentDescription, setCurrentDescription] = useState(recording.description);
  
  // Fetch latest recording data when modal opens
  useEffect(() => {
    if (isOpen && recording.id) {
      const fetchRecording = async () => {
        const { data, error } = await supabase
          .from('recordings')
          .select('description')
          .eq('id', recording.id)
          .single();
          
        if (!error && data) {
          setCurrentDescription(data.description);
        }
      };
      
      fetchRecording();
    }
  }, [isOpen, recording.id, supabase]);

  const formattedDate = new Date(recording.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Default to transcript tab if there's a transcription
  const hasTranscription = currentDescription && currentDescription !== `Recording` && !currentDescription.startsWith('Recording ');
  const defaultTab = hasTranscription ? 'transcript' : 'notes';

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {recording.title || 'Untitled Recording'}
            <span className="text-sm font-normal text-gray-500">
              {formattedDate}
            </span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4 bg-purple-soft/20">
            <TabsTrigger value="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="transcript" className="flex items-center gap-2">
              <PenLine className="h-4 w-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Mic className="h-4 w-4" />
              Create
            </TabsTrigger>
            <TabsTrigger value="speaker" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Speaker Transcript
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes" className="mt-4">
            <div className="space-y-4">
              <CardNotes
                isEditingNotes={isEditingNotes}
                notes={notes}
                onNotesChange={onNotesChange}
                onSaveNotes={onSaveNotes}
                onCancelEditNotes={onCancelEditNotes}
                onStartEditNotes={onStartEditNotes}
              />
            </div>
          </TabsContent>

          <TabsContent value="transcript" className="mt-4">
            <div className="space-y-4">
              {currentDescription && !currentDescription.startsWith('Recording ') ? (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Transcription</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {currentDescription}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No transcription available for this recording. Click "Transcribe and Generate Summary" below to transcribe this recording.
                </p>
              )}
              <SummarySection
                recordingId={recording.id}
                description={currentDescription}
              />
            </div>
          </TabsContent>

          <TabsContent value="create" className="mt-4">
            <div className="flex items-center justify-center h-48 bg-purple-soft/10 rounded-lg">
              <p className="text-gray-500">Create feature coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="speaker" className="mt-4">
            <div className="flex items-center justify-center h-48 bg-purple-soft/10 rounded-lg">
              <p className="text-gray-500">Speaker transcript feature coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
