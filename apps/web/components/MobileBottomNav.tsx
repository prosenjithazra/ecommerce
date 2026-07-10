"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, ShoppingBag, Heart, User } from 'lucide-react';
import { useApp } from './AppContext';

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const { wishlist, cart } = useApp();
  const wishlistCount = wishlist.length;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const items = [
    { name: "Home",    icon: <Home className="w-5 h-5" />,         href: "/" },
    { name: "Shop",    icon: <Compass className="w-5 h-5" />,       href: "/products" },
    { name: "Cart",    icon: <ShoppingBag className="w-5 h-5" />,   href: "/cart",    count: cartCount },
    { name: "Saved",   icon: <Heart className="w-5 h-5" />,         href: "/wishlist", count: wishlistCount },
    { name: "Account", icon: <User className="w-5 h-5" />,          href: "/profile" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E8E2D6] backdrop-blur-sm px-2 py-2">
      <nav className="flex justify-between items-center max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 relative transition-all rounded-xl ${
                pathname === item.href
                  ? 'text-[#F9A37E]'
                  : 'text-[#A89B8A] hover:text-[#4A453E]'
              }`}
            >
              <div className="flex items-center justify-center relative">
                {item.icon}
                {!!item.count && item.count > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F9A37E] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[9px] mt-0.5 font-semibold">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
