"use client";

import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Layers, TrendingUp, TrendingDown, Package, AlertCircle, ArrowRight } from "lucide-react";
import { AdminTopbar } from "./AdminSidebar";

const stats = [
  { label: "Total Revenue", value: "₹1,24,492", sub: "+14.5% this week", icon: DollarSign, up: true, color: "from-emerald-500 to-emerald-600" },
  { label: "Total Orders", value: "142", sub: "12 pending fulfilment", icon: ShoppingBag, up: true, color: "from-[#F9A37E] to-[#e8855a]" },
  { label: "Registered Users", value: "38", sub: "+3 this week", icon: Users, up: true, color: "from-violet-500 to-violet-600" },
  { label: "Product Catalog", value: "24 SKUs", sub: "3 out of stock", icon: Layers, up: false, color: "from-sky-500 to-sky-600" },
];

const recentOrders = [
  { id: "ORD-9872", customer: "Jane Doe", total: "₹4,598", status: "Delivered", date: "2026-07-08" },
  { id: "ORD-4819", customer: "Alex Mercer", total: "₹8,040", status: "Processing", date: "2026-07-12" },
  { id: "ORD-2391", customer: "Sarah Connor", total: "₹2,299", status: "Pending", date: "2026-07-13" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Dashboard Overview" subtitle="Welcome back, your store is performing well" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold text-zinc-400 mb-1">{s.label}</p>
                    <p className="text-2xl font-black text-zinc-900">{s.value}</p>
                    <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                      {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {s.sub}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shadow-md flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom two panels */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Recent Orders Table */}
          <div className="lg:col-span-3 bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <h2 className="font-extrabold text-sm text-zinc-800">Recent Orders</h2>
              <Link href="/admin/orders" className="text-[10px] font-bold text-[#F9A37E] hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="divide-y divide-zinc-100">
              {recentOrders.map((o) => (
                <div key={o.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-extrabold text-zinc-800">{o.id}</p>
                    <p className="text-[10px] text-zinc-400 font-medium">{o.customer} · {o.date}</p>
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900">{o.total}</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusColors[o.status]}`}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Nav Tiles */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-gradient-to-br from-[#F9A37E] to-[#e8855a] rounded-lg p-5 shadow-md text-white">
              <Package className="w-6 h-6 mb-2 opacity-80" />
              <p className="font-black text-base leading-tight">Add New Product</p>
              <p className="text-xs opacity-70 mb-3">Expand your catalog with a new listing</p>
              <Link href="/admin/products/add" className="text-xs font-extrabold bg-white text-[#e8855a] px-4 py-1.5 rounded-lg inline-flex items-center gap-1 hover:opacity-90 transition-opacity">
                Go to Add <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm">
              <AlertCircle className="w-5 h-5 text-amber-500 mb-1" />
              <p className="text-xs font-extrabold text-zinc-800 mb-0.5">POD API Status</p>
              <p className="text-[10px] text-zinc-400 mb-2">Qikink integration is active and syncing orders.</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600">Operational</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
