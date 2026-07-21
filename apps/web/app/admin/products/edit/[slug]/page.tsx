"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, X, ImagePlus, Save, Package, Loader2, Link2 } from "lucide-react";
import { AdminTopbar } from "../../../AdminSidebar";
import { useApp } from "../../../../../components/AppContext";
import { getApiUrl } from "../../../../../components/ApiConfig";

const PRODUCT_DB: Record<string, { name: string; price: string; originalPrice: string; category: string; description: string; inStock: boolean; tag: string; images: string[]; selectedSizes: string[]; selectedColors: string[] }> = {
  p1: { name: "Premium Soft Cotton Tee", price: "2549", originalPrice: "3399", category: "T-Shirts", description: "Tailored with a modern fit and crafted from ultra-soft combed cotton.", inStock: true, tag: "Best Seller", images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80"], selectedSizes: ["S", "M", "L", "XL"], selectedColors: ["White", "Black"] },
  p2: { name: "Heavyweight Fleece Hoodie", price: "4249", originalPrice: "5099", category: "Hoodies", description: "Stay warm in style with this premium fleece hoodie.", inStock: true, tag: "New", images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&auto=format&fit=crop&q=80"], selectedSizes: ["M", "L", "XL", "XXL"], selectedColors: ["Black", "Forest Green"] },
};

const CATEGORIES = ["T-Shirts", "Hoodies", "Jackets", "Mugs", "Accessories", "Bags", "Phone Cases"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COLORS = [
  { name: "White", hex: "#ffffff" }, { name: "Black", hex: "#0f172a" },
  { name: "Heather Grey", hex: "#94a3b8" }, { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Forest Green", hex: "#14532d" }, { name: "Crimson Red", hex: "#991b1b" },
];

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function EditProductPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const params = useParams();
  const slug = (params?.slug as string) || (params?.id as string);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productId, setProductId] = useState<string>("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    price: "",
    originalPrice: "",
    category: "T-Shirts",
    description: "",
    inStock: true,
    selectedSizes: [] as string[],
    selectedColors: [] as string[],
    tag: "",
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(getApiUrl(`/products/slug/${slug}`))
      .then(res => {
        if (res.ok) return res.json();
        return fetch(getApiUrl(`/products/${slug}`)).then(r => r.ok ? r.json() : null);
      })
      .then(product => {
        if (!product) throw new Error("Failed to load product details");
        setProductId(product.id);
        setForm({
          name: product.name,
          slug: product.slug || slugify(product.name),
          price: String(product.price),
          originalPrice: String(product.originalPrice),
          category: product.category,
          description: product.description || "",
          inStock: product.inStock,
          selectedSizes: product.sizes || [],
          selectedColors: (product.colors || []).map((c: any) => c.name),
          tag: product.tag || "",
        });
        setExistingImages(product.images || [product.image].filter(Boolean));
        setLoading(false);
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to load product details.", "error");
        setLoading(false);
      });
  }, [slug]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewImages((prev) => [...prev, { file, preview: ev.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleSize = (s: string) => setForm((prev) => ({ ...prev, selectedSizes: prev.selectedSizes.includes(s) ? prev.selectedSizes.filter((x) => x !== s) : [...prev.selectedSizes, s] }));
  const toggleColor = (name: string) => setForm((prev) => ({ ...prev, selectedColors: prev.selectedColors.includes(name) ? prev.selectedColors.filter((x) => x !== name) : [...prev.selectedColors, name] }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const colors = form.selectedColors
      .map((name) => COLORS.find((c) => c.name === name))
      .filter((c): c is { name: string; hex: string } => !!c);

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || parseFloat(form.price) || 0,
      category: form.category,
      description: form.description,
      inStock: form.inStock,
      tag: form.tag,
      sizes: form.selectedSizes,
      colors,
      image: newImages[0]?.preview || existingImages[0] || "",
      images: [...existingImages, ...newImages.map((img) => img.preview)]
    };

    const targetId = productId || slug;
    fetch(getApiUrl(`/products/${targetId}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to update product");
      })
      .then(() => {
        showToast("Product Updated", `${form.name} has been updated.`, "success");
        router.push("/admin/products");
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to update product.", "error");
        setSubmitting(false);
      });
  };

  const inputCls = "w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 text-xs font-medium text-zinc-800 outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 transition-all placeholder:text-zinc-400";
  const labelCls = "block text-xs font-extrabold text-zinc-600 mb-1.5";

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Edit Product" subtitle="Loading..." />
        <main className="flex-1 flex items-center justify-center p-8 bg-[#FDFAF6]">
          <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Edit Product" subtitle={form.name || "Loading..."} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-6">
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-800 flex items-center gap-2">
                  <ImagePlus className="w-4 h-4 text-[#F9A37E]" /> Product Images
                </h3>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest mb-2">Current Images</p>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200">
                          <img src={src} alt="" className="w-full h-full object-cover" />
                          {idx === 0 && <span className="absolute top-1 left-1 text-[8px] font-extrabold bg-[#F9A37E] text-white px-1.5 py-0.5 rounded-md uppercase">Primary</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg p-5 flex flex-col items-center gap-1.5 transition-all hover:bg-[#F9A37E]/5 cursor-pointer group"
                >
                  <Upload className="w-6 h-6 text-zinc-300 group-hover:text-[#F9A37E] transition-colors" />
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#F9A37E] transition-colors">Upload Additional Images</span>
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />

                {newImages.length > 0 && (
                  <div>
                    <p className="text-[9px] font-bold uppercase text-zinc-400 tracking-widest mb-2">New Uploads</p>
                    <div className="grid grid-cols-2 gap-2">
                      {newImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-200 group">
                          <img src={img.preview} alt="" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => setNewImages((p) => p.filter((_, i) => i !== idx))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-800">Publish Settings</h3>
                <label className="flex items-center gap-3 cursor-pointer" onClick={() => setForm((p) => ({ ...p, inStock: !p.inStock }))}>
                  <div className={`relative w-10 rounded-full transition-colors cursor-pointer ${form.inStock ? "bg-[#A8C69F]" : "bg-zinc-200"}`} style={{ height: '22px' }}>
                    <span className={`absolute top-0.5 rounded-full bg-white shadow transition-all ${form.inStock ? "left-5" : "left-0.5"}`} style={{ width: '18px', height: '18px', top: '2px' }} />
                  </div>
                  <span className="text-xs font-bold text-zinc-700">{form.inStock ? "In Stock" : "Out of Stock"}</span>
                </label>
                <div>
                  <label className={labelCls}>Product Tag</label>
                  <div className="relative">
                    <select
                      value={form.tag}
                      onChange={(e) => setForm((p) => ({ ...p, tag: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-3 pl-4 pr-10 text-xs font-semibold text-zinc-800 outline-none focus:border-[#F9A37E] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat cursor-pointer"
                    >
                      <option value="">No Tag</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="New">New Arrival</option>
                      <option value="Sale">On Sale</option>
                      <option value="Eco">Eco Friendly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#F9A37E]" /> Product Details
                </h3>
                <div>
                  <label className={labelCls}>Product Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setForm((p) => ({
                        ...p,
                        name,
                        slug: slugManuallyEdited ? p.slug : slugify(name),
                      }));
                    }}
                    className={inputCls}
                  />
                </div>

                {/* Slug field */}
                <div>
                  <label className={labelCls}>
                    <span className="flex items-center gap-1.5"><Link2 className="w-3 h-3 text-[#F9A37E]" /> URL Slug</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        setSlugManuallyEdited(true);
                        setForm((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-') }));
                      }}
                      placeholder="product-url-slug"
                      className={inputCls + " pr-24"}
                    />
                    <button
                      type="button"
                      onClick={() => { setSlugManuallyEdited(false); setForm((p) => ({ ...p, slug: slugify(p.name) })); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-extrabold text-[#F9A37E] hover:underline"
                    >
                      Auto-generate
                    </button>
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-1 truncate">
                    Preview: <span className="text-zinc-600 font-medium">/products/{form.slug || slugify(form.name) || 'product-slug'}</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Selling Price (₹) <span className="text-red-400">*</span></label>
                    <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Original Price (₹)</label>
                    <input type="number" min="0" step="0.01" value={form.originalPrice} onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Category <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-3 pl-4 pr-10 text-xs font-semibold text-zinc-800 outline-none focus:border-[#F9A37E] transition-all appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat cursor-pointer"
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className={inputCls + " resize-none leading-relaxed"} />
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-zinc-800">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button key={s} type="button" onClick={() => toggleSize(s)} className={`w-11 h-10 text-xs font-extrabold rounded-lg border-2 transition-all ${form.selectedSizes.includes(s) ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-zinc-800">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button key={c.name} type="button" onClick={() => toggleColor(c.name)} title={c.name} className="flex flex-col items-center gap-1">
                      <span className={`w-8 h-8 rounded-lg border-2 transition-all ${form.selectedColors.includes(c.name) ? "border-[#F9A37E] scale-110 shadow-md" : "border-zinc-200 hover:border-zinc-400"}`} style={{ backgroundColor: c.hex }} />
                      <span className="text-[8px] font-bold text-zinc-400 w-9 text-center truncate leading-tight">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href="/admin/products" className="flex-1 text-center py-3.5 px-6 border-2 border-zinc-200 text-zinc-600 font-extrabold text-xs rounded-lg hover:bg-zinc-50 transition-colors">Cancel</Link>
                <button type="submit" disabled={submitting} className="flex-1 flex items-center justify-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20">
                  <Save className="w-4 h-4" /> {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
