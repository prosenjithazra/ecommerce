"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '../../components/UIComponents';
import { Rocket, Compass } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

const FALLBACK_ABOUT = {
  badge: "Our Story",
  title: "We empower creators to bring designs to life.",
  story1: "Founded with a passion for quality and design flexibility, Kaiva Fashion is a premium print-on-demand storefront. We reject low-grade sublimation and thin materials, offering only heavyweight cotton, durable stitching, and brilliant color direct-to-garment prints.",
  story2: "Whether you are a solo artist looking to drop a new merchandise line, a corporate manager ordering uniform shirts, or simply designing a gift for a loved one, we print and deliver with absolute care.",
  image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
  missionTitle: "Our Mission",
  missionDesc: "To provide the most intuitive, beautiful, and accessible print-on-demand customization experience online. We enable zero-minimum orders so that creative printing has no entry barriers.",
  visionTitle: "Our Vision",
  visionDesc: "To become the leading globally sustainable customization ecosystem, utilizing strictly organic materials, biodegradable water-based inks, and automated carbon-neutral fulfillment logistics.",
  milestones: [
    { year: "2023", title: "Company Scaffolding", desc: "Kaiva Fashion was conceptualized with a single high-tech DTG printer in a small Brooklyn garage." },
    { year: "2024", title: "Interactive Canvas Designer Launch", desc: "Built our bespoke real-time HTML canvas designer interface, facilitating drag-and-drop customization online." },
    { year: "2025", title: "Eco-Fulfillment Integration", desc: "Switched all base blanks to certified organic cotton and recycled fleece fabrics." },
    { year: "2026", title: "Nationwide Scaling", desc: "Opened three new fulfillment centers, lowering delivery turnarounds to less than 4 days." }
  ],
  team: [
    { name: "John Carter", role: "CEO & Co-Founder", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80" },
    { name: "Sarah Vance", role: "Lead Design Strategist", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80" },
    { name: "David Kim", role: "VP of Print Operations", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80" }
  ],
  ctaTitle: "Ready to wear your story?",
  ctaDesc: "Browse our premium print-ready collection and order with confidence — fast delivery, easy returns."
};

export default function AboutPage() {
  const [data, setData] = useState(FALLBACK_ABOUT);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl("/about"))
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load custom About Us settings");
      })
      .then((dbData) => {
        if (dbData) {
          setData({
            badge: dbData.badge || FALLBACK_ABOUT.badge,
            title: dbData.title || FALLBACK_ABOUT.title,
            story1: dbData.story1 || FALLBACK_ABOUT.story1,
            story2: dbData.story2 || FALLBACK_ABOUT.story2,
            image: dbData.image || FALLBACK_ABOUT.image,
            missionTitle: dbData.missionTitle || FALLBACK_ABOUT.missionTitle,
            missionDesc: dbData.missionDesc || FALLBACK_ABOUT.missionDesc,
            visionTitle: dbData.visionTitle || FALLBACK_ABOUT.visionTitle,
            visionDesc: dbData.visionDesc || FALLBACK_ABOUT.visionDesc,
            milestones: dbData.milestones || FALLBACK_ABOUT.milestones,
            team: dbData.team || FALLBACK_ABOUT.team,
            ctaTitle: dbData.ctaTitle || FALLBACK_ABOUT.ctaTitle,
            ctaDesc: dbData.ctaDesc || FALLBACK_ABOUT.ctaDesc
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-16 pb-16">
        <Breadcrumb items={[{ name: "About Us" }]} />

        {/* Header story skeleton */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
          <div className="space-y-[16px] md:space-y-6">
            {/* Badge skeleton */}
            <div className="w-24 h-6 rounded-full skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            {/* Title skeleton */}
            <div className="space-y-2">
              <div className="w-3/4 h-8 sm:h-12 rounded-lg skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-1/2 h-8 sm:h-12 rounded-lg skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            </div>
            {/* Story paragraphs skeleton */}
            <div className="space-y-3 pt-2">
              <div className="w-full h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-full h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-5/6 h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="w-full h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-11/12 h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          {/* Image skeleton */}
          <div className="aspect-video bg-zinc-150 dark:bg-zinc-800 rounded-[16px] md:rounded-[32px] skeleton-shimmer" />
        </section>

        {/* Mission & Vision skeleton */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[16px] md:rounded-lg border border-zinc-200/50 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-lg skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-32 h-6 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="w-full h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-5/6 h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
          <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[16px] md:rounded-lg border border-zinc-200/50 dark:border-zinc-800 space-y-4">
            <div className="w-12 h-12 rounded-lg skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            <div className="w-32 h-6 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-2">
              <div className="w-full h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              <div className="w-5/6 h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
            </div>
          </div>
        </section>

        {/* Milestones timeline skeleton */}
        <section className="space-y-8">
          <div className="w-48 h-8 mx-auto rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 md:p-6 border border-zinc-150 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900/60 space-y-3">
                <div className="w-12 h-8 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-24 h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-full h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </section>

        {/* Team skeleton */}
        <section className="space-y-8">
          <div className="w-56 h-8 mx-auto rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
          <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="text-center space-y-3 w-36 sm:w-40 flex flex-col items-center">
                <div className="w-32 h-32 rounded-full skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-24 h-4 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
                <div className="w-16 h-3 rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-800" />
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action skeleton */}
        <section className="p-6 md:p-12 bg-zinc-100 dark:bg-zinc-800 rounded-[20px] md:rounded-[32px] text-center space-y-4 md:space-y-6">
          <div className="w-64 h-8 mx-auto rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-700" />
          <div className="w-80 max-w-full h-4 mx-auto rounded skeleton-shimmer bg-zinc-200 dark:bg-zinc-700" />
          <div className="w-32 h-10 mx-auto rounded-lg skeleton-shimmer bg-zinc-200 dark:bg-zinc-700" />
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 md:space-y-16 pb-16">
      <Breadcrumb items={[{ name: "About Us" }]} />

      {/* Header story */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">
        <div className="space-y-[16px] md:space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full">
            {data.badge}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">
            {data.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {data.story1}
          </p>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {data.story2}
          </p>
        </div>
        <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 rounded-[16px] md:rounded-[32px] overflow-hidden shadow-lg">
          <img
            src={data.image}
            alt="Print Production Facility"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
        <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900/40 rounded-[16px] md:rounded-lg border border-zinc-200/50 dark:border-zinc-800 space-y-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">{data.missionTitle}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {data.missionDesc}
          </p>
        </div>
        <div className="p-4 md:p-8 bg-zinc-50 dark:bg-zinc-900/40  rounded-[16px] md:rounded-lg border border-zinc-200/50 dark:border-zinc-800 space-y-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-lg flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">{data.visionTitle}</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {data.visionDesc}
          </p>
        </div>
      </section>

      {/* Milestones timeline */}
      <section className="space-y-8">
        <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white tracking-tight text-center">Company Milestones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {data.milestones.map((m) => (
            <div key={m.year} className="p-3 md:p-6 border border-zinc-150 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900/60 relative">
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
        <div className="flex flex-wrap gap-6 md:gap-8 justify-center">
          {data.team.map((t) => (
            <div key={t.name} className="text-center space-y-3 group w-36 sm:w-40 flex-shrink-0">
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
      <section className="p-6 md:p-12 bg-[#4A453E] text-white rounded-[20px] md:rounded-[32px] text-center space-y-4 md:space-y-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-[#F9A37E]/10 blur-[100px] pointer-events-none" />
        <h2 className="text-3xl font-extrabold tracking-tight max-w-lg mx-auto text-white">{data.ctaTitle}</h2>
        <p className="text-xs text-[#E8E2D6]/70 max-w-full md:max-w-[60%] mx-auto">{data.ctaDesc}</p>
        <Link
          href="/products"
          className="inline-block bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3.5 px-8 rounded-lg transition-colors shadow-lg"
        >
          Explore Collection
        </Link>
      </section>
    </div>
  );
}
