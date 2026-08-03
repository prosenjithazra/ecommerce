"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Breadcrumb } from '../../components/UIComponents';
import { HelpCircle, ChevronDown, Search, HelpCircle as HelpIcon, ArrowRight, RefreshCw } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

interface PolicySection {
  id: string;
  heading: string;
  content: string;
  lastUpdated?: string;
}

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<string | null>(null);
  const [sections, setSections] = useState<PolicySection[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("Help Center / FAQ");

  useEffect(() => {
    let isMounted = true;
    const fetchPolicy = async () => {
      try {
        let res = await fetch(getApiUrl('/policies/faq')).catch(() => null);
        if (!res || !res.ok) {
          res = await fetch('/api/policies/faq').catch(() => null);
        }
        if (res && res.ok) {
          const data = await res.json();
          if (isMounted && data) {
            if (data.title) setTitle(data.title);
            if (Array.isArray(data.sections) && data.sections.length > 0) {
              setSections(data.sections);
            }
          }
        }
      } catch (err) {
        console.error('[FaqPage] Failed to fetch FAQ:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPolicy();
    return () => { isMounted = false; };
  }, []);

  const handleToggle = (id: string) => {
    setOpenIdx(openIdx === id ? null : id);
  };

  const filteredSections = sections.filter(
    (sec) =>
      sec.heading.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Help Center / FAQ" }]} />

      {/* Header section */}
      <section className="text-center space-y-3 max-w-xl mx-auto">
        <div className="w-12 h-12 bg-[#FBD5C1]/30 text-[#e8855a] rounded-xl flex items-center justify-center mx-auto shadow-sm">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">{title}</h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Find answers to print quality questions, customizer controls, shipping turnarounds, and account preferences.
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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs sm:text-sm text-zinc-800 dark:text-zinc-250 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#df794d]/50 focus:border-[#df794d] transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3.5 text-xs text-zinc-400 hover:text-zinc-650 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* Accordion List */}
      <section className="space-y-6">
        {loading ? (
          <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-6 h-6 animate-spin text-[#df794d]" />
            <p className="text-xs text-zinc-500 font-bold">Loading Help Center FAQ...</p>
          </div>
        ) : filteredSections.length > 0 ? (
          <div className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 rounded-xl divide-y divide-zinc-200 dark:divide-zinc-800 overflow-hidden shadow-sm">
            {filteredSections.map((faq, idx) => {
              const uniqueId = `faq-${faq.id || idx}`;
              const isOpen = openIdx === uniqueId;
              return (
                <div key={idx} className="transition-all hover:bg-zinc-50/30 dark:hover:bg-zinc-950/10">
                  <button
                    onClick={() => handleToggle(uniqueId)}
                    className="w-full flex items-center justify-between text-left font-extrabold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 p-4 sm:p-5 transition-colors focus:outline-none cursor-pointer"
                  >
                    <span className="pr-4">{faq.heading}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#df794d]' : ''}`} />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? 'max-h-60 border-t border-zinc-100 dark:border-zinc-800/60' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 sm:p-5 bg-zinc-50/40 dark:bg-zinc-950/5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-350 leading-relaxed whitespace-pre-line">
                      {faq.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty search state */
          <div className="text-center py-12 border border-dashed border-[#E8E2D6] rounded-2xl bg-white dark:bg-zinc-900/10 max-w-lg mx-auto p-6 space-y-4">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 rounded-full flex items-center justify-center mx-auto">
              <HelpIcon className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">No questions found</h4>
              <p className="text-xs text-zinc-400">We couldn't find any questions matching "{searchQuery}". Try searching another topic.</p>
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary py-2 px-4 inline-block shadow-none hover:shadow-none active:scale-95 cursor-pointer"
            >
              Reset Search
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
