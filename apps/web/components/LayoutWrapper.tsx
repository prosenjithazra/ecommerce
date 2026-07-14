"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from './AppContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from './Toast';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismissToast } = useApp();
  const pathname = usePathname();
  const [activeRequests, setActiveRequests] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [showPreloader, setShowPreloader] = useState(true);

  // Keep loader visible briefly for initial entry branding
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Monkey-patch window.fetch to capture all API response statuses
  useEffect(() => {
    if (typeof window === "undefined") return;

    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      setActiveRequests((prev) => {
        const next = prev + 1;
        if (next === 1) {
          setProgressWidth(30);
        }
        return next;
      });
      try {
        return await originalFetch(...args);
      } finally {
        setActiveRequests((prev) => {
          const next = Math.max(0, prev - 1);
          if (next === 0) {
            setProgressWidth(100);
            setTimeout(() => setProgressWidth(0), 450);
          }
          return next;
        });
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Slowly progress the loading bar while requests are active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRequests > 0 && progressWidth < 90) {
      interval = setInterval(() => {
        setProgressWidth((p) => Math.min(90, p + (90 - p) * 0.1));
      }, 150);
    }
    return () => clearInterval(interval);
  }, [activeRequests, progressWidth]);

  // Route groups to hide Footer or Header
  const isAuth = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password'].includes(pathname) || pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* INITIAL SITE PRELOADER */}
      {showPreloader && (
        <div 
          className="fixed inset-0 z-[999999] bg-[#FDFAF6] flex flex-col items-center justify-center select-none" 
          style={{
            animation: 'fade-out-preloader 0.4s ease-out 1.2s forwards'
          }}
        >
          <div className="relative flex flex-col items-center justify-center space-y-6">
            <div className="relative flex items-center justify-center w-48 h-48">
              {/* Outer Clockwise Ring */}
              <div 
                className="absolute inset-0 rounded-full border-[3px] border-t-[#F9A37E] border-r-transparent border-b-[#F9A37E] border-l-transparent animate-spin" 
                style={{ animationDuration: '1.6s' }} 
              />
              {/* Inner Anticlockwise Ring */}
              <div 
                className="absolute inset-3 rounded-full border-[3px] border-t-transparent border-r-[#A8C69F] border-b-transparent border-l-[#A8C69F] animate-spin-reverse" 
                style={{ animationDuration: '1.2s' }} 
              />
              <img 
                src="/logoMainNew.png" 
                alt="Kaiva Fashion Logo" 
                className="w-24 h-24 object-contain animate-logo-pulse" 
              />
            </div>
            <h2 className="text-xs font-black tracking-[0.3em] text-[#4A453E]/80 uppercase animate-pulse">
              KAIVA FASHION
            </h2>
          </div>
        </div>
      )}
      {progressWidth > 0 && (
        <div 
          className="api-progress-bar" 
          style={{ 
            width: `${progressWidth}%`, 
            opacity: progressWidth === 100 ? 0 : 1 
          }} 
        />
      )}

      <div>
        {!isAuth && <Header />}
        <main className="relative">{children}</main>
      </div>

      {!isAuth && <Footer />}
      {!isAuth && <MobileBottomNav />}

      {/* Global Toast Overlay */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
};

