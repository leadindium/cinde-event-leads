'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark } from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import Label from '@/components/ds/Label';

type Props = {
  selectedTags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
};

export default function TagPicker({ selectedTags, onAdd, onRemove }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const customTags = useLeadStore((s) => s.config.customTags);
  const available = customTags.filter((t) => !selectedTags.includes(t));

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {selectedTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => onRemove(tag)}
              aria-label={`Remove ${tag}`}
              className="cursor-pointer text-blue-500 transition-colors hover:text-blue-800"
            >
              <FontAwesomeIcon icon={faXmark} className="text-[10px]" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="hover:border-blue hover:text-blue inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-dashed border-gray-300 px-2 py-1 text-xs font-medium text-gray-500 transition-colors"
        >
          <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
          Add tag
        </button>
      </div>
      {isOpen && available.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg border border-gray-200 bg-gray-50 p-3">
          {available.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => {
                onAdd(tag);
                if (available.length === 1) setIsOpen(false);
              }}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <Label status={tag} color="gray" />
            </button>
          ))}
        </div>
      )}
      {isOpen && available.length === 0 && (
        <p className="mt-2 text-xs text-gray-500">
          No more tags available. Add custom tags in{' '}
          <a href="/lead-capture/settings" className="text-blue underline">
            Settings
          </a>
          .
        </p>
      )}
    </div>
  );
}
