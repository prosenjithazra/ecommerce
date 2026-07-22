"use client";

import React from 'react';
import { Breadcrumb } from '../../components/UIComponents';

export default function RefundPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 pb-10 sm:pb-16">
      <Breadcrumb items={[{ name: "Refund Policy" }]} />

      <article className="prose prose-zinc dark:prose-invert space-y-4 sm:space-y-6 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Refund & Returns Policy</h1>
        <p className="text-[10px] text-zinc-400">Last updated: July 10, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">1. Custom On-Demand Products</h2>
          <p>Because every item is custom printed on demand based on your specifications, we do not accept returns or offer refunds for user errors, including choosing incorrect sizes, design positioning, or color combinations.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">2. Damaged Blanks or Print Errors</h2>
          <p>If you receive an item with printing defects (e.g. alignment issues, faded printing, incorrect colors) or structural damage (torn seams, stains on blank garment), we will send a free replacement immediately. Please email us support ticket details including photos within 14 days of delivery.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">3. Refund Processing</h2>
          <p>Approved refunds are processed instantly and returned to your original payment method (Card, Razorpay, UPI wallet) within 5-7 business days depending on bank clearance durations.</p>
        </section>
      </article>
    </div>
  );
}
