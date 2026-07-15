"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Save, Upload, X } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface Banner {
  id: string;
  badge: string;
  headline1: string;
  headline2: string;
  headline2Color: string;
  sub: string;
  productImg: string;
  bgImg?: string;
  headline1Color?: string;
  subColor?: string;
  badgeColor?: string;
  overlayColor?: string;
  bg: string;
  accent: string;
  textDark: boolean;
  isActive: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const INITIAL_MOCK_BANNERS: Banner[] = [
  {
    id: "b1",
    badge: "NEW COLLECTION",
    headline1: "PRINTED",
    headline2: "T-SHIRTS",
    headline2Color: "#F9A37E",
    sub: "Express Your Style with Unique Prints & Premium Quality",
    productImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
    bg: "#E8E2D6",
    accent: "#F9A37E",
    textDark: true,
    isActive: true,
  },
  {
    id: "b2",
    badge: "BOLD DESIGNS",
    headline1: "BOLD DESIGNS.",
    headline2: "REAL YOU.",
    headline2Color: "#F9A37E",
    sub: "PRINTED T-SHIRTS",
    productImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop&q=80",
    bg: "#4A453E",
    accent: "#F9A37E",
    textDark: false,
    isActive: true,
  },
  {
    id: "b3",
    badge: "CUSTOM STUDIO",
    headline1: "DESIGN IT.",
    headline2: "OWN IT.",
    headline2Color: "#A8C69F",
    sub: "Create unique hoodies, totes & accessories with our drag-and-drop studio.",
    productImg: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=700&auto=format&fit=crop&q=80",
    bg: "#FDFAF6",
    accent: "#A8C69F",
    textDark: true,
    isActive: true,
  }
];

