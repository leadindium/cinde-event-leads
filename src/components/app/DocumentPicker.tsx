'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileLines, faPaperPlane, faXmark, faCircleCheck } from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnText from '@/components/ds/BtnText';
import type { Document } from '@/features/leads/types';

type Props = {
  leadId: string;
  sentDocuments: Document[];
};

export default function DocumentPicker({ leadId, sentDocuments }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const documents = useLeadStore((s) => s.config.documents);
  const sendDocument = useLeadStore((s) => s.sendDocument);
  const { showToast } = useToast();

  const sentIds = new Set(sentDocuments.map((d) => d.id));

  return (
    <div>
      {sentDocuments.length > 0 && (
        <div className="mb-3 space-y-2">
          {sentDocuments.map((doc, i) => (
            <div
              key={`${doc.id}-${i}`}
              className="flex items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm"
            >
              <FontAwesomeIcon icon={faCircleCheck} className="text-green-600" />
              <span className="text-gray-800">{doc.name}</span>
              {doc.sentAt && (
                <span className="ml-auto text-xs text-gray-500">
                  Sent {new Date(doc.sentAt).toLocaleDateString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <BtnText onClick={() => setIsOpen((v) => !v)}>
        <span className="inline-flex items-center gap-1.5">
          <FontAwesomeIcon icon={faPaperPlane} />
          Send a document
        </span>
      </BtnText>

      {isOpen && (
        <div className="mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-3 py-2">
            <span className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
              Available documents
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              className="cursor-pointer text-gray-400 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
          {documents.length === 0 && (
            <p className="px-3 py-4 text-center text-xs text-gray-500">
              No documents in library. Upload them in Settings.
            </p>
          )}
          {documents.map((doc) => {
            const alreadySent = sentIds.has(doc.id);
            return (
              <button
                key={doc.id}
                type="button"
                disabled={alreadySent}
                onClick={() => {
                  sendDocument(leadId, doc);
                  showToast({
                    title: 'Document sent',
                    description: `"${doc.name}" delivered to the lead.`,
                    variant: 'success',
                  });
                }}
                className="flex w-full cursor-pointer items-center gap-2 border-b border-gray-200 px-3 py-2.5 text-left text-sm transition-colors last:border-0 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FontAwesomeIcon icon={faFileLines} className="text-blue" />
                <span className="flex-1">{doc.name}</span>
                {alreadySent ? (
                  <span className="text-xs text-gray-500">Sent</span>
                ) : (
                  <FontAwesomeIcon icon={faPaperPlane} className="text-blue text-xs" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
