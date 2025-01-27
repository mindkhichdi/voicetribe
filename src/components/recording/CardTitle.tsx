import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Pencil } from 'lucide-react';

interface CardTitleProps {
  isEditing: boolean;
  title: string;
  editedTitle: string;
  onEditedTitleChange: (value: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  isShared?: boolean;
  onClick?: () => void;
}

export const CardTitle = ({
  isEditing,
  title,
  editedTitle,
  onEditedTitleChange,
  onSaveTitle,
  onCancelEdit,
  onStartEdit,
  isShared = false,
  onClick,
}: CardTitleProps) => {
  if (isEditing) {
    return (
      <div className="flex gap-2 items-center">
        <Input
          type="text"
          value={editedTitle}
          onChange={(e) => onEditedTitleChange(e.target.value)}
          className="h-8"
        />
        <Button size="sm" onClick={onSaveTitle}>Save</Button>
        <Button size="sm" variant="ghost" onClick={onCancelEdit}>Cancel</Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h3 
        className="text-lg font-semibold cursor-pointer hover:text-purple-600 transition-colors"
        onClick={onClick}
      >
        {title}
      </h3>
      {!isShared && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartEdit}
          className="h-6 w-6 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};