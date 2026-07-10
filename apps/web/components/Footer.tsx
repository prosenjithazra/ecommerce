"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import { useApp } from './AppContext';

export const Footer: React.FC = () => {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast("Subscribed!", "Thank you for subscribing to our newsletter.", "success");
    setEmail("");
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "T-Shirts",     href: "/products" },
      { name: "Hoodies",      href: "/products" },
      { name: "Accessories",  href: "/products" },
      { name: "Best Sellers", href: "/products" }
    ],
    company: [
      { name: "About Us",          href: "/about" },
      { name: "Contact Us",        href: "/contact" },
      { name: "Privacy Policy",    href: "/privacy" },
      { name: "Terms & Conditions",href: "/terms" }
    ],
    support: [
      { name: "Help Center / FAQ", href: "/faq" },
      { name: "Refund Policy",     href: "/refund" },
      { name: "Shipping Policy",   href: "/shipping" },
      { name: "Track Order",       href: "/orders" }
    ]
  };

  return (
    <footer className="bg-[#4A453E] text-[#C4B8A8] pt-12 pb-24 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Newsletter */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="space-y-2">
            <h4 className="text-white font-extrabold text-lg">Join the Creative Club</h4>
            <p className="text-xs text-[#A89B8A] max-w-xs">Sign up for updates, exclusive drops, and 10% off your first order.</p>
          </div>
          <div className="lg:col-span-2 flex items-center">
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-lg">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-[#3A3530] border border-[rgba(255,255,255,0.1)] text-[#E8E2D6] text-xs rounded-xl py-3 px-4 outline-none focus:border-[#F9A37E] placeholder:text-[#6A635A]"
              />
              <button
                type="submit"
                className="bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-xl py-3 px-5 flex items-center gap-1.5 font-bold text-xs transition-colors flex-shrink-0"
              >
                Subscribe <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-extrabold text-xl text-white tracking-tight">
                PRINT<span className="text-[#F9A37E]">HUB</span>
              </span>
              <span className="text-[9px] font-bold tracking-widest bg-[rgba(255,255,255,0.1)] text-[#C4B8A8] px-1.5 py-0.5 rounded uppercase">
                POD
              </span>
            </Link>
            <p className="text-xs text-[#A89B8A] leading-relaxed max-w-xs">
              Premium custom-printed apparel and accessories, made on demand and delivered fast.
            </p>
            <div className="space-y-2 text-xs text-[#A89B8A]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <span>123 Creative St, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <span>+1 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <span>support@printhub-pod.com</span>
              </div>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Shop</h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.shop.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#F9A37E] transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#F9A37E] transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2.5 text-xs">
              {footerLinks.support.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#F9A37E] transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-4 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="text-xs text-[#6A635A] text-center sm:text-left">
            © {currentYear} PrintHub. All rights reserved.
          </span>
          <div className="flex gap-2 justify-center">
            {[
              { icon: <Twitter className="w-4 h-4" />,   href: "#" },
              { icon: <Instagram className="w-4 h-4" />, href: "#" },
              { icon: <Facebook className="w-4 h-4" />,  href: "#" },
            ].map((s, i) => (
              <a key={i} href={s.href} className="w-8 h-8 rounded-xl bg-[rgba(255,255,255,0.08)] hover:bg-[#F9A37E] hover:text-white text-[#A89B8A] flex items-center justify-center transition-all">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
