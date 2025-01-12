import React from 'react';
import { Button } from '../ui/button';

interface RecordButtonProps {
  onClick: () => void;
}

export const FloatingRecordButton = ({ onClick }: RecordButtonProps) => {
  return (
    <Button 
      size="lg"
      className="fixed bottom-8 right-8 rounded-full bg-purple hover:bg-purple-vivid text-white px-6 animate-float"
      onClick={onClick}
    >
      start recording
    </Button>
  );
};