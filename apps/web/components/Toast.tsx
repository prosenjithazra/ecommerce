"use client";

import React from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { ToastMessage } from './AppContext';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const config = {
    success: { icon: <CheckCircle2 className="w-5 h-5 text-emerald-500" />, bar: '#A8C69F' },
    error:   { icon: <AlertCircle className="w-5 h-5 text-rose-400" />,    bar: '#F9A37E' },
    info:    { icon: <Info className="w-5 h-5 text-[#A8C69F]" />,          bar: '#E8E2D6' },
  }[toast.type] ?? { icon: <Info className="w-5 h-5 text-[#A8C69F]" />, bar: '#E8E2D6' };

  return (
    <div className="flex items-start gap-3 p-4 bg-white border border-[#E8E2D6] shadow-xl rounded-lg max-w-sm w-full animate-fade-in-up pointer-events-auto overflow-hidden relative">
      {/* left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ backgroundColor: config.bar }} />
      <div className="ml-1 flex-shrink-0 mt-0.5">{config.icon}</div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-[#4A453E]">{toast.title}</h4>
        <p className="text-xs text-[#7A736A] mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-[#A89B8A] hover:text-[#4A453E] transition-colors p-1 flex-shrink-0"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => (
  <div className="fixed bottom-20 sm:bottom-5 right-4 z-[60] flex flex-col gap-2 w-full max-w-xs pointer-events-none">
    {toasts.map(toast => <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />)}
  </div>
);
