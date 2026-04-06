import { useState, useRef } from 'react';
import { Camera, X, Maximize2 } from 'lucide-react';
import { v4 as uuid } from 'uuid';
import { useLeadStore } from '../store/useLeadStore';
import { showToast } from './Toast';

interface PhotoGridProps {
  leadId: string;
  photos: { id: string; url: string; caption?: string; takenAt: string }[];
}

export default function PhotoGrid({ leadId, photos }: PhotoGridProps) {
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const addPhoto = useLeadStore((s) => s.addPhoto);
  const removePhoto = useLeadStore((s) => s.removePhoto);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      addPhoto(leadId, { id: uuid(), url, takenAt: new Date().toISOString() });
    });
    showToast(`Added ${files.length} photo${files.length > 1 ? 's' : ''}`);
    e.target.value = '';
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {photos.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img src={photo.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <button
                onClick={() => setViewingPhoto(photo.url)}
                className="p-1.5 bg-white/90 rounded-full"
              >
                <Maximize2 size={14} />
              </button>
              <button
                onClick={() => {
                  removePhoto(leadId, photo.id);
                  showToast('Photo removed');
                }}
                className="p-1.5 bg-white/90 rounded-full text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="text-sm text-primary font-medium hover:underline flex items-center gap-1"
      >
        <Camera size={14} /> Add Photo
      </button>

      {/* Lightbox */}
      {viewingPhoto && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setViewingPhoto(null)}
        >
          <button className="absolute top-4 right-4 text-white" onClick={() => setViewingPhoto(null)}>
            <X size={24} />
          </button>
          <img src={viewingPhoto} alt="" className="max-w-full max-h-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
