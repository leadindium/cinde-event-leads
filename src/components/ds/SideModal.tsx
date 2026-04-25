'use client';
import { useEffect } from 'react';
import { useSideModal } from './SideModalProvider';

export default function SideModal() {
  const { isOpen, closeModal, modalContent } = useSideModal();

  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeModal]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] bg-[#0F1A2E]/80 backdrop-blur-md transition-opacity duration-300"
        onClick={closeModal}
      />
      <div
        className={`fixed top-0 right-0 z-[10000] h-full w-full max-w-screen-lg transform p-2 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full w-full overflow-hidden rounded-2xl bg-white p-4 shadow-xl">
          {modalContent}
        </div>
      </div>
    </>
  );
}
