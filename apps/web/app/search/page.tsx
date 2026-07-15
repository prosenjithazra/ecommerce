"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { Search } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl("/products"))
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load products");
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading search products:", err);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setQuery(searchParams?.get('q') || "");
  }, [searchParams]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Search Results" }]} />

      <section className="space-y-4 max-w-xl">
        <h1 className="text-3xl font-extrabold text-zinc-909 dark:text-white tracking-tight">Search Results</h1>
        <p className="text-xs text-zinc-400">Search details for: <span className="font-extrabold text-zinc-700 dark:text-zinc-300 font-mono">&ldquo;{query || "All Products"}&rdquo;</span></p>
      </section>

      {/* Central Searchbar input */}
      <section className="py-2">
        <SearchBar initialValue={query} />
      </section>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="border border-zinc-200 rounded-lg p-4 space-y-4">
              <div className="aspect-square bg-zinc-200 rounded-lg w-full" />
              <div className="h-4 bg-zinc-200 rounded w-3/4" />
              <div className="h-3 bg-zinc-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No search results"
          description={`We couldn't find any premium blanks matching "${query}". Try standard queries like "T-shirt" or "Hoodie".`}
          actionText="View all products"
          actionHref="/products"
          icon={<Search className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          <span className="text-xs text-zinc-400 font-semibold">{filteredProducts.length} matching products found</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading Search results...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
