"use client";

import React, { useState, useEffect } from 'react';
import { Breadcrumb, Pagination, Drawer, Select, EmptyState } from '../../components/UIComponents';
import { ProductCard } from '../../components/ProductCard';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { Product } from '../../components/AppContext';
import { getApiUrl } from '../../components/ApiConfig';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popular");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const PRODUCTS_PER_PAGE = 9;

  useEffect(() => {
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
        console.error("Error loading products:", err);
        setLoading(false);
      });
  }, []);

  const filterColors = ["White", "Black", "Grey", "Blue", "Green", "Red"];
  const filterSizes = ["S", "M", "L", "XL", "XXL"];

  const handleColorToggle = (color: string) =>
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const handleSizeToggle = (size: string) =>
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  
  const handleReset = () => {
    setSearch(""); 
    setSelectedColors([]); 
    setSelectedSizes([]); 
    setInStockOnly(false); 
    setSort("popular");
  };

  // Reset page to 1 on search or filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, selectedColors, selectedSizes, inStockOnly]);

  // Filter products dynamically
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                        p.description?.toLowerCase().includes(search.toLowerCase());
    
    const matchStock = !inStockOnly || p.inStock;
    
    const matchColor = selectedColors.length === 0 || 
                       p.colors?.some(c => selectedColors.includes(c.name));
                       
    const matchSize = selectedSizes.length === 0 || 
                      p.sizes?.some(s => selectedSizes.includes(s));
                      
    return matchSearch && matchStock && matchColor && matchSize;
  });

  // Sort products dynamically
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-low") return a.price - b.price;
    if (sort === "price-high") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return 0; // Default popularity
  });

  // Dynamic pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const FilterContent = () => (
    <>
      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#A89B8A] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text" placeholder="Search product..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
        />
      </div>

      {/* Availability */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-[#4A453E]">Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox" checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
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
            const isSelected = selectedColors.includes(color);
            return (
              <button key={color} onClick={() => handleColorToggle(color)}
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
            const isSelected = selectedSizes.includes(size);
            return (
              <button key={size} onClick={() => handleSizeToggle(size)}
                className={`min-w-8 h-8 px-2 rounded-lg text-[10px] font-extrabold border transition-all ${
                  isSelected ? 'bg-[#F9A37E] text-white border-[#F9A37E]' : 'text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
                }`}
              >{size}</button>
            );
          })}
        </div>
      </div>
    </>
  );

  // Full-width empty state when the product catalog is completely empty
  if (!loading && products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12 md:pb-16">
        <Breadcrumb items={[{ name: "Products" }]} />
        <div className="w-full">
          <EmptyState
            title="No Products Available"
            description="Our print-ready blanks catalog is currently empty. Please check back later or add products via the admin portal."
            actionText="Go back Home"
            actionHref="/"
            icon={<Search className="w-8 h-8" />}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-12 md:pb-16">
      <Breadcrumb items={[{ name: "Products" }]} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Browse Products</h1>
        <p className="text-xs text-[#A89B8A] mt-1">Filter and pick from our premium print-ready blanks</p>
      </div>

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
          <FilterContent />
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <span className="text-xs font-bold text-[#A89B8A]">{sortedProducts.length} Products Found</span>
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
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "rating", label: "Rating" }
                ]}
                className="flex-1 sm:w-40 sm:flex-none"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 grid-cols-mobile-single">
              {Array(6).fill(0).map((_, i) => <ProductCard key={i} loading={true} />)}
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="lg:col-span-3">
              <EmptyState
                title="No products found"
                description="We couldn't find any products matching your search or filters. Try checking your spelling or adjusting options."
                actionText="Reset Filters"
                actionHref="/products"
                icon={<Search className="w-8 h-8" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 grid-cols-mobile-single">
              {paginatedProducts.map(prod => <ProductCard key={prod.id} product={prod} />)}
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
        title="Product Filters"
      >
        <div className="space-y-6 pt-2">
          <div className="flex justify-between items-center border-b border-[#E8E2D6] pb-4">
            <span className="text-xs font-bold text-[#7A736A]">{sortedProducts.length} results</span>
            <button onClick={handleReset} className="text-[10px] font-bold text-[#A89B8A] hover:text-[#F9A37E] flex items-center gap-1 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>
          <FilterContent />
        </div>
      </Drawer>
    </div>
  );
}
