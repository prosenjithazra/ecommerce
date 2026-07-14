"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, Check, Search } from "lucide-react";
import { AdminTopbar } from "../../AdminSidebar";
import { useApp } from "../../../../components/AppContext";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  lastUpdated: string;
}

const INITIAL_FAQS: FaqItem[] = [
  { id: "f1", category: "Orders", question: "How do I track my order?", answer: "Once your order is dispatched, you will receive an email with a tracking link. You can also view real-time tracking by going to your PrintHub account → Orders → Track Order.", lastUpdated: "2026-07-01" },
  { id: "f2", category: "Orders", question: "Can I cancel or modify my order after placing it?", answer: "Orders can be cancelled or modified within 2 hours of placement, before they enter the printing queue. After that, cancellation is not possible. Please contact support immediately at support@printhub.com with your Order ID.", lastUpdated: "2026-07-01" },
  { id: "f3", category: "Printing", question: "What file format should I upload for best print quality?", answer: "We recommend uploading PNG or SVG files at a minimum of 300 DPI for the best print results. JPEG files are also accepted but may show compression artefacts on large prints. The design canvas recommends dimensions to guide you.", lastUpdated: "2026-07-01" },
  { id: "f4", category: "Printing", question: "What printing method do you use?", answer: "We use Direct-to-Garment (DTG) printing for t-shirts and hoodies, and sublimation printing for mugs and phone cases. Hats and bags use embroidery for text and simple logos.", lastUpdated: "2026-07-01" },
  { id: "f5", category: "Refund & Returns", question: "My item arrived damaged. What should I do?", answer: "We're sorry to hear that! Please email support@printhub.com within 7 days of delivery with your Order ID and clear photos of the damage. We will arrange a free reprint or issue a full refund within 24–48 business hours.", lastUpdated: "2026-07-01" },
  { id: "f6", category: "Refund & Returns", question: "Can I return an item if I simply don't like it?", answer: "As all our products are custom-printed on demand, we cannot accept returns for change of mind. However, if the product has a manufacturing defect or doesn't match your approved design proof, we will gladly offer a reprint or refund.", lastUpdated: "2026-07-01" },
  { id: "f7", category: "Shipping", question: "How long does delivery take?", answer: "Standard delivery within India takes 6–9 business days (2–4 days production + 4–5 days shipping). Express options are available at checkout for select pin codes. International orders typically take 14–21 business days.", lastUpdated: "2026-07-01" },
  { id: "f8", category: "Account", question: "How do I delete my account?", answer: "You can request account deletion by emailing privacy@printhub.com. We will process your request within 7 business days. Please note that order history is retained for 3 years as required by financial regulations, even after account deletion.", lastUpdated: "2026-07-01" },
];

const CATEGORIES = ["All", "Orders", "Printing", "Refund & Returns", "Shipping", "Account"];

