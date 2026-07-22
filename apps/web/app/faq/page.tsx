"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '../../components/UIComponents';
import { HelpCircle, ChevronDown, Sparkles, Paintbrush, Truck, Search, HelpCircle as HelpIcon, ArrowRight } from 'lucide-react';

interface QuestionItem {
  q: string;
  a: string;
}

interface FaqCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: QuestionItem[];
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  const categories: FaqCategory[] = [
    {
      id: "designer",
      title: "Design Studio & Editor",
      icon: <Paintbrush className="w-4 h-4" />,
      questions: [
        { q: "What design file formats can I upload?", a: "Our canvas designer supports transparent PNGs, JPEGs, and SVGs. We highly recommend utilizing high-resolution transparent PNG files (at least 300 DPI) for clean direct-to-garment print lines." },
        { q: "Can I print on both the front and back of the shirt?", a: "Yes! Use the 'Front / Back' view toggle in the design studio to add text layers and custom graphic images to both sides. Custom double-sided printing adds a minor ₹5 setup fee." },
        { q: "Can I add custom text and choose different fonts?", a: "Absolutely! Our Editor allows you to write custom text, choose from multiple premium fonts, resize, rotate, change line height, and select colors instantly." }
      ]
    },
    {
      id: "orders",
      title: "Ordering & Print Quality",
      icon: <Sparkles className="w-4 h-4" />,
      questions: [
        { q: "Is there a minimum order quantity (MOQ)?", a: "No! There are absolutely no minimum limits. You can design and order a single t-shirt or fleece hoodie. Bulk orders of 15+ units automatically qualify for wholesale discounts." },
        { q: "What garment brands do you print on?", a: "We print on premium organic apparel blanks from Bella+Canvas, Gildan, and Champion. Specific materials (organic cotton, heavyweight fleece) are listed under each product details page." },
        { q: "How durable is the direct-to-garment (DTG) print?", a: "We use state-of-the-art DTG machines and eco-friendly water-based inks. With proper care (machine wash cold, inside out, line dry), the prints will last as long as the garment itself." }
      ]
    },
    {
      id: "shipping",
      title: "Shipping & Refunds",
      icon: <Truck className="w-4 h-4" />,
      questions: [
        { q: "How do I track my shipment package?", a: "Once printed and handed over to DHL Express, a tracking ID is generated. You can input this under your dashboard orders list or track the timeline details directly inside our Track Order page." },
        { q: "Can I return an item if it doesn't fit?", a: "Because items are custom printed on demand, we do not accept returns for incorrect size selection. Please consult our sizing guides before checking out. If you receive a damaged blank or alignment print error, we send a replacement free of charge." },
        { q: "How long does shipping and fulfillment take?", a: "Fulfillment (printing and packaging) takes 2-3 business days. Courier transit takes another 3-5 business days depending on your location." }
      ]
    }
  ];

  const handleToggle = (id: string) => {
    setOpenIdx(openIdx === id ? null : id);
  };

  // 1. Filter categories by selected category tab
  const filteredCategories = categories.map(cat => {
    if (activeCategory !== 'all' && cat.id !== activeCategory) {
      return null;
    }
    // 2. Filter questions inside category by search query
    const matchedQuestions = cat.questions.filter(
      q =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matchedQuestions.length === 0) {
      return null;
    }

    return {
      ...cat,
      questions: matchedQuestions,
    };
  }).filter((cat): cat is FaqCategory => cat !== null);

  const hasResults = filteredCategories.length > 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Frequently Asked Questions" }]} />

      {/* Header section with brand peach colors */}
      <section className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 bg-[#FBD5C1]/30 text-[#e8855a] rounded-xl flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Help Center</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Find answers to print quality questions, interactive designer controls, shipping turnarounds, and account preferences.
        </p>
      </section>

      {/* Search Bar Section */}
      <section className="max-w-xl mx-auto relative">
        <div className="relative">
          <input
            type="text"
            placeholder="Search questions, keywords, or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs sm:text-sm text-zinc-800 dark:text-zinc-250 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#F9A37E]/50 focus:border-[#F9A37E] transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-xs text-zinc-400 hover:text-zinc-650"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Category Tabs */}
      <section className="flex flex-wrap items-center justify-center gap-2">
        <button
          onClick={() => { setActiveCategory('all'); setOpenIdx(null); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
            activeCategory === 'all'
              ? 'bg-[#F9A37E] text-white border-[#F9A37E] shadow-sm shadow-[#F9A37E]/20'
              : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950'
          }`}
        >
          All Topics
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => { setActiveCategory(cat.id); setOpenIdx(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
              activeCategory === cat.id
                ? 'bg-[#F9A37E] text-white border-[#F9A37E] shadow-sm shadow-[#F9A37E]/20'
                : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950'
            }`}
          >
            {cat.icon}
            {cat.title}
          </button>
        ))}
      </section>

      {/* Accordion / Category List */}
      <section className="space-y-6">
        {hasResults ? (
          filteredCategories.map((cat) => (
            <div key={cat.id} className="space-y-3">
              <h3 className="font-extrabold text-xs sm:text-sm text-zinc-900 dark:text-white flex items-center gap-2 px-1 text-[#e8855a]">
                <span className="p-1.5 rounded-lg bg-[#FBD5C1]/20 inline-block">{cat.icon}</span>
                {cat.title}
              </h3>
              <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-sm">
                {cat.questions.map((faq, idx) => {
                  const uniqueId = `${cat.id}-${idx}`;
                  const isOpen = openIdx === uniqueId;
                  return (
                    <div key={idx} className="transition-all hover:bg-zinc-50/30 dark:hover:bg-zinc-950/10">
                      <button
                        onClick={() => handleToggle(uniqueId)}
                        className="w-full flex items-center justify-between text-left font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 p-4 sm:p-5 transition-colors focus:outline-none"
                      >
                        <span className="pr-4">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#F9A37E]' : ''}`} />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 ${
                          isOpen ? 'max-h-40 border-t border-zinc-100 dark:border-zinc-800/60' : 'max-h-0'
                        }`}
                      >
                        <div className="p-4 sm:p-5 bg-zinc-50/40 dark:bg-zinc-950/5 text-xs text-zinc-555 dark:text-zinc-450 leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          /* Empty search state */
          <div className="text-center py-12 border border-dashed border-[#E8E2D6] rounded-2xl bg-white dark:bg-zinc-900/10 max-w-lg mx-auto p-6 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
              <HelpIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">No questions found</h4>
              <p className="text-xs text-zinc-400">We couldn't find any results matching "{searchQuery}". Try searching for another topic.</p>
            </div>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="btn-primary py-2 px-4 inline-block shadow-none hover:shadow-none active:scale-95"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Support Card CTA */}
      <section className="bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl p-6 sm:p-8 text-center space-y-4 max-w-xl mx-auto shadow-sm">
        <h4 className="font-extrabold text-base text-zinc-800">Still have questions?</h4>
        <p className="text-xs text-zinc-500 max-w-md mx-auto leading-relaxed">
          Can't find the answers you're looking for? Reach out to Kliamo Customer Support. Our team is available to assist you with order alignments and print designs.
        </p>
        <div>
          <Link
            href="/contact"
            className="btn-primary py-2.5 px-6 inline-flex items-center gap-2"
          >
            Contact Support <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
