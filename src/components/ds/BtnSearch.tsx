'use client';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@/lib/icons';

type Props = {
  onSearch?: (term: string) => void;
  searchTerm?: string;
  placeholder?: string;
};

export default function BtnSearch({ onSearch, searchTerm = '', placeholder = 'Search...' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(searchTerm);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => setValue(searchTerm), [searchTerm]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  return (
    <div
      ref={wrapperRef}
      className={`flex h-10 items-center rounded-full bg-white text-black shadow-md transition-all duration-300 ${isOpen ? 'w-sm' : 'w-10'}`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 cursor-pointer items-center justify-center"
        aria-label="Open search"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
      {isOpen && (
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onSearch?.(e.target.value);
          }}
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
          className="h-8 w-full bg-transparent pr-4 outline-none placeholder:italic"
        />
      )}
    </div>
  );
}
