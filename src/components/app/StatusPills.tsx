'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@/lib/icons';
import type { LeadStatus } from '@/features/leads/types';

type PillStyle = {
  /** Color del dot y del fill cuando activo */
  accent: string;
  /** Texto cuando activo */
  activeText: string;
  /** Borde cuando activo */
  activeBorder: string;
  /** Texto cuando inactivo */
  idleText: string;
  /** Hover idle bg */
  idleHover: string;
};

const STYLES: Record<LeadStatus, PillStyle> = {
  new: {
    accent: 'bg-blue-500',
    activeText: 'text-blue-700',
    activeBorder: 'border-blue-300 bg-blue-50',
    idleText: 'text-gray-500',
    idleHover: 'hover:bg-blue-50/50 hover:text-blue-700',
  },
  contacted: {
    accent: 'bg-yellow-500',
    activeText: 'text-yellow-800',
    activeBorder: 'border-yellow-300 bg-yellow-50',
    idleText: 'text-gray-500',
    idleHover: 'hover:bg-yellow-50/50 hover:text-yellow-800',
  },
  qualified: {
    accent: 'bg-green-500',
    activeText: 'text-green-700',
    activeBorder: 'border-green-300 bg-green-50',
    idleText: 'text-gray-500',
    idleHover: 'hover:bg-green-50/50 hover:text-green-700',
  },
  not_interested: {
    accent: 'bg-gray-500',
    activeText: 'text-gray-700',
    activeBorder: 'border-gray-300 bg-gray-100',
    idleText: 'text-gray-500',
    idleHover: 'hover:bg-gray-100 hover:text-gray-700',
  },
};

const ORDER: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'not_interested', label: 'Not interested' },
];

type Props = {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
};

export default function StatusPills({ status, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold tracking-wide text-gray-500 uppercase">Status</p>
      <div className="flex flex-wrap gap-2">
        {ORDER.map((opt) => {
          const isActive = opt.value === status;
          const style = STYLES[opt.value];
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              aria-pressed={isActive}
              className={`group inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? `${style.activeBorder} ${style.activeText} shadow-sm`
                  : `border-gray-200 bg-white ${style.idleText} ${style.idleHover}`
              }`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full transition-all ${
                  isActive ? style.accent : 'bg-gray-200 group-hover:bg-gray-300'
                }`}
              >
                {isActive && (
                  <FontAwesomeIcon icon={faCheck} className="text-[8px] text-white" />
                )}
              </span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
