'use client';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLeadStore } from '@/features/leads/store';
import { faUsers, faUserPlus, faStar, faFileLines } from '@/lib/icons';

export default function StatsCards() {
  const leads = useLeadStore((s) => s.leads);

  const totalLeads = leads.length;
  const todaysLeads = leads.filter((l) => {
    const captured = new Date(l.capturedAt);
    return captured.toDateString() === new Date().toDateString();
  }).length;
  const ratedLeads = leads.filter((l) => l.rating > 0);
  const avgRating = ratedLeads.length
    ? (ratedLeads.reduce((sum, l) => sum + l.rating, 0) / ratedLeads.length).toFixed(1)
    : '—';
  const docsSent = leads.reduce((sum, l) => sum + l.documentsSent.length, 0);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Stat label="Total leads" value={totalLeads} icon={faUsers} accent="text-blue" />
      <Stat label="Today" value={todaysLeads} icon={faUserPlus} accent="text-green-600" />
      <Stat label="Avg. rating" value={avgRating} icon={faStar} accent="text-yellow-600" />
      <Stat label="Docs sent" value={docsSent} icon={faFileLines} accent="text-purple-600" />
    </div>
  );
}

type StatProps = {
  label: string;
  value: string | number;
  icon: IconDefinition;
  accent: string;
};

function Stat({ label, value, icon, accent }: StatProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-[#E9EAEB] bg-white px-3 py-2.5">
      <FontAwesomeIcon icon={icon} className={`text-base ${accent}`} />
      <div className="flex min-w-0 items-baseline gap-1.5">
        <span className="text-lg font-bold text-gray-900 leading-none">{value}</span>
        <span className="truncate text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
}
