'use client';
import dynamic from 'next/dynamic';

// html5-qrcode toca window — debe ser client-only y dynamic.
const QRScanner = dynamic(() => import('@/components/app/QRScanner'), { ssr: false });

export default function ScanPage() {
  return <QRScanner />;
}
