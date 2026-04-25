import Papa from 'papaparse';
import { saveAs } from 'file-saver';
import type { Lead } from '@/features/leads/types';

export function exportLeadsToCSV(leads: Lead[], companyName: string): void {
  const data = leads.map((l) => ({
    'Full Name': l.fullName,
    Email: l.email,
    Phone: l.phone,
    Company: l.company,
    'Job Title': l.jobTitle,
    Country: l.country,
    Rating: l.rating || '',
    Status: l.status,
    Tags: l.tags.join('; '),
    Notes: l.notes,
    'Documents Sent': l.documentsSent.map((d) => d.name).join('; '),
    'Captured At': l.capturedAt,
    'Captured By': l.capturedBy,
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const date = new Date().toISOString().split('T')[0];
  saveAs(blob, `${companyName.replace(/\s+/g, '_')}_leads_${date}.csv`);
}
