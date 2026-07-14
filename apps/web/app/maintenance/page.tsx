"use client";

import React from 'react';
import { Settings, ShieldCheck, Heart } from 'lucide-react';

export default function MaintenancePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-[#FDFAF6] relative overflow-hidden select-none">
      {/* Background blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#A8C69F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#F9A37E]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />

      <div className="max-w-lg w-full space-y-4 sm:space-y-6 relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <img src="/logoMainNew.png" alt="Kaiva Fashion" className="h-12 sm:h-16 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
        </div>

        {/* Animated Maintenance Gears */}
        <div className="relative flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mx-auto">
          {/* Outer Gear */}
          <Settings 
            className="w-12 h-12 sm:w-16 sm:h-16 text-[#F9A37E] animate-spin" 
            style={{ animationDuration: '8s' }} 
          />
          {/* Inner Gear */}
          <Settings 
            className="w-8 h-8 sm:w-10 sm:h-10 text-[#A8C69F] absolute top-1.5 right-1.5 sm:top-2 sm:right-2 animate-spin-reverse" 
            style={{ animationDuration: '6s' }} 
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#4A453E] leading-none">
            Tuning Our <span className="text-[#A8C69F]">Printing Presses</span>
          </h1>
          <p className="text-[12px] sm:text-md text-[#7A736A] leading-relaxed max-w-ld mx-auto">
            We are performing scheduled maintenance to improve our catalog selection and order fulfillment backend. We should be back online shortly.
          </p>
        </div>

        {/* Bullet Trust Points */}
        <div className="max-w-sm mx-auto bg-white border border-[#E8E2D6] rounded-xl p-3.5 sm:p-4 shadow-sm text-left space-y-2 sm:space-y-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#A8C69F] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] sm:text-[14px] font-black text-[#4A453E] uppercase tracking-wide">Orders are Safe</p>
              <p className="text-[10px] text-[#7A736A] leading-tight mt-0.5">All existing order details and payments are fully secured.</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Heart className="w-3.5 h-3.5 text-[#F9A37E] mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[12px] sm:text-[14px] font-black text-[#4A453E] uppercase tracking-wide">Customer Support</p>
              <p className="text-[10px] text-[#7A736A] leading-tight mt-0.5">Have an urgent question? Email support@kaivafashion.com anytime.</p>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <p className="text-[12px] sm:text-[14px] font-bold text-[#A89B8A] uppercase tracking-widest pt-2 sm:pt-4">
          Thank you for your patience
        </p>
      </div>
    </div>
  );
}
