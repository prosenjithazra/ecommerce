"use client";

import React, { useState, useEffect } from "react";
import { Plus, Tag, Trash2, Edit2, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface Coupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  expiresAt?: string;
  assignedUserEmail?: string;
  isActive: boolean;
  usageCount: number;
}

export default function AdminCouponsPage() {
  const { showToast } = useApp();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "",
    maxDiscount: "",
    expiresAt: "",
    assignedUserEmail: "",
    isActive: true,
  });

  const fetchCoupons = () => {
    setLoading(true);
    fetch(getApiUrl("/coupons"))
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCoupons(data);
        setLoading(false);
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to load coupons", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const openModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setForm({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: String(coupon.discountValue),
        minOrderAmount: String(coupon.minOrderAmount || 0),
        maxDiscount: String(coupon.maxDiscount || 0),
        expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0]! : "",
        assignedUserEmail: coupon.assignedUserEmail || "",
        isActive: coupon.isActive,
      });
    } else {
      setEditingCoupon(null);
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "0",
        maxDiscount: "0",
        expiresAt: "",
        assignedUserEmail: "",
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.discountValue) return;

    setSubmitting(true);
    const payload = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue) || 0,
      minOrderAmount: parseFloat(form.minOrderAmount) || 0,
      maxDiscount: parseFloat(form.maxDiscount) || 0,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : undefined,
      assignedUserEmail: form.assignedUserEmail ? form.assignedUserEmail.trim().toLowerCase() : undefined,
      isActive: form.isActive,
    };

    const url = editingCoupon ? getApiUrl(`/coupons/${editingCoupon.id}`) : getApiUrl("/coupons");
    const method = editingCoupon ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((err) => { throw new Error(err.message || "Failed to save coupon"); });
      })
      .then(() => {
        showToast("Success", `Coupon ${editingCoupon ? "updated" : "created"} successfully.`, "success");
        closeModal();
        fetchCoupons();
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to save coupon.", "error");
      })
      .finally(() => setSubmitting(false));
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete coupon "${code}"?`)) {
      fetch(getApiUrl(`/coupons/${id}`), { method: "DELETE" })
        .then((res) => {
          if (res.ok) {
            showToast("Deleted", `Coupon "${code}" deleted.`, "info");
            setCoupons((prev) => prev.filter((c) => c.id !== id));
          } else {
            throw new Error("Failed to delete");
          }
        })
        .catch((err) => showToast("Error", err.message, "error"));
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    fetch(getApiUrl(`/coupons/${coupon.id}`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !coupon.isActive }),
    })
      .then((res) => {
        if (res.ok) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === coupon.id ? { ...c, isActive: !c.isActive } : c))
          );
        }
      })
      .catch((err) => showToast("Error", err.message, "error"));
  };

  const inputCls = "w-full bg-white border border-zinc-200 rounded-lg py-2.5 px-3 text-xs font-semibold text-zinc-800 outline-none focus:border-[#F9A37E] transition-all";
  const labelCls = "block text-xs font-extrabold text-zinc-600 mb-1";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Coupons & Promo Codes" subtitle="Manage dynamic & user-specific discount codes" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-zinc-800">Store Coupons & Assigned Offers</h2>
            <p className="text-xs text-zinc-500">Create percentage or fixed discount codes for all users or assigned to a specific user</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
          >
            <Plus className="w-4 h-4" /> Create New Coupon
          </button>
        </div>

        {/* Coupons Table */}
        <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider font-extrabold">
                <tr>
                  <th className="py-3.5 px-5">Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Min Order</th>
                  <th className="py-3.5 px-4">Assigned User</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-medium">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-400 font-bold">Loading coupons...</td>
                  </tr>
                ) : coupons.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-400 font-bold">No coupons found. Click "Create New Coupon" to add one!</td>
                  </tr>
                ) : (
                  coupons.map((c) => {
                    const isExpired = c.expiresAt && new Date() > new Date(c.expiresAt);
                    return (
                      <tr key={c.id} className="hover:bg-zinc-50 transition-colors">
                        <td className="py-3.5 px-5 font-black text-zinc-900 flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-[#F9A37E]" />
                          <code className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded font-mono text-xs uppercase">{c.code}</code>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-zinc-800">
                          {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-600 font-semibold">
                          {c.minOrderAmount > 0 ? `₹${c.minOrderAmount}` : "None"}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-600 font-semibold">
                          {c.assignedUserEmail ? (
                            <span className="inline-flex items-center gap-1.5 bg-[#FBD5C1]/30 text-[#E8855A] font-bold px-2 py-0.5 rounded-md text-[10px]">
                              <User className="w-3 h-3" />
                              {c.assignedUserEmail}
                            </span>
                          ) : (
                            <span className="text-zinc-400 font-normal">All Users (Public)</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-zinc-500 font-semibold">
                          {c.expiresAt ? (
                            <span className={`inline-flex items-center gap-1 ${isExpired ? "text-red-500 font-bold" : ""}`}>
                              <Clock className="w-3 h-3" />
                              {new Date(c.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </span>
                          ) : (
                            <span className="text-zinc-400">Never</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleActive(c)}
                            className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-2.5 py-1 rounded-full border uppercase cursor-pointer transition-all ${
                              !c.isActive
                                ? "bg-zinc-100 text-zinc-500 border-zinc-200"
                                : isExpired
                                ? "bg-red-50 text-red-600 border-red-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            {c.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                            {isExpired ? "Expired" : c.isActive ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="py-3.5 px-5 text-right space-x-1">
                          <button
                            onClick={() => openModal(c)}
                            className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id, c.code)}
                            className="p-1.5 border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-zinc-400 rounded-lg transition-all"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-zinc-200 rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900 border-b border-zinc-100 pb-3">
              {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : "Create New Coupon"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SUMMER20"
                  value={form.code}
                  onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                  className={inputCls + " uppercase font-mono"}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Discount Type *</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm((p) => ({ ...p, discountType: e.target.value as any }))}
                    className={inputCls}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    placeholder={form.discountType === "percentage" ? "10 for 10%" : "100 for ₹100"}
                    value={form.discountValue}
                    onChange={(e) => setForm((p) => ({ ...p, discountValue: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Assign to Specific User Email (Optional)</label>
                <input
                  type="email"
                  placeholder="Leave empty for all users, or user@example.com"
                  value={form.assignedUserEmail}
                  onChange={(e) => setForm((p) => ({ ...p, assignedUserEmail: e.target.value }))}
                  className={inputCls}
                />
                <p className="text-[10px] text-zinc-400 mt-1">If set, this coupon will only appear and work for this specific user email.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Min Order Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = No minimum"
                    value={form.minOrderAmount}
                    onChange={(e) => setForm((p) => ({ ...p, minOrderAmount: e.target.value }))}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Max Cap Amount (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = Unlimited"
                    value={form.maxDiscount}
                    onChange={(e) => setForm((p) => ({ ...p, maxDiscount: e.target.value }))}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={form.expiresAt}
                  onChange={(e) => setForm((p) => ({ ...p, expiresAt: e.target.value }))}
                  className={inputCls}
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded border-zinc-300 accent-[#F9A37E]"
                />
                <span className="text-xs font-bold text-zinc-700">Coupon is Active</span>
              </label>

              <div className="flex gap-3 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 text-xs font-bold text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 text-xs font-extrabold text-white bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 rounded-lg shadow-md shadow-[#F9A37E]/20"
                >
                  {submitting ? "Saving..." : editingCoupon ? "Update Coupon" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
