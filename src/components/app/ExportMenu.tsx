'use client';
import BtnWhite from '@/components/ds/BtnWhite';
import { useLeadStore } from '@/features/leads/store';
import { exportLeadsToCSV } from '@/lib/csv-export';
import { useToast } from '@/components/ds/ToastProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudArrowDown } from '@/lib/icons';

export default function ExportMenu() {
  const leads = useLeadStore((s) => s.leads);
  const companyName = useLeadStore((s) => s.config.companyName);
  const { showToast } = useToast();

  return (
    <BtnWhite
      onClick={() => {
        exportLeadsToCSV(leads, companyName);
        showToast({
          title: 'Export ready',
          description: `${leads.length} leads exported to CSV.`,
          variant: 'success',
        });
      }}
    >
      <span className="inline-flex items-center gap-2">
        <FontAwesomeIcon icon={faCloudArrowDown} />
        Export
      </span>
    </BtnWhite>
  );
}
