"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Sparkles, Instagram, Facebook, Twitter, Clock } from 'lucide-react';
import { useApp } from '../../components/AppContext';
import { getApiUrl } from '../../components/ApiConfig';

export default function ComingSoonPage() {
  const { showToast } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Target launch date: August 1st, 2026
  const calculateTimeLeft = () => {
    const targetDate = new Date('August 1, 2026 00:00:00').getTime();
    const difference = targetDate - Date.now();

    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    fetch(getApiUrl("/newsletter/subscribe"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim() }),
    })
      .then(async (res) => {
        if (res.ok) {
          showToast("Subscribed!", "We will notify you once we launch.", "success");
          setEmail("");
        } else {
          const body = await res.json();
          throw new Error(body.message || "Failed to subscribe.");
        }
      })
      .catch((err) => {
        showToast("Error", err.message || "Something went wrong.", "error");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center bg-[#FDFAF6] relative overflow-hidden select-none">
      {/* Background blobs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-[#F9A37E]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s' }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-[#A8C69F]/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '7s' }} />

      <div className="max-w-lg w-full space-y-3 md:space-y-8 relative z-10">
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center space-y-3">
          <img src="/kliamologoNew.png" alt="Kliamo Fashion" className="h-16 w-auto object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]" />
          <div className="flex items-center gap-1 bg-[#F9A37E]/15 border border-[#F9A37E]/30 rounded-full px-3 py-1 text-[9px] font-black text-[#E8855A] tracking-widest uppercase">
            <Sparkles className="w-3 h-3 animate-spin" style={{ animationDuration: '4s' }} /> Something Big is Brewing
          </div>
        </div>

        {/* Headlines */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#4A453E] leading-1">
            Our Premium Storefront is <span className="text-[#F9A37E] block">Coming Soon</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#7A736A] leading-relaxed max-w-md mx-auto">
            We are weaving together the ultimate collection of premium printed apparel. Sign up to get exclusive early access and a 15% discount code on launch day.
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto py-2">
          <div className="bg-white/80 border border-[#E8E2D6] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-2xl sm:text-3xl font-black text-[#E8855A] font-mono leading-none">
              {String(timeLeft.days).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black text-[#8A837A] uppercase tracking-wider mt-1.5">Days</span>
          </div>

          <div className="bg-white/80 border border-[#E8E2D6] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-2xl sm:text-3xl font-black text-[#E8855A] font-mono leading-none">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black text-[#8A837A] uppercase tracking-wider mt-1.5">Hours</span>
          </div>

          <div className="bg-white/80 border border-[#E8E2D6] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-2xl sm:text-3xl font-black text-[#E8855A] font-mono leading-none">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black text-[#8A837A] uppercase tracking-wider mt-1.5">Mins</span>
          </div>

          <div className="bg-white/80 border border-[#E8E2D6] rounded-xl p-3 sm:p-4 shadow-sm flex flex-col items-center justify-center backdrop-blur-sm transition-transform hover:scale-105">
            <span className="text-2xl sm:text-3xl font-black text-[#E8855A] font-mono leading-none">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-black text-[#8A837A] uppercase tracking-wider mt-1.5">Secs</span>
          </div>
        </div>

        {/* Subscribe Form */}
        <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#A8C69F]" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full bg-white border border-[#E8E2D6] focus:border-[#F9A37E] rounded-lg py-3.5 pl-11 pr-28 text-xs font-semibold text-[#4A453E] outline-none transition-all shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#F9A37E] hover:bg-[#E8855A] text-white text-[10px] font-extrabold py-2 px-4 rounded-md transition-all flex items-center gap-1 disabled:opacity-50"
            >
              {loading ? "..." : "Notify Me"} <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </form>

        {/* Social Links */}
        <div className="pt-6 border-t border-[#E8E2D6] flex flex-col items-center gap-4">
          <p className="text-[10px] font-black text-[#A89B8A] uppercase tracking-widest">Stay Connected</p>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white border border-[#E8E2D6] text-[#7A736A] hover:text-[#F9A37E] hover:border-[#F9A37E] transition-all shadow-sm">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white border border-[#E8E2D6] text-[#7A736A] hover:text-[#F9A37E] hover:border-[#F9A37E] transition-all shadow-sm">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-white border border-[#E8E2D6] text-[#7A736A] hover:text-[#F9A37E] hover:border-[#F9A37E] transition-all shadow-sm">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
