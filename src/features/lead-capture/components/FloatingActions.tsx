import { Camera, PenLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FloatingActions() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      <button
        onClick={() => navigate('/lead-capture/manual')}
        className="w-12 h-12 rounded-full border-2 border-primary text-primary bg-white shadow-lg flex items-center justify-center hover:bg-primary/5 transition-colors"
        title="Manual Entry"
      >
        <PenLine size={20} />
      </button>
      <button
        onClick={() => navigate('/lead-capture/scan')}
        className="w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors"
        title="Scan QR"
      >
        <Camera size={24} />
      </button>
    </div>
  );
}
