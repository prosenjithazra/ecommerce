"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Save, X, Check, Film, Link2, Upload } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface GalleryItem {
  id: string;
  mediaUrl: string;
  link?: string;
  mediaType: string;
  isActive: boolean;
}

function GalleryForm({ initial, onSave, onCancel }: {
  initial?: Partial<GalleryItem>;
  onSave: (data: Omit<GalleryItem, "id">) => void;
  onCancel: () => void;
}) {
  const [mediaUrl, setMediaUrl] = useState(initial?.mediaUrl || "");
  const [link, setLink] = useState(initial?.link || "");
  const [mediaType, setMediaType] = useState(initial?.mediaType || "image");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setMediaUrl(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400";
  const labelCls = "block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5";

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="font-extrabold text-sm text-zinc-900">{initial?.id ? "Edit Gallery Item" : "Add Gallery Item"}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><X className="w-4 h-4" /></button>
      </div>

      <div className="space-y-4">
        <div>
          <label className={labelCls}>Media Image/Thumbnail *</label>
          {mediaUrl ? (
            <div className="relative aspect-square w-full max-w-xs mx-auto rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 group">
              <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
              {mediaType === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                  <Film className="w-6 h-6 text-white" />
                </div>
              )}
              <button type="button" onClick={() => setMediaUrl("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-32 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg flex flex-col items-center justify-center gap-1.5 text-zinc-400 hover:text-[#F9A37E] transition-all bg-zinc-50">
              <Upload className="w-5 h-5" />
              <span className="text-[10px] font-bold">Select & Upload Image</span>
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>

        <div>
          <label className={labelCls}>Redirect Link (Instagram/YouTube URL)</label>
          <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://www.instagram.com/p/... or https://youtube.com/watch?v=..." className={inputCls} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Media Type</label>
            <select value={mediaType} onChange={(e) => setMediaType(e.target.value)} className={inputCls}>
              <option value="image">Image Post</option>
              <option value="video">Video Reel / YouTube</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Status</label>
            <select value={isActive ? "true" : "false"} onChange={(e) => setIsActive(e.target.value === "true")} className={inputCls}>
              <option value="true">Active (Show)</option>
              <option value="false">Inactive (Hide)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-zinc-100 justify-end">
        <button type="button" onClick={onCancel} className="py-2.5 px-6 border border-zinc-200 text-zinc-500 font-extrabold text-xs rounded-lg hover:bg-zinc-50 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            if (!mediaUrl.trim()) return;
            onSave({
              mediaUrl: mediaUrl.trim(),
              link: link.trim() || undefined,
              mediaType,
              isActive,
            });
          }}
          className="flex items-center gap-1.5 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
        >
          <Save className="w-4 h-4" /> Save Item
        </button>
      </div>
    </div>
  );
}

export default function AdminGalleryPage() {
  const { showToast } = useApp();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"table" | "add" | "edit">("table");
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);

  const fetchItems = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/gallery/admin"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired.");
      }
      if (res.ok) return res.json();
      throw new Error("Unable to retrieve gallery items.");
    })
    .then((data) => {
      setItems(data);
      setLoading(false);
    })
    .catch((err) => {
      showToast("Error", err.message || "Failed to load gallery items.", "error");
      setItems([]);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = (data: Omit<GalleryItem, "id">) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/gallery"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Item Added", "Social item linked successfully.", "success");
        fetchItems();
        setMode("table");
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to link item");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const handleEdit = (data: Omit<GalleryItem, "id">) => {
    if (!editTarget) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/gallery/${editTarget.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Item Updated", "Modifications saved successfully.", "success");
        fetchItems();
        setMode("table");
        setEditTarget(null);
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to update item");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to remove this gallery item?")) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/gallery/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Deleted Successfully", "Gallery item removed.", "info");
        fetchItems();
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to delete item");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const toggleStatus = (id: string, active: boolean) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/gallery/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isActive: !active })
    })
    .then((res) => {
      if (res.ok) {
        showToast("Status Updated", `Item is now ${!active ? 'Active' : 'Inactive'}`, "success");
        fetchItems();
      }
    });
  };

  if (mode === "add" || mode === "edit") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Social Gallery" subtitle={mode === "add" ? "Link new Instagram / YouTube media" : `Edit gallery item details`} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          <button onClick={() => { setMode("table"); setEditTarget(null); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-505 hover:text-[#F9A37E] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </button>
          <GalleryForm
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
      <AdminTopbar title="Social Gallery" subtitle="Manage dynamic Instagram & YouTube reels or posts for #WearYourCreativity" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
        <div className="flex justify-end">
          <button
            onClick={() => { setEditTarget(null); setMode("add"); }}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
          >
            <Plus className="w-4 h-4" /> Add Gallery Item
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["#", "Preview", "Type", "Redirect Link", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-3.5 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="relative w-12 h-12 rounded overflow-hidden border border-zinc-100 bg-zinc-50">
                        <img
                          src={item.mediaUrl}
                          alt="gallery item"
                          className="w-full h-full object-cover"
                        />
                        {item.mediaType === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Film className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold capitalize text-zinc-900 block">
                        {item.mediaType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      {item.link ? (
                        <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-zinc-600 font-medium hover:text-[#F9A37E] flex items-center gap-1 transition-colors">
                          <Link2 className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="truncate">{item.link}</span>
                        </a>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(item.id, item.isActive)}
                        className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide transition-all ${
                          item.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100"
                        }`}
                        title={`Click to ${item.isActive ? "deactivate" : "activate"}`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 pr-5">
                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditTarget(item); setMode("edit"); }}
                          className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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
          {items.length === 0 && !loading && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No gallery items found.</p>
          )}
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-[10px] font-bold text-zinc-400">
              Showing <strong className="text-zinc-600">{items.length}</strong> linked social items
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
