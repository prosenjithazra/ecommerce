"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-4 text-center space-y-6">

      <div className="relative">
        <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-[#E8E2D6] select-none">
          404
        </h1>
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-[#E8E2D6] text-[10px] font-extrabold px-3 py-0.5 rounded-full shadow-sm text-[#7A736A] tracking-widest uppercase whitespace-nowrap">
          Page Not Found
        </span>
      </div>

      <div className="space-y-2 max-w-sm pt-4">
        <h3 className="font-extrabold text-lg text-[#4A453E] tracking-tight">Design off printable boundaries</h3>
        <p className="text-xs text-[#7A736A] leading-relaxed">
          The page you are looking for has been moved, renamed, or falls outside our canvas printing area.
        </p>
      </div>

      <div className="flex gap-3 pt-2">
        <Link href="/"
          className="bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#A8C69F]/20 flex items-center gap-1.5 active:scale-95">
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/products"
          className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-[#F9A37E]/20 flex items-center gap-1.5 active:scale-95">
          <Compass className="w-4 h-4" /> Browse Shop
        </Link>
      </div>
    </div>
  );
}
