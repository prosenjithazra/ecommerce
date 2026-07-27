"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AdminTopbar } from "../AdminSidebar";
import { getApiUrl } from "../../../components/ApiConfig";
import { useApp } from "../../../components/AppContext";
import { Star, Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  comment: string;
  productName: string;
  userCount: number;
  isActive: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "",
  avatar: "",
  rating: 5,
  comment: "",
  productName: "",
  isActive: true,
};

/* ── Star Rating Picker ── */
const StarPicker = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

/* ── Star Display ── */
const StarDisplay = ({ value }: { value: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 ${
          s <= value ? "text-amber-400 fill-amber-400" : "text-zinc-200 fill-zinc-200"
        }`}
      />
    ))}
  </div>
);

export default function AdminTestimonialsPage() {
  const { authToken, showToast } = useApp();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const bearerToken = `Bearer ${authToken || ''}`;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(getApiUrl("/testimonials/admin"), {
        headers: { Authorization: bearerToken },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [bearerToken]);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowForm(true);
  };

  const openEdit = (item: Testimonial) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      avatar: item.avatar,
      rating: item.rating,
      comment: item.comment,
      productName: item.productName,
      isActive: item.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || !form.comment.trim()) {
      showToast("Validation", "Name and comment are required.", "error");
      return;
    }
    setSaving(true);
    try {
      const url = editingId
        ? getApiUrl(`/testimonials/${editingId}`)
        : getApiUrl("/testimonials");
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", Authorization: bearerToken },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      showToast("Saved", editingId ? "Testimonial updated." : "Testimonial added.", "success");
      setShowForm(false);
      load();
    } catch {
      showToast("Error", "Could not save testimonial.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setDeleting(id);
    try {
      await fetch(getApiUrl(`/testimonials/${id}`), {
        method: "DELETE",
        headers: { Authorization: bearerToken },
      });
      showToast("Deleted", "Testimonial removed.", "success");
      load();
    } catch {
      showToast("Error", "Could not delete.", "error");
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (item: Testimonial) => {
    try {
      await fetch(getApiUrl(`/testimonials/${item.id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: bearerToken },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      load();
    } catch {
      showToast("Error", "Could not update status.", "error");
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-zinc-50">
      <AdminTopbar
        title="Testimonials"
        subtitle="Manage 'Loved by Creators' reviews shown on the homepage"
      />

      <main className="flex-1 p-4 sm:p-6 space-y-6">
        {/* Header action */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">{items.length} testimonial(s) total</p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#F9A37E] hover:bg-[#E8855A] text-white text-xs font-bold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Testimonial
          </button>
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-[#F9A37E]" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-zinc-400 text-sm">
            No testimonials yet. Click "Add Testimonial" to create the first one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className={`bg-white rounded-xl border p-5 space-y-3 transition-all ${
                  item.isActive ? "border-zinc-200" : "border-dashed border-zinc-300 opacity-60"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-zinc-100"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-[#FBD5C1] flex items-center justify-center flex-shrink-0 text-[#E8855A] font-black text-sm">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-extrabold text-sm text-[#4A453E] truncate">{item.name}</p>
                      {item.productName && (
                        <p className="text-[10px] text-[#A89B8A] truncate">{item.productName}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`flex-shrink-0 text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                      item.isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    {item.isActive ? "Active" : "Hidden"}
                  </span>
                </div>

                {/* Rating */}
                <StarDisplay value={item.rating} />

                {/* Comment */}
                <p className="text-xs text-[#7A736A] leading-relaxed line-clamp-3">{item.comment}</p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="text-[10px] text-zinc-400">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                        item.isActive
                          ? "text-zinc-500 hover:text-zinc-700 bg-zinc-50 hover:bg-zinc-100"
                          : "text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      }`}
                    >
                      {item.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      {deleting === item.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <h2 className="font-extrabold text-sm text-[#4A453E]">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg hover:bg-zinc-100 text-zinc-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-6 py-5 space-y-4">
              {/* Name */}
              <div>
                <label className="text-xs font-bold text-zinc-600 block mb-1">
                  Customer Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Alex Mercer"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F9A37E] transition-colors"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="text-xs font-bold text-zinc-600 block mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={form.avatar}
                  onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F9A37E] transition-colors"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-bold text-zinc-600 block mb-2">Rating</label>
                <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
              </div>

              {/* Product Name */}
              <div>
                <label className="text-xs font-bold text-zinc-600 block mb-1">Product Name</label>
                <input
                  type="text"
                  value={form.productName}
                  onChange={(e) => setForm({ ...form, productName: e.target.value })}
                  placeholder="e.g. Custom T-Shirt"
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F9A37E] transition-colors"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="text-xs font-bold text-zinc-600 block mb-1">
                  Review Comment <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={form.comment}
                  onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={3}
                  placeholder="Customer's review text..."
                  className="w-full px-3 py-2 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-[#F9A37E] transition-colors resize-none"
                />
              </div>

              {/* Active toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isActive: !form.isActive })}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    form.isActive ? "bg-[#F9A37E]" : "bg-zinc-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.isActive ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-zinc-600">
                  {form.isActive ? "Visible on homepage" : "Hidden from homepage"}
                </span>
              </div>

              {/* Note: user count is auto */}
              <p className="text-[10px] text-zinc-400 bg-zinc-50 px-3 py-2 rounded-lg border border-zinc-100">
                ℹ️ <strong>User count</strong> is automatically calculated from platform orders — not editable.
              </p>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-zinc-100">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-700 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#F9A37E] hover:bg-[#E8855A] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
