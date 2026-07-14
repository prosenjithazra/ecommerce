"use client";

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface StickyAddToCartProps {
  name: string;
  price: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  onAddToCart: () => void;
  inStock: boolean;
}

export const StickyAddToCart: React.FC<StickyAddToCartProps> = ({
  name, price, image, selectedSize, selectedColor, onAddToCart, inStock
}) => {
  return (
    <div className="md:hidden fixed bottom-[66px] left-0 right-0 z-20 bg-white border-t border-[#E8E2D6] px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-[#E8E2D6] rounded-lg overflow-hidden flex-shrink-0">
          <img src={image} alt={name} className="w-full h-full object-cover" />
        </div>
        <div className="min-w-0">
          <h4 className="font-bold text-xs text-[#4A453E] truncate max-w-[140px]">{name}</h4>
          <p className="text-[10px] text-[#A89B8A] mt-0.5">
            ₹{price.toFixed(2)} · <span className="uppercase">{selectedSize}</span> · {selectedColor}
          </p>
        </div>
      </div>
      <button
        onClick={onAddToCart}
        disabled={!inStock}
        className="flex items-center gap-2 bg-[#A8C69F] hover:bg-[#92b089] disabled:bg-[#E8E2D6] disabled:text-[#A89B8A] text-white font-extrabold text-xs py-2 px-3 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/25 flex-shrink-0"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        <span className='text-xs'>{inStock ? "Add to Cart" : "Out of Stock"}</span>
      </button>
    </div>
  );
};
