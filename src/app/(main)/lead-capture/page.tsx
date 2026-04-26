import PageHeader from '@/components/app/PageHeader';
import StatsCards from '@/components/app/StatsCards';
import LeadsTable from '@/components/app/LeadsTable';
import ExportMenu from '@/components/app/ExportMenu';

export default function LeadCapturePage() {
  return (
    <div className="flex flex-col gap-6 p-4 lg:p-6">
      <PageHeader title="Leads" subtitle="Life Sciences Forum 2026" actions={<ExportMenu />} />
      <StatsCards />
      <LeadsTable />
    </div>
  );
}
