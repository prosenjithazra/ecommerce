"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  Trash2,
  ArrowRight,
  LayoutDashboard,
  Minus,
  Plus,
} from "lucide-react";
import { useApp } from "./AppContext";

export const Header: React.FC = () => {
  const { cart, wishlist, currentUser, logout, removeFromCart, updateCartQty } =
    useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setIsSearchOpen(false);
      setSearchValue("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-[#E8E2D6]">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8 h-[auto] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/logoMainNew.png" alt="Kaiva Fashion Logo" className="h-10 md:h-14 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.15)]" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "text-[#F9A37E] font-bold"
                    : "text-[#7A736A] hover:text-[#4A453E]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#7A736A] hover:text-[#F9A37E] transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden md:inline-flex p-2 text-[#7A736A] hover:text-[#F9A37E] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F9A37E] text-white rounded-full flex items-center justify-center text-[9px] font-bold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden md:inline-flex p-2 text-[#7A736A] hover:text-[#F9A37E] transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#A8C69F] text-[#2E2B26] rounded-full flex items-center justify-center text-[9px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account */}
            {currentUser ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-90 transition-opacity pl-2"
                aria-label="Account"
              >
                <div className="w-7 h-7 rounded-full bg-[#F9A37E] text-white flex items-center justify-center text-xs font-black border border-[#E8E2D6] shadow-sm">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-extrabold text-[#4A453E]">
                  {currentUser.name}
                </span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 py-2 px-3.5 bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-md text-xs font-extrabold transition-all shadow-md shadow-[#F9A37E]/20 active:scale-95 ml-1"
                aria-label="Account"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-[#7A736A] hover:text-[#F9A37E] transition-colors"
              aria-label="Open menu"
            >
              <LayoutDashboard className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </header>

      {/* ── FULL-PAGE SEARCH DRAWER ── */}
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-white/98 backdrop-blur-md animate-fade-in-up"
          style={{ animationDuration: "200ms" }}
        >
          {/* Search Header */}
          <div className="max-w-3xl mx-auto w-full px-4 pt-16 pb-8">
            <button
              onClick={() => {
                setIsSearchOpen(false);
                setSearchValue("");
              }}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#E8E2D6] hover:bg-[#F9A37E] hover:text-white text-[#4A453E] transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <p className="text-xs font-bold tracking-widest uppercase text-[#A8C69F] mb-3">
              Search Kaiva Fashion
            </p>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A8C69F]" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search t-shirts, hoodies, accessories..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-[#FDFAF6] border-2 border-[#E8E2D6] focus:border-[#F9A37E] rounded-lg py-4 pl-12 pr-4 text-base font-medium text-[#4A453E] outline-none transition-colors placeholder:text-[#C4B8A8]"
              />
              {searchValue && (
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#F9A37E] hover:bg-[#E8855A] text-white font-bold text-xs py-2 px-4 rounded-lg transition-all flex items-center gap-1"
                >
                  Search <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Quick Suggestions */}
            <div className="mt-6 space-y-3">
              <p className="text-xs font-semibold text-[#A8C69F] uppercase tracking-wider">
                Popular searches
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Custom T-Shirt",
                  "Hoodie",
                  "Tote Bag",
                  "Printed Cap",
                  "Sweatshirt",
                ].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                      setIsSearchOpen(false);
                      setSearchValue("");
                    }}
                    className="text-xs font-medium px-3 py-1.5 bg-[#E8E2D6] hover:bg-[#F9A37E] hover:text-white text-[#4A453E] rounded-full transition-all"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE SIDEBAR DRAWER ── */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <div
            className="fixed inset-0 bg-black/40 animate-fade-in-overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 bg-white h-full flex flex-col shadow-2xl animate-slide-from-left">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D6]">
              <div className="flex items-center">
                <img src="/logoMainNew.png" alt="Kaiva Fashion Logo" className="h-9 w-auto object-contain" />
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg bg-[#E8E2D6] text-[#7A736A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="flex flex-col p-4 gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? "bg-[#FBD5C1] text-[#E8855A]"
                      : "text-[#4A453E] hover:bg-[#E8E2D6]"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {currentUser ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-sm font-semibold py-2.5 px-3 rounded-lg text-[#4A453E] hover:bg-[#E8E2D6]"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-red-500 hover:bg-red-50"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 text-center text-sm font-bold py-2.5 px-3 rounded-lg bg-[#F9A37E] text-white hover:bg-[#E8855A]"
                >
                  Log In / Register
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/40 animate-fade-in-overlay"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-sm bg-white h-full flex flex-col shadow-2xl animate-slide-from-right">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E2D6]">
              <h3 className="font-bold text-base text-[#4A453E] flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#F9A37E]" />
                Your Cart
                <span className="text-xs font-semibold text-[#7A736A]">
                  ({cartCount})
                </span>
              </h3>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-lg bg-[#E8E2D6] text-[#7A736A] hover:text-[#4A453E]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <div className="w-16 h-16 bg-[#E8E2D6] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 text-[#A8C69F]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-[#4A453E]">
                      Cart is empty
                    </p>
                    <p className="text-xs text-[#7A736A] mt-1">
                      Fill it with custom prints!
                    </p>
                  </div>
                  <Link
                    href="/products"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#F9A37E] hover:bg-[#E8855A] text-white text-xs font-bold py-2.5 px-6 rounded-lg transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg"
                  >
                    <div className="w-14 h-14 bg-[#E8E2D6] rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-[#4A453E] truncate">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#7A736A] mt-0.5">
                        {item.size} · {item.color}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-[#E8E2D6] rounded-lg bg-[#FDFAF6] h-7 w-20 overflow-hidden">
                          <button
                            onClick={() =>
                              updateCartQty(item.id, item.quantity - 1)
                            }
                            className="w-7 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="flex-1 text-[10px] font-bold text-center text-[#4A453E]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQty(item.id, item.quantity + 1)
                            }
                            className="w-7 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <span className="font-extrabold text-xs text-[#4A453E]">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-[#C4B8A8] hover:text-red-400 transition-colors self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-4 py-4 bg-[#FDFAF6] border-t border-[#E8E2D6] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#7A736A]">Subtotal</span>
                  <span className="font-extrabold text-base text-[#4A453E]">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="border border-[#E8E2D6] hover:bg-[#E8E2D6] text-[#4A453E] text-xs font-bold py-3 px-4 rounded-lg transition-all text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#F9A37E] hover:bg-[#E8855A] text-white text-xs font-bold py-3 px-4 rounded-lg transition-all text-center shadow-sm"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
