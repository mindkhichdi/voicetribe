import React from 'react';
import { Tag } from 'lucide-react';
import { Button } from '../ui/button';

interface TagsFilterProps {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
}

export const TagsFilter = ({ tags, selectedTag, onTagSelect }: TagsFilterProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedTag && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onTagSelect(null)}
          className="text-purple-dark dark:text-purple-light"
        >
          Clear filter
        </Button>
      )}
      {tags.map((tag) => (
        <Button
          key={tag}
          variant={selectedTag === tag ? "default" : "outline"}
          size="sm"
          onClick={() => onTagSelect(tag)}
          className="flex items-center gap-1"
        >
          <Tag className="h-4 w-4" />
          {tag}
        </Button>
      ))}
    </div>
  );
};