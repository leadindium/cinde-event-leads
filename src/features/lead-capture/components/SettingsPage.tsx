import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, X, FileText, Upload, Eye, Trash2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useLeadStore } from '../store/useLeadStore';
import { showToast } from './Toast';

export default function SettingsPage() {
  const navigate = useNavigate();
  const config = useLeadStore((s) => s.config);
  const { addCustomTag, removeCustomTag, addDocument, removeDocument } = useLeadStore();
  const [newTag, setNewTag] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const tag = newTag.trim();
    if (!tag) return;
    if (config.customTags.includes(tag)) {
      showToast('Tag already exists');
      return;
    }
    addCustomTag(tag);
    setNewTag('');
    showToast('Tag added');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const doc = {
      id: uuid(),
      name: file.name.replace(/\.pdf$/i, ''),
      fileName: file.name,
      fileUrl: URL.createObjectURL(file),
    };
    addDocument(doc);
    showToast(`"${doc.name}" uploaded`);
    e.target.value = '';
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 p-4 border-b border-border bg-white sticky top-0 z-10">
        <button onClick={() => navigate('/lead-capture')} className="text-text-light hover:text-text-primary">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold text-text-primary">Settings</h2>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Custom Tags */}
        <div className="bg-white rounded-lg border border-border p-4 lg:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-text-primary mb-4">Custom Tags</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              placeholder="Add a new tag..."
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            <button
              onClick={handleAddTag}
              className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {config.customTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm bg-bg text-text-primary border border-border"
              >
                {tag}
                <button
                  onClick={() => { removeCustomTag(tag); showToast('Tag removed'); }}
                  className="text-text-light hover:text-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Documents Library */}
        <div className="bg-white rounded-lg border border-border p-4 lg:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-text-primary mb-4">Documents Library</h3>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 mb-4 border border-dashed border-border rounded-lg text-sm text-text-light hover:border-primary hover:text-primary transition-colors w-full justify-center"
          >
            <Upload size={16} /> Upload PDF Document
          </button>
          <div className="space-y-2">
            {config.documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-bg transition-colors"
              >
                <FileText size={18} className="text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                  <p className="text-xs text-text-light">{doc.fileName}</p>
                </div>
                <div className="flex items-center gap-1">
                  {doc.fileUrl !== '#' && (
                    <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-text-light hover:text-primary">
                      <Eye size={16} />
                    </a>
                  )}
                  <button
                    onClick={() => { removeDocument(doc.id); showToast('Document removed'); }}
                    className="p-1.5 text-text-light hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Members */}
        <div className="bg-white rounded-lg border border-border p-4 lg:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <h3 className="font-semibold text-text-primary mb-4">Staff Members</h3>
          <div className="space-y-2">
            {config.staffMembers.map((staff) => (
              <div
                key={staff.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                  {staff.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{staff.name}</p>
                  <p className="text-xs text-text-light">{staff.role} &middot; {staff.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
