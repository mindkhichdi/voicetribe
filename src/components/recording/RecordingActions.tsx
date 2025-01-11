import React from 'react';
import { Button } from '../ui/button';
import { MessageSquare, PenSquare, Mic } from 'lucide-react';

export const RecordingActions = () => {
  return (
    <div className="flex gap-4 justify-center mt-4">
      <Button variant="ghost" className="bg-white shadow-sm">
        <MessageSquare className="w-4 h-4 mr-2" />
        Ask AI
      </Button>
      
      <Button variant="ghost" className="bg-white shadow-sm">
        <PenSquare className="w-4 h-4 mr-2" />
        Note
      </Button>
      
      <Button className="bg-black text-white hover:bg-black/90">
        <Mic className="w-4 h-4 mr-2" />
        Record
      </Button>
    </div>
  );
};