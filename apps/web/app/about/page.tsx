"use client";

import React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '../../components/UIComponents';
import { Sparkles, Heart, Rocket, Compass } from 'lucide-react';

export default function AboutPage() {
  const team = [
    { name: "John Carter", role: "CEO & Co-Founder", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { name: "Sarah Vance", role: "Lead Design Strategist", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { name: "David Kim", role: "VP of Print Operations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
  ];

  const milestones = [
    { year: "2023", title: "Company Scaffolding", desc: "PrintHub was conceptualized with a single high-tech DTG printer in a small Brooklyn garage." },
    { year: "2024", title: "Interactive Canvas Designer Launch", desc: "Built our bespoke real-time HTML canvas designer interface, facilitating drag-and-drop customization online." },
    { year: "2025", title: "Eco-Fulfillment Integration", desc: "Switched all base blanks to certified organic cotton and recycled fleece fabrics." },
    { year: "2026", title: "Nationwide Scaling", desc: "Opened three new fulfillment centers, lowering delivery turnarounds to less than 4 days." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-16">
      <Breadcrumb items={[{ name: "About Us" }]} />

      {/* Header story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            We empower creators to bring designs to life.
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Founded with a passion for quality and design flexibility, PrintHub is a premium print-on-demand storefront. We reject low-grade sublimation and thin materials, offering only heavyweight cotton, durable stitching, and brilliant color direct-to-garment prints.
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Whether you are a solo artist looking to drop a new merchandise line, a corporate manager ordering uniform shirts, or simply designing a gift for a loved one, we print and deliver with absolute care.
          </p>
        </div>
        <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-[32px] overflow-hidden shadow-lg">
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80"
            alt="Print Production Facility"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 space-y-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Our Mission</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            To provide the most intuitive, beautiful, and accessible print-on-demand customization experience online. We enable zero-minimum orders so that creative printing has no entry barriers.
          </p>
        </div>
        <div className="p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Our Vision</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            To become the leading globally sustainable customization ecosystem, utilizing strictly organic materials, biodegradable water-based inks, and automated carbon-neutral fulfillment logistics.
          </p>
        </div>
      </section>

      {/* Milestones timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight text-center">Company Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {milestones.map((m) => (
            <div key={m.year} className="p-6 border border-zinc-150 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/60 relative">
              <span className="text-2xl font-black text-indigo-550 dark:text-indigo-400 block mb-2">{m.year}</span>
              <h4 className="font-bold text-sm text-zinc-850 dark:text-white mb-2">{m.title}</h4>
              <p className="text-[11px] text-zinc-450 dark:text-zinc-400 leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="space-y-8">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight text-center">Meet Our Leadership Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {team.map((t) => (
            <div key={t.name} className="text-center space-y-3 group">
              <div className="w-32 h-32 rounded-full overflow-hidden mx-auto shadow-md border-2 border-transparent group-hover:border-indigo-550 transition-all duration-300">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">{t.name}</h4>
                <p className="text-xs text-zinc-450 mt-0.5">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="p-12 bg-[#4A453E] text-white rounded-[32px] text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#F9A37E]/10 blur-[100px] pointer-events-none" />
        <h2 className="text-3xl font-extrabold tracking-tight max-w-lg mx-auto text-white">Ready to wear your story?</h2>
        <p className="text-xs text-[#E8E2D6]/70 max-w-sm mx-auto">Browse our premium print-ready collection and order with confidence — fast delivery, easy returns.</p>
        <Link
          href="/products"
          className="inline-block bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3.5 px-8 rounded-xl transition-colors shadow-lg"
        >
          Shop Collection →
        </Link>
      </section>
    </div>
  );
}
