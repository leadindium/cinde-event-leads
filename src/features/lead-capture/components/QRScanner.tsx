import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import { useLeadStore } from '../store/useLeadStore';
import { showToast } from './Toast';

const MOCK_QR_DATA = JSON.stringify({
  attendeeId: 'ATT-9999',
  fullName: 'Test Attendee',
  email: 'test@example.com',
  phone: '+506 8000-0000',
  company: 'Demo Corp',
  jobTitle: 'Chief Innovation Officer',
  country: 'Costa Rica',
});

export default function QRScanner() {
  const navigate = useNavigate();
  const addLead = useLeadStore((s) => s.addLead);
  const leads = useLeadStore((s) => s.leads);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const processedRef = useRef(false);

  const processQRData = (data: string) => {
    if (processedRef.current) return;
    processedRef.current = true;

    try {
      let parsed: Record<string, string>;
      // Try JSON first
      try {
        parsed = JSON.parse(data);
      } catch {
        // Try URL query params
        const url = new URL(data);
        parsed = Object.fromEntries(url.searchParams.entries());
      }

      const { attendeeId, fullName, email, phone, company, jobTitle, country } = parsed;

      if (!fullName || !email) {
        setError('Invalid QR code: missing name or email');
        processedRef.current = false;
        return;
      }

      // Check for duplicate
      const existing = leads.find((l) => l.attendeeId === attendeeId || l.email === email);
      if (existing) {
        showToast('Lead already captured — opening existing');
        navigate(`/lead-capture/leads/${existing.id}`);
        return;
      }

      // Haptic feedback
      if (navigator.vibrate) navigator.vibrate(100);

      const newLead = addLead({
        attendeeId: attendeeId || '',
        fullName,
        email,
        phone: phone || '',
        company: company || '',
        jobTitle: jobTitle || '',
        country: country || '',
        capturedBy: 'Current User',
      });

      showToast('Lead captured!');
      navigate(`/lead-capture/leads/${newLead.id}`);
    } catch {
      setError('Could not parse QR code');
      processedRef.current = false;
    }
  };

  useEffect(() => {
    const scannerId = 'qr-reader';
    let html5QrCode: Html5Qrcode;

    const startScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(scannerId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 250, height: 250 } },
          (decodedText) => {
            html5QrCode.stop().catch(() => {});
            processQRData(decodedText);
          },
          () => {}
        );
        setScanning(true);
      } catch (err) {
        setError('Camera access denied or not available. Use "Simulate Scan" to test.');
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black z-30 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center gap-3 p-4 bg-black/60 text-white relative z-10">
        <button
          onClick={() => {
            scannerRef.current?.stop().catch(() => {});
            navigate('/lead-capture');
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-semibold">Scan QR Code</h2>
      </div>

      {/* Scanner area */}
      <div className="flex-1 flex items-center justify-center relative">
        <div id="qr-reader" className="w-full max-w-md" />

        {!scanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 border-2 border-white/30 rounded-2xl animate-pulse" />
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center text-white max-w-sm">
              <p className="text-sm mb-4">{error}</p>
              <button
                onClick={() => { setError(null); processedRef.current = false; }}
                className="text-sm text-secondary underline"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom */}
      <div className="p-4 bg-black/60 text-center relative z-10 space-y-3">
        <p className="text-white/60 text-sm">Point camera at attendee's QR code</p>
        <button
          onClick={() => {
            scannerRef.current?.stop().catch(() => {});
            processQRData(MOCK_QR_DATA);
          }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-warm/20 text-warm rounded-lg text-sm font-medium border border-warm/30"
        >
          <Zap size={16} /> Simulate Scan (Dev)
        </button>
      </div>
    </div>
  );
}
