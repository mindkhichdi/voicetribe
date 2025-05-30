
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
  onStartEdit: (e: React.MouseEvent) => void;
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
          className="h-8 bg-white/90 backdrop-blur-sm border-purple-200 focus:border-purple-400 focus:ring-purple-300"
        />
        <Button 
          size="sm" 
          onClick={onSaveTitle}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm"
        >
          Save
        </Button>
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={onCancelEdit}
          className="hover:bg-red-50 hover:text-red-600"
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <h3 
        className="text-lg font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent cursor-pointer hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        onClick={onClick}
      >
        {title}
      </h3>
      {!isShared && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onStartEdit}
          className="h-6 w-6 p-0 hover:bg-purple-100 hover:text-purple-600 transition-all duration-200"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
