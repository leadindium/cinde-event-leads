import { v4 as uuid } from 'uuid';
import type { Lead, CompanyConfig } from '../types';

export const mockCompanyConfig: CompanyConfig = {
  companyId: 'comp-001',
  companyName: 'CINDE',
  customTags: [
    'Decision Maker',
    'Technical Contact',
    'Follow Up Needed',
    'Partnership Opportunity',
    'Interested in Manufacturing',
    'Regulatory Inquiry',
    'Not a Fit',
  ],
  documents: [
    { id: 'doc-1', name: 'Company Overview 2026', fileName: 'Company_Overview_2026.pdf', fileUrl: '#' },
    { id: 'doc-2', name: 'Partnership Opportunities', fileName: 'Partnership_Opportunities.pdf', fileUrl: '#' },
    { id: 'doc-3', name: 'Technical Capabilities Brochure', fileName: 'Technical_Capabilities_Brochure.pdf', fileUrl: '#' },
    { id: 'doc-4', name: 'Costa Rica Operations Fact Sheet', fileName: 'CR_Operations_Fact_Sheet.pdf', fileUrl: '#' },
  ],
  staffMembers: [
    { id: 'staff-1', name: 'María Fernández', email: 'maria.fernandez@cinde.org', role: 'Investment Director' },
    { id: 'staff-2', name: 'Carlos Mora', email: 'carlos.mora@cinde.org', role: 'Business Development' },
    { id: 'staff-3', name: 'Ana Jiménez', email: 'ana.jimenez@cinde.org', role: 'Life Sciences Lead' },
  ],
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(Math.floor(Math.random() * 10) + 8, Math.floor(Math.random() * 60));
  return d.toISOString();
}

