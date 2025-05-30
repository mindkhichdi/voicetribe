
import React from 'react';
import { Badge } from '../ui/badge';
import { Tag, X } from 'lucide-react';
import { Input } from '../ui/input';

interface CardHeaderProps {
  formattedDate: string;
  tags?: string[];
  onRemoveTag?: (tag: string) => void;
  newTag: string;
  onNewTagChange: (value: string) => void;
  onNewTagKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isShared?: boolean;
}

export const CardHeader = ({
  formattedDate,
  tags,
  onRemoveTag,
  newTag,
  onNewTagChange,
  onNewTagKeyDown,
  isShared = false,
}: CardHeaderProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge 
          variant="secondary" 
          className="text-xs bg-gradient-to-r from-emerald-400 to-teal-500 text-white border-0 shadow-sm font-medium px-3"
        >
          NEW
        </Badge>
        <span className="text-sm text-gray-600 font-medium">{formattedDate}</span>
        <span className="text-sm text-gray-500">00:03</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags?.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1 cursor-pointer hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 border-purple-200 text-purple-700 transition-all duration-200 shadow-sm"
            onClick={() => !isShared && onRemoveTag?.(tag)}
          >
            <Tag className="h-3 w-3" />
            {tag}
            {!isShared && <X className="h-3 w-3 ml-1 hover:text-red-500 transition-colors" />}
          </Badge>
        ))}
        {!isShared && (
          <Input
            type="text"
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyDown={onNewTagKeyDown}
            placeholder="Add tag..."
            className="w-24 h-6 text-sm border-purple-200 focus:border-purple-400 focus:ring-purple-300 bg-white/80 backdrop-blur-sm"
          />
        )}
      </div>
    </div>
  );
};
