"use client";

import { useState, useEffect } from "react";
import { Search, Loader2, Mail, MessageSquare, Clock, CheckCircle2, Trash2, Eye, X } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface ContactQuery {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function AdminContactPage() {
  const { showToast } = useApp();
  const [queries, setQueries] = useState<ContactQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Pending" | "Replied" | "Closed">("All");
  const [selectedQuery, setSelectedQuery] = useState<ContactQuery | null>(null);

  const fetchQueries = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/contact"), {
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
      throw new Error("Failed to load contact queries");
    })
    .then(data => {
      setQueries(data);
      setLoading(false);
    })
    .catch(err => {
      showToast("Error", err.message || "Failed to load queries.", "error");
      setQueries([]);
      setLoading(false);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchQueries();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/contact/${id}/status`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus })
    })
    .then(res => {
      if (res.ok) return res.json();
      throw new Error("Failed to update status");
    })
    .then(updated => {
      setQueries(prev => prev.map(q => q.id === id ? updated : q));
      if (selectedQuery && selectedQuery.id === id) {
        setSelectedQuery(updated);
      }
      showToast("Status Updated", `Query status changed to ${newStatus}`, "success");
    })
    .catch(err => {
      showToast("Error", err.message || "Failed to update status.", "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this query?")) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/contact/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.ok) {
        setQueries(prev => prev.filter(q => q.id !== id));
        if (selectedQuery && selectedQuery.id === id) {
          setSelectedQuery(null);
        }
        showToast("Query Deleted", "Contact message was successfully removed.", "info");
      } else {
        throw new Error("Failed to delete contact query");
      }
    })
    .catch(err => {
      showToast("Error", err.message || "Failed to delete query.", "error");
    });
  };

  const filtered = queries.filter((q) => {
    const s = search.toLowerCase();
    const matchSearch =
      q.name.toLowerCase().includes(s) ||
      q.email.toLowerCase().includes(s) ||
      (q.subject || "").toLowerCase().includes(s) ||
      q.message.toLowerCase().includes(s);
    const matchFilter = filter === "All" || q.status === filter;
    return matchSearch && matchFilter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return (
          <span className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "Replied":
        return (
          <span className="flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/50">
            <CheckCircle2 className="w-3 h-3" /> Replied
          </span>
        );
      case "Closed":
        return (
          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
            <CheckCircle2 className="w-3 h-3" /> Closed
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-black text-zinc-500 bg-zinc-50 px-2 py-0.5 rounded-full">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Contact Queries" subtitle={`${queries.length} submitted messages from customers`} />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 bg-zinc-50/50">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search queries..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-2">
            {(["All", "Pending", "Replied", "Closed"] as const).map((f) => (
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
            <span className="text-xs font-bold">Loading contact logs...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3 bg-white border border-zinc-200 rounded-lg shadow-sm">
            <MessageSquare className="w-10 h-10 text-zinc-300 mx-auto" />
            <p className="text-xs font-bold text-zinc-450">No queries found matching the criteria.</p>
          </div>
        ) : (
          /* Queries List */
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    {["#", "Customer", "Subject", "Message Snippet", "Date", "Status", "Actions"].map((h) => (
                      <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filtered.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-zinc-50/50 transition-colors group">
                      <td className="py-4 pl-5 px-4 text-zinc-450 font-bold text-[11px]">{idx + 1}</td>
                      <td className="py-4 px-4">
                        <div className="leading-tight">
                          <span className="font-extrabold text-zinc-900 block">{q.name}</span>
                          <span className="text-[10px] text-zinc-400 block mt-0.5">{q.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-bold text-zinc-700 truncate max-w-[150px]">
                        {q.subject || <span className="text-zinc-300 font-normal italic">None</span>}
                      </td>
                      <td className="py-4 px-4 text-zinc-500 truncate max-w-[240px]">
                        {q.message}
                      </td>
                      <td className="py-4 px-4 text-zinc-450 font-medium">
                        {new Date(q.createdAt).toLocaleDateString(undefined, { dateStyle: "medium" })}
                      </td>
                      <td className="py-4 px-4">{getStatusBadge(q.status)}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setSelectedQuery(q)}
                            className="p-1.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-all"
                            title="View Message"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-500 transition-all"
                            title="Delete query"
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

      {/* Query Detail Modal Drawer Overlay */}
      {selectedQuery && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedQuery(null)} />
          <div className="relative w-full max-w-lg bg-white h-full flex flex-col p-6 sm:p-8 shadow-2xl z-10 animate-slide-from-right">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 flex-shrink-0">
              <h3 className="font-extrabold text-sm text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F9A37E]" /> Query Details
              </h3>
              <button
                onClick={() => setSelectedQuery(null)}
                className="w-7 h-7 rounded-full hover:bg-zinc-100 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Info details */}
            <div className="flex-1 overflow-y-auto py-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-150/70">
                <div className="text-xs">
                  <span className="text-zinc-400 block font-bold">From</span>
                  <span className="font-black text-zinc-800 mt-1 block">{selectedQuery.name}</span>
                </div>
                <div className="text-xs">
                  <span className="text-zinc-400 block font-bold">Email Address</span>
                  <a href={`mailto:${selectedQuery.email}`} className="font-black text-[#F9A37E] hover:underline mt-1 block">
                    {selectedQuery.email}
                  </a>
                </div>
                <div className="text-xs">
                  <span className="text-zinc-400 block font-bold">Date Received</span>
                  <span className="font-bold text-zinc-650 mt-1 block">
                    {new Date(selectedQuery.createdAt).toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
                  </span>
                </div>
                <div className="text-xs">
                  <span className="text-zinc-400 block font-bold">Status</span>
                  <div className="mt-1.5">{getStatusBadge(selectedQuery.status)}</div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 block">Subject</span>
                <p className="text-sm font-extrabold text-zinc-800 bg-white border border-zinc-100 rounded-lg p-3">
                  {selectedQuery.subject || <span className="text-zinc-300 font-normal italic">No Subject Provided</span>}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-zinc-400 block">Message Content</span>
                <p className="text-xs text-zinc-600 leading-relaxed bg-white border border-zinc-100 rounded-lg p-4 whitespace-pre-wrap">
                  {selectedQuery.message}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-zinc-100 flex gap-2 flex-shrink-0">
              <button
                onClick={() => handleUpdateStatus(selectedQuery.id, "Replied")}
                className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-650 font-extrabold text-xs py-3 px-4 rounded-lg transition-colors text-center"
              >
                Mark as Replied
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedQuery.id, "Closed")}
                className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 font-extrabold text-xs py-3 px-4 rounded-lg transition-colors text-center"
              >
                Close Query
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedQuery.id, "Pending")}
                className="bg-zinc-50 hover:bg-zinc-100 text-zinc-600 font-extrabold text-[10px] py-3 px-3 rounded-lg transition-colors"
                title="Reset to Pending"
              >
                Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
