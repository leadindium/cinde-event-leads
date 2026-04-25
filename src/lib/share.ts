import type { Lead } from '@/features/leads/types';

export function getLeadSummaryText(lead: Lead): string {
  const stars = lead.rating ? ' | ' + '★'.repeat(lead.rating) + '☆'.repeat(5 - lead.rating) : '';
  return [
    `${lead.fullName}`,
    `${lead.jobTitle} @ ${lead.company}`,
    lead.email,
    lead.phone,
    lead.country,
    stars,
    lead.notes ? `\nNotes: ${lead.notes}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export async function shareLead(lead: Lead): Promise<boolean> {
  const text = getLeadSummaryText(lead);
  if (navigator.share) {
    try {
      await navigator.share({ title: lead.fullName, text });
      return true;
    } catch {
      // User cancelled or not supported
    }
  }
  // Fallback: copy to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
