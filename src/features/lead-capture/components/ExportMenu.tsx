import { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';
import { exportLeadsToCSV } from '../utils/csv-export';
import { showToast } from './Toast';

export default function ExportMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const leads = useLeadStore((s) => s.leads);
  const companyName = useLeadStore((s) => s.config.companyName);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg transition-colors"
      >
        <Download size={16} />
        <span className="hidden sm:inline">Export</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg border border-border shadow-lg z-20 py-1">
          <button
            onClick={() => {
              exportLeadsToCSV(leads, companyName);
              showToast(`Exported ${leads.length} leads`);
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary hover:bg-bg transition-colors"
          >
            <FileSpreadsheet size={16} className="text-emerald-600" />
            Export as CSV
          </button>
        </div>
      )}
    </div>
  );
}
