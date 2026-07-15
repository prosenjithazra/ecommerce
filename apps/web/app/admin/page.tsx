"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DollarSign, ShoppingBag, Users, Layers, TrendingUp, Package, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { AdminTopbar } from "./AdminSidebar";
import { getApiUrl } from "../../components/ApiConfig";
import { useApp } from "../../components/AppContext";

const statusColors: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-red-50 text-red-650 border-red-100",
  Returned: "bg-violet-50 text-violet-700 border-violet-100",
};

export default function AdminDashboardPage() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(getApiUrl("/orders")).then(r => r.ok ? r.json() : []),
      fetch(getApiUrl("/products")).then(r => r.ok ? r.json() : []),
      fetch(getApiUrl("/user")).then(r => r.ok ? r.json() : []),
    ])
      .then(([ordersData, productsData, usersData]) => {
        setOrders(ordersData);
        setProducts(productsData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard fetch failed:", err);
        showToast("Error", "Failed to load real-time statistics.", "error");
        setLoading(false);
      });
  }, [showToast]);

  // Calculations
  const nonCancelledOrders = orders.filter(o => o.status !== "Cancelled" && o.status !== "Returned");
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter(o => o.status === "Pending" || o.status === "Processing").length;

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, sub: "Revenue from active orders", icon: DollarSign, up: true, color: "from-emerald-500 to-emerald-600" },
    { label: "Total Orders", value: orders.length.toString(), sub: `${pendingCount} pending fulfillment`, icon: ShoppingBag, up: true, color: "from-[#F9A37E] to-[#e8855a]" },
    { label: "Registered Users", value: users.length.toString(), sub: "Total customer accounts", icon: Users, up: true, color: "from-violet-500 to-violet-600" },
    { label: "Product Catalog", value: `${products.length} SKUs`, sub: "Active listed items", icon: Layers, up: true, color: "from-sky-500 to-sky-600" },
  ];

  // Slice last 5 orders
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt || b.date || 0).getTime() - new Date(a.createdAt || a.date || 0).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Dashboard Overview" subtitle="Loading..." />
        <main className="flex-1 flex items-center justify-center p-8 bg-[#FDFAF6]">
          <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        </main>
      </div>
    );
  }

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
                    <p className="text-[10px] font-bold mt-1 flex items-center gap-1 text-emerald-600">
                      <TrendingUp className="w-3 h-3" />
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
            
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-xs italic">
                No orders received yet.
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {recentOrders.map((o) => (
                  <div key={o.id} className="px-6 py-3.5 flex items-center gap-4 hover:bg-zinc-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-extrabold text-zinc-800 truncate">{o.id}</p>
                      <p className="text-[10px] text-zinc-400 font-medium truncate">
                        {o.customer || o.email || "Guest User"} · {o.date || new Date(o.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-extrabold text-xs text-zinc-900">
                      ₹{Number(o.total || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${statusColors[o.status] || "bg-zinc-100 text-zinc-600"}`}>
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
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
