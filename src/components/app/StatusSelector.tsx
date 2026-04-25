'use client';
import StatusSelect, { type StatusOption } from '@/components/ds/StatusSelect';
import type { LeadStatus } from '@/features/leads/types';

const OPTIONS: StatusOption[] = [
  { value: 'new', label: 'New', color: 'blue' },
  { value: 'contacted', label: 'Contacted', color: 'yellow' },
  { value: 'qualified', label: 'Qualified', color: 'green' },
  { value: 'not_interested', label: 'Not interested', color: 'gray' },
];

type Props = {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
};

export default function StatusSelector({ status, onChange }: Props) {
  return (
    <StatusSelect value={status} options={OPTIONS} onChange={(v) => onChange(v as LeadStatus)} />
  );
}
