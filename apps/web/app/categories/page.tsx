"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb, Pagination, Drawer, Select, EmptyState } from '../../components/UIComponents';
import { CategoryCard } from '../../components/CategoryCard';
import { SlidersHorizontal, Search, RotateCcw, X } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [draftSearch, setDraftSearch] = useState("");
  const [draftColors, setDraftColors] = useState<string[]>([]);
  const [draftSizes, setDraftSizes] = useState<string[]>([]);
  const [draftInStockOnly, setDraftInStockOnly] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(getApiUrl("/category")).then(res => res.ok ? res.json() : []),
      fetch(getApiUrl("/products")).then(res => res.ok ? res.json() : [])
    ])
      .then(([catData, prodData]) => {
        setProducts(prodData || []);
        const mapped = (catData || []).map((c: any) => ({
          name: c.name,
          image: c.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
          count: c.count || 0,
          href: `/products?category=${encodeURIComponent(c.name)}`
        }));
        setCategories(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading categories/products:", err);
        setLoading(false);
      });
  }, []);

  const filterColors = ["White", "Black", "Grey", "Blue", "Green", "Red"];
  const filterSizes = ["S", "M", "L", "XL", "XXL"];

  const handleColorToggle = (color: string) => {
    setDraftColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  };

  const handleSizeToggle = (size: string) => {
    setDraftSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleApplyFilters = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSearch(draftSearch);
    setSelectedColors(draftColors);
    setSelectedSizes(draftSizes);
    setInStockOnly(draftInStockOnly);
    setIsFilterDrawerOpen(false);
  };

  const handleReset = () => {
    setDraftSearch("");
    setDraftColors([]);
    setDraftSizes([]);
    setDraftInStockOnly(false);

    setSearch("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSort("popular");
    setCurrentPage(1);
  };

  // Reset page to 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, selectedColors, selectedSizes, inStockOnly]);

  // Filter products based on sidebar selections
  const filteredProducts = products.filter(p => {
    const matchStock = !inStockOnly || p.inStock;
    const matchColor = selectedColors.length === 0 || p.colors?.some((c: any) => selectedColors.includes(c.name));
    const matchSize = selectedSizes.length === 0 || p.sizes?.some((s: string) => selectedSizes.includes(s));
    return matchStock && matchColor && matchSize;
  });

  // Filter categories by search keyword and whether they contain any product matching active sidebar filters
  const filteredCategories = categories.filter(cat => {
    const matchSearch = cat.name.toLowerCase().includes(search.toLowerCase());
    const hasActiveProductFilters = inStockOnly || selectedColors.length > 0 || selectedSizes.length > 0;
    const matchFilters = !hasActiveProductFilters || filteredProducts.some(p => p.category?.toLowerCase() === cat.name.toLowerCase());
    return matchSearch && matchFilters;
  });

  // Sort categories dynamically
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (sort === "name-asc") return a.name.localeCompare(b.name);
    if (sort === "name-desc") return b.name.localeCompare(a.name);
    return b.count - a.count; // Popularity (count)
  });

  // Dynamic pagination calculations
  const CATEGORIES_PER_PAGE = 6;
  const totalPages = Math.ceil(sortedCategories.length / CATEGORIES_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * CATEGORIES_PER_PAGE;
  const paginatedCategories = sortedCategories.slice(startIndex, startIndex + CATEGORIES_PER_PAGE);

  const filterFormProps = {
    draftSearch,
    setDraftSearch,
    draftInStockOnly,
    setDraftInStockOnly,
    draftColors,
    filterColors,
    handleColorToggle,
    draftSizes,
    filterSizes,
    handleSizeToggle,
    handleApplyFilters,
  };

  // Full-width empty state when the categories catalog is completely empty
  if (!loading && categories.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-6 pb-10 md:pb-16">
        <Breadcrumb items={[{ name: "Categories" }]} />
        <div className="w-full">
          <EmptyState
            title="No Categories Available"
            description="Our product categories listing is currently empty. Please check back later!"
            actionText="Go back Home"
            actionHref="/"
            icon={<SlidersHorizontal className="w-8 h-8 text-[#F9A37E]" />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-6 pb-10 md:pb-16">
      <Breadcrumb items={[{ name: "Categories" }]} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Browse Categories</h1>
        <p className="text-xs text-[#A89B8A] mt-1">Filter and pick from our premium print-ready blanks inventory</p>
      </div>

      {/* Grid container: filter sidebar and main grid */}
      <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar - Desktop Only */}
        <div className="hidden lg:block bg-white border border-[#E8E2D6] rounded-lg p-5 space-y-5 lg:sticky lg:top-20">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D6]">
            <h3 className="font-extrabold text-sm text-[#4A453E] flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-[#F9A37E]" /> Filters
            </h3>
            <button onClick={handleReset} className="text-[10px] font-bold text-[#A89B8A] hover:text-[#F9A37E] flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <FilterForm {...filterFormProps} />
        </div>

        {/* Main list output */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs font-bold text-[#A89B8A]">{sortedCategories.length} Categories Found</span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="flex-none flex lg:hidden items-center justify-center gap-1.5 border border-[#E8E2D6] hover:border-[#A89B8A] bg-white rounded-lg py-2 px-3.5 text-xs font-bold text-[#4A453E] transition-all hover:scale-[1.02]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F9A37E]" /> Filters
              </button>
              
              <span className="text-xs text-[#A89B8A] flex-shrink-0 ml-auto sm:ml-0 font-semibold">Sort by:</span>
              <Select
                value={sort}
                onChange={(val) => setSort(val)}
                options={[
                  { value: "popular", label: "Popularity" },
                  { value: "name-asc", label: "Alphabetical (A-Z)" },
                  { value: "name-desc", label: "Alphabetical (Z-A)" }
                ]}
                className="flex-1 sm:w-44 sm:flex-none"
              />
            </div>
          </div>

          {/* Grids */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => <CategoryCard key={i} loading={true} />)}
            </div>
          ) : sortedCategories.length === 0 ? (
            <div className="lg:col-span-3">
              <EmptyState
                title="No categories found"
                description="We couldn't find any categories matching your search or filters. Try checking your spelling or adjusting options."
                actionText="Reset Filters"
                actionHref="/categories"
                icon={<Search className="w-8 h-8 text-[#F9A37E]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedCategories.map(cat => (
                <CategoryCard key={cat.name} name={cat.name} image={cat.image} count={cat.count} href={cat.href} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => setCurrentPage(p)} />
          )}
        </div>

      </section>

      {/* Mobile Filters Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title="Category Filters"
      >
        <div className="space-y-6 pt-2">
          <div className="flex justify-between items-center border-b border-[#E8E2D6] pb-4">
            <span className="text-xs font-bold text-[#7A736A]">{sortedCategories.length} results</span>
            <button onClick={handleReset} className="text-[10px] font-bold text-[#A89B8A] hover:text-[#F9A37E] flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
          <FilterForm {...filterFormProps} />
        </div>
      </Drawer>
    </div>
  );
}

interface FilterFormProps {
  draftSearch: string;
  setDraftSearch: (val: string) => void;
  draftInStockOnly: boolean;
  setDraftInStockOnly: (val: boolean) => void;
  draftColors: string[];
  filterColors: string[];
  handleColorToggle: (color: string) => void;
  draftSizes: string[];
  filterSizes: string[];
  handleSizeToggle: (size: string) => void;
  handleApplyFilters: (e?: React.FormEvent) => void;
}

function FilterForm({
  draftSearch,
  setDraftSearch,
  draftInStockOnly,
  setDraftInStockOnly,
  draftColors,
  filterColors,
  handleColorToggle,
  draftSizes,
  filterSizes,
  handleSizeToggle,
  handleApplyFilters,
}: FilterFormProps) {
  return (
    <form onSubmit={handleApplyFilters} className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A89B8A] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search categories..."
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
        />
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#4A453E]">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={draftInStockOnly}
            onChange={(e) => setDraftInStockOnly(e.target.checked)}
            className="w-4 h-4 rounded border-[#E8E2D6] accent-[#F9A37E]"
          />
          <span className="text-xs text-[#7A736A] font-medium">In stock only</span>
        </label>
      </div>

      {/* Colors */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#4A453E]">Colors</h4>
        <div className="flex flex-wrap gap-1.5">
          {filterColors.map(color => {
            const isSelected = draftColors.includes(color);
            return (
              <button
                type="button"
                key={color}
                onClick={() => handleColorToggle(color)}
                className={`text-[10px] font-bold py-1 px-2.5 rounded-lg border transition-colors ${
                  isSelected ? 'bg-[#4A453E] text-white border-[#4A453E]' : 'text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
                }`}
              >{color}</button>
            );
          })}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#4A453E]">Sizes</h4>
        <div className="flex flex-wrap gap-1.5">
          {filterSizes.map(size => {
            const isSelected = draftSizes.includes(size);
            return (
              <button
                type="button"
                key={size}
                onClick={() => handleSizeToggle(size)}
                className={`min-w-8 h-8 px-2 rounded-lg text-[10px] font-extrabold border transition-all ${
                  isSelected ? 'bg-[#F9A37E] text-white border-[#F9A37E]' : 'text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
                }`}
              >{size}</button>
            );
          })}
        </div>
      </div>

      {/* Submit Filter Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2.5 px-4 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20 flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" /> Apply Filters
        </button>
      </div>
    </form>
  );
}
