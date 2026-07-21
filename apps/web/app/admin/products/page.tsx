"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Edit2, Trash2, Search, ArrowUpDown } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const INITIAL_PRODUCTS = [
  { id: "p1", name: "Premium Soft Cotton Tee", price: 2549, originalPrice: 3399, category: "T-Shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80", inStock: true, tag: "Best Seller", sku: "PHT-001" },
  { id: "p2", name: "Heavyweight Fleece Hoodie", price: 4249, originalPrice: 5099, category: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&auto=format&fit=crop&q=80", inStock: true, tag: "New", sku: "PHH-002" },
  { id: "p3", name: "Embroidery Custom Canvas Cap", price: 1699, originalPrice: 2199, category: "Accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80", inStock: false, tag: "", sku: "PHA-003" },
  { id: "p4", name: "Zip-Up Lightweight Bomber", price: 5499, originalPrice: 6999, category: "Jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=80", inStock: true, tag: "Sale", sku: "PHJ-004" },
  { id: "p5", name: "Classic Logo Mug 350ml", price: 799, originalPrice: 999, category: "Mugs", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200&auto=format&fit=crop&q=80", inStock: true, tag: "", sku: "PHM-005" },
];

const TAG_STYLES: Record<string, string> = {
  "Best Seller": "bg-amber-50 text-amber-700 border-amber-100",
  "New": "bg-sky-50 text-sky-700 border-sky-100",
  "Sale": "bg-red-50 text-red-600 border-red-100",
  "Eco": "bg-emerald-50 text-emerald-700 border-emerald-100",
};

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  inStock: boolean;
  tag: string;
  sku: string;
  slug?: string;
}

const slugify = (name: string) =>
  name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

export default function AdminProductsPage() {
  const { showToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [_loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [sortField, setSortField] = useState<"name" | "price" | "category">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch(getApiUrl("/products"))
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load products");
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to load products.", "error");
        setProducts([]);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      fetch(getApiUrl(`/products/${id}`), {
        method: "DELETE"
      })
        .then(res => {
          if (res.ok) {
            setProducts((prev) => prev.filter((p) => p.id !== id));
            showToast("Deleted", "Product deleted successfully.", "info");
          } else {
            throw new Error("Failed to delete product");
          }
        })
        .catch(err => {
          showToast("Error", err.message || "Failed to delete product.", "error");
        });
    }
  };

  const toggleSort = (field: "name" | "price" | "category") => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const filtered = products
    .filter((p) => {
      const s = search.toLowerCase();
      const matchSearch = p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s) || p.category.toLowerCase().includes(s);
      const matchCat = filterCat === "All" || p.category === filterCat;
      const matchStock = filterStock === "All" || (filterStock === "In Stock" ? p.inStock : !p.inStock);
      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      let va: string | number = a[sortField];
      let vb: string | number = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortButton = ({ field, label }: { field: "name" | "price" | "category"; label: string }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-[#F9A37E] transition-colors group">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-[#F9A37E]" : "text-zinc-400 group-hover:text-[#F9A37E]"}`} />
    </button>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Products" subtitle={`${products.length} products in catalog`} />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-5">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name, SKU, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Category:</span>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`text-[10px] font-extrabold px-3 py-1 rounded-md border transition-all ${filterCat === c ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
            >
              {c}
            </button>
          ))}
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-3">Stock:</span>
          {["All", "In Stock", "Out of Stock"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStock(s)}
              className={`text-[10px] font-extrabold px-3 py-1 rounded-md border transition-all ${filterStock === s ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-zinc-900">{products.length}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Total Products</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-emerald-600">{products.filter((p) => p.inStock).length}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">In Stock</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
            <p className="text-xl font-black text-red-500">{products.filter((p) => !p.inStock).length}</p>
            <p className="text-[10px] font-bold text-zinc-400 mt-0.5">Out of Stock</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="py-3.5 px-5 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide w-12">Image</th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">
                    <SortButton field="name" label="Product Name" />
                  </th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">SKU</th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">
                    <SortButton field="category" label="Category" />
                  </th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">
                    <SortButton field="price" label="Price" />
                  </th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">Original</th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">Tag</th>
                  <th className="py-3.5 px-4 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide">Stock</th>
                  <th className="py-3.5 px-5 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="py-3 px-5">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-zinc-100"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/products/${p.slug || slugify(p.name)}`}
                        target="_blank"
                        className="font-extrabold text-zinc-900 leading-snug hover:text-[#F9A37E] transition-colors group-hover:underline block"
                        title="View on store"
                      >
                        {p.name}
                      </Link>
                      <span className="text-[9px] text-zinc-400 font-mono">/{p.slug || slugify(p.name)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-[10px] font-bold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-md">{p.sku}</code>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-xs font-bold text-zinc-600">{p.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-black text-zinc-900">₹{p.price.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-zinc-400 line-through text-[11px]">₹{p.originalPrice.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.tag ? (
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${TAG_STYLES[p.tag] || "bg-zinc-100 text-zinc-500 border-zinc-200"}`}>
                          {p.tag}
                        </span>
                      ) : (
                        <span className="text-zinc-300 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${p.inStock ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                        {p.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex gap-1.5 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/admin/products/edit/${p.slug || slugify(p.name)}`}
                          className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
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
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No products match your filters.</p>
          )}
          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-zinc-100 bg-zinc-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-zinc-400">
              Showing <strong className="text-zinc-600">{filtered.length}</strong> of <strong className="text-zinc-600">{products.length}</strong> products
            </p>
            <p className="text-[10px] font-bold text-zinc-400">Sorted by <strong className="text-zinc-600">{sortField}</strong> ({sortDir})</p>
          </div>
        </div>
      </main>
    </div>
  );
}
