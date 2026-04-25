'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';

type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type Toast = ToastOptions & {
  id: number;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (options: ToastOptions) => number;
  dismissToast: (toastId: number) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ duration = 4000, ...options }: ToastOptions) => {
      const id = Number(`${Date.now()}${Math.floor(Math.random() * 1000)}`);
      const toast: Toast = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? 'info',
        duration,
      };
      setToasts((current) => [...current, toast]);
      if (duration !== Infinity) {
        window.setTimeout(() => dismissToast(id), duration);
      }
      return id;
    },
    [dismissToast],
  );

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {isClient &&
        createPortal(
          <div className="pointer-events-none fixed inset-x-0 bottom-6 z-11000 flex flex-col items-center gap-3 px-4 sm:items-end sm:px-6">
            {toasts.map((toast) => (
              <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
            ))}
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

const variantBorder: Record<ToastVariant, string> = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  info: 'border-l-4 border-blue-500',
  warning: 'border-l-4 border-amber-500',
};

const variantDot: Record<ToastVariant, string> = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: number) => void }) {
  const { id, title, description, variant } = toast;
  return (
    <div className="pointer-events-auto w-full max-w-sm">
      <div
        role="status"
        aria-live="polite"
        className={`flex items-start gap-3 rounded-md border border-gray-200 bg-white px-4 py-3 shadow-lg ${variantBorder[variant]}`}
      >
        <span
          className={`mt-1 inline-block h-2 w-2 rounded-full ${variantDot[variant]}`}
          aria-hidden
        />
        <div className="flex-1">
          {title && <p className="text-sm font-semibold text-gray-900">{title}</p>}
          {description && <p className="mt-1 text-sm leading-5 text-gray-600">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          aria-label="Dismiss notification"
          className="ml-2 cursor-pointer text-gray-400 transition hover:text-gray-600"
        >
          x
        </button>
      </div>
    </div>
  );
}
