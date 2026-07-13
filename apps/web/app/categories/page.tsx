"use client";

import React, { useState } from 'react';
import { Breadcrumb, Pagination, Select } from '../../components/UIComponents';
import { CategoryCard } from '../../components/CategoryCard';
import { Filter, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export default function CategoriesPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const categories = [
    { name: "Premium T-Shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80", count: 18, href: "/products" },
    { name: "Cozy Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80", count: 12, href: "/products" },
    { name: "Merchandise Tote Bags", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80", count: 9, href: "/products" },
    { name: "Premium Drinkware", image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", count: 6, href: "/products" },
    { name: "Comfortable Sweatshirts", image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80", count: 8, href: "/products" },
    { name: "Embroidered Caps", image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&auto=format&fit=crop&q=80", count: 11, href: "/products" }
  ];

  const filterColors = ["White", "Black", "Grey", "Blue", "Green", "Red"];
  const filterSizes = ["S", "M", "L", "XL", "XXL"];
  const filterBrands = ["Gildan", "Bella+Canvas", "Champion", "Next Level"];

  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setSort("popular");
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Categories Listing" }]} />

      <section className="space-y-4">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Product Categories</h1>
        <p className="text-xs text-zinc-400">Filter, sort, and select from our print-ready blanks inventory</p>
      </section>

      {/* Grid container: filter sidebar and main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar filters */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 space-y-6 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Filters
            </h3>
            <button 
              onClick={handleReset}
              className="text-[10px] font-bold text-zinc-400 hover:text-indigo-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 text-zinc-900 dark:text-white"
            />
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Availability</h4>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-850 accent-indigo-600"
              />
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">In stock only</span>
            </label>
          </div>

          {/* Colors filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Colors</h4>
            <div className="flex flex-wrap gap-2">
              {filterColors.map(color => {
                const isSelected = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => handleColorToggle(color)}
                    className={`text-[10px] font-bold py-1 px-2.5 rounded-lg border transition-colors ${isSelected ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' : 'bg-transparent text-zinc-505 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'}`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sizes filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Sizes</h4>
            <div className="flex flex-wrap gap-1.5">
              {filterSizes.map(size => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => handleSizeToggle(size)}
                    className={`min-w-8 h-8 px-2 rounded-lg text-[10px] font-extrabold border transition-all ${isSelected ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900' : 'bg-transparent text-zinc-505 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400'}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brand filter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Print Brands</h4>
            <div className="space-y-2">
              {filterBrands.map(brand => {
                const isSelected = selectedBrands.includes(brand);
                return (
                  <label key={brand} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4 h-4 border border-zinc-200 dark:border-zinc-700 rounded bg-zinc-50 dark:bg-zinc-850 accent-indigo-600"
                    />
                    <span className="text-xs text-zinc-505 dark:text-zinc-400 font-medium">{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

        {/* Main list output */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400">{filteredCategories.length} Categories Found</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400">Sort:</span>
              <Select
                value={sort}
                onChange={(val) => setSort(val)}
                options={[
                  { value: "popular", label: "Popularity" },
                  { value: "name-asc", label: "Alphabetical (A-Z)" },
                  { value: "name-desc", label: "Alphabetical (Z-A)" }
                ]}
                className="w-44"
              />
            </div>
          </div>

          {/* Grids */}
          {filteredCategories.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
              <span className="text-sm font-bold text-zinc-500">No categories match your filters.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map(cat => (
                <CategoryCard key={cat.name} name={cat.name} image={cat.image} count={cat.count} href={cat.href} />
              ))}
            </div>
          )}

          <Pagination currentPage={currentPage} totalPages={3} onPageChange={(p) => setCurrentPage(p)} />
        </div>

      </section>
    </div>
  );
}
