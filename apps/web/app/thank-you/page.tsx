"use client";

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, Download, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

function ThankYouPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams?.get('orderId') || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

  // Run Confetti on mount!
  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  }, []);

  const handleDownloadInvoice = () => {
    alert("Simulating PDF invoice generation and download for " + orderId);
  };

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-center space-y-6">
      
      {/* Circle Icon */}
      <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center animate-pulse">
        <CheckCircle2 className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-[10px] font-extrabold tracking-widest uppercase text-emerald-600 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-950/20 px-3.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/60">
          Payment Confirmed
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
          Thank you for your order!
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          Your order has been received and is now in the print queue. We have dispatched a confirmation email detailing your receipt.
        </p>
      </div>

      {/* Summary Box */}
      <div className="max-w-sm w-full bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-450">Order Number</span>
          <span className="font-extrabold text-zinc-900 dark:text-white font-mono">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-450">Fulfillment Status</span>
          <span className="font-extrabold text-[#F9A37E]">In Print Queue</span>
        </div>
        <div className="flex justify-between items-center text-xs border-t border-zinc-100 dark:border-zinc-800 pt-3">
          <span className="text-zinc-450">Estimated Dispatch</span>
          <span className="font-bold text-zinc-800 dark:text-zinc-200">In 48 Hours</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <Link
          href="/"
          className="bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-md flex items-center gap-1.5"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
        <button
          onClick={handleDownloadInvoice}
          className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" /> Invoice Receipt
        </button>
        <Link
          href="/orders"
          className="text-xs font-bold text-[#F9A37E] hover:text-[#e8855a] hover:underline flex items-center gap-1"
        >
          Track Shipment <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading Order confirmation...</div>}>
      <ThankYouPageContent />
    </Suspense>
  );
}
