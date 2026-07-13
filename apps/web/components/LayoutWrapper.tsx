"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { useApp } from './AppContext';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBottomNav } from './MobileBottomNav';
import { ToastContainer } from './Toast';

export const LayoutWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toasts, dismissToast } = useApp();
  const pathname = usePathname();

  // Route groups to hide Footer or Header
  const isAuth = ['/login', '/signup', '/forgot-password', '/verify-otp', '/reset-password'].includes(pathname) || pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col justify-between">
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
