import type { Lead } from '../types';

export function generateVCard(lead: Lead): string {
  const nameParts = lead.fullName.split(' ');
  const lastName = nameParts.pop() || '';
  const firstName = nameParts.join(' ');

  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${lastName};${firstName};;;`,
    `FN:${lead.fullName}`,
    lead.company ? `ORG:${lead.company}` : '',
    lead.jobTitle ? `TITLE:${lead.jobTitle}` : '',
    lead.email ? `EMAIL;type=INTERNET;type=WORK:${lead.email}` : '',
    lead.phone ? `TEL;type=WORK:${lead.phone}` : '',
    lead.country ? `ADR;type=WORK:;;;;;;${lead.country}` : '',
    lead.notes ? `NOTE:${lead.notes.replace(/\n/g, '\\n')}` : '',
    'END:VCARD',
  ].filter(Boolean);

  return lines.join('\r\n');
}

export function downloadVCard(lead: Lead): void {
  const vcard = generateVCard(lead);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${lead.fullName.replace(/\s+/g, '_')}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
