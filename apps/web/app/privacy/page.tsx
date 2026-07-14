"use client";

import React from 'react';
import { Breadcrumb } from '../../components/UIComponents';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Privacy Policy" }]} />

      <article className="prose prose-zinc dark:prose-invert space-y-6 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Privacy Policy</h1>
        <p className="text-[10px] text-zinc-400">Last updated: July 10, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">1. Information We Collect</h2>
          <p>We collect personal information that you provide directly to us when setting up an account, using our interactive design canvas designer, or placing custom print orders. This includes name, billing details, shipping address, phone number, and uploaded custom graphics/images.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">2. How We Use Your Data</h2>
          <p>We utilize your data strictly to fulfill order print logistics, verify payments, manage account dashboards, and send shipment notifications. We do not sell or lease your custom designs or personal information to third parties.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">3. Image & Asset Ownership</h2>
          <p>You retain 100% intellectual property ownership of all custom texts and design images you upload onto the Kaiva Fashion workspace. We hold assets temporarily in secure cache memory to print onto physical blanks before deleting them according to security compliance.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">4. Cookies & Security</h2>
          <p>We use standard functional cookies to persist your checkout details and cart/wishlist items across sessions. All payments are verified securely via 256-bit SSL encrypted channels.</p>
        </section>
      </article>
    </div>
  );
}
