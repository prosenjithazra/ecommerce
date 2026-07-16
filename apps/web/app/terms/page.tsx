"use client";

import React from 'react';
import { Breadcrumb } from '../../components/UIComponents';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Terms & Conditions" }]} />

      <article className="prose prose-zinc dark:prose-invert space-y-6 text-xs text-zinc-650 dark:text-zinc-400 leading-relaxed">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Terms & Conditions</h1>
        <p className="text-[10px] text-zinc-400">Last updated: July 10, 2026</p>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">1. User Agreement</h2>
          <p>By accessing Kliamo Fashion and utilizing our design tools or placing purchase orders, you agree to comply with our platform terms. You verify that you are at least 18 years old or are using the storefront under guardian supervision.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">2. Graphic Content Guidelines</h2>
          <p>You verify that you hold legal copyright permissions for all images, logos, and custom graphics you upload onto our canvas designer. We reserve the right to cancel orders containing copyrighted material, hate speech, explicit violence, or illegal trademark infringements.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-extrabold text-zinc-900 dark:text-white">3. Custom Order Fulfillment</h2>
          <p>Because items are printed on demand based on your sizing and design layout, orders cannot be changed or cancelled once they enter the &ldquo;Processing &amp; Print&rdquo; stage. Sizing details are provided inside each product page; please check them before confirming transactions.</p>
        </section>
      </article>
    </div>
  );
}
