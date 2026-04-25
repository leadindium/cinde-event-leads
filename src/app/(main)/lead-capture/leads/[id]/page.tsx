import ContainerWhite from '@/components/ds/ContainerWhite';
import LeadDetail from '@/components/app/LeadDetail';

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ContainerWhite>
      <LeadDetail id={id} />
    </ContainerWhite>
  );
}
