"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  name?: string;
  image?: string;
  count?: number;
  href?: string;
  loading?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, count, href, loading }) => {
  if (loading || !name || !image || !href) {
    return (
      <div className="relative block aspect-[4/3] rounded-lg overflow-hidden bg-[#E8E2D6] shadow-sm border border-[#E8E2D6] skeleton-shimmer" />
    );
  }
  const displayCount = typeof count === 'number' && !isNaN(count) ? count : 0;
  const countLabel = `${displayCount} ${displayCount === 1 ? 'Product' : 'Products'}`;

  return (
    <Link href={href} className="group relative block aspect-[10/9] sm:aspect-[4/3] rounded-lg overflow-hidden bg-[#E8E2D6] shadow-sm border border-[#E8E2D6]">
      <img
        src={image}
        alt={name}
        width={280}
        height={210}
        loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4">
        <span className="text-[9px] uppercase font-extrabold tracking-widest text-[#f9a37e]">
          {countLabel}
        </span>
        <h3 className="font-extrabold text-sm sm:text-base text-white mt-0.5 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          {name}
          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
        </h3>
      </div>
    </Link>
  );
};
