import ContainerWhite from '@/components/ds/ContainerWhite';
import PageHeader from '@/components/app/PageHeader';
import StatsCards from '@/components/app/StatsCards';
import LeadsTable from '@/components/app/LeadsTable';
import ExportMenu from '@/components/app/ExportMenu';

export default function LeadCapturePage() {
  return (
    <>
      <PageHeader title="Leads" subtitle="Life Sciences Forum 2026" actions={<ExportMenu />} />
      <ContainerWhite>
        <div className="flex flex-col gap-6 p-6">
          <StatsCards />
          <LeadsTable />
        </div>
      </ContainerWhite>
    </>
  );
}
