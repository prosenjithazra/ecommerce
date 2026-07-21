"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Loader2 } from 'lucide-react';
import { useApp } from './AppContext';
import { getApiUrl } from './ApiConfig';

export const Footer: React.FC = () => {
  const { showToast, companySettings } = useApp();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
      showToast("Invalid Email", "Please enter a valid email address.", "error");
      return;
    }
    setSubscribing(true);
    try {
      const res = await fetch(getApiUrl("/newsletter/subscribe"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        showToast("Subscribed!", "Thank you for joining the Creative Club! 🎉", "success");
      } else if (res.status === 409) {
        showToast("Already Subscribed", data.message || "This email is already on our list.", "info");
      } else {
        throw new Error(data.message || "Subscription failed.");
      }
    } catch (err: any) {
      if (!err.message?.includes('already')) {
        showToast("Error", err.message || "Something went wrong. Please try again.", "error");
      }
    } finally {
      setSubscribing(false);
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "Design Studio", href: "/custom" },
      { name: "T-Shirts",     href: "/products" },
      { name: "Hoodies",      href: "/products" },
      { name: "Accessories",  href: "/products" }
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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 pb-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="lg:col-span-3 space-y-2">
            <h4 className="text-white font-extrabold text-xl">Join the Creative Club</h4>
            <p className="text-sm text-[#A89B8A] max-w-lg">Join our Creative Club for exclusive updates, inspiring events, creative resources, member-only opportunities, and connect with passionate creators worldwide.</p>
          </div>
          <div className="lg:col-span-3 flex items-center">
            {subscribed ? (
              <div className="flex items-center gap-3 text-emerald-400 bg-emerald-900/20 border border-emerald-700/30 rounded-lg px-4 py-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-bold">You&apos;re on the list! Welcome to the Creative Club. 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:flex-1 h-11 bg-[#3A3530] border border-[rgba(255,255,255,0.1)] text-[#E8E2D6] text-sm rounded-lg px-4 outline-none focus:border-[#F9A37E] placeholder:text-[#6A635A]"
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="w-full sm:w-auto bg-[#F9A37E] hover:bg-[#E8855A] disabled:opacity-60 text-white rounded-lg px-6 h-11 flex items-center justify-center gap-1.5 font-bold text-sm transition-colors flex-shrink-0"
                >
                  {subscribing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {/* Brand */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <img src="/kliamologoNew.png" alt="Kliamo Fashion Logo" className="h-20 w-auto object-contain " />
            </Link>
            <p className="text-sm text-[#A89B8A] leading-relaxed max-w-xs">
              Premium custom-printed apparel and accessories, made on demand and delivered fast.
            </p>
            <div className="space-y-2 text-sm text-[#A89B8A]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <span>{companySettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <a href={`tel:${companySettings.phone.replace(/\s+/g, '')}`} className="hover:text-[#F9A37E] transition-colors">{companySettings.phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                <a href={`mailto:${companySettings.email}`} className="hover:text-[#F9A37E] transition-colors">{companySettings.email}</a>
              </div>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Shop</h5>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.shop.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#F9A37E] transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Company</h5>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map(link => (
                <li key={link.name}>
                  <Link href={link.href} className="hover:text-[#F9A37E] transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h5 className="text-white font-bold text-sm uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2.5 text-sm">
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
          <span className="text-sm text-[#d9d9d9] text-center sm:text-left">
            © {currentYear} <Link href="/" className="hover:text-[#F9A37E] transition-colors">Kliamo Fashion</Link>. All rights reserved.
          </span>
          <div className="flex gap-2 justify-center">
            {[
              { 
                icon: (
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                ), 
                href: companySettings.twitterUrl 
              },
              { icon: <Instagram className="w-4 h-4" />, href: companySettings.instagramUrl },
              { icon: <Facebook className="w-4 h-4" />,  href: companySettings.facebookUrl },
            ].map((s, i) => (
              <a 
                key={i} 
                href={s.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[#F9A37E] hover:text-white text-[#A89B8A] flex items-center justify-center transition-all"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
