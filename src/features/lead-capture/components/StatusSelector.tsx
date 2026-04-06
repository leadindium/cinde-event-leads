import type { LeadStatus } from '../types';

const statuses: { value: LeadStatus; label: string; color: string; activeColor: string }[] = [
  { value: 'new', label: 'New', color: 'border-primary text-primary', activeColor: 'bg-primary text-white' },
  { value: 'contacted', label: 'Contacted', color: 'border-secondary text-secondary', activeColor: 'bg-secondary text-white' },
  { value: 'qualified', label: 'Qualified', color: 'border-emerald-500 text-emerald-600', activeColor: 'bg-emerald-500 text-white' },
  { value: 'not_interested', label: 'Not Interested', color: 'border-gray-400 text-gray-500', activeColor: 'bg-gray-400 text-white' },
];

interface StatusSelectorProps {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

export default function StatusSelector({ status, onChange }: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          onClick={() => onChange(s.value)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
            status === s.value
              ? `${s.activeColor} border-transparent scale-105`
              : `${s.color} bg-white hover:opacity-80`
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
