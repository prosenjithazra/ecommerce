"use client";

import React, { useEffect, useState } from 'react';
import { Breadcrumb } from '../../components/UIComponents';
import { RefreshCw, Truck } from 'lucide-react';

interface PolicySection {
  id: string;
  heading: string;
  content: string;
  lastUpdated?: string;
}

export default function ShippingPage() {
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Shipping Policy");

  useEffect(() => {
    fetch('/api/policies/shipping')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          if (data.title) setTitle(data.title);
          if (Array.isArray(data.sections) && data.sections.length > 0) {
            setSections(data.sections);
          }
        }
      })
      .catch((err) => console.error('[ShippingPage] Failed to fetch policy:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12 sm:pb-20">
      <Breadcrumb items={[{ name: "Shipping Policy" }]} />

      <div className="bg-white border border-[#E8E2D6] rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-zinc-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">{title}</h1>
          <p className="text-xs text-[#7A736A] mt-1">Fulfillment timelines, courier partners, and tracking procedures</p>
        </div>

        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#3B82F6]" />
            <p className="text-xs text-zinc-500 font-bold">Loading Shipping Policy...</p>
          </div>
        ) : sections.length === 0 ? (
          <div className="py-8 text-center text-xs text-zinc-400">No shipping policy published yet.</div>
        ) : (
          <div className="space-y-8">
            {sections.map((sec, idx) => (
              <section key={sec.id || idx} className="space-y-2">
                <h2 className="text-base sm:text-lg font-extrabold text-[#4A453E] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs flex items-center justify-center font-black">
                    {idx + 1}
                  </span>
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-zinc-650 leading-relaxed pl-8 whitespace-pre-line">
                  {sec.content}
                </p>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
