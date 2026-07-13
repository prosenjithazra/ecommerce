"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, ArrowLeft, Save, Upload, X, Check, Search } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

const INITIAL_CATEGORIES = [
  { id: "c1", name: "T-Shirts", count: 18, slug: "t-shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80", status: "Active" },
  { id: "c2", name: "Hoodies", count: 12, slug: "hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300&auto=format&fit=crop&q=80", status: "Active" },
  { id: "c3", name: "Accessories", count: 8, slug: "accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&auto=format&fit=crop&q=80", status: "Active" },
  { id: "c4", name: "Jackets", count: 5, slug: "jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=300&auto=format&fit=crop&q=80", status: "Active" },
  { id: "c5", name: "Mugs", count: 3, slug: "mugs", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&auto=format&fit=crop&q=80", status: "Inactive" },
];

type Category = { id: string; name: string; count: number; slug: string; image: string; status: string };

function CategoryForm({ initial, onSave, onCancel }: {
  initial?: Partial<Category>;
  onSave: (data: Omit<Category, "id">) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial?.name || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [count, setCount] = useState(String(initial?.count ?? ""));
  const [status, setStatus] = useState(initial?.status || "Active");
  const [preview, setPreview] = useState(initial?.image || "");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleNameChange = (v: string) => {
    setName(v);
    if (!initial?.slug) setSlug(v.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400";

  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm space-y-5 max-w-2xl">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm text-zinc-900">{initial?.name ? `Edit: ${initial.name}` : "Add New Category"}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"><X className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Image Upload */}
        <div className="space-y-2">
          <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest">Category Image</label>
          {preview ? (
            <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#F9A37E]">
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => setPreview("")} className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full aspect-square border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-[#F9A37E] transition-all">
              <Upload className="w-6 h-6" />
              <span className="text-[9px] font-bold">Upload Image</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        {/* Form fields */}
        <div className="sm:col-span-2 space-y-3">
          <div>
            <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Category Name *</label>
            <input value={name} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. Activewear" className={inputCls} />
          </div>
          <div>
            <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">URL Slug</label>
            <div className="flex items-center border border-zinc-200 rounded-lg bg-zinc-50 overflow-hidden focus-within:border-[#F9A37E] transition-colors">
              <span className="px-3 py-2.5 text-[10px] font-bold text-zinc-400 bg-zinc-100 border-r border-zinc-200">/categories/</span>
              <input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="activewear" className="flex-1 py-2.5 px-3 text-xs text-zinc-800 outline-none bg-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Product Count</label>
              <input type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder="0" className={inputCls} />
            </div>
            <div>
              <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Visibility</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-2 border-t border-zinc-100">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-zinc-200 text-zinc-500 font-extrabold text-xs rounded-lg hover:bg-zinc-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!name.trim()) return;
            onSave({
              name: name.trim(),
              slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
              count: parseInt(count) || 0,
              image: preview || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=300&auto=format&fit=crop&q=80",
              status,
            });
          }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-4 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
        >
          <Save className="w-3.5 h-3.5" /> Save Category
        </button>
      </div>
    </div>
  );
}

export default function AdminCategoriesPage() {
  const { showToast } = useApp();
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<"table" | "add" | "edit">("table");
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const filtered = categories.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: Omit<Category, "id">) => {
    const id = "c" + (categories.length + 1);
    setCategories([...categories, { id, ...data }]);
    showToast("Category Added", `${data.name} was created.`, "success");
    setMode("table");
  };

  const handleEdit = (data: Omit<Category, "id">) => {
    if (!editTarget) return;
    setCategories(categories.map((c) => c.id === editTarget.id ? { ...c, ...data } : c));
    showToast("Category Updated", "Category changes saved.", "success");
    setMode("table");
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (confirm(`Delete category "${cat?.name}"?`)) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast("Deleted", `${cat?.name} removed.`, "info");
    }
  };

  const toggleStatus = (id: string) => {
    setCategories(categories.map((c) => c.id === id ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } : c));
  };

  if (mode === "add" || mode === "edit") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Categories" subtitle={mode === "add" ? "Add new category" : `Edit: ${editTarget?.name}`} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          <button onClick={() => { setMode("table"); setEditTarget(null); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
          </button>
          <CategoryForm
            initial={editTarget ?? undefined}
            onSave={mode === "add" ? handleAdd : handleEdit}
            onCancel={() => { setMode("table"); setEditTarget(null); }}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Categories" subtitle={`${categories.length} product categories`} />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <button
            onClick={() => { setEditTarget(null); setMode("add"); }}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-zinc-900">{categories.length}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Total Categories</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-emerald-600">{categories.filter((c) => c.status === "Active").length}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Active</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-zinc-900">{categories.reduce((a, c) => a + c.count, 0)}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Total Products</p>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["#", "Image", "Category Name", "Slug", "Products", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((c, idx) => (
                  <tr key={c.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-3.5 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-10 h-10 rounded-lg object-cover border border-zinc-100"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-zinc-900">{c.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <code className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">/categories/{c.slug}</code>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-black text-zinc-800">{c.count}</span>
                      <span className="text-zinc-400 ml-1">items</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(c.id)}
                        className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide transition-all ${
                          c.status === "Active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100"
                        }`}
                        title={`Click to ${c.status === "Active" ? "deactivate" : "activate"}`}
                      >
                        {c.status}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 pr-5">
                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditTarget(c); setMode("edit"); }}
                          className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-zinc-400 rounded-lg transition-all"
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
          {filtered.length === 0 && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No categories found.</p>
          )}
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-[10px] font-bold text-zinc-400">
              Showing <strong className="text-zinc-600">{filtered.length}</strong> of <strong className="text-zinc-600">{categories.length}</strong> categories
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
