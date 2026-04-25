'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@/lib/icons';

export type StatusSelectColor = 'green' | 'gray' | 'yellow' | 'red' | 'blue';

export type StatusOption = {
  value: string;
  label: string;
  color: StatusSelectColor;
};

type Props = {
  value: string;
  options: StatusOption[];
  onChange: (value: string) => void;
  className?: string;
};

const dotClasses: Record<StatusSelectColor, string> = {
  green: 'bg-green-500',
  gray: 'bg-gray-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};

export default function StatusSelect({ value, options, onChange, className = '' }: Props) {
  const current = options.find((o) => o.value === value);
  const color = current?.color ?? 'gray';

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
        <div className={`h-2 w-2 rounded-full ${dotClasses[color]}`} />
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer appearance-none rounded-md border border-gray-300 bg-white py-1 pr-8 pl-6 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
        <FontAwesomeIcon icon={faChevronDown} className="text-xs text-gray-400" />
      </div>
    </div>
  );
}
