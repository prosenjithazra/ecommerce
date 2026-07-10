"use client";

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState, Price } from '../../components/UIComponents';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useApp();

  const handleMoveToCart = (item: any) => {
    addToCart({
      productId: item.id, name: item.name, price: item.price,
      quantity: 1, image: item.image,
      size: item.sizes[0] || 'M', color: item.colors[0]?.name || 'White'
    });
    toggleWishlist(item);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      <Breadcrumb items={[{ name: "Wishlist" }]} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-400 fill-rose-400" /> My Wishlist
        </h1>
        <p className="text-xs text-[#A89B8A] mt-1">Save items here to buy them later.</p>
      </div>

      {wishlist.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          description="Browse our inventory and save items to buy them later."
          actionText="Explore Products"
          actionHref="/products"
          icon={<Heart className="w-8 h-8 text-rose-300" />}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {wishlist.map(item => (
            <div key={item.id} className="border border-[#E8E2D6] bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="relative aspect-square w-full bg-[#E8E2D6]">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleWishlist(item)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-400 rounded-full shadow hover:bg-white hover:scale-105 transition-all"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-3 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-extrabold text-[#A89B8A]">{item.category}</span>
                  <Link href={`/products/${item.id}`}>
                    <h3 className="font-bold text-sm text-[#4A453E] line-clamp-1 hover:text-[#F9A37E] transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <Price value={item.price} original={item.originalPrice} size="sm" />
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    href={`/products/${item.id}`}
                    className="border border-[#A8C69F] hover:bg-[#A8C69F] text-[#4A453E] hover:text-white font-extrabold text-[10px] py-2 px-2 rounded-2xl transition-all text-center"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-[10px] py-2 px-2 rounded-2xl transition-all shadow-md shadow-[#F9A37E]/20 flex items-center justify-center gap-1"
                  >
                    <ShoppingBag className="w-3 h-3" /> Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