export default function AdminFaqPage() {
  const { showToast } = useApp();
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ category: "Orders", question: "", answer: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ category: "Orders", question: "", answer: "" });
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0]!;

  const filtered = faqs.filter((f) => {
    const s = search.toLowerCase();
    const matchSearch = f.question.toLowerCase().includes(s) || f.answer.toLowerCase().includes(s);
    const matchCat = filterCat === "All" || f.category === filterCat;
    return matchSearch && matchCat;
  });

  const startEdit = (f: FaqItem) => {
    setEditingId(f.id);
    setEditForm({ category: f.category, question: f.question, answer: f.answer });
    setExpandedId(null);
  };

  const saveEdit = (id: string) => {
    setFaqs((prev) => prev.map((f) => f.id === id ? { ...f, ...editForm, lastUpdated: today } : f));
    setEditingId(null);
    showToast("FAQ Updated", `"${editForm.question}" has been saved.`, "success");
  };

  const deleteItem = (id: string) => {
    const item = faqs.find((f) => f.id === id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    showToast("FAQ Removed", `"${item?.question}" was deleted.`, "info");
  };

  const addFaq = () => {
    if (!newForm.question.trim()) return;
    const id = `f${Date.now()}`;
    setFaqs((prev) => [...prev, { id, ...newForm, lastUpdated: today }]);
    setNewForm({ category: "Orders", question: "", answer: "" });
    setAddingNew(false);
    showToast("FAQ Added", "New question has been added to the Help Center.", "success");
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 transition-all placeholder:text-zinc-400";
  const textareaCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-3 px-3.5 text-xs text-zinc-700 leading-relaxed outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 resize-none transition-all";

  const catColors: Record<string, string> = {
    Orders: "bg-amber-50 text-amber-700 border-amber-100",
    Printing: "bg-violet-50 text-violet-700 border-violet-100",
    "Refund & Returns": "bg-red-50 text-red-600 border-red-100",
    Shipping: "bg-sky-50 text-sky-700 border-sky-100",
    Account: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Help Center / FAQ" subtitle="Manage customer-facing frequently asked questions" />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <button
            onClick={() => { setAddingNew(true); setEditingId(null); }}
            className="flex items-center gap-1.5 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${filterCat === c ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
            >
              {c} {c === "All" ? `(${faqs.length})` : `(${faqs.filter((f) => f.category === c).length})`}
            </button>
          ))}
        </div>

        {/* FAQs Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-50 border-b border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            <div className="col-span-1">#</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-5">Question</div>
            <div className="col-span-2">Answer Preview</div>
            <div className="col-span-1 text-center">Updated</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-zinc-100">
            {filtered.map((f, idx) => (
              <div key={f.id}>
                {editingId === f.id ? (
                  <div className="px-5 py-4 space-y-3 bg-amber-50/30 border-l-4 border-l-[#F9A37E]">
                    <p className="text-[9px] font-black text-[#F9A37E] uppercase tracking-widest">Editing FAQ</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-1">
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
                        <select value={editForm.category} onChange={(e) => setEditForm((p) => ({ ...p, category: e.target.value }))} className={inputCls}>
                          {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Question</label>
                        <input value={editForm.question} onChange={(e) => setEditForm((p) => ({ ...p, question: e.target.value }))} className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Answer</label>
                      <textarea rows={4} value={editForm.answer} onChange={(e) => setEditForm((p) => ({ ...p, answer: e.target.value }))} className={textareaCls} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(null)} className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors"><X className="w-3.5 h-3.5" /> Cancel</button>
                      <button onClick={() => saveEdit(f.id)} className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-4 rounded-lg bg-[#F9A37E] hover:bg-[#e8855a] text-white transition-all shadow-sm"><Check className="w-3.5 h-3.5" /> Save</button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors items-start cursor-pointer" onClick={() => setExpandedId(expandedId === f.id ? null : f.id)}>
                      <div className="col-span-1 text-[10px] font-black text-zinc-300 pt-0.5">{idx + 1}</div>
                      <div className="col-span-2 pt-0.5">
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${catColors[f.category] || "bg-zinc-100 text-zinc-500"}`}>{f.category}</span>
                      </div>
                      <div className="col-span-5 pt-0.5">
                        <p className="font-extrabold text-xs text-zinc-900 leading-snug">{f.question}</p>
                      </div>
                      <div className="col-span-2 pt-0.5">
                        <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">{f.answer}</p>
                      </div>
                      <div className="col-span-1 text-center pt-0.5">
                        <span className="text-[9px] font-bold text-zinc-400">{f.lastUpdated}</span>
                      </div>
                      <div className="col-span-1 flex gap-1 justify-end pt-0.5" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => startEdit(f)} className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"><Edit2 className="w-3 h-3" /></button>
                        <button onClick={() => deleteItem(f.id)} className="p-1.5 border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-zinc-400 rounded-lg transition-all"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    </div>
                    {/* Expanded Answer */}
                    {expandedId === f.id && (
                      <div className="px-5 pb-4 ml-14 border-l-2 border-[#F9A37E]/20 ml-[72px]">
                        <p className="text-xs text-zinc-600 leading-relaxed">{f.answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New FAQ Row */}
          {addingNew && (
            <div className="px-5 py-4 space-y-3 border-t border-zinc-100 bg-emerald-50/30 border-l-4 border-l-emerald-400">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">New FAQ Entry</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Category</label>
                  <select value={newForm.category} onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value }))} className={inputCls}>
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Question *</label>
                  <input value={newForm.question} onChange={(e) => setNewForm((p) => ({ ...p, question: e.target.value }))} className={inputCls} placeholder="e.g. What is the minimum order quantity?" autoFocus />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1.5">Answer</label>
                <textarea rows={4} value={newForm.answer} onChange={(e) => setNewForm((p) => ({ ...p, answer: e.target.value }))} className={textareaCls} placeholder="Write a clear, helpful answer..." />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setAddingNew(false); setNewForm({ category: "Orders", question: "", answer: "" }); }} className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50"><X className="w-3.5 h-3.5" /> Cancel</button>
                <button onClick={addFaq} className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"><Plus className="w-3.5 h-3.5" /> Add FAQ</button>
              </div>
            </div>
          )}

          {filtered.length === 0 && !addingNew && (
            <div className="py-14 text-center text-zinc-400 text-xs font-bold">No FAQs match your search or filter.</div>
          )}
        </div>
      </main>
    </div>
  );
}
