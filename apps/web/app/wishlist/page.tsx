"use client";

import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { ProductCard } from '../../components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-6 pb-12 md:pb-16">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {wishlist.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
}

