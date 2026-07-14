"use client";

import React, { useState } from "react";
import { Plus, Edit2, Trash2, Save, X, Check } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

export interface PolicySection {
  id: string;
  heading: string;
  content: string;
  lastUpdated: string;
}

interface PolicyPageProps {
  title: string;
  subtitle: string;
  accentColor: string;
  initialSections: PolicySection[];
}

export function PolicyPage({ title, subtitle, accentColor, initialSections }: PolicyPageProps) {
  const { showToast } = useApp();
  const [sections, setSections] = useState<PolicySection[]>(initialSections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ heading: "", content: "" });
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({ heading: "", content: "" });
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().split("T")[0]!;

  const startEdit = (s: PolicySection) => {
    setEditingId(s.id);
    setEditForm({ heading: s.heading, content: s.content });
  };

  const saveEdit = (id: string) => {
    if (!editForm.heading.trim()) return;
    setSections((prev) =>
      prev.map((s) => s.id === id ? { ...s, heading: editForm.heading, content: editForm.content, lastUpdated: today } : s)
    );
    setEditingId(null);
    showToast("Section Updated", `"${editForm.heading}" has been saved.`, "success");
  };

  const cancelEdit = () => setEditingId(null);

  const deleteSection = (id: string) => {
    const section = sections.find((s) => s.id === id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    showToast("Section Removed", `"${section?.heading}" was deleted.`, "info");
  };

  const addSection = () => {
    if (!newForm.heading.trim()) return;
    const id = `s${Date.now()}`;
    setSections((prev) => [...prev, { id, heading: newForm.heading, content: newForm.content, lastUpdated: today }]);
    setNewForm({ heading: "", content: "" });
    setAddingNew(false);
    showToast("Section Added", `"${newForm.heading}" has been added.`, "success");
  };

  const publishAll = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setSaving(false);
    showToast("Policy Published", `${title} has been published to the storefront.`, "success");
  };

  const inputCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs text-zinc-800 outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 transition-all placeholder:text-zinc-400";
  const textareaCls = "w-full bg-zinc-50 border border-zinc-200 rounded-lg py-3 px-3.5 text-xs text-zinc-700 leading-relaxed outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 resize-none transition-all";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title={title} subtitle={subtitle} />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
        {/* Top actions */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-8 rounded-full" style={{ backgroundColor: accentColor }} />
            <div>
              <p className="font-extrabold text-sm text-zinc-900">{title}</p>
              <p className="text-[10px] text-zinc-400">{sections.length} sections · last updated {today}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setAddingNew(true); setEditingId(null); }}
              className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-4 rounded-lg border-2 border-dashed border-zinc-300 hover:border-[#F9A37E] text-zinc-500 hover:text-[#F9A37E] transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Add Section
            </button>
            <button
              onClick={publishAll}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-5 rounded-lg text-white transition-all shadow-md disabled:opacity-60"
              style={{ backgroundColor: accentColor }}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Publishing..." : "Publish All"}
            </button>
          </div>
        </div>

        {/* Sections Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-zinc-50 border-b border-zinc-200 text-[9px] font-black uppercase tracking-widest text-zinc-400">
            <div className="col-span-1 flex items-center">#</div>
            <div className="col-span-3">Section Heading</div>
            <div className="col-span-6">Content Preview</div>
            <div className="col-span-1 text-center">Updated</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-zinc-100">
            {sections.map((s, idx) => (
              <div key={s.id}>
                {editingId === s.id ? (
                  /* EDIT ROW */
                  <div className="px-5 py-4 space-y-3 bg-amber-50/40 border-l-4" style={{ borderLeftColor: accentColor }}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Section Heading</label>
                        <input
                          value={editForm.heading}
                          onChange={(e) => setEditForm((p) => ({ ...p, heading: e.target.value }))}
                          className={inputCls}
                          placeholder="e.g. Return Eligibility"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Section Content</label>
                      <textarea
                        rows={5}
                        value={editForm.content}
                        onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))}
                        className={textareaCls}
                        placeholder="Write the policy content for this section..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={cancelEdit} className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors">
                        <X className="w-3.5 h-3.5" /> Cancel
                      </button>
                      <button
                        onClick={() => saveEdit(s.id)}
                        className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-4 rounded-lg text-white transition-all shadow-sm"
                        style={{ backgroundColor: accentColor }}
                      >
                        <Check className="w-3.5 h-3.5" /> Save Section
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VIEW ROW */
                  <div className="grid grid-cols-12 gap-4 px-5 py-4 hover:bg-zinc-50 transition-colors items-start">
                    <div className="col-span-1 flex items-center gap-2 pt-0.5">
                      <span className="text-[10px] font-black text-zinc-300 w-5 text-center">{idx + 1}</span>
                    </div>
                    <div className="col-span-3 pt-0.5">
                      <p className="font-extrabold text-xs text-zinc-900 leading-snug">{s.heading}</p>
                    </div>
                    <div className="col-span-6 pt-0.5">
                      <p className="text-[11px] text-zinc-500 leading-relaxed line-clamp-3">{s.content || <em className="text-zinc-300">No content</em>}</p>
                    </div>
                    <div className="col-span-1 pt-0.5 text-center">
                      <span className="text-[9px] font-bold text-zinc-400">{s.lastUpdated}</span>
                    </div>
                    <div className="col-span-1 flex gap-1 justify-end pt-0.5">
                      <button
                        onClick={() => startEdit(s)}
                        className="p-1.5 border border-zinc-200 hover:border-[#F9A37E]/40 hover:bg-[#F9A37E]/5 hover:text-[#F9A37E] text-zinc-400 rounded-lg transition-all"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteSection(s.id)}
                        className="p-1.5 border border-zinc-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500 text-zinc-400 rounded-lg transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add New Section Inline */}
          {addingNew && (
            <div className="px-5 py-4 space-y-3 border-t border-zinc-100 bg-emerald-50/30 border-l-4 border-l-emerald-400">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">New Section</p>
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Section Heading</label>
                <input
                  value={newForm.heading}
                  onChange={(e) => setNewForm((p) => ({ ...p, heading: e.target.value }))}
                  className={inputCls}
                  placeholder="e.g. International Shipping"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[9px] font-black uppercase text-zinc-500 tracking-widest mb-1.5">Section Content</label>
                <textarea
                  rows={5}
                  value={newForm.content}
                  onChange={(e) => setNewForm((p) => ({ ...p, content: e.target.value }))}
                  className={textareaCls}
                  placeholder="Write the policy content for this section..."
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setAddingNew(false); setNewForm({ heading: "", content: "" }); }} className="flex items-center gap-1.5 text-xs font-bold py-2 px-4 rounded-lg border border-zinc-200 text-zinc-500 hover:bg-zinc-50 transition-colors">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={addSection} className="flex items-center gap-1.5 text-xs font-extrabold py-2 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-sm">
                  <Plus className="w-3.5 h-3.5" /> Add Section
                </button>
              </div>
            </div>
          )}

          {sections.length === 0 && !addingNew && (
            <div className="py-16 text-center">
              <p className="text-zinc-400 text-xs font-bold">No sections yet.</p>
              <button onClick={() => setAddingNew(true)} className="mt-2 text-[#F9A37E] text-xs font-extrabold hover:underline">+ Add your first section</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