export const mockLeads: Lead[] = [
  {
    id: uuid(), attendeeId: 'ATT-1001', fullName: 'Roberto Álvarez', email: 'ralvarez@abbott.com',
    phone: '+506 8844-1122', company: 'Abbott', jobTitle: 'VP Operations',
    country: 'Costa Rica', notes: 'Very interested in expanding manufacturing capacity. Wants follow-up on incentives.',
    rating: 5, tags: ['Decision Maker', 'Partnership Opportunity'], status: 'qualified',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[0], sentAt: daysAgo(0) }],
    capturedAt: daysAgo(0), capturedBy: 'María Fernández', updatedAt: daysAgo(0),
  },
  {
    id: uuid(), attendeeId: 'ATT-1002', fullName: 'Laura Castillo', email: 'lcastillo@bostonscientific.com',
    phone: '+506 7012-3344', company: 'Boston Scientific', jobTitle: 'Quality Director',
    country: 'Costa Rica', notes: 'Discussed regulatory framework. Needs technical capabilities doc.',
    rating: 4, tags: ['Technical Contact', 'Follow Up Needed'], status: 'contacted',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(0), capturedBy: 'Carlos Mora', updatedAt: daysAgo(0),
  },
  {
    id: uuid(), attendeeId: 'ATT-1003', fullName: 'Diego Ramírez', email: 'dramirez@hologic.com',
    phone: '+1 555-0198', company: 'Hologic', jobTitle: 'Regulatory Affairs Manager',
    country: 'United States', notes: 'Interested in regulatory pathway for Class III devices.',
    rating: 4, tags: ['Regulatory Inquiry', 'Follow Up Needed'], status: 'new',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(0), capturedBy: 'Ana Jiménez', updatedAt: daysAgo(0),
  },
  {
    id: uuid(), attendeeId: 'ATT-1004', fullName: 'Sofía Herrera', email: 'sherrera@establishmentlabs.com',
    phone: '+506 6123-4567', company: 'Establishment Labs', jobTitle: 'Plant Manager',
    country: 'Costa Rica', notes: 'Already operating in CR. Exploring expansion for new product line.',
    rating: 5, tags: ['Decision Maker', 'Interested in Manufacturing'], status: 'qualified',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[0], sentAt: daysAgo(0) }, { ...mockCompanyConfig.documents[3], sentAt: daysAgo(0) }],
    capturedAt: daysAgo(0), capturedBy: 'María Fernández', updatedAt: daysAgo(0),
  },
  {
    id: uuid(), attendeeId: 'ATT-1005', fullName: 'Andrés Vargas', email: 'avargas@medela.com',
    phone: '+41 79-234-5678', company: 'Medela', jobTitle: 'Director of Engineering',
    country: 'Switzerland', notes: 'First time exploring LATAM manufacturing. Very early stage.',
    rating: 3, tags: ['Technical Contact'], status: 'new',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(1), capturedBy: 'Carlos Mora', updatedAt: daysAgo(1),
  },
  {
    id: uuid(), attendeeId: 'ATT-1006', fullName: 'Isabella Rojas', email: 'irojas@aligntech.com',
    phone: '+506 7788-9900', company: 'Align Technology', jobTitle: 'Supply Chain Manager',
    country: 'Costa Rica', notes: 'Looking at nearshoring component production.',
    rating: 4, tags: ['Interested in Manufacturing', 'Follow Up Needed'], status: 'contacted',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[2], sentAt: daysAgo(1) }],
    capturedAt: daysAgo(1), capturedBy: 'Ana Jiménez', updatedAt: daysAgo(1),
  },
  {
    id: uuid(), attendeeId: 'ATT-1007', fullName: 'Fernando Monge', email: 'fmonge@bayer.com',
    phone: '+49 170-1234567', company: 'Bayer', jobTitle: 'Head of LATAM Operations',
    country: 'Germany', notes: 'High-level decision maker. Needs executive summary and meeting with director.',
    rating: 5, tags: ['Decision Maker', 'Partnership Opportunity'], status: 'qualified',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[1], sentAt: daysAgo(1) }],
    capturedAt: daysAgo(1), capturedBy: 'María Fernández', updatedAt: daysAgo(1),
  },
  {
    id: uuid(), attendeeId: 'ATT-1008', fullName: 'Valentina Solano', email: 'vsolano@pfizer.com',
    phone: '+1 555-0234', company: 'Pfizer', jobTitle: 'Manufacturing Excellence Lead',
    country: 'United States', notes: 'Benchmarking CR vs other LATAM sites.',
    rating: 3, tags: ['Technical Contact', 'Interested in Manufacturing'], status: 'new',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(1), capturedBy: 'Carlos Mora', updatedAt: daysAgo(1),
  },
  {
    id: uuid(), attendeeId: 'ATT-1009', fullName: 'Mateo Quesada', email: 'mquesada@baxter.com',
    phone: '+506 8345-6789', company: 'Baxter', jobTitle: 'Regulatory Affairs Director',
    country: 'Costa Rica', notes: 'Wants info on CFIA approval timelines for medical devices.',
    rating: 4, tags: ['Regulatory Inquiry'], status: 'contacted',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(2), capturedBy: 'Ana Jiménez', updatedAt: daysAgo(2),
  },
  {
    id: uuid(), attendeeId: 'ATT-1010', fullName: 'Camila Trejos', email: 'ctrejos@icumed.com',
    phone: '+506 7654-3210', company: 'ICU Medical', jobTitle: 'VP Manufacturing',
    country: 'Costa Rica', notes: 'Existing operations in CR. Wants to discuss workforce development programs.',
    rating: 4, tags: ['Decision Maker', 'Partnership Opportunity'], status: 'qualified',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[3], sentAt: daysAgo(2) }],
    capturedAt: daysAgo(2), capturedBy: 'María Fernández', updatedAt: daysAgo(2),
  },
  {
    id: uuid(), attendeeId: 'ATT-1011', fullName: 'Sebastián Ulate', email: 'sulate@stryker.com',
    phone: '+1 555-0567', company: 'Stryker', jobTitle: 'Senior Process Engineer',
    country: 'United States', notes: 'Technical evaluation. Interested in cleanroom capabilities.',
    rating: 3, tags: ['Technical Contact'], status: 'new',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(2), capturedBy: 'Carlos Mora', updatedAt: daysAgo(2),
  },
  {
    id: uuid(), attendeeId: 'ATT-1012', fullName: 'Paula Madrigal', email: 'pmadrigal@medtronic.com',
    phone: '+353 87-1234567', company: 'Medtronic', jobTitle: 'Global Sourcing Manager',
    country: 'Ireland', notes: 'Exploring dual sourcing strategy. Needs cost comparison data.',
    rating: 4, tags: ['Decision Maker', 'Follow Up Needed'], status: 'contacted',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(2), capturedBy: 'Ana Jiménez', updatedAt: daysAgo(2),
  },
  {
    id: uuid(), attendeeId: 'ATT-1013', fullName: 'José Calderón', email: 'jcalderon@coopersurgical.com',
    phone: '+506 6011-2233', company: 'CooperSurgical', jobTitle: 'Operations Director',
    country: 'Costa Rica', notes: 'Not currently looking to expand. Polite conversation only.',
    rating: 1, tags: ['Not a Fit'], status: 'not_interested',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(3), capturedBy: 'Carlos Mora', updatedAt: daysAgo(3),
  },
  {
    id: uuid(), attendeeId: 'ATT-1014', fullName: 'Daniela Esquivel', email: 'desquivel@jnj.com',
    phone: '+1 555-0890', company: 'Johnson & Johnson', jobTitle: 'Site Selection Analyst',
    country: 'United States', notes: 'Active site search underway. Very promising lead. Schedule call next week.',
    rating: 5, tags: ['Decision Maker', 'Partnership Opportunity', 'Follow Up Needed'], status: 'qualified',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[0], sentAt: daysAgo(3) }, { ...mockCompanyConfig.documents[1], sentAt: daysAgo(3) }],
    capturedAt: daysAgo(3), capturedBy: 'María Fernández', updatedAt: daysAgo(3),
  },
  {
    id: uuid(), attendeeId: 'ATT-1015', fullName: 'Gabriel Chaves', email: 'gchaves@zimmer.com',
    phone: '+506 8899-0011', company: 'Zimmer Biomet', jobTitle: 'Quality Assurance Manager',
    country: 'Costa Rica', notes: 'Interested in ISO 13485 certified facilities in country.',
    rating: 3, tags: ['Technical Contact', 'Regulatory Inquiry'], status: 'new',
    photos: [], documentsSent: [],
    capturedAt: daysAgo(3), capturedBy: 'Ana Jiménez', updatedAt: daysAgo(3),
  },
  {
    id: uuid(), attendeeId: 'ATT-1016', fullName: 'Marcela Vindas', email: 'mvindas@bd.com',
    phone: '+506 7111-2233', company: 'Becton Dickinson', jobTitle: 'Plant Director',
    country: 'Costa Rica', notes: 'BD already has large operations in CR. Exploring new product vertical.',
    rating: 4, tags: ['Decision Maker', 'Interested in Manufacturing'], status: 'contacted',
    photos: [], documentsSent: [{ ...mockCompanyConfig.documents[2], sentAt: daysAgo(3) }],
    capturedAt: daysAgo(3), capturedBy: 'María Fernández', updatedAt: daysAgo(3),
  },
];
