"use client";

import { useState } from "react";
import { Search, ShieldOff, ShieldCheck, Mail, Phone } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

const INITIAL_USERS = [
  { id: "u1", name: "Jane Doe", email: "jane.doe@example.com", phone: "+1 555-0199", orders: 4, spent: 24294, status: "Active", joined: "2026-01-12" },
  { id: "u2", name: "Alex Mercer", email: "alex.mercer@gmail.com", phone: "+1 555-0144", orders: 7, spent: 56280, status: "Active", joined: "2025-11-03" },
  { id: "u3", name: "Sarah Connor", email: "s.connor@cyberdyne.org", phone: "+1 555-0100", orders: 2, spent: 11398, status: "Suspended", joined: "2026-03-20" },
  { id: "u4", name: "Mark Wells", email: "mark.w@example.com", phone: "+91 98765-43210", orders: 1, spent: 2299, status: "Active", joined: "2026-07-01" },
  { id: "u5", name: "Priya Sharma", email: "priya.s@gmail.com", phone: "+91 87654-32109", orders: 3, spent: 18497, status: "Active", joined: "2025-12-14" },
];

export default function AdminUsersPage() {
  const { showToast } = useApp();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Suspended">("All");

  const filtered = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
    const matchFilter = filter === "All" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const toggle = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== id) return u;
        const next = u.status === "Active" ? "Suspended" : "Active";
        showToast(`Account ${next}`, `${u.name}'s account has been ${next.toLowerCase()}.`, next === "Active" ? "success" : "info");
        return { ...u, status: next };
      })
    );
  };

  const avatarColors = ["from-[#A8C69F] to-[#7dab73]", "from-[#F9A37E] to-[#e8855a]", "from-violet-400 to-violet-600", "from-sky-400 to-sky-600", "from-rose-400 to-rose-600"];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Users" subtitle={`${users.length} registered customers`} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-xl outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Active", "Suspended"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${filter === f ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((u, idx) => (
            <div key={u.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex gap-4">
              {/* Avatar */}
              <div className={`w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-black text-white text-base shadow-md`}>
                {u.name.charAt(0).toUpperCase()}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-sm text-zinc-900 leading-tight">{u.name}</h3>
                    <p className="text-[10px] text-zinc-400 font-medium">Joined {u.joined}</p>
                  </div>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap flex-shrink-0 ${u.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                    {u.status}
                  </span>
                </div>

                <div className="flex gap-4 text-[10px] text-zinc-500 flex-wrap">
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {u.email}</span>
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {u.phone}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-[10px] text-zinc-500">
                    <span><strong className="text-zinc-900 font-extrabold">{u.orders}</strong> orders</span>
                    <span><strong className="text-zinc-900 font-extrabold">₹{u.spent.toLocaleString()}</strong> spent</span>
                  </div>
                  <button
                    onClick={() => toggle(u.id)}
                    className={`flex items-center gap-1.5 text-[9px] font-extrabold px-2.5 py-1.5 rounded-xl border transition-all ${u.status === "Active" ? "text-red-500 border-red-200 hover:bg-red-50" : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"}`}
                  >
                    {u.status === "Active" ? <ShieldOff className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                    {u.status === "Active" ? "Suspend" : "Activate"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-zinc-400 text-sm font-bold">No users match your search.</p>
        )}
      </main>
    </div>
  );
}
