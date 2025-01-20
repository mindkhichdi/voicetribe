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
        <Badge variant="secondary" className="text-xs bg-purple-soft text-purple-vivid">NEW</Badge>
        <span className="text-sm text-gray-500">{formattedDate}</span>
        <span className="text-sm text-gray-500">00:03</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags?.map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1 cursor-pointer hover:bg-purple-soft/50"
            onClick={() => !isShared && onRemoveTag?.(tag)}
          >
            <Tag className="h-3 w-3" />
            {tag}
            {!isShared && <X className="h-3 w-3 ml-1" />}
          </Badge>
        ))}
        {!isShared && (
          <Input
            type="text"
            value={newTag}
            onChange={(e) => onNewTagChange(e.target.value)}
            onKeyDown={onNewTagKeyDown}
            placeholder="Add tag..."
            className="w-24 h-6 text-sm"
          />
        )}
      </div>
    </div>
  );
};