import { X, Plus } from 'lucide-react';
import { useState } from 'react';
import { useLeadStore } from '../store/useLeadStore';

interface TagPickerProps {
  selectedTags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
}

export default function TagPicker({ selectedTags, onAdd, onRemove }: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const customTags = useLeadStore((s) => s.config.customTags);
  const availableTags = customTags.filter((t) => !selectedTags.includes(t));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
          >
            {tag}
            <button onClick={() => onRemove(tag)} className="hover:text-accent transition-colors">
              <X size={12} />
            </button>
          </span>
        ))}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-gray-300 text-text-light hover:border-primary hover:text-primary transition-colors"
        >
          <Plus size={12} /> Add Tag
        </button>
      </div>
      {isOpen && availableTags.length > 0 && (
        <div className="mt-2 p-2 bg-white rounded-lg border border-border shadow-sm flex flex-wrap gap-1.5">
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => {
                onAdd(tag);
                if (availableTags.length === 1) setIsOpen(false);
              }}
              className="px-2.5 py-1 rounded-full text-xs font-medium bg-bg text-text-light hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
