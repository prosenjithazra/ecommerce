"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Sparkles, TrendingUp } from 'lucide-react';

export const SearchBar: React.FC<{ initialValue?: string }> = ({ initialValue = "" }) => {
  const router = useRouter();
  const [query, setQuery] = useState(initialValue);
  const [focused, setFocused] = useState(false);

  const popularSearches = ["Custom T-shirt", "Hoodies", "Family Mug", "Tote Bag", "Corporate Polo"];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSearch} className="relative flex items-center">
        <div className="absolute left-4 text-zinc-400 dark:text-zinc-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search for custom apparel, hoodies, mugs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          className="w-full bg-white dark:bg-zinc-900 border-2 border-zinc-150 dark:border-zinc-800 focus:border-indigo-500 dark:focus:border-indigo-500/80 rounded-lg py-3.5 pl-12 pr-12 text-sm outline-none shadow-sm transition-colors text-zinc-950 dark:text-zinc-50"
        />
        {query && (
          <button 
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Suggestion Dropdown */}
      {focused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-lg p-4 z-50 animate-fade-in-up duration-200">
          <div className="space-y-4">
            {/* Popular tags */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setQuery(tag);
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                    }}
                    className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3.5 py-1.5 rounded-full transition-colors font-medium border border-transparent dark:border-zinc-800"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Trending Collections
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300">
                <li className="hover:text-indigo-500 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between" onClick={() => router.push('/products')}>
                  <span>Summer Collection 2026</span>
                  <span className="text-[9px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-bold">New</span>
                </li>
                <li className="hover:text-indigo-500 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors flex items-center justify-between" onClick={() => router.push('/products')}>
                  <span>Eco-Friendly Organic Cotton Apparel</span>
                  <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950 text-emerald-600 px-1.5 py-0.5 rounded font-bold">Eco</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
