"use client";

import React, { useState } from 'react';
import { Breadcrumb } from '../../components/UIComponents';
import { HelpCircle, ChevronDown, Sparkles, Paintbrush, Truck } from 'lucide-react';

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const categories = [
    {
      id: "designer",
      title: "Design Studio & Editor",
      icon: <Paintbrush className="w-5 h-5 text-indigo-500" />,
      questions: [
        { q: "What design file formats can I upload?", a: "Our canvas designer supports transparent PNGs, JPEGs, and SVGs. We highly recommend utilizing high-resolution transparent PNG files (at least 300 DPI) for clean direct-to-garment print lines." },
        { q: "Can I print on both the front and back of the shirt?", a: "Yes! Use the 'Front / Back' view toggle in the design studio to add text layers and custom graphic images to both sides. Custom double-sided printing adds a minor $5 setup fee." }
      ]
    },
    {
      id: "orders",
      title: "Ordering & Print Quality",
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      questions: [
        { q: "Is there a minimum order quantity (MOQ)?", a: "No! There are absolutely no minimum limits. You can design and order a single t-shirt or fleece hoodie. Bulk orders of 15+ units automatically qualify for wholesale discounts." },
        { q: "What garment brands do you print on?", a: "We print on premium organic apparel blanks from Bella+Canvas, Gildan, and Champion. Specific materials (organic cotton, heavyweight fleece) are listed under each product details page." }
      ]
    },
    {
      id: "shipping",
      title: "Shipping & Refunds",
      icon: <Truck className="w-5 h-5 text-indigo-500" />,
      questions: [
        { q: "How do I track my shipment package?", a: "Once printed and handed over to DHL Express, a tracking ID is generated. You can input this under your dashboard orders list or track the timeline details directly inside our Track Order page." },
        { q: "Can I return an item if it doesn't fit?", a: "Because items are custom printed on demand, we do not accept returns for incorrect size selection. Please consult our sizing guides before checking out. If you receive a damaged blank or alignment print error, we send a replacement free of charge." }
      ]
    }
  ];

  const handleToggle = (id: string) => {
    setOpenIdx(openIdx === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Frequently Asked Questions" }]} />

      <section className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Help Center</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Find answers to print quality, interactive designer controls, shipping turnarounds, and account preferences.</p>
      </section>

      {/* Accordion List */}
      <section className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="space-y-3">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2 px-1">
              {cat.icon}
              {cat.title}
            </h3>
            <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-3xl divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-sm">
              {cat.questions.map((faq, idx) => {
                const uniqueId = `${cat.id}-${idx}`;
                const isOpen = openIdx === uniqueId;
                return (
                  <div key={idx} className="p-5">
                    <button
                      onClick={() => handleToggle(uniqueId)}
                      className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-zinc-850 dark:text-zinc-100"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3.5 leading-relaxed animate-fade-in-up duration-250">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
