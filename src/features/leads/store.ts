import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuid } from 'uuid';
import type { Lead, LeadStatus, CompanyConfig, Document, Photo } from './types';
import { mockLeads, mockCompanyConfig } from './mock-data';

type AddLeadInput = Omit<
  Lead,
  | 'id'
  | 'capturedAt'
  | 'updatedAt'
  | 'status'
  | 'photos'
  | 'documentsSent'
  | 'tags'
  | 'rating'
  | 'notes'
> &
  Partial<Pick<Lead, 'status' | 'photos' | 'documentsSent' | 'tags' | 'rating' | 'notes'>>;

interface LeadStore {
  leads: Lead[];
  config: CompanyConfig;

  // Lead CRUD
  addLead: (lead: AddLeadInput) => Lead;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  getLeadById: (id: string) => Lead | undefined;

  // Lead actions
  setRating: (id: string, rating: number) => void;
  setStatus: (id: string, status: LeadStatus) => void;
  addTag: (id: string, tag: string) => void;
  removeTag: (id: string, tag: string) => void;
  setNotes: (id: string, notes: string) => void;
  sendDocument: (leadId: string, doc: Document) => void;
  addPhoto: (leadId: string, photo: Photo) => void;
  removePhoto: (leadId: string, photoId: string) => void;

  // Config
  addCustomTag: (tag: string) => void;
  removeCustomTag: (tag: string) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (docId: string) => void;
}

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      leads: mockLeads,
      config: mockCompanyConfig,

      addLead: (data) => {
        const now = new Date().toISOString();
        const newLead: Lead = {
          id: uuid(),
          ...data,
          notes: data.notes ?? '',
          rating: data.rating ?? 0,
          tags: data.tags ?? [],
          status: data.status ?? 'new',
          photos: data.photos ?? [],
          documentsSent: data.documentsSent ?? [],
          capturedAt: now,
          updatedAt: now,
        };
        set((s) => ({ leads: [newLead, ...s.leads] }));
        return newLead;
      },

      updateLead: (id, updates) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l,
          ),
        })),

      deleteLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      getLeadById: (id) => get().leads.find((l) => l.id === id),

      setRating: (id, rating) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, rating, updatedAt: new Date().toISOString() } : l,
          ),
        })),

      setStatus: (id, status) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l,
          ),
        })),

      addTag: (id, tag) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id && !l.tags.includes(tag)
              ? { ...l, tags: [...l.tags, tag], updatedAt: new Date().toISOString() }
              : l,
          ),
        })),

      removeTag: (id, tag) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id
              ? { ...l, tags: l.tags.filter((t) => t !== tag), updatedAt: new Date().toISOString() }
              : l,
          ),
        })),

      setNotes: (id, notes) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === id ? { ...l, notes, updatedAt: new Date().toISOString() } : l,
          ),
        })),

      sendDocument: (leadId, doc) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  documentsSent: [...l.documentsSent, { ...doc, sentAt: new Date().toISOString() }],
                  updatedAt: new Date().toISOString(),
                }
              : l,
          ),
        })),

      addPhoto: (leadId, photo) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId
              ? { ...l, photos: [...l.photos, photo], updatedAt: new Date().toISOString() }
              : l,
          ),
        })),

      removePhoto: (leadId, photoId) =>
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  photos: l.photos.filter((p) => p.id !== photoId),
                  updatedAt: new Date().toISOString(),
                }
              : l,
          ),
        })),

      addCustomTag: (tag) =>
        set((s) => ({ config: { ...s.config, customTags: [...s.config.customTags, tag] } })),

      removeCustomTag: (tag) =>
        set((s) => ({
          config: { ...s.config, customTags: s.config.customTags.filter((t) => t !== tag) },
        })),

      addDocument: (doc) =>
        set((s) => ({ config: { ...s.config, documents: [...s.config.documents, doc] } })),

      removeDocument: (docId) =>
        set((s) => ({
          config: { ...s.config, documents: s.config.documents.filter((d) => d.id !== docId) },
        })),
    }),
    {
      name: 'cinde-leads-store',
      storage: createJSONStorage(() => localStorage),
      // SSR-safe: el render inicial siempre usa mockLeads (server + client primer render).
      // El layout monta <StoreHydrator/> que llama .rehydrate() en useEffect.
      // Sin esto, el store tendría datos distintos en server vs client → hydration mismatch.
      skipHydration: true,
      // No persistir las photos (son object URLs que mueren al refrescar).
      partialize: (state) => ({
        ...state,
        leads: state.leads.map((l) => ({ ...l, photos: [] as Photo[] })),
      }),
    },
  ),
);
