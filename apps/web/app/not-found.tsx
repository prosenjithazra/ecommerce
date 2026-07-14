"use client";

import React from 'react';
import Link from 'next/link';
import { Home, Compass, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[78vh] flex flex-col items-center justify-center py-12 px-4 text-center relative overflow-hidden bg-[#FDFAF6]">
      {/* Background Animated Accents */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-[#F9A37E]/10 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-10 right-10 w-44 h-44 bg-[#A8C69F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }} />

      <div className="relative space-y-8 max-w-lg z-10">
        {/* Animated Icon Card */}
        <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center border border-red-100 animate-bounce">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>

        {/* 404 Canvas representation */}
        <div className="relative">
          <h1 className="text-9xl font-black tracking-tighter text-[#E8E2D6] select-none font-serif leading-none relative">
            404
            <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-br from-[#F9A37E] to-[#A8C69F] opacity-10 filter blur-[1px]">404</span>
          </h1>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-[#E8E2D6] text-[10px] font-extrabold px-4 py-1 rounded-full shadow-md text-[#7A736A] tracking-[0.25em] uppercase whitespace-nowrap">
            Page Not Found
          </span>
        </div>

        {/* Subtitle & Explanation */}
        <div className="space-y-3 pt-6">
          <h3 className="font-extrabold text-xl text-[#4A453E] tracking-tight">Design off printable boundaries</h3>
          <p className="text-sm text-[#7A736A] max-w-sm mx-auto leading-relaxed">
            The page you are looking for has been moved, renamed, or falls outside our canvas printing area.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
          <Link href="/"
            className="bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-4 px-8 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/20 flex items-center justify-center gap-2 active:scale-95">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link href="/products"
            className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-4 px-8 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/20 flex items-center justify-center gap-2 active:scale-95">
            <Compass className="w-4 h-4" /> Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
