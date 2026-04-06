import { Users, UserPlus, Star, FileText } from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';

export default function StatsCards() {
  const leads = useLeadStore((s) => s.leads);

  const totalLeads = leads.length;
  const todaysLeads = leads.filter((l) => {
    const today = new Date();
    const captured = new Date(l.capturedAt);
    return captured.toDateString() === today.toDateString();
  }).length;
  const avgRating = leads.length
    ? (leads.reduce((sum, l) => sum + l.rating, 0) / leads.filter((l) => l.rating > 0).length || 0).toFixed(1)
    : '0';
  const docsSent = leads.reduce((sum, l) => sum + l.documentsSent.length, 0);

  const stats = [
    { label: 'Total Leads', value: totalLeads, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: "Today's Leads", value: todaysLeads, icon: UserPlus, color: 'bg-secondary/10 text-secondary' },
    { label: 'Avg. Rating', value: avgRating, icon: Star, color: 'bg-warm/10 text-warm' },
    { label: 'Docs Sent', value: docsSent, icon: FileText, color: 'bg-accent/10 text-accent' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
              <p className="text-xs text-text-light">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
