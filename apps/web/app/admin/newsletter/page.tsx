"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Mail, Trash2, UserCheck, UserX, Download } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  status: string;
}

export default function AdminNewsletterPage() {
  const { showToast } = useApp();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Active" | "Unsubscribed">("All");

  const fetchSubscribers = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/newsletter"), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
          throw new Error("Session expired.");
        }
        if (res.ok) return res.json();
        throw new Error("Failed to load subscribers");
      })
      .then((data) => {
        setSubscribers(data);
        setLoading(false);
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to load subscribers.", "error");
        setSubscribers([]);
        setLoading(false);
      });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleUpdateStatus = (id: string, status: string) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/newsletter/${id}/status`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to update status");
      })
      .then((updated) => {
        setSubscribers((prev) => prev.map((s) => (s.id === id ? updated : s)));
        showToast("Status Updated", `Subscriber status changed to ${status}`, "success");
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to update status.", "error");
      });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Remove this subscriber?")) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/newsletter/${id}`), {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.ok) {
          setSubscribers((prev) => prev.filter((s) => s.id !== id));
          showToast("Removed", "Subscriber was deleted.", "info");
        } else {
          throw new Error("Failed to delete subscriber");
        }
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to delete.", "error");
      });
  };

  const handleExportCSV = () => {
    const active = subscribers.filter((s) => s.status === "Active");
    if (!active.length) {
      showToast("No Data", "No active subscribers to export.", "info");
      return;
    }
    const csv = ["Email,Status,Subscribed At", ...active.map((s) => `${s.email},${s.status},${new Date(s.subscribedAt).toLocaleString()}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported", `${active.length} subscriber emails downloaded.`, "success");
  };

  const filtered = subscribers.filter((s) => {
    const matchSearch = s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || s.status === filter;
    return matchSearch && matchFilter;
  });

  const activeCount = subscribers.filter((s) => s.status === "Active").length;
  const unsubCount = subscribers.filter((s) => s.status === "Unsubscribed").length;

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
          <UserCheck className="w-3 h-3" /> Active
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[10px] font-black text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200/50">
        <UserX className="w-3 h-3" /> Unsubscribed
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar
        title="Newsletter Subscribers"
        subtitle={`${activeCount} active · ${unsubCount} unsubscribed`}
      />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-zinc-50/50">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: subscribers.length, color: "text-zinc-900" },
            { label: "Active", value: activeCount, color: "text-emerald-600" },
            { label: "Unsubscribed", value: unsubCount, color: "text-zinc-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-zinc-200 rounded-xl p-4 text-center shadow-sm"
            >
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Filters + Export */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(["All", "Active", "Unsubscribed"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${filter === f ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all"
            >
              <Download className="w-3 h-3" /> Export CSV
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#F9A37E]" />
            <span className="text-xs font-bold">Loading subscribers...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white border border-zinc-200 rounded-lg shadow-sm">
            <Mail className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-xs font-bold text-zinc-400">No subscribers found.</p>
          </div>
        ) : (
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {["#", "Email Address", "Subscribed At", "Status", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filtered.map((s, idx) => (
                    <tr key={s.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-4 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <span className="font-extrabold text-zinc-900 flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-[#F9A37E] flex-shrink-0" />
                          {s.email}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-zinc-450 font-medium">
                        {new Date(s.subscribedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(s.status)}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          {s.status === "Active" ? (
                            <button
                              onClick={() => handleUpdateStatus(s.id, "Unsubscribed")}
                              className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all"
                              title="Mark Unsubscribed"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(s.id, "Active")}
                              className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-all"
                              title="Reactivate"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(s.id)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-all"
                            title="Delete subscriber"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
