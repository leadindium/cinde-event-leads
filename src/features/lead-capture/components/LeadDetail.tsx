import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft, Mail, Phone, MapPin, Clock,
  Star, Tag, FileText, Camera, Share2, Contact, Trash2,
} from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';
import StarRating from './StarRating';
import StatusSelector from './StatusSelector';
import TagPicker from './TagPicker';
import DocumentPicker from './DocumentPicker';
import PhotoGrid from './PhotoGrid';
import { getInitials, getAvatarColor, relativeTime } from '../utils/helpers';
import { downloadVCard } from '../utils/vcard';
import { shareLead } from '../utils/share';
import { showToast } from './Toast';

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const lead = useLeadStore((s) => s.leads.find((l) => l.id === id));
  const { setRating, setStatus, addTag, removeTag, setNotes, deleteLead } = useLeadStore();

  const [notes, setLocalNotes] = useState(lead?.notes || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (lead) setLocalNotes(lead.notes);
  }, [lead?.notes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (id) setNotes(id, value);
    }, 500);
  };

  if (!lead) {
    return (
      <div className="p-6 text-center">
        <p className="text-text-light">Lead not found</p>
        <button onClick={() => navigate('/lead-capture')} className="text-primary mt-2 text-sm font-medium">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const quickActions = [
    { icon: Star, label: 'Rate', key: 'rate' },
    { icon: Tag, label: 'Tag', key: 'tag' },
    { icon: FileText, label: 'Send Doc', key: 'doc' },
    { icon: Camera, label: 'Photo', key: 'photo' },
    {
      icon: Share2, label: 'Share', key: 'share',
      action: async () => {
        const ok = await shareLead(lead);
        showToast(ok ? 'Shared / copied to clipboard' : 'Could not share');
      },
    },
    {
      icon: Contact, label: 'Save Contact', key: 'vcard',
      action: () => {
        downloadVCard(lead);
        showToast('vCard downloaded');
      },
    },
  ];

  return (
    <div className="max-w-3xl mx-auto w-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-white sticky top-0 z-10">
        <button onClick={() => navigate('/lead-capture')} className="text-text-light hover:text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-text-primary">Lead Detail</h2>
      </div>

      <div className="p-4 lg:p-6 space-y-6 pb-24">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
            style={{ backgroundColor: getAvatarColor(lead.fullName) }}
          >
            {getInitials(lead.fullName)}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-text-primary">{lead.fullName}</h1>
            <p className="text-sm text-text-light">{lead.jobTitle} @ {lead.company}</p>
            <div className="flex flex-wrap gap-3 mt-2 text-sm">
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1 text-secondary hover:underline">
                <Mail size={14} /> {lead.email}
              </a>
              {lead.phone && (
                <a href={`tel:${lead.phone}`} className="flex items-center gap-1 text-secondary hover:underline">
                  <Phone size={14} /> {lead.phone}
                </a>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-light">
              {lead.country && <span className="flex items-center gap-1"><MapPin size={12} /> {lead.country}</span>}
              <span className="flex items-center gap-1"><Clock size={12} /> {relativeTime(lead.capturedAt)}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 lg:mx-0 lg:px-0">
          {quickActions.map((qa) => (
            <button
              key={qa.key}
              onClick={() => qa.action ? qa.action() : setActiveSection(activeSection === qa.key ? null : qa.key)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg border text-xs font-medium transition-colors shrink-0 ${
                activeSection === qa.key
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-light hover:bg-bg'
              }`}
            >
              <qa.icon size={18} />
              {qa.label}
            </button>
          ))}
        </div>

        {/* Status */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Status</label>
          <StatusSelector status={lead.status} onChange={(s) => setStatus(lead.id, s)} />
        </div>

        {/* Rating */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Rating</label>
          <StarRating rating={lead.rating} onChange={(r) => setRating(lead.id, r)} size={28} />
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Tags</label>
          <TagPicker
            selectedTags={lead.tags}
            onAdd={(tag) => addTag(lead.id, tag)}
            onRemove={(tag) => removeTag(lead.id, tag)}
          />
        </div>

        {/* Notes */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Add notes about this conversation..."
            className="w-full min-h-[80px] text-sm border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
          />
        </div>

        {/* Documents */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Documents</label>
          <DocumentPicker leadId={lead.id} sentDocuments={lead.documentsSent} />
        </div>

        {/* Photos */}
        <div className="bg-white rounded-lg border border-border p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <label className="text-xs font-semibold text-text-light uppercase tracking-wider mb-2 block">Photos</label>
          <PhotoGrid leadId={lead.id} photos={lead.photos} />
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => { downloadVCard(lead); showToast('vCard downloaded'); }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg transition-colors"
          >
            <Contact size={16} /> Export Contact
          </button>
          <button
            onClick={async () => {
              const ok = await shareLead(lead);
              showToast(ok ? 'Shared / copied' : 'Could not share');
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg transition-colors"
          >
            <Share2 size={16} /> Share
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors ml-auto"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold text-text-primary mb-2">Delete Lead</h3>
            <p className="text-sm text-text-light mb-4">
              Are you sure you want to delete {lead.fullName}? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-bg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteLead(lead.id);
                  navigate('/lead-capture');
                  showToast('Lead deleted');
                }}
                className="px-4 py-2 text-sm font-medium bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
