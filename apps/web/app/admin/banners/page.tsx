"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, ArrowLeft, Save, Upload, X, Monitor, Smartphone, ExternalLink } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface Banner {
  id: string;
  title?: string;
  desktopImage?: string;
  mobileImage?: string;
  link?: string;
  badge?: string;
  headline1?: string;
  headline2?: string;
  headline2Color?: string;
  sub?: string;
  productImg?: string;
  bgImg?: string;
  headline1Color?: string;
  subColor?: string;
  badgeColor?: string;
  overlayColor?: string;
  bg?: string;
  accent?: string;
  textDark?: boolean;
  isActive: boolean;
}

function BannerForm({ initial, onSave, onCancel }: {
  initial?: Partial<Banner>;
  onSave: (data: Omit<Banner, "id">) => void;
  onCancel: () => void;
}) {
  const desktopFileRef = useRef<HTMLInputElement>(null);
  const mobileFileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initial?.title || "");
  const [link, setLink] = useState(initial?.link || "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  
  const [desktopPreview, setDesktopPreview] = useState(initial?.desktopImage || initial?.bgImg || "");
  const [mobilePreview, setMobilePreview] = useState(initial?.mobileImage || initial?.productImg || "");

  const handleDesktopFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setDesktopPreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const handleMobileFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setMobilePreview(ev.target?.result as string);
    r.readAsDataURL(f);
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400 font-medium";
  const labelCls = "block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5";

  return (
    <div className="bg-white border border-zinc-200 rounded-lg p-6 shadow-sm space-y-6 max-w-full">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
        <h3 className="font-extrabold text-sm text-zinc-900">{initial?.id ? "Edit Homepage Banner" : "Create Homepage Banner"}</h3>
        <button onClick={onCancel} className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400"><X className="w-4 h-4" /></button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Banner details */}
        <div className="lg:col-span-6 space-y-4">
          <div>
            <label className={labelCls}>Banner Title / Name</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Summer Collection Special Banner"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Target Link URL (OnClick Destination)</label>
            <div className="relative">
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="e.g. /products or /categories/t-shirts"
                className={inputCls + " pl-8"}
              />
              <ExternalLink className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">Users will be directed to this page when clicking the banner.</p>
          </div>

          <div>
            <label className={labelCls}>Status</label>
            <select
              value={isActive ? "true" : "false"}
              onChange={(e) => setIsActive(e.target.value === "true")}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] transition-all cursor-pointer font-extrabold"
            >
              <option value="true">Active (Published on Homepage)</option>
              <option value="false">Inactive (Draft / Hidden)</option>
            </select>
          </div>
        </div>

        {/* Right column: Desktop & Mobile Banner Uploads */}
        <div className="lg:col-span-6 space-y-5">
          {/* Desktop Image Box */}
          <div className="space-y-1.5">
            <label className={labelCls + " flex items-center gap-1.5 text-blue-600"}>
              <Monitor className="w-3.5 h-3.5" /> Desktop Banner Image (Recommended: 1920 x 600 or 16:9)
            </label>
            {desktopPreview ? (
              <div className="relative aspect-[16/6] rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 group shadow-sm">
                <img src={desktopPreview} alt="Desktop Banner" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setDesktopPreview("")}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => desktopFileRef.current?.click()}
                className="w-full h-28 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#F9A37E] transition-all bg-zinc-50"
              >
                <Upload className="w-5 h-5 text-[#F9A37E]" />
                <span className="text-xs font-bold text-zinc-600">Upload Desktop Banner Image</span>
                <span className="text-[10px] text-zinc-400">Click to browse PNG, JPG or WEBP</span>
              </button>
            )}
            <input ref={desktopFileRef} type="file" accept="image/*" className="hidden" onChange={handleDesktopFile} />
          </div>

          {/* Mobile Image Box */}
          <div className="space-y-1.5">
            <label className={labelCls + " flex items-center gap-1.5 text-emerald-600"}>
              <Smartphone className="w-3.5 h-3.5" /> Mobile Banner Image (Recommended: 750 x 900 or 4:5)
            </label>
            {mobilePreview ? (
              <div className="relative aspect-[4/3] max-w-xs rounded-xl overflow-hidden border border-zinc-200 bg-zinc-900 group shadow-sm">
                <img src={mobilePreview} alt="Mobile Banner" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setMobilePreview("")}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => mobileFileRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-xl flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-[#F9A37E] transition-all bg-zinc-50"
              >
                <Upload className="w-5 h-5 text-[#F9A37E]" />
                <span className="text-xs font-bold text-zinc-600">Upload Mobile Banner Image</span>
                <span className="text-[10px] text-zinc-400">Click to browse PNG, JPG or WEBP</span>
              </button>
            )}
            <input ref={mobileFileRef} type="file" accept="image/*" className="hidden" onChange={handleMobileFile} />
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
            if (!desktopPreview && !mobilePreview) {
              alert("Please upload at least a Desktop or Mobile banner image.");
              return;
            }
            onSave({
              title: title.trim() || "Storefront Banner",
              link: link.trim() || "/products",
              desktopImage: desktopPreview,
              mobileImage: mobilePreview || desktopPreview,
              bgImg: desktopPreview,
              productImg: mobilePreview || desktopPreview,
              isActive,
            });
          }}
          className="flex items-center gap-1.5 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
        >
          <Save className="w-4 h-4" /> Save Banner
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
        showToast("Banner Saved", "Banner created successfully.", "success");
        fetchBanners();
        setMode("table");
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to create banner");
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
        showToast("Banner Updated", "Banner modifications saved successfully.", "success");
        fetchBanners();
        setMode("table");
        setEditTarget(null);
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to update banner");
      }
    })
    .catch((err) => {
      showToast("Error", err.message, "error");
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    const token = localStorage.getItem("token");
    fetch(getApiUrl(`/banner/${id}`), {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(async (res) => {
      if (res.ok) {
        showToast("Deleted Successfully", "Banner removed.", "info");
        fetchBanners();
      } else {
        const body = await res.json();
        throw new Error(body.message || "Failed to delete banner");
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
        <AdminTopbar title="Home Banners" subtitle={mode === "add" ? "Upload desktop & mobile banner images" : `Edit banner details`} />
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
      <AdminTopbar title="Home Banners" subtitle="Manage desktop & mobile storefront homepage banners" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
        <div className="flex justify-end">
          <button
            onClick={() => { setEditTarget(null); setMode("add"); }}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
          >
            <Plus className="w-4 h-4" /> Add Banner
          </button>
        </div>

        {/* Banners Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["#", "Title", "Desktop Image", "Mobile Image", "Target Link", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap first:pl-5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {banners.map((b, idx) => {
                  const deskImg = b.desktopImage || b.bgImg || "";
                  const mobImg = b.mobileImage || b.productImg || deskImg;

                  return (
                    <tr key={b.id} className="hover:bg-zinc-50 transition-colors group">
                      <td className="py-3.5 pl-5 px-4 text-zinc-400 font-bold text-[11px]">{idx + 1}</td>
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-zinc-900 leading-snug block">
                          {b.title || b.headline1 || "Storefront Banner"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {deskImg ? (
                          <div className="w-24 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                            <img src={deskImg} alt="Desktop" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-[10px]">No desktop img</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {mobImg ? (
                          <div className="w-12 h-14 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                            <img src={mobImg} alt="Mobile" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <span className="text-zinc-400 italic text-[10px]">No mobile img</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                          {b.link || "/products"}
                        </span>
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
                  );
                })}
              </tbody>
            </table>
          </div>
          {banners.length === 0 && !loading && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No banners uploaded yet.</p>
          )}
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-[10px] font-bold text-zinc-400">
              Total <strong className="text-zinc-600">{banners.length}</strong> banners
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
