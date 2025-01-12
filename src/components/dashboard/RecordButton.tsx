import React from 'react';
import { Button } from '../ui/button';

interface RecordButtonProps {
  onClick: () => void;
}

export const FloatingRecordButton = ({ onClick }: RecordButtonProps) => {
  return (
    <Button 
      size="lg"
      className="fixed bottom-8 right-8 rounded-full bg-red-500 hover:bg-red-600 text-white px-6"
      onClick={onClick}
    >
      start recording
    </Button>
  );
};