import React from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { StickyNote } from 'lucide-react';

interface CardNotesProps {
  isEditingNotes: boolean;
  notes: string;
  onNotesChange: (value: string) => void;
  onSaveNotes: () => void;
  onCancelEditNotes: () => void;
  onStartEditNotes: () => void;
}

export const CardNotes = ({
  isEditingNotes,
  notes,
  onNotesChange,
  onSaveNotes,
  onCancelEditNotes,
  onStartEditNotes,
}: CardNotesProps) => {
  if (isEditingNotes) {
    return (
      <div className="space-y-2">
        <Textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Add notes..."
          className="min-h-[100px]"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={onSaveNotes}>Save Notes</Button>
          <Button size="sm" variant="ghost" onClick={onCancelEditNotes}>Cancel</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notes && <p className="text-sm">{notes}</p>}
      <Button
        size="sm"
        variant="ghost"
        onClick={onStartEditNotes}
        className="flex items-center gap-2"
      >
        <StickyNote className="h-4 w-4" />
        {notes ? 'Edit Notes' : 'Add Notes'}
      </Button>
    </div>
  );
};