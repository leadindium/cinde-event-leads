'use client';
import { useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faXmark, faEye } from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnText from '@/components/ds/BtnText';
import type { Photo } from '@/features/leads/types';

type Props = {
  leadId: string;
  photos: Photo[];
};

export default function PhotoGrid({ leadId, photos }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [viewing, setViewing] = useState<string | null>(null);
  const addPhoto = useLeadStore((s) => s.addPhoto);
  const removePhoto = useLeadStore((s) => s.removePhoto);
  const { showToast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      addPhoto(leadId, { id: uuid(), url, takenAt: new Date().toISOString() });
    });
    showToast({
      title: 'Photo added',
      description: `${files.length} photo${files.length > 1 ? 's' : ''} attached.`,
      variant: 'success',
    });
    e.target.value = '';
  };

  return (
    <div>
      {photos.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.url}
                alt=""
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => setViewing(photo.url)}
                  aria-label="View"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-gray-700 shadow-md hover:shadow-lg"
                >
                  <FontAwesomeIcon icon={faEye} className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removePhoto(leadId, photo.id);
                    showToast({ description: 'Photo removed.', variant: 'info' });
                  }}
                  aria-label="Remove"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white text-red-500 shadow-md hover:shadow-lg"
                >
                  <FontAwesomeIcon icon={faXmark} className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleChange}
        className="hidden"
      />
      <BtnText onClick={() => fileRef.current?.click()}>
        <span className="inline-flex items-center gap-1.5">
          <FontAwesomeIcon icon={faCamera} />
          Add photo
        </span>
      </BtnText>

      {viewing && (
        <div
          className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewing(null)}
        >
          <button
            type="button"
            onClick={() => setViewing(null)}
            aria-label="Close"
            className="absolute top-4 right-4 cursor-pointer text-white"
          >
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={viewing} alt="" className="max-h-full max-w-full rounded-lg" />
        </div>
      )}
    </div>
  );
}
