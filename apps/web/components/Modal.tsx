"use client";

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white border border-[#E8E2D6] rounded-lg shadow-xl max-w-3xl w-full overflow-hidden z-15 animate-fade-in-up duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8E2D6]">
          <h3 className="font-extrabold text-base text-[#4A453E]">
            {title || "Quick View"}
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#FDFAF6] hover:bg-[#E8E2D6] text-[#A89B8A] hover:text-[#4A453E] transition-all"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto max-h-[80vh] p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
