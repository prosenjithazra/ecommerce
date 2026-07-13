"use client";

import React from 'react';
import { Breadcrumb } from '../../components/UIComponents';

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Shipping Policy" }]} />

      <article className="prose prose-zinc dark:prose-invert space-y-6 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Shipping Policy</h1>
        <p className="text-[10px] text-zinc-400">Last updated: July 10, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">1. Production & Fulfillment Times</h2>
          <p>Unlike standard commerce stores, all custom items are printed on demand. Production time ranges between 2-3 business days. High-volume periods (holiday peaks) may extend printing durations by 1-2 days.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">2. Shipping Durations & Charges</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Standard Ground Shipping</strong>: Free for orders above ₹50 (otherwise ₹5.99). Takes 4-6 business days to arrive.</li>
            <li><strong>Express Air Shipping</strong>: ₹14.99 flat. Takes 2-3 business days.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-905 dark:text-white">3. Package Tracking</h2>
          <p>Once your custom order has been printed and packaged, we will send an email confirmation containing your DHL tracking number and timeline. You can check order statuses at any time under your profile dashboard.</p>
        </section>
      </article>
    </div>
  );
}
