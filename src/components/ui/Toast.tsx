import React from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning';
}

export const ToastContainer: React.FC<{
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((t) => {
        const isWarn = t.type === 'warning';
        const isSuccess = t.type === 'success';

        return (
          <div
            key={t.id}
            className="pointer-events-auto p-4 rounded-2xl glass-deep shadow-2xl anim-pop flex items-start gap-3 border border-white/40"
          >
            <div className="mt-0.5 shrink-0">
              {isWarn && <AlertTriangle className="w-4 h-4 text-amber-500" />}
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
              {!isWarn && !isSuccess && <Info className="w-4 h-4 text-core-500" />}
            </div>

            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold text-hi leading-tight">
                {t.title}
              </div>
              {t.description && (
                <div className="text-[12px] text-mid mt-1 leading-snug">
                  {t.description}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-lo hover:text-hi hover:bg-black/[.05] transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
