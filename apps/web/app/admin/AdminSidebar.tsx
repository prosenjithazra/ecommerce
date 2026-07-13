"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Layers,
  Users,
  FileText,
  LogOut,
  Sliders,
  Store,
  X,
  Menu,
  Bell,
  ChevronRight,
} from "lucide-react";
import { useApp } from "../../components/AppContext";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: ShoppingBag, exact: false },
  { href: "/admin/categories", label: "Categories", icon: Layers, exact: false },
  { href: "/admin/orders", label: "Orders", icon: Sliders, exact: false },
  { href: "/admin/users", label: "Users", icon: Users, exact: false },
  { href: "/admin/terms", label: "Terms & Privacy", icon: FileText, exact: false },
];

export function AdminSidebar() {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-300">
      {/* Brand */}
      <div className="px-5 py-6 border-b border-zinc-800 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F9A37E] to-[#e8855a] flex items-center justify-center shadow-lg shadow-[#F9A37E]/30">
            <span className="text-white font-black text-base leading-none">P</span>
          </div>
          <div className="leading-tight">
            <span className="font-black text-white text-sm tracking-tight block">PRINTHUB</span>
            <span className="text-[#F9A37E] text-[9px] font-extrabold tracking-[0.2em] block">ADMIN CONSOLE</span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all group ${
                active
                  ? "bg-[#F9A37E]/15 text-[#F9A37E] border border-[#F9A37E]/20"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-[#F9A37E]" : "group-hover:text-white"}`} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to storefront */}
      <div className="px-3 pb-2">
        <Link
          href="/"
          className="flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 transition-all"
        >
          <Store className="w-4 h-4" />
          <span>Visit Storefront</span>
        </Link>
      </div>

      {/* Admin user footer */}
      <div className="px-3 pb-5 pt-3 border-t border-zinc-800">
        <div className="flex items-center gap-2.5 p-2 rounded-xl">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#A8C69F] to-[#7dab73] flex items-center justify-center font-black text-zinc-950 text-sm flex-shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-extrabold text-white text-xs block leading-tight truncate">{currentUser?.name || "Administrator"}</span>
            <span className="text-zinc-500 text-[10px] block leading-tight truncate">{currentUser?.email || "admin@printhub.com"}</span>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="p-1.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-zinc-500 transition-colors flex-shrink-0"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-56 xl:w-64 flex-shrink-0 flex-col border-r border-zinc-800 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-zinc-950 text-white shadow-xl border border-zinc-800"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 h-full bg-zinc-950 shadow-2xl z-10">
            <SidebarContent />
          </div>
        </div>
      )}
    </>
  );
}

export function AdminTopbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 bg-white border-b border-zinc-200 px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
      <div className="lg:block pl-0">
        <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-tight">Admin Console</p>
        <h1 className="text-sm font-extrabold text-[#4A453E] leading-tight">{title}</h1>
        {subtitle && <p className="text-[10px] text-zinc-400 leading-tight">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="text-xs font-bold text-zinc-500 hover:text-[#F9A37E] py-1.5 px-3 rounded-lg border border-zinc-200 hover:border-[#F9A37E]/30 hover:bg-[#F9A37E]/5 flex items-center gap-1.5 transition-all"
        >
          <Store className="w-3.5 h-3.5" /> Storefront
        </Link>
        <button className="relative p-2 hover:bg-zinc-50 rounded-xl text-zinc-400 hover:text-zinc-600 transition-colors">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F9A37E] rounded-full border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
