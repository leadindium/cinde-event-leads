'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faPlus,
  faXmark,
  faFileLines,
  faCloudArrowDown,
  faTrashCan,
  faEye,
} from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnBlue from '@/components/ds/BtnBlue';
import BtnIcon from '@/components/ds/BtnIcon';
import Avatar from './Avatar';

export default function SettingsPage() {
  const router = useRouter();
  const config = useLeadStore((s) => s.config);
  const addCustomTag = useLeadStore((s) => s.addCustomTag);
  const removeCustomTag = useLeadStore((s) => s.removeCustomTag);
  const addDocument = useLeadStore((s) => s.addDocument);
  const removeDocument = useLeadStore((s) => s.removeDocument);
  const { showToast } = useToast();

  const [newTag, setNewTag] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (config.customTags.includes(tag)) {
      showToast({ description: 'Tag already exists.', variant: 'warning' });
      return;
    }
    addCustomTag(tag);
    setNewTag('');
    showToast({ title: 'Tag added', variant: 'success' });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doc = {
      id: uuid(),
      name: file.name.replace(/\.pdf$/i, ''),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    };
    addDocument(doc);
    showToast({ title: 'Document uploaded', description: doc.name, variant: 'success' });
    e.target.value = '';
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.push('/lead-capture')}
          aria-label="Back"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      {/* Custom tags */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold">Custom tags</p>
            <p className="text-sm text-gray-500">Categories used when capturing leads.</p>
          </div>
        </div>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            placeholder="Add a new tag..."
            className="focus:border-blue focus:ring-blue/20 flex-1 rounded-lg border border-gray-300 px-3 py-2 shadow-xs focus:ring-2 focus:outline-none"
          />
          <BtnBlue onClick={handleAddTag}>
            <span className="inline-flex items-center gap-2">
              <FontAwesomeIcon icon={faPlus} />
              Add
            </span>
          </BtnBlue>
        </div>
        <div className="flex flex-wrap gap-2">
          {config.customTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm"
            >
              {tag}
              <button
                type="button"
                onClick={() => {
                  removeCustomTag(tag);
                  showToast({ description: 'Tag removed.', variant: 'info' });
                }}
                className="cursor-pointer text-gray-400 transition-colors hover:text-red-500"
                aria-label={`Remove ${tag}`}
              >
                <FontAwesomeIcon icon={faXmark} className="text-xs" />
              </button>
            </span>
          ))}
        </div>
      </section>

      {/* Documents library */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-lg font-bold">Documents library</p>
          <p className="text-sm text-gray-500">PDFs you can email to leads on the spot.</p>
        </div>
        <input ref={fileRef} type="file" accept=".pdf" onChange={handleUpload} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="hover:border-blue hover:text-blue mb-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 transition-colors"
        >
          <FontAwesomeIcon icon={faCloudArrowDown} />
          Upload a PDF document
        </button>
        <div className="space-y-2">
          {config.documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5 transition-colors hover:bg-gray-50"
            >
              <FontAwesomeIcon icon={faFileLines} className="text-blue" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{doc.name}</p>
                <p className="truncate text-xs text-gray-500">{doc.fileName}</p>
              </div>
              <div className="flex items-center gap-1">
                {doc.fileUrl !== '#' && (
                  <BtnIcon
                    icon={faEye}
                    title="Open"
                    onClick={() => window.open(doc.fileUrl, '_blank')}
                  />
                )}
                <BtnIcon
                  icon={faTrashCan}
                  title="Remove"
                  onClick={() => {
                    removeDocument(doc.id);
                    showToast({ description: 'Document removed.', variant: 'info' });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Staff members */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-lg font-bold">Staff at the event</p>
          <p className="text-sm text-gray-500">Team members capturing leads in this booth.</p>
        </div>
        <div className="space-y-2">
          {config.staffMembers.map((staff) => (
            <div
              key={staff.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2.5"
            >
              <Avatar name={staff.name} />
              <div className="flex-1">
                <p className="text-sm font-semibold">{staff.name}</p>
                <p className="text-xs text-gray-500">
                  {staff.role} · {staff.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