function BannerForm({ initial, onSave, onCancel }: {
  initial?: Partial<Banner>;
  onSave: (data: Omit<Banner, "id">) => void;
  onCancel: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const bgFileRef = useRef<HTMLInputElement>(null);

  const [badge, setBadge] = useState(initial?.badge || "");
  const [headline1, setHeadline1] = useState(initial?.headline1 || "");
  const [headline2, setHeadline2] = useState(initial?.headline2 || "");
  
  const [headline1Color, setHeadline1Color] = useState(initial?.headline1Color || "#2E2B26");
  const [headline2Color, setHeadline2Color] = useState(initial?.headline2Color || "#F9A37E");
  const [subColor, setSubColor] = useState(initial?.subColor || "#4A453E");
  const [badgeColor, setBadgeColor] = useState(initial?.badgeColor || "#F9A37E");
  const [overlayColor, setOverlayColor] = useState(initial?.overlayColor || "#000000");

  const [sub, setSub] = useState(initial?.sub || "");
  const [bg, setBg] = useState(initial?.bg || "#E8E2D6");
  const [accent, setAccent] = useState(initial?.accent || "#F9A37E");
  const [textDark, setTextDark] = useState(initial?.textDark ?? true);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  
  const [preview, setPreview] = useState(initial?.productImg || "");
  const [bgPreview, setBgPreview] = useState(initial?.bgImg || "");

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleBgFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setBgPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400";
  const labelCls = "block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5";

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-6 max-w-full">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="font-extrabold text-sm text-zinc-900">{initial?.id ? "Edit Banner Slide" : "Create New Banner Slide"}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><X className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: texts & options */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Chip Badge Text</label>
              <input value={badge} onChange={(e) => setBadge(e.target.value)} placeholder="e.g. NEW COLLECTION" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Badge Theme Color</label>
              <input type="color" value={badgeColor} onChange={(e) => setBadgeColor(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
            <div>
              <label className={labelCls}>Headline 1 Color</label>
              <input type="color" value={headline1Color} onChange={(e) => setHeadline1Color(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
            <div>
              <label className={labelCls}>Headline 2 Color</label>
              <input type="color" value={headline2Color} onChange={(e) => setHeadline2Color(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Headline Part 1 *</label>
              <input required value={headline1} onChange={(e) => setHeadline1(e.target.value)} placeholder="e.g. PRINTED" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Headline Part 2 *</label>
              <input required value={headline2} onChange={(e) => setHeadline2(e.target.value)} placeholder="e.g. T-SHIRTS" className={inputCls} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-9">
              <label className={labelCls}>Subtitle Description</label>
              <textarea rows={3} value={sub} onChange={(e) => setSub(e.target.value)} placeholder="Explain the collection or promotion detail..." className={inputCls + " resize-none"} />
            </div>
            <div className="sm:col-span-3">
              <label className={labelCls}>Subtitle Text Color</label>
              <input type="color" value={subColor} onChange={(e) => setSubColor(e.target.value)} className="w-full h-[88px] border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className={labelCls}>Background Color</label>
              <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
            <div>
              <label className={labelCls}>Overlay Color</label>
              <div className="flex flex-col gap-1">
                <input type="color" value={overlayColor} onChange={(e) => setOverlayColor(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
                <span className="text-[9px] text-zinc-400 font-bold tracking-wide">Over bg image</span>
              </div>
            </div>
            <div>
              <label className={labelCls}>Accent / Button Color</label>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="w-full h-10 border border-zinc-200 rounded-lg cursor-pointer bg-white px-2 py-1" />
            </div>
            <div>
              <label className={labelCls}>Text Brightness</label>
              <div className="relative">
                <select
                  value={textDark ? "true" : "false"}
                  onChange={(e) => setTextDark(e.target.value === "true")}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 pl-3.5 pr-10 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.1rem_1.1rem] bg-[right_0.5rem_center] bg-no-repeat cursor-pointer font-bold"
                >
                  <option value="true">Dark Text</option>
                  <option value="false">Light Text</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelCls}>Visibility</label>
              <div className="relative">
                <select
                  value={isActive ? "true" : "false"}
                  onChange={(e) => setIsActive(e.target.value === "true")}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 pl-3.5 pr-10 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.1rem_1.1rem] bg-[right_0.5rem_center] bg-no-repeat cursor-pointer font-bold"
                >
                  <option value="true">Active (Show)</option>
                  <option value="false">Inactive (Hide)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: image uploads and previews */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <label className={labelCls}>Shirt Image (Product Image)</label>
            {preview ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 group">
                <img src={preview} alt="slide" className="w-full h-full object-contain p-2" />
                <button type="button" onClick={() => setPreview("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileRef.current?.click()} className="w-full h-24 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#F9A37E] transition-all bg-zinc-50">
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-bold">Upload Shirt Product Image</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>

          <div>
            <label className={labelCls}>Slide Background Image</label>
            {bgPreview ? (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-50 group">
                <img src={bgPreview} alt="bg" className="w-full h-full object-cover" />
                <button type="button" onClick={() => setBgPreview("")} className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => bgFileRef.current?.click()} className="w-full h-24 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#F9A37E] transition-all bg-zinc-50">
                <Upload className="w-4 h-4" />
                <span className="text-[10px] font-bold">Upload Background Image</span>
              </button>
            )}
            <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgFile} />
          </div>

          {/* Visual Slide Preview mini card */}
          <div className="p-3 border border-zinc-200 rounded-lg bg-zinc-50 space-y-2">
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest block">Live Color & Style Preview:</span>
            <div className="h-16 rounded-md flex items-center justify-between px-3 relative overflow-hidden" style={{ background: bgPreview ? `url(${bgPreview}) center/cover no-repeat` : bg }}>
              <div className="relative z-10 leading-tight">
                <span className="text-[8px] font-black tracking-wider uppercase block px-1.5 py-0.5 rounded" style={{ backgroundColor: badgeColor, color: '#fff', display: badge ? 'inline-block' : 'none' }}>{badge}</span>
                <p className="text-xs font-black mt-0.5" style={{ color: headline1Color }}>
                  {headline1} <span style={{ color: headline2Color }}>{headline2}</span>
                </p>
              </div>
              {preview && <img src={preview} alt="thumb" className="w-10 h-10 object-cover rounded-md relative z-10 border border-white/20 shadow-sm" />}
              <div className="absolute top-0 right-0 w-12 h-12 rounded-bl-full opacity-30" style={{ backgroundColor: accent }} />
            </div>
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
            if (!headline1.trim() || !headline2.trim()) return;
            onSave({
              badge: badge.trim(),
              headline1: headline1.trim(),
              headline2: headline2.trim(),
              headline2Color,
              sub: sub.trim(),
              productImg: preview || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
              bgImg: bgPreview,
              headline1Color,
              subColor,
              badgeColor,
              overlayColor,
              bg,
              accent,
              textDark,
              isActive,
            });
          }}
          className="flex items-center gap-1.5 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
        >
          <Save className="w-4 h-4" /> Save Slide
        </button>
      </div>
    </div>
  );
}

export default function AdminBannersPage() {
  const { showToast } = useApp();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"table" | "add" | "edit">("table");
  const [editTarget, setEditTarget] = useState<Banner | null>(null);

  const fetchBanners = () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/banner/admin"), {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }
      if (res.ok) return res.json();
      throw new Error("Unable to retrieve banners list");
    })
    .then((data) => {
      setBanners(data);
      setLoading(false);
    })
    .catch((err) => {
      showToast("Error", err.message || "Failed to load banners.", "error");
      setBanners([]);
      setLoading(false);
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchBanners();
  }, []);

  const handleAdd = (data: Omit<Banner, "id">) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/banner"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Banner Created", "Slide added successfully.", "success");
        fetchBanners();
        setMode("table");
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to create slide");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const handleEdit = (data: Omit<Banner, "id">) => {
    if (!editTarget) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/banner/${editTarget.id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Banner Updated", "Slide modifications saved successfully.", "success");
        fetchBanners();
        setMode("table");
        setEditTarget(null);
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to update slide");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this banner slide?")) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/banner/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Deleted Successfully", "Banner slide removed.", "info");
        fetchBanners();
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to delete slide");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const toggleStatus = (id: string, active: boolean) => {
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/banner/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ isActive: !active })
    })
    .then((res) => {
      if (res.ok) {
        showToast("Status Updated", `Banner is now ${!active ? 'Active' : 'Inactive'}`, "success");
        fetchBanners();
      }
    });
  };

  if (mode === "add" || mode === "edit") {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Home Banners" subtitle={mode === "add" ? "Create new slides" : `Edit slide details`} />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-4">
          <button onClick={() => { setMode("table"); setEditTarget(null); }} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </button>
          <BannerForm
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
      <AdminTopbar title="Home Banners" subtitle="Manage dynamic promotional slides for storefront homepage" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
        <div className="flex justify-end">
          <button
            onClick={() => { setEditTarget(null); setMode("add"); }}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
          >
            <Plus className="w-4 h-4" /> Add Banner Slide
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["#", "Image", "Chip Badge", "Headline / Titles", "Subtitle Description", "Colors Preview", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {banners.map((b, idx) => (
                  <tr key={b.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-3.5 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <img
                        src={b.productImg}
                        alt="banner"
                        className="w-12 h-9 rounded object-cover border border-zinc-100 bg-zinc-50"
                      />
                    </td>
                    <td className="py-3.5 px-4">
                      {b.badge ? (
                        <span className="text-[9px] font-black px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase tracking-wider">{b.badge}</span>
                      ) : (
                        <span className="text-zinc-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-zinc-900 leading-snug block">
                        {b.headline1} <span style={{ color: b.headline2Color }}>{b.headline2}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="text-zinc-500 truncate leading-relaxed text-[11px]">{b.sub || <em className="text-zinc-300">No description</em>}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-4 h-4 rounded border border-zinc-300 shadow-sm block" style={{ backgroundColor: b.bg }} title={`Background: ${b.bg}`} />
                        <span className="w-4 h-4 rounded border border-zinc-300 shadow-sm block" style={{ backgroundColor: b.accent }} title={`Accent Decoration: ${b.accent}`} />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase">{b.textDark ? "Dark Txt" : "Light Txt"}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => toggleStatus(b.id, b.isActive)}
                        className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide transition-all ${
                          b.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-100"
                        }`}
                        title={`Click to ${b.isActive ? "deactivate" : "activate"}`}
                      >
                        {b.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 pr-5">
                      <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditTarget(b); setMode("edit"); }}
                          className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
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
          {banners.length === 0 && !loading && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No banner slides found.</p>
          )}
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-[10px] font-bold text-zinc-400">
              Showing <strong className="text-zinc-600">{banners.length}</strong> banner slides
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
