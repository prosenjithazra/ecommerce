"use client";

import { useState, useEffect } from "react";
import { Search, ShieldOff, ShieldCheck, Mail, Loader2 } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

const INITIAL_USERS = [
  { id: "u1", name: "Jane Doe", email: "jane.doe@example.com", role: "admin", status: "Active", createdAt: "2026-01-12T00:00:00.000Z" },
  { id: "u2", name: "Alex Mercer", email: "alex.mercer@gmail.com", role: "user", status: "Active", createdAt: "2025-11-03T00:00:00.000Z" },
  { id: "u3", name: "Sarah Connor", email: "s.connor@cyberdyne.org", role: "user", status: "Suspended", createdAt: "2026-03-20T00:00:00.000Z" },
  { id: "u4", name: "Mark Wells", email: "mark.w@example.com", role: "user", status: "Active", createdAt: "2026-07-01T00:00:00.000Z" },
  { id: "u5", name: "Priya Sharma", email: "priya.s@gmail.com", role: "user", status: "Active", createdAt: "2025-12-14T00:00:00.000Z" },
];

export default function AdminUsersPage() {
  const { showToast } = useApp();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Suspended">("All");

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/user"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }
      if (res.ok) return res.json();
      throw new Error("Failed to load backend users");
    })
    .then(data => {
      setUsers(data);
      setLoading(false);
    })
    .catch(err => {
      showToast("Error", err.message || "Failed to load users.", "error");
      setUsers([]);
      setLoading(false);
    });
  }, []);

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

  const avatarColors = [
    "from-[#A8C69F] to-[#7dab73]",
    "from-[#F9A37E] to-[#e8855a]",
    "from-violet-400 to-violet-600",
    "from-sky-400 to-sky-600",
    "from-rose-400 to-rose-600"
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Users" subtitle={`${users.length} registered customers`} />
      
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
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

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#F9A37E]" />
            <span className="text-xs font-bold">Loading users from backend...</span>
          </div>
        ) : (
          /* Users Table */
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {["#", "User", "Email", "Role", "Joined Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filtered.map((u, idx) => (
                    <tr key={u.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="py-4 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${avatarColors[idx % avatarColors.length]} flex items-center justify-center font-black text-white text-[11px] shadow-sm`}>
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-extrabold text-zinc-900">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-zinc-600 font-medium">{u.email}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase tracking-wide">{u.role || 'user'}</span>
                      </td>
                      <td className="py-4 px-4 text-zinc-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${u.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => toggle(u.id)}
                          className={`flex items-center gap-1.5 text-[9px] font-extrabold px-2.5 py-1.5 rounded-lg border transition-all ${
                            u.status === "Active" 
                              ? "text-red-500 border-red-200 hover:bg-red-50" 
                              : "text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          }`}
                        >
                          <ShieldOff className="w-3.5 h-3.5" />
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <p className="py-12 text-center text-zinc-400 text-sm font-bold">No users match your search.</p>
            )}
            <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50">
              <p className="text-[10px] font-bold text-zinc-400">
                Showing <strong className="text-zinc-600">{filtered.length}</strong> of <strong className="text-zinc-600">{users.length}</strong> users
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
