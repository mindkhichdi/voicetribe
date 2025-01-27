import React from 'react';
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
  const formattedDate = new Date(recording.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

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

        <Tabs defaultValue="notes" className="mt-4">
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
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {recording.description || 'No transcription available'}
              </p>
              <SummarySection
                recordingId={recording.id}
                description={recording.description}
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