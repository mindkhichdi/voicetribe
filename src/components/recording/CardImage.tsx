import React from 'react';
import { Button } from '../ui/button';
import { ImageIcon } from 'lucide-react';

interface CardImageProps {
  recordingId: string;
  imageUrl?: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CardImage = ({ recordingId, imageUrl, onImageUpload }: CardImageProps) => {
  return (
    <div className="mt-2">
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Recording attachment"
          className="max-w-xs rounded-lg mb-2"
        />
      )}
      <label className="cursor-pointer">
        <Button
          size="sm"
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => document.getElementById(`image-upload-${recordingId}`)?.click()}
        >
          <ImageIcon className="h-4 w-4" />
          {imageUrl ? 'Change Image' : 'Add Image'}
        </Button>
        <input
          type="file"
          id={`image-upload-${recordingId}`}
          className="hidden"
          accept="image/*"
          onChange={onImageUpload}
        />
      </label>
    </div>
  );
};