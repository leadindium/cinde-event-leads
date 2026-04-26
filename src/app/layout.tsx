import type { Metadata } from 'next';
import '@/lib/fa-config';
import './globals.css';
import { gothamFont } from '@/lib/fonts';
import { ToastProvider } from '@/components/ds/ToastProvider';
import { SideModalProvider } from '@/components/ds/SideModalProvider';
import SideModal from '@/components/ds/SideModal';
import StoreHydrator from '@/features/leads/StoreHydrator';

export const metadata: Metadata = {
  title: 'CINDE Lead Capture — Life Sciences Forum 2026',
  description: 'Captura de leads en feria. Escanea, califica, comparte.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={gothamFont.variable}>
      <body className="antialiased">
        <SideModalProvider>
          <ToastProvider>
            <StoreHydrator />
            {children}
            <SideModal />
          </ToastProvider>
        </SideModalProvider>
      </body>
    </html>
  );
}
