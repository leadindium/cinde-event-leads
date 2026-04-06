import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatsCards from './StatsCards';
import LeadsTable from './LeadsTable';
import FloatingActions from './FloatingActions';
import ExportMenu from './ExportMenu';

export default function LeadDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 lg:p-6 pb-24 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-text-primary">Lead Capture</h1>
          <p className="text-sm text-text-light">Life Sciences Forum 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportMenu />
          <button
            onClick={() => navigate('/lead-capture/settings')}
            className="p-2 border border-border rounded-lg hover:bg-bg transition-colors"
            title="Settings"
          >
            <Settings size={18} className="text-text-light" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <StatsCards />
        <LeadsTable />
      </div>

      <FloatingActions />
    </div>
  );
}
