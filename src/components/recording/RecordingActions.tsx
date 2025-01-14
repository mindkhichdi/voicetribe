import React from 'react';
import { Button } from '../ui/button';

interface RecordingActionsProps {
  onSave: () => void;
  onDiscard: () => void;
  isProcessing: boolean;
}

export const RecordingActions = ({ onSave, onDiscard, isProcessing }: RecordingActionsProps) => {
  return (
    <div className="flex justify-end space-x-2 mt-4">
      <Button
        variant="outline"
        onClick={onDiscard}
        disabled={isProcessing}
      >
        Discard
      </Button>
      <Button
        onClick={onSave}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Save Recording'}
      </Button>
    </div>
  );
};