"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Breadcrumb, Pagination, Drawer, Select, EmptyState, SkeletonLoader } from '../../../components/UIComponents';
import { ProductCard } from '../../../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw, ArrowLeft, Package, Sparkles } from 'lucide-react';
import { Product } from '../../../components/AppContext';
import { getApiUrl } from '../../../components/ApiConfig';

export default function CategoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<{ id: string; name: string; slug: string; image: string; description?: string; count?: number } | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Draft filters
  const [draftSearch, setDraftSearch] = useState("");
  const [draftColors, setDraftColors] = useState<string[]>([]);
  const [draftSizes, setDraftSizes] = useState<string[]>([]);
  const [draftInStockOnly, setDraftInStockOnly] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const PRODUCTS_PER_PAGE = 9;
  const filterColors = ["White", "Black", "Grey", "Blue", "Green", "Red"];
  const filterSizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(getApiUrl(`/category/slug/${slug}`)).then(res => res.ok ? res.json() : null),
      fetch(getApiUrl(`/products/category/${slug}`)).then(res => res.ok ? res.json() : [])
    ])
      .then(([catData, prodData]) => {
        if (!catData) {
          // Fallback fetch all categories to see if name matches
          return fetch(getApiUrl('/category'))
            .then(r => r.ok ? r.json() : [])
            .then(allCats => {
              const matched = allCats.find((c: any) => c.slug === slug || c.name.toLowerCase().replace(/\s+/g, '-') === slug || c.id === slug);
              if (matched) {
                setCategory(matched);
                setProducts(prodData || []);
                setLoading(false);
              } else {
                setError("Category not found.");
                setLoading(false);
              }
            });
        }
        setCategory(catData);
        setProducts(prodData || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading category detail:", err);
        setError("Failed to load category products. Please try again.");
        setLoading(false);
      });
  }, [slug]);

  const handleColorToggle = (color: string) =>
    setDraftColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleSizeToggle = (size: string) =>
    setDraftSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, selectedColors, selectedSizes, inStockOnly]);

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                        p.description?.toLowerCase().includes(search.toLowerCase());
    const matchStock = !inStockOnly || p.inStock;
    const matchColor = selectedColors.length === 0 || p.colors?.some(c => selectedColors.includes(c.name));
    const matchSize = selectedSizes.length === 0 || p.sizes?.some(s => selectedSizes.includes(s));
    return matchSearch && matchStock && matchColor && matchSize;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

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

  if (loading) {
    return (
      <div className="w-full bg-[#FDFAF6] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-4">
          <Breadcrumb items={[{ name: "Categories", href: "/categories" }, { name: "Loading..." }]} />
          <div className="w-full h-48 bg-[#E8E2D6] rounded-2xl animate-pulse" />
          <SkeletonLoader type="card" />
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="w-full bg-[#FDFAF6] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-4">
          <Breadcrumb items={[{ name: "Categories", href: "/categories" }, { name: "Category Not Found" }]} />
          <EmptyState
            title="Category Not Found"
            description={error || "The category you are looking for does not exist or has been removed."}
            actionText="View All Categories"
            actionHref="/categories"
            icon={<Package className="w-8 h-8 text-[#F9A37E]" />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#FDFAF6] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-4">
        <Breadcrumb items={[{ name: "Categories", href: "/categories" }, { name: category.name }]} />

        {/* Category Header Banner */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#4A453E] to-[#2B2723] text-white p-6 sm:p-10 shadow-xl border border-[#E8E2D6]">
          {category.image && (
            <div className="absolute inset-0 opacity-25 mix-blend-overlay">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#F9A37E] bg-[#F9A37E]/20 px-3 py-1 rounded-full border border-[#F9A37E]/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Category Collection
              </span>
              <span className="text-[10px] font-extrabold text-[#A89B8A] bg-white/10 px-3 py-1 rounded-full">
                {products.length} Products
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{category.name}</h1>
            {category.description && (
              <p className="text-xs sm:text-sm text-[#D4CCC0] leading-relaxed pt-1">{category.description}</p>
            )}
          </div>
        </div>

        {/* Main Grid Section */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">

          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block bg-white border border-[#E8E2D6] rounded-xl p-5 space-y-5 lg:sticky lg:top-20 shadow-xs">
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

          {/* Product Grid Area */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="text-xs font-bold text-[#A89B8A]">{sortedProducts.length} Products Found in {category.name}</span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className="flex-none flex lg:hidden items-center justify-center gap-1.5 bg-white border border-[#E8E2D6] rounded-lg py-2 px-3.5 text-xs font-bold text-[#4A453E]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#F9A37E]" /> Filters
                </button>
                <span className="text-xs text-[#A89B8A] flex-shrink-0 ml-auto sm:ml-0 font-semibold">Sort by:</span>
                <Select
                  value={sort}
                  onChange={(val) => setSort(val)}
                  options={[
                    { value: "popular", label: "Popularity" },
                    { value: "price-low", label: "Price: Low to High" },
                    { value: "price-high", label: "Price: High to Low" },
                    { value: "rating", label: "Rating" }
                  ]}
                  className="flex-1 sm:w-40 sm:flex-none"
                />
              </div>
            </div>

            {/* Empty State vs Product Cards Grid */}
            {sortedProducts.length === 0 ? (
              <div className="lg:col-span-3 py-6">
                <EmptyState
                  title={`No products found in "${category.name}"`}
                  description="We couldn't find any items matching your active search or filters in this category."
                  actionText="Reset Filters"
                  actionHref={`/categories/${category.slug}`}
                  icon={<Search className="w-8 h-8 text-[#F9A37E]" />}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedProducts.map(prod => (
                  <ProductCard key={prod.id} product={prod} />
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
          title={`${category.name} Filters`}
        >
          <div className="space-y-6 pt-2">
            <div className="flex justify-between items-center border-b border-[#E8E2D6] pb-4">
              <span className="text-xs font-bold text-[#7A736A]">{sortedProducts.length} results</span>
              <button onClick={handleReset} className="text-[10px] font-bold text-[#A89B8A] hover:text-[#F9A37E] flex items-center gap-1 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
              </button>
            </div>
            <FilterForm {...filterFormProps} />
          </div>
        </Drawer>
      </div>
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
      <div className="relative">
        <Search className="w-4 h-4 text-[#A89B8A] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search category products..."
          value={draftSearch}
          onChange={(e) => setDraftSearch(e.target.value)}
          className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
        />
      </div>

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
