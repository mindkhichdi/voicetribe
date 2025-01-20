import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Pencil, Check, X } from 'lucide-react';

interface CardTitleProps {
  isEditing: boolean;
  title: string;
  editedTitle: string;
  onEditedTitleChange: (value: string) => void;
  onSaveTitle: () => void;
  onCancelEdit: () => void;
  onStartEdit: () => void;
  isShared?: boolean;
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
}: CardTitleProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editedTitle}
          onChange={(e) => onEditedTitleChange(e.target.value)}
          className="text-lg font-semibold"
          autoFocus
        />
        <Button size="icon" variant="ghost" onClick={onSaveTitle} className="h-8 w-8">
          <Check className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onCancelEdit} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h3 className="text-lg font-semibold text-purple-dark dark:text-purple-light">
        {title}
      </h3>
      {!isShared && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onStartEdit}
          className="h-8 w-8 hover:bg-purple-soft/50"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};