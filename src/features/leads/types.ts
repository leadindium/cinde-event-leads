export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'not_interested';

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  takenAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileUrl: string;
  sentAt?: string;
}

export interface Lead {
  id: string;
  attendeeId: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  notes: string;
  rating: number;
  tags: string[];
  status: LeadStatus;
  photos: Photo[];
  documentsSent: Document[];
  capturedAt: string;
  capturedBy: string;
  updatedAt: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface CompanyConfig {
  companyId: string;
  companyName: string;
  customTags: string[];
  documents: Document[];
  staffMembers: StaffMember[];
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  not_interested: 'Not interested',
};

export const STATUS_COLORS: Record<LeadStatus, 'blue' | 'yellow' | 'green' | 'gray'> = {
  new: 'blue',
  contacted: 'yellow',
  qualified: 'green',
  not_interested: 'gray',
};
