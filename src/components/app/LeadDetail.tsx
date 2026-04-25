'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faEnvelope,
  faPhone,
  faLocationDot,
  faClock,
  faNoteSticky,
  faPaperPlane,
  faCamera,
  faShareNodes,
  faAddressCard,
  faTrashCan,
} from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnBlue from '@/components/ds/BtnBlue';
import BtnWhite from '@/components/ds/BtnWhite';
import StarRating from './StarRating';
import StatusSelector from './StatusSelector';
import TagPicker from './TagPicker';
import DocumentPicker from './DocumentPicker';
import PhotoGrid from './PhotoGrid';
import Avatar from './Avatar';
import { downloadVCard } from '@/lib/vcard';
import { shareLead } from '@/lib/share';
import { relativeTime } from '@/lib/helpers';

type Props = { id: string };

export default function LeadDetail({ id }: Props) {
  const router = useRouter();
  const lead = useLeadStore((s) => s.leads.find((l) => l.id === id));
  const setRating = useLeadStore((s) => s.setRating);
  const setStatus = useLeadStore((s) => s.setStatus);
  const addTag = useLeadStore((s) => s.addTag);
  const removeTag = useLeadStore((s) => s.removeTag);
  const setNotes = useLeadStore((s) => s.setNotes);
  const deleteLead = useLeadStore((s) => s.deleteLead);
  const { showToast } = useToast();

  const [notes, setLocalNotes] = useState(lead?.notes ?? '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const notesRef = useRef<HTMLDivElement>(null);
  const docsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lead) setLocalNotes(lead.notes);
  }, [lead?.notes, lead]);

  if (!lead) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Lead not found.</p>
        <button
          onClick={() => router.push('/lead-capture')}
          className="text-blue mt-4 cursor-pointer text-sm font-semibold underline"
        >
          Back to leads
        </button>
      </div>
    );
  }

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setNotes(lead.id, value), 500);
  };

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) =>
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });

  const quickActions = [
    {
      icon: faNoteSticky,
      label: 'Add notes',
      onClick: () => scrollTo(notesRef),
    },
    {
      icon: faPaperPlane,
      label: 'Send doc',
      onClick: () => scrollTo(docsRef),
    },
    {
      icon: faCamera,
      label: 'Add photo',
      onClick: () => scrollTo(photosRef),
    },
    {
      icon: faShareNodes,
      label: 'Share',
      onClick: async () => {
        const ok = await shareLead(lead);
        showToast({
          title: ok ? 'Shared' : 'Could not share',
          description: ok ? 'Copied to clipboard.' : '',
          variant: ok ? 'success' : 'error',
        });
      },
    },
    {
      icon: faAddressCard,
      label: 'Save contact',
      onClick: () => {
        downloadVCard(lead);
        showToast({ title: 'vCard downloaded', variant: 'success' });
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      {/* Back link + name */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/lead-capture')}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          aria-label="Back to leads"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <h1 className="text-2xl font-bold">Lead detail</h1>
      </div>

      {/* Header card */}
      <div className="flex items-start gap-4 rounded-2xl bg-white p-5 shadow-sm">
        <Avatar name={lead.fullName} size="xl" />
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold">{lead.fullName}</h2>
          <p className="text-sm text-gray-600">
            {lead.jobTitle} @ {lead.company}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a
              href={`mailto:${lead.email}`}
              className="text-blue inline-flex items-center gap-1.5 hover:underline"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-xs" />
              {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="text-blue inline-flex items-center gap-1.5 hover:underline"
              >
                <FontAwesomeIcon icon={faPhone} className="text-xs" />
                {lead.phone}
              </a>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
            {lead.country && (
              <span className="inline-flex items-center gap-1">
                <FontAwesomeIcon icon={faLocationDot} />
                {lead.country}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <FontAwesomeIcon icon={faClock} />
              Captured {relativeTime(lead.capturedAt)} by {lead.capturedBy}
            </span>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
        {quickActions.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={action.onClick}
            className="flex shrink-0 cursor-pointer flex-col items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-3 text-xs font-semibold text-gray-700 transition-shadow hover:shadow-md"
          >
            <FontAwesomeIcon icon={action.icon} className="text-blue text-base" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Detail sections — todas en un mismo card con dividers */}
      <div className="divide-y divide-gray-200 rounded-2xl bg-white shadow-sm">
        <Section label="Status">
          <StatusSelector status={lead.status} onChange={(s) => setStatus(lead.id, s)} />
        </Section>

        <Section label="Rating">
          <StarRating rating={lead.rating} onChange={(r) => setRating(lead.id, r)} size="lg" />
        </Section>

        <Section label="Tags">
          <TagPicker
            selectedTags={lead.tags}
            onAdd={(tag) => addTag(lead.id, tag)}
            onRemove={(tag) => removeTag(lead.id, tag)}
          />
        </Section>

        <Section label="Notes" innerRef={notesRef}>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about this conversation..."
            className="focus:border-blue focus:ring-blue/20 min-h-[88px] w-full resize-y rounded-lg border border-gray-300 p-3 shadow-xs focus:ring-2 focus:outline-none"
          />
          <p className="mt-1 text-[11px] text-gray-400">Auto-saves as you type.</p>
        </Section>

        <Section label="Documents" innerRef={docsRef}>
          <DocumentPicker leadId={lead.id} sentDocuments={lead.documentsSent} />
        </Section>

        <Section label="Photos" innerRef={photosRef}>
          <PhotoGrid leadId={lead.id} photos={lead.photos} />
        </Section>
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap gap-3">
        <BtnWhite
          onClick={() => {
            downloadVCard(lead);
            showToast({ title: 'vCard downloaded', variant: 'success' });
          }}
        >
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faAddressCard} />
            Save as vCard
          </span>
        </BtnWhite>
        <BtnWhite
          onClick={async () => {
            const ok = await shareLead(lead);
            showToast({
              title: ok ? 'Shared' : 'Could not share',
              variant: ok ? 'success' : 'error',
            });
          }}
        >
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faShareNodes} />
            Share
          </span>
        </BtnWhite>
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="ml-auto inline-flex cursor-pointer items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          <FontAwesomeIcon icon={faTrashCan} />
          Delete lead
        </button>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold">Delete lead</h3>
            <p className="mt-2 text-sm text-gray-600">
              Delete <span className="font-semibold">{lead.fullName}</span>? This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <BtnWhite onClick={() => setShowDeleteConfirm(false)}>Cancel</BtnWhite>
              <BtnBlue
                onClick={() => {
                  deleteLead(lead.id);
                  showToast({ title: 'Lead deleted', variant: 'success' });
                  router.push('/lead-capture');
                }}
              >
                Delete
              </BtnBlue>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  label,
  innerRef,
  children,
}: {
  label: string;
  innerRef?: React.RefObject<HTMLDivElement | null>;
  children: React.ReactNode;
}) {
  return (
    <div ref={innerRef} className="p-5">
      <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">{label}</p>
      {children}
    </div>
  );
}
