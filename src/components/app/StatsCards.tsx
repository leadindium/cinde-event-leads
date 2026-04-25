'use client';
import { useLeadStore } from '@/features/leads/store';
import ContentCard from '@/components/ds/ContentCard';
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <ContentCard
        title="Total leads"
        value={totalLeads}
        icon={faUsers}
        iconBgColor="bg-blue-100"
        iconColor="text-blue"
      />
      <ContentCard
        title="Today's leads"
        value={todaysLeads}
        icon={faUserPlus}
        iconBgColor="bg-green-100"
        iconColor="text-green-600"
      />
      <ContentCard
        title="Avg. rating"
        value={avgRating}
        icon={faStar}
        iconBgColor="bg-yellow-100"
        iconColor="text-yellow-600"
      />
      <ContentCard
        title="Documents sent"
        value={docsSent}
        icon={faFileLines}
        iconBgColor="bg-purple-100"
        iconColor="text-purple-600"
      />
    </div>
  );
}
