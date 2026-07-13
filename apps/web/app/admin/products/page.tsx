"use client";

import Link from "next/link";
import { Plus, Edit2, Trash2, Search } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useState } from "react";

const INITIAL_PRODUCTS = [
  { id: "p1", name: "Premium Soft Cotton Tee", price: 29.99, category: "T-Shirts", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80", inStock: true },
  { id: "p2", name: "Heavyweight Fleece Hoodie", price: 49.99, category: "Hoodies", image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&auto=format&fit=crop&q=80", inStock: true },
  { id: "p3", name: "Embroidery Custom Canvas Cap", price: 19.99, category: "Accessories", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80", inStock: false },
  { id: "p4", name: "Zip-Up Lightweight Bomber", price: 64.99, category: "Jackets", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&auto=format&fit=crop&q=80", inStock: true },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Products" subtitle={`${products.length} products in catalog`} />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-xl outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <Link
            href="/admin/products/add"
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-[#F9A37E]/20 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative overflow-hidden bg-zinc-100 aspect-[4/3]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${p.inStock ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">{p.category}</span>
                  <h3 className="font-extrabold text-sm text-zinc-900 leading-tight mt-0.5">{p.name}</h3>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-base text-zinc-900">₹{(p.price * 85).toFixed(0)}</span>
                  <div className="flex gap-1.5">
                    <Link
                      href={`/admin/products/edit/${p.id}`}
                      className="p-2 border border-zinc-200 hover:bg-[#F9A37E]/10 hover:border-[#F9A37E]/30 hover:text-[#F9A37E] text-zinc-500 rounded-xl transition-all"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 border border-zinc-200 hover:bg-red-50 hover:border-red-200 hover:text-red-500 text-zinc-500 rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-zinc-400 text-sm font-bold">
            No products found for &quot;{search}&quot;
          </div>
        )}
      </main>
    </div>
  );
}
