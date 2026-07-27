"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, ImagePlus, Save, Package, Link2 } from "lucide-react";
import { AdminTopbar } from "../../AdminSidebar";
import { useApp } from "../../../../components/AppContext";
import { getApiUrl } from "../../../../components/ApiConfig";

const CATEGORIES = ["T-Shirts", "Hoodies", "Jackets", "Mugs", "Accessories", "Bags", "Phone Cases"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const COLORS = [
  { name: "White", hex: "#ffffff" },
  { name: "Black", hex: "#0f172a" },
  { name: "Heather Grey", hex: "#94a3b8" },
  { name: "Navy Blue", hex: "#1e3a8a" },
  { name: "Forest Green", hex: "#14532d" },
  { name: "Crimson Red", hex: "#991b1b" },
];

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function AddProductPage() {
  const { showToast } = useApp();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    skuMappingStr: "",
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
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages: { file: File; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages((prev) => [...prev, { file, preview: ev.target?.result as string }]);
      };
      reader.readAsDataURL(file);
    });
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const toggleSize = (s: string) => {
    setForm((prev) => ({
      ...prev,
      selectedSizes: prev.selectedSizes.includes(s)
        ? prev.selectedSizes.filter((x) => x !== s)
        : [...prev.selectedSizes, s],
    }));
  };

  const toggleColor = (name: string) => {
    setForm((prev) => ({
      ...prev,
      selectedColors: prev.selectedColors.includes(name)
        ? prev.selectedColors.filter((x) => x !== name)
        : [...prev.selectedColors, name],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    if (images.length === 0) {
      showToast("No Images", "Please upload at least one product image.", "error");
      return;
    }
    let skuMapping = {};
    if (form.skuMappingStr.trim()) {
      try {
        skuMapping = JSON.parse(form.skuMappingStr);
      } catch (e) {
        showToast("Invalid JSON", "Variant SKU Overrides must be a valid JSON object.", "error");
        setSubmitting(false);
        return;
      }
    }

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
      image: images[0]?.preview || "",
      images: images.map((img) => img.preview),
      sku: form.sku.trim() || "SKU-" + Math.floor(100000 + Math.random() * 900000),
      skuMapping
    };

    fetch(getApiUrl("/products"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        if (res.ok) {
          const text = await res.text();
          return text && text.trim() ? JSON.parse(text) : {};
        }
        throw new Error("Failed to add product");
      })
      .then(() => {
        showToast("Product Created", `${form.name} has been added to the catalog.`, "success");
        router.push("/admin/products");
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to create product.", "error");
        setSubmitting(false);
      });
  };

  const inputCls = "w-full bg-white border border-zinc-200 rounded-lg py-3 px-4 text-xs font-medium text-zinc-800 outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 transition-all placeholder:text-zinc-400";
  const labelCls = "block text-xs font-extrabold text-zinc-600 mb-1.5";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Add New Product" subtitle="Fill in product details and upload images" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8">
        <form onSubmit={handleSubmit} className="max-w-full mx-auto space-y-6">

          {/* Back link */}
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-[#F9A37E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* LEFT COLUMN: Image Upload */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-800 flex items-center gap-2">
                  <ImagePlus className="w-4 h-4 text-[#F9A37E]" /> Product Images
                </h3>

                {/* Drop Zone */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] rounded-lg p-8 flex flex-col items-center justify-center gap-2 transition-all hover:bg-[#F9A37E]/5 cursor-pointer group"
                >
                  <Upload className="w-8 h-8 text-zinc-300 group-hover:text-[#F9A37E] transition-colors" />
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-[#F9A37E] transition-colors">Click to Upload Images</span>
                  <span className="text-[10px] text-zinc-400">PNG, JPG, WEBP up to 5MB each</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Image previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative rounded-lg overflow-hidden aspect-square border border-zinc-200 group">
                        <img src={img.preview} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 text-[8px] font-extrabold bg-[#F9A37E] text-white px-1.5 py-0.5 rounded-md uppercase">Primary</span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-lg border-2 border-dashed border-zinc-200 hover:border-[#F9A37E] flex items-center justify-center text-zinc-400 hover:text-[#F9A37E] transition-all"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <p className="text-[10px] text-zinc-400">First uploaded image is the primary listing image.</p>
              </div>

              {/* Status & Tag card */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-4">
                <h3 className="font-extrabold text-sm text-zinc-800">Publish Settings</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm((p) => ({ ...p, inStock: !p.inStock }))}
                    className={`w-10 h-5.5 rounded-full relative transition-colors cursor-pointer ${form.inStock ? "bg-[#A8C69F]" : "bg-zinc-200"}`}
                    style={{ height: '22px' }}
                  >
                    <span
                      className={`absolute top-0.5 w-4.5 h-4 rounded-full bg-white shadow transition-all ${form.inStock ? "left-5" : "left-0.5"}`}
                      style={{ width: '18px', height: '18px', top: '2px' }}
                    />
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
 
            {/* RIGHT COLUMN: Details */}
            <div className="lg:col-span-3 space-y-4">
              {/* Basic Info */}
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
                    placeholder="e.g. Vintage Oversized Graphic Tee"
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
                      placeholder="auto-generated-from-name"
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
                    Preview: <span className="text-zinc-600 font-medium">/products/{form.slug || slugify(form.name) || 'your-product-slug'}</span>
                  </p>
                </div>

                {/* Qikink My Products Library Mapping */}
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-5 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-700">
                      <Link2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-900">Qikink My Products Library Mapping</h3>
                      <p className="text-[11px] font-medium text-amber-800 leading-relaxed mt-1">
                        For syncing orders from your store to Qikink, make sure to map the products present in your store with the products in the Qikink My Products Library. This step is crucial for the orders to be pulled correctly from your store.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>
                        <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-[#F9A37E]" /> Primary Qikink Base SKU <span className="text-red-400">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        value={form.sku}
                        onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                        placeholder="e.g. MVnHs-Wh-S"
                        className={inputCls}
                      />
                      <p className="text-[9px] text-zinc-500 mt-1">
                        Must match the SKU registered in your Qikink Seller Dashboard.
                      </p>
                    </div>

                    <div>
                      <label className={labelCls}>
                        <span>Quick Variant SKU Generator</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const base = form.sku.trim() || 'PHT-001';
                          const colors = form.selectedColors.length > 0 ? form.selectedColors : ['White', 'Black'];
                          const sizes = form.selectedSizes.length > 0 ? form.selectedSizes : ['S', 'M', 'L', 'XL'];
                          const map: Record<string, string> = {};
                          const COLOR_MAP: Record<string, string> = { 'White': 'Wh', 'Black': 'Bk', 'Heather Grey': 'Gy', 'Navy Blue': 'Ny', 'Forest Green': 'Gn', 'Crimson Red': 'Rd' };
                          colors.forEach(c => {
                            const cCode = COLOR_MAP[c] || c.slice(0, 2).toUpperCase();
                            sizes.forEach(s => {
                              map[`${c}_${s}`] = `${base}-${cCode}-${s}`;
                            });
                          });
                          setForm(p => ({ ...p, skuMappingStr: JSON.stringify(map, null, 2) }));
                          showToast("SKUs Auto-Generated", "Variant SKUs mapped for Qikink My Products Library.", "info");
                        }}
                        className="w-full py-3 px-4 bg-white border border-amber-300 hover:bg-amber-100/50 text-amber-900 font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        ⚡ Generate Qikink Variant SKUs
                      </button>
                      <p className="text-[9px] text-zinc-500 mt-1">Auto-maps color & size variants to standard Qikink format.</p>
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      <span className="flex items-center gap-1.5"><Link2 className="w-3.5 h-3.5 text-[#F9A37E]" /> Variant SKU Mappings (JSON)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={form.skuMappingStr}
                      onChange={(e) => setForm((p) => ({ ...p, skuMappingStr: e.target.value }))}
                      placeholder='{"White_S": "MVnHs-Wh-S", "Black_M": "MVnHs-Bk-M"}'
                      className={inputCls + " resize-none font-mono text-[10px]"}
                    />
                    <p className="text-[9px] text-zinc-500 mt-1">
                      Mapped color_size keys ensure orders pull automatically from Qikink My Products Library (`search_from_my_products: 1`).
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Selling Price (₹) <span className="text-red-400">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                      placeholder="e.g. 999"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Original Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.originalPrice}
                      onChange={(e) => setForm((p) => ({ ...p, originalPrice: e.target.value }))}
                      placeholder="e.g. 1299"
                      className={inputCls}
                    />
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
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe the product material, feel, and best use case..."
                    className={inputCls + " resize-none leading-relaxed"}
                  />
                </div>
              </div>

              {/* Sizes */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-zinc-800">Available Sizes</h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSize(s)}
                      className={`w-11 h-10 text-xs font-extrabold rounded-lg border-2 transition-all ${
                        form.selectedSizes.includes(s)
                          ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]"
                          : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="bg-white border border-zinc-200 rounded-lg p-5 shadow-sm space-y-3">
                <h3 className="font-extrabold text-sm text-zinc-800">Available Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => toggleColor(c.name)}
                      title={c.name}
                      className={`flex flex-col items-center gap-1 group`}
                    >
                      <span
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${
                          form.selectedColors.includes(c.name)
                            ? "border-[#F9A37E] scale-110 shadow-md shadow-[#F9A37E]/30"
                            : "border-zinc-200 group-hover:border-zinc-400"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-[8px] font-bold text-zinc-400 leading-tight text-center w-9 truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Link
                  href="/admin/products"
                  className="flex-1 text-center py-3.5 px-6 border-2 border-zinc-200 text-zinc-600 font-extrabold text-xs rounded-lg hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
                >
                  <Save className="w-4 h-4" />
                  {submitting ? "Saving..." : "Save Product"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
