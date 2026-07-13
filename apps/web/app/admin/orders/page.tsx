"use client";

import { useState } from "react";
import { AdminTopbar } from "../AdminSidebar";
import { Search, ChevronDown, Check } from "lucide-react";

const INITIAL_ORDERS = [
  { id: "ORD-9872", customer: "Jane Doe", email: "jane.doe@example.com", date: "2026-07-08", items: 2, total: 4598, status: "Delivered" },
  { id: "ORD-4819", customer: "Alex Mercer", email: "alex.mercer@gmail.com", date: "2026-07-12", items: 3, total: 8040, status: "Processing" },
  { id: "ORD-2391", customer: "Sarah Connor", email: "s.connor@cyberdyne.org", date: "2026-07-13", items: 1, total: 2299, status: "Pending" },
  { id: "ORD-1104", customer: "Mark Wells", email: "mark.w@example.com", date: "2026-07-11", items: 4, total: 12840, status: "Shipped" },
  { id: "ORD-7761", customer: "Priya Sharma", email: "priya.s@gmail.com", date: "2026-07-09", items: 1, total: 1699, status: "Cancelled" },
];

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-red-50 text-red-600 border-red-100",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Orders" subtitle={`${orders.length} total orders`} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-xl outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${filterStatus === s ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATUS_OPTIONS.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="bg-white border border-zinc-200 rounded-2xl px-4 py-3 text-center shadow-sm">
                <p className="text-2xl font-black text-zinc-900">{count}</p>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{s}</p>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-5 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-4 px-5 font-extrabold text-zinc-900">{o.id}</td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-zinc-900 block">{o.customer}</span>
                      <span className="text-zinc-400 text-[10px]">{o.email}</span>
                    </td>
                    <td className="py-4 px-5 text-zinc-500">{o.date}</td>
                    <td className="py-4 px-5 font-bold text-zinc-700">{o.items} items</td>
                    <td className="py-4 px-5 font-black text-zinc-900">₹{o.total.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLES[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className="bg-zinc-50 border border-zinc-200 rounded-xl py-1.5 px-2.5 text-[10px] font-bold text-zinc-700 outline-none hover:border-[#F9A37E] transition-colors cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No orders match your search.</p>
          )}
        </div>
      </main>
    </div>
  );
}
