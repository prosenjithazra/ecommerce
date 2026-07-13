"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, ImagePlus, Upload, X, ArrowLeft, Save } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

const INITIAL_CATEGORIES = [
  { id: "c1", name: "T-Shirts", count: 18, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80" },
  { id: "c2", name: "Hoodies", count: 12, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80" },
  { id: "c3", name: "Accessories", count: 8, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80" },
];

type Category = { id: string; name: string; count: number; image: string };

function CategoryForm({ initial, onSave, onCancel }: {
  initial?: Partial<Category>;
  onSave: (data: { name: string; count: number; image: string; imageFile?: File }) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(initial?.name || "");
  const [count, setCount] = useState(String(initial?.count || ""));
  const [preview, setPreview] = useState(initial?.image || "");
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    const r = new FileReader();
    r.onload = (ev) => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const inputCls = "w-full bg-[#FDFAF6] border border-zinc-200 rounded-xl py-3 px-4 text-xs font-medium text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400";

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm space-y-5 max-w-xl">
      <h3 className="font-extrabold text-sm text-zinc-800">{initial?.name ? "Edit Category" : "New Category"}</h3>

      {/* Image Upload */}
      <div>
        <label className="block text-xs font-extrabold text-zinc-500 mb-2">Category Image</label>
        <div className="flex gap-4 items-start">
          {preview ? (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-[#F9A37E] flex-shrink-0">
              <img src={preview} alt="" className="w-full h-full object-cover" />
              <button type="button" onClick={() => { setPreview(""); setImageFile(undefined); }} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-24 h-24 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#F9A37E] transition-all flex-shrink-0">
              <Upload className="w-5 h-5" />
              <span className="text-[9px] font-bold">Upload</span>
            </button>
          )}
          <div className="flex-1 space-y-3">
            <div>
              <label className="block text-xs font-extrabold text-zinc-500 mb-1.5">Category Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Activewear" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-extrabold text-zinc-500 mb-1.5">Product Count</label>
              <input type="number" value={count} onChange={(e) => setCount(e.target.value)} placeholder="0" className={inputCls} />
            </div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div className="flex gap-3">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border-2 border-zinc-200 text-zinc-500 font-extrabold text-xs rounded-xl hover:bg-zinc-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => { if (!name.trim()) return; onSave({ name: name.trim(), count: parseInt(count) || 0, image: preview, imageFile }); }}
          className="flex-1 flex items-center justify-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-[#F9A37E]/20"
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
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [editTarget, setEditTarget] = useState<Category | null>(null);

  const handleAdd = (data: { name: string; count: number; image: string }) => {
    const id = "c" + (categories.length + 1);
    setCategories([...categories, { id, ...data }]);
    showToast("Category Added", `${data.name} was created.`, "success");
    setMode("list");
  };

  const handleEdit = (data: { name: string; count: number; image: string }) => {
    if (!editTarget) return;
    setCategories(categories.map((c) => c.id === editTarget.id ? { ...c, ...data } : c));
    showToast("Category Updated", "Category changes saved.", "success");
    setMode("list");
    setEditTarget(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this category?")) {
      setCategories(categories.filter((c) => c.id !== id));
      showToast("Deleted", "Category removed.", "info");
    }
  };

  if (mode === "add") return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Categories" subtitle="Add new category" />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
        <button onClick={() => setMode("list")} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
        </button>
        <CategoryForm onSave={handleAdd} onCancel={() => setMode("list")} />
      </main>
    </div>
  );

  if (mode === "edit" && editTarget) return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Categories" subtitle={`Editing: ${editTarget.name}`} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
        <button onClick={() => { setMode("list"); setEditTarget(null); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Categories
        </button>
        <CategoryForm initial={editTarget} onSave={handleEdit} onCancel={() => { setMode("list"); setEditTarget(null); }} />
      </main>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Categories" subtitle={`${categories.length} product categories`} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        <div className="flex justify-end">
          <button
            onClick={() => setMode("add")}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-[#F9A37E]/20"
          >
            <Plus className="w-4 h-4" /> Add Category
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {categories.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="aspect-[3/2] overflow-hidden bg-zinc-100 relative">
                <img src={c.image || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80"} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
                <div className="absolute bottom-3 left-4">
                  <h3 className="font-extrabold text-white text-sm">{c.name}</h3>
                  <p className="text-xs text-white/70 font-medium">{c.count} products</p>
                </div>
              </div>
              <div className="px-4 py-3 flex justify-end gap-2">
                <button onClick={() => { setEditTarget(c); setMode("edit"); }} className="p-2 border border-zinc-200 hover:bg-[#F9A37E]/10 hover:border-[#F9A37E]/30 hover:text-[#F9A37E] text-zinc-500 rounded-xl transition-all">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(c.id)} className="p-2 border border-zinc-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-zinc-500 rounded-xl transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
