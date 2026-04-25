'use client';
import { createContext, useContext, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type SideModalContextValue = {
  isOpen: boolean;
  modalContent: ReactNode | null;
  openModal: (content: ReactNode, routeOnClose?: string) => void;
  closeModal: () => void;
};

const SideModalContext = createContext<SideModalContextValue | undefined>(undefined);

export function SideModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [routeOnClose, setRouteOnClose] = useState<string | undefined>(undefined);
  const router = useRouter();

  const openModal = (content: ReactNode, route?: string) => {
    setModalContent(content);
    setIsOpen(true);
    setRouteOnClose(route);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalContent(null);
    if (routeOnClose) router.push(routeOnClose);
    setRouteOnClose(undefined);
  };

  return (
    <SideModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>
      {children}
    </SideModalContext.Provider>
  );
}

export function useSideModal() {
  const ctx = useContext(SideModalContext);
  if (!ctx) throw new Error('useSideModal must be used within a SideModalProvider');
  return ctx;
}
