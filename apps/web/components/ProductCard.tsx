"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { Product, useApp } from './AppContext';
import { Modal } from './Modal';

interface ProductCardProps {
  product?: Product;
  loading?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, loading }) => {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'White');

  if (loading || !product) {
    return (
      <div className="flex flex-col bg-white border border-[#E8E2D6] rounded-lg overflow-hidden shadow-sm">
        {/* Pulsing Image area */}
        <div className="relative aspect-square w-full skeleton-shimmer" />
        
        {/* Pulsing Card info */}
        <div className="p-3 space-y-2.5">
          <div className="h-2 w-1/4 rounded skeleton-shimmer" />
          <div className="h-4.5 w-3/4 rounded skeleton-shimmer" />
          <div className="h-3 w-1/3 rounded skeleton-shimmer" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-4.5 w-1/4 rounded skeleton-shimmer" />
            <div className="h-3 w-1/5 rounded skeleton-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(product.id);
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      size: selectedSize,
      color: selectedColor
    });
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white border border-[#E8E2D6] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-[#F9A37E]/10 transition-all duration-300">

        {/* Image area */}
        <div className="relative aspect-square w-full bg-[#F5F0E8] overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-2 left-2 z-10 bg-rose-400 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
              {discount}% OFF
            </span>
          )}
          {product.tag && !discount && (
            <span className="absolute top-2 left-2 z-10 bg-[#F9A37E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
              {product.tag}
            </span>
          )}

          {/* Wishlist button */}
          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 hover:bg-white text-[#7A736A] hover:text-rose-400 rounded-full transition-all shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#4A453E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-10">
            <button
              onClick={() => setQuickViewOpen(true)}
              className="p-2.5 bg-white hover:bg-[#E8E2D6] text-[#4A453E] rounded-full transition-all hover:scale-110 shadow-md"
              title="Quick View"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={handleQuickAddToCart}
              className="p-2.5 bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-full transition-all hover:scale-110 shadow-md"
              title="Add to Cart"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          </div>

          <Link href={`/products/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
        </div>

        {/* Card info */}
        <div className="p-2 md:p-3 flex-1 flex flex-col justify-between">
          <div className="space-y-0.5">
            <p className="text-[9px] uppercase font-bold tracking-wider text-[#A89B8A]">
              {product.category}
            </p>
            <Link href={`/products/${product.id}`} className="block">
              <h4 className="font-bold text-sm text-[#4A453E] hover:text-[#F9A37E] line-clamp-1 transition-colors">
                {product.name}
              </h4>
            </Link>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-[10px] font-bold text-[#4A453E]">{product.rating}</span>
              <span className="text-[10px] text-[#A89B8A]">({product.reviewsCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm text-[#4A453E]">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-[#A89B8A] line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <Link
              href={`/products/${product.id}`}
              className="text-[14px] font-bold text-[#F9A37E] hover:text-[#E8855A] transition-colors"
            >
              Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewOpen && (
        <Modal isOpen={quickViewOpen} onClose={() => setQuickViewOpen(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square bg-[#F5F0E8] rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            <div className="flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-[#F9A37E] tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="font-extrabold text-xl text-[#4A453E] mt-1">{product.name}</h3>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-[#E8E2D6]'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-[#7A736A]">{product.rating} ({product.reviewsCount} reviews)</span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold text-[#4A453E]">₹{product.price}</span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-[#A89B8A] line-through">₹{product.originalPrice}</span>
                  )}
                </div>

                <p className="text-xs text-[#7A736A] leading-relaxed">{product.description}</p>

                {/* Colors */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#4A453E]">Color: <span className="text-[#F9A37E]">{selectedColor}</span></span>
                  <div className="flex gap-2">
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`w-6 h-6 rounded-full border-2 transition-all ${selectedColor === color.name ? 'border-[#F9A37E] scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-[#4A453E]">Size: <span className="text-[#F9A37E]">{selectedSize}</span></span>
                  <div className="flex gap-1.5">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-8 h-8 px-2 rounded-lg text-xs font-extrabold border transition-all ${
                          selectedSize === size
                            ? 'bg-[#4A453E] text-white border-[#4A453E]'
                            : 'bg-transparent text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-5 mt-5 border-t border-[#E8E2D6]">
                <button
                  onClick={(e) => { handleQuickAddToCart(e); setQuickViewOpen(false); }}
                  className="flex-1 bg-[#A8C69F] hover:bg-[#92b089] text-white text-xs font-extrabold py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/25 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
                <Link
                  href={`/products/${product.id}`}
                  onClick={() => setQuickViewOpen(false)}
                  className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white text-xs font-extrabold py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 flex items-center justify-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
