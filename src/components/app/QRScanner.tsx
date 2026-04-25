'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faBolt } from '@/lib/icons';
import { useLeadStore } from '@/features/leads/store';
import { useToast } from '@/components/ds/ToastProvider';
import BtnWhite from '@/components/ds/BtnWhite';

const MOCK_QR_DATA = JSON.stringify({
  attendeeId: `ATT-${Math.floor(1000 + Math.random() * 9000)}`,
  fullName: 'Test Attendee',
  email: `test${Math.floor(Math.random() * 1000)}@example.com`,
  phone: '+506 8000-0000',
  company: 'Demo Corp',
  jobTitle: 'Chief Innovation Officer',
  country: 'Costa Rica',
});

export default function QRScanner() {
  const router = useRouter();
  const addLead = useLeadStore((s) => s.addLead);
  const leads = useLeadStore((s) => s.leads);
  const { showToast } = useToast();
  const scannerRef = useRef<{ stop: () => Promise<void> } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const processedRef = useRef(false);

  const processQRData = (data: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      let parsed: Record<string, string>;
      try {
        parsed = JSON.parse(data);
      } catch {
        const url = new URL(data);
        parsed = Object.fromEntries(url.searchParams.entries());
      }

      const { attendeeId, fullName, email, phone, company, jobTitle, country } = parsed;
      if (!fullName || !email) {
        setError('Invalid QR: missing name or email.');
        processedRef.current = false;
        return;
      }

      const existing = leads.find((l) => l.attendeeId === attendeeId || l.email === email);
      if (existing) {
        showToast({
          title: 'Already captured',
          description: 'Opening existing lead.',
          variant: 'info',
        });
        router.push(`/lead-capture/leads/${existing.id}`);
        return;
      }

      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(80);

      const newLead = addLead({
        attendeeId: attendeeId || '',
        fullName,
        email,
        phone: phone || '',
        company: company || '',
        jobTitle: jobTitle || '',
        country: country || '',
        capturedBy: 'María Fernández',
      });

      showToast({ title: 'Lead captured', variant: 'success' });
      router.push(`/lead-capture/leads/${newLead.id}`);
    } catch {
      setError('Could not parse QR code.');
      processedRef.current = false;
    }
  };

  useEffect(() => {
    const containerId = 'qr-reader';
    let cancelled = false;

    (async () => {
      try {
        const { Html5Qrcode } = await import('html5-qrcode');
        if (cancelled) return;
        const html5Qr = new Html5Qrcode(containerId);
        scannerRef.current = html5Qr;
        await html5Qr.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 260 } },
          (decoded) => {
            html5Qr.stop().catch(() => {});
            processQRData(decoded);
          },
          () => {},
        );
        if (!cancelled) setScanning(true);
      } catch {
        setError('Camera not available. Use “Simulate scan” to test the flow.');
      }
    })();

    return () => {
      cancelled = true;
      scannerRef.current?.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 z-30 flex flex-col bg-black">
      <div className="relative z-10 flex items-center gap-3 bg-black/60 p-4 text-white">
        <button
          type="button"
          onClick={() => {
            scannerRef.current?.stop().catch(() => {});
            router.push('/lead-capture');
          }}
          aria-label="Close scanner"
          className="cursor-pointer"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <h2 className="font-semibold">Scan attendee QR</h2>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <div id="qr-reader" className="absolute inset-0 flex items-center justify-center" />
        {!scanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 animate-pulse rounded-2xl border-2 border-white/30" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="max-w-sm rounded-xl bg-white/10 p-6 text-center text-white backdrop-blur">
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 space-y-3 bg-black/60 p-4 text-center">
        <p className="text-sm text-white/60">Point camera at the attendee&apos;s QR badge.</p>
        <BtnWhite
          onClick={() => {
            scannerRef.current?.stop().catch(() => {});
            processQRData(MOCK_QR_DATA);
          }}
        >
          <span className="inline-flex items-center gap-2">
            <FontAwesomeIcon icon={faBolt} />
            Simulate scan (dev)
          </span>
        </BtnWhite>
      </div>
    </div>
  );
}
