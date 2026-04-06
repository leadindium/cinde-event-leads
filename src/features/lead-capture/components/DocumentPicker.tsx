import { useState } from 'react';
import { FileText, Send, X } from 'lucide-react';
import { useLeadStore } from '../store/useLeadStore';
import { showToast } from './Toast';
import type { Document } from '../types';

interface DocumentPickerProps {
  leadId: string;
  sentDocuments: Document[];
}

export default function DocumentPicker({ leadId, sentDocuments }: DocumentPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const documents = useLeadStore((s) => s.config.documents);
  const sendDocument = useLeadStore((s) => s.sendDocument);

  const sentIds = new Set(sentDocuments.map((d) => d.id));

  const handleSend = (doc: Document) => {
    sendDocument(leadId, doc);
    showToast(`Sent "${doc.name}"`);
  };

  return (
    <div>
      {sentDocuments.length > 0 && (
        <div className="space-y-2 mb-3">
          {sentDocuments.map((doc, i) => (
            <div key={`${doc.id}-${i}`} className="flex items-center gap-2 text-sm">
              <FileText size={14} className="text-primary shrink-0" />
              <span className="text-text-primary">{doc.name}</span>
              {doc.sentAt && (
                <span className="text-xs text-text-light ml-auto">
                  {new Date(doc.sentAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
      >
        <Send size={14} /> Send Document
      </button>
      {isOpen && (
        <div className="mt-2 bg-white border border-border rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg">
            <span className="text-xs font-medium text-text-light">Available Documents</span>
            <button onClick={() => setIsOpen(false)} className="text-text-light hover:text-text-primary">
              <X size={14} />
            </button>
          </div>
          {documents.map((doc) => (
            <button
              key={doc.id}
              onClick={() => handleSend(doc)}
              disabled={sentIds.has(doc.id)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-bg transition-colors disabled:opacity-40 disabled:cursor-not-allowed border-b last:border-0 border-border"
            >
              <FileText size={16} className="text-accent shrink-0" />
              <span className="text-left flex-1">{doc.name}</span>
              {sentIds.has(doc.id) ? (
                <span className="text-xs text-text-light">Sent</span>
              ) : (
                <Send size={14} className="text-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
