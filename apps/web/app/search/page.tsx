"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { ProductCard } from '../../components/ProductCard';
import { SearchBar } from '../../components/SearchBar';
import { Search } from 'lucide-react';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Soft Cotton Tee",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"],
    category: "T-Shirts",
    tag: "Best Seller",
    description: "Tailored with a modern fit...",
    colors: [{ name: "White", hex: "#ffffff" }],
    sizes: ["S", "M", "L"],
    inStock: true
  },
  {
    id: "p2",
    name: "Heavyweight Fleece Hoodie",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80"],
    category: "Hoodies",
    tag: "New",
    description: "Cozy fleece hoodie...",
    colors: [{ name: "Black", hex: "#0f172a" }],
    sizes: ["M", "L", "XL"],
    inStock: true
  }
];

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || "";
  const [query, setQuery] = useState(initialQuery);

  const filteredProducts = INITIAL_PRODUCTS.filter(p => 
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

      {filteredProducts.length === 0 ? (
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
