"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  Target, 
  Milestone, 
  Users, 
  Megaphone, 
  Save, 
  Plus, 
  Trash2, 
  Loader2,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";

interface MilestoneItem {
  year: string;
  title: string;
  desc: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export default function AdminAboutPage() {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"story" | "mission" | "milestones" | "team" | "cta">("story");

  const storyFileInputRef = useRef<HTMLInputElement>(null);
  const memberFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [storyForm, setStoryForm] = useState({
    badge: "",
    title: "",
    story1: "",
    story2: "",
    image: "",
  });

  const [missionForm, setMissionForm] = useState({
    missionTitle: "",
    missionDesc: "",
    visionTitle: "",
    visionDesc: "",
  });

  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [newMilestone, setNewMilestone] = useState<MilestoneItem>({ year: "", title: "", desc: "" });

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [newMember, setNewMember] = useState<TeamMember>({ name: "", role: "", image: "" });

  const [ctaForm, setCtaForm] = useState({
    ctaTitle: "",
    ctaDesc: "",
  });

  useEffect(() => {
    fetch(getApiUrl("/about"))
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load About Us content");
      })
      .then((data) => {
        if (data) {
          setStoryForm({
            badge: data.badge || "",
            title: data.title || "",
            story1: data.story1 || "",
            story2: data.story2 || "",
            image: data.image || "",
          });
          setMissionForm({
            missionTitle: data.missionTitle || "",
            missionDesc: data.missionDesc || "",
            visionTitle: data.visionTitle || "",
            visionDesc: data.visionDesc || "",
          });
          setMilestones(data.milestones || []);
          setTeam(data.team || []);
          setCtaForm({
            ctaTitle: data.ctaTitle || "",
            ctaDesc: data.ctaDesc || "",
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to load page content.", "error");
        setLoading(false);
      });
  }, []);

  const handleSave = (tabName: string, payload: any) => {
    setSaving(true);
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/about"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to update page section");
      })
      .then((updated) => {
        if (updated) {
          // Update local state with latest URLs from Cloudinary
          if (updated.image) setStoryForm(prev => ({ ...prev, image: updated.image }));
          if (updated.team) setTeam(updated.team);
        }
        showToast("Section Updated", `${tabName} section changes have been saved to the database.`, "success");
        setSaving(false);
      })
      .catch((err) => {
        showToast("Error", err.message || "Failed to save section changes.", "error");
        setSaving(false);
      });
  };

  // Image Upload helper
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        callback(ev.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Milestone list operations
  const addMilestone = () => {
    if (!newMilestone.year || !newMilestone.title) return;
    setMilestones((prev) => [...prev, newMilestone]);
    setNewMilestone({ year: "", title: "", desc: "" });
  };

  const removeMilestone = (idx: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== idx));
  };

  // Team list operations
  const addTeamMember = () => {
    if (!newMember.name || !newMember.role || !newMember.image) {
      showToast("Missing Fields", "Please enter member name, role, and upload an avatar image.", "error");
      return;
    }
    setTeam((prev) => [...prev, newMember]);
    setNewMember({ name: "", role: "", image: "" });
    if (memberFileInputRef.current) memberFileInputRef.current.value = "";
  };

  const removeTeamMember = (idx: number) => {
    setTeam((prev) => prev.filter((_, i) => i !== idx));
  };

  const tabCls = (tab: typeof activeTab) => 
    `flex items-center gap-2 px-4 py-3 text-xs font-extrabold border-b-2 transition-all cursor-pointer ${
      activeTab === tab 
        ? "border-[#F9A37E] text-[#e8855a] bg-[#F9A37E]/5" 
        : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
    }`;

  const inputCls = "w-full bg-white border border-zinc-200 rounded-lg py-2.5 px-3.5 text-xs font-medium text-zinc-800 outline-none focus:border-[#F9A37E] transition-all placeholder:text-zinc-400";
  const labelCls = "block text-xs font-extrabold text-zinc-600 mb-1.5";

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="About Us Editor" subtitle="Loading page settings..." />
        <main className="flex-1 flex items-center justify-center p-8 bg-[#FDFAF6]">
          <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="About Us Editor" subtitle="Customize sections displayed on the public About Us page" />
      
      {/* Tab Navigation */}
      <div className="bg-white border-b border-zinc-200 flex overflow-x-auto">
        <button onClick={() => setActiveTab("story")} className={tabCls("story")}>
          <BookOpen className="w-4 h-4" /> Story Section
        </button>
        <button onClick={() => setActiveTab("mission")} className={tabCls("mission")}>
          <Target className="w-4 h-4" /> Mission & Vision
        </button>
        <button onClick={() => setActiveTab("milestones")} className={tabCls("milestones")}>
          <Milestone className="w-4 h-4" /> Company Timeline
        </button>
        <button onClick={() => setActiveTab("team")} className={tabCls("team")}>
          <Users className="w-4 h-4" /> Leadership Team
        </button>
        <button onClick={() => setActiveTab("cta")} className={tabCls("cta")}>
          <Megaphone className="w-4 h-4" /> Call-To-Action
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#FDFAF6]">
        <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
          
          {/* TAB 1: STORY SECTION */}
          {activeTab === "story" && (
            <div className="space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-zinc-950 text-base">Story / Header Section</h3>
                <p className="text-zinc-400 text-[10px] mt-0.5">Customize the main hero segment and brand text.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Badge Text</label>
                  <input 
                    type="text" 
                    value={storyForm.badge} 
                    onChange={(e) => setStoryForm({ ...storyForm, badge: e.target.value })} 
                    className={inputCls} 
                    placeholder="e.g. Our Story"
                  />
                </div>
                <div>
                  <label className={labelCls}>Story Header Title</label>
                  <input 
                    type="text" 
                    value={storyForm.title} 
                    onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })} 
                    className={inputCls}
                    placeholder="e.g. Custom printing with care"
                  />
                </div>
              </div>

              {/* Uploadable Story Image */}
              <div className="space-y-2">
                <label className={labelCls}>Story Section Image</label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-zinc-200 rounded-lg bg-zinc-50/55">
                  <div className="w-40 h-24 rounded-lg overflow-hidden border border-zinc-200 bg-white flex-shrink-0 flex items-center justify-center">
                    {storyForm.image ? (
                      <img src={storyForm.image} alt="Story Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-zinc-300" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => storyFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-zinc-200 hover:border-[#F9A37E] text-zinc-700 text-xs font-bold rounded-lg transition-all shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload Photo
                    </button>
                    <p className="text-[10px] text-zinc-400 leading-normal">Select a premium JPEG, PNG, or WEBP file to upload directly to Cloudinary.</p>
                    <input
                      ref={storyFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, (base64) => setStoryForm(prev => ({ ...prev, image: base64 })))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={labelCls}>Story Paragraph 1</label>
                <textarea 
                  rows={4}
                  value={storyForm.story1} 
                  onChange={(e) => setStoryForm({ ...storyForm, story1: e.target.value })} 
                  className={inputCls + " resize-none"}
                  placeholder="Paragraph 1..."
                />
              </div>

              <div>
                <label className={labelCls}>Story Paragraph 2</label>
                <textarea 
                  rows={4}
                  value={storyForm.story2} 
                  onChange={(e) => setStoryForm({ ...storyForm, story2: e.target.value })} 
                  className={inputCls + " resize-none"}
                  placeholder="Paragraph 2..."
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => handleSave("Story", storyForm)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Uploading..." : "Save Story Changes"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: MISSION & VISION */}
          {activeTab === "mission" && (
            <div className="space-y-6">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-zinc-950 text-base">Mission & Vision Values</h3>
                <p className="text-zinc-400 text-[10px] mt-0.5">Customize core values cards on the storefront page.</p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Our Mission Card</h4>
                <div>
                  <label className={labelCls}>Mission Section Title</label>
                  <input 
                    type="text" 
                    value={missionForm.missionTitle} 
                    onChange={(e) => setMissionForm({ ...missionForm, missionTitle: e.target.value })} 
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Mission Description</label>
                  <textarea 
                    rows={3}
                    value={missionForm.missionDesc} 
                    onChange={(e) => setMissionForm({ ...missionForm, missionDesc: e.target.value })} 
                    className={inputCls + " resize-none"}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-zinc-100">
                <h4 className="text-xs font-black uppercase text-zinc-400 tracking-wider">Our Vision Card</h4>
                <div>
                  <label className={labelCls}>Vision Section Title</label>
                  <input 
                    type="text" 
                    value={missionForm.visionTitle} 
                    onChange={(e) => setMissionForm({ ...missionForm, visionTitle: e.target.value })} 
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Vision Description</label>
                  <textarea 
                    rows={3}
                    value={missionForm.visionDesc} 
                    onChange={(e) => setMissionForm({ ...missionForm, visionDesc: e.target.value })} 
                    className={inputCls + " resize-none"}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => handleSave("Mission & Vision", missionForm)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Values"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: TIMELINE MILESTONES */}
          {activeTab === "milestones" && (
            <div className="space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-zinc-950 text-base">Company Milestones Timeline</h3>
                <p className="text-zinc-400 text-[10px] mt-0.5">Define historical checkpoints and growth markers.</p>
              </div>

              {/* Milestone list */}
              <div className="space-y-3">
                {milestones.map((m, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-zinc-50 border border-zinc-100 p-3 rounded-lg">
                    <span className="text-sm font-black text-[#e8855a] w-14">{m.year}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-800 truncate">{m.title}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{m.desc}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeMilestone(idx)} 
                      className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {milestones.length === 0 && (
                  <p className="text-xs text-zinc-400 text-center py-6">No milestones defined yet.</p>
                )}
              </div>

              {/* Add Milestone Form */}
              <div className="bg-zinc-50/50 border border-dashed border-zinc-200 rounded-xl p-4 space-y-3 mt-4">
                <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Timeline Checkpoint
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-1">
                    <input 
                      type="text" 
                      placeholder="Year (e.g. 2026)" 
                      value={newMilestone.year}
                      onChange={(e) => setNewMilestone({ ...newMilestone, year: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="col-span-2">
                    <input 
                      type="text" 
                      placeholder="Checkpoint Title" 
                      value={newMilestone.title}
                      onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <textarea 
                    rows={2} 
                    placeholder="Provide a brief description of what was achieved..." 
                    value={newMilestone.desc}
                    onChange={(e) => setNewMilestone({ ...newMilestone, desc: e.target.value })}
                    className={inputCls + " resize-none"}
                  />
                </div>
                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={addMilestone}
                    className="bg-zinc-800 hover:bg-zinc-950 text-white font-extrabold text-[10px] py-1.5 px-4 rounded-lg transition-colors"
                  >
                    Insert Checkpoint
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-zinc-100">
                <button
                  onClick={() => handleSave("Timeline", { milestones })}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Timeline Changes"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: LEADERSHIP TEAM */}
          {activeTab === "team" && (
            <div className="space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-zinc-950 text-base">Leadership & Founders</h3>
                <p className="text-zinc-400 text-[10px] mt-0.5">Customize founders and team members profiles.</p>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {team.map((t, idx) => (
                  <div key={idx} className="flex gap-3 items-center border border-zinc-200 bg-zinc-50 rounded-lg p-3 relative group">
                    <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-zinc-200 bg-white" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-zinc-800 truncate">{t.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate mt-0.5">{t.role}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => removeTeamMember(idx)} 
                      className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {team.length === 0 && (
                  <p className="text-xs text-zinc-400 text-center col-span-2 py-6">No team members added.</p>
                )}
              </div>

              {/* Add Member Form */}
              <div className="bg-zinc-50/50 border border-dashed border-zinc-200 rounded-xl p-4 space-y-3 mt-4">
                <h4 className="text-xs font-black uppercase text-zinc-500 tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> Add Leadership Member
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Member Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe" 
                      value={newMember.name}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Role / Position</label>
                    <input 
                      type="text" 
                      placeholder="e.g. VP of Operations" 
                      value={newMember.role}
                      onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>

                {/* Uploadable Avatar for New Member */}
                <div className="space-y-2">
                  <label className={labelCls}>Avatar Image</label>
                  <div className="flex items-center gap-3 p-3 border border-zinc-200 rounded-lg bg-white">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-200 bg-zinc-50 flex-shrink-0 flex items-center justify-center">
                      {newMember.image ? (
                        <img src={newMember.image} alt="Avatar Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 text-zinc-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <button
                        type="button"
                        onClick={() => memberFileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-zinc-200 hover:border-[#F9A37E] text-zinc-700 text-[10px] font-bold rounded-lg transition-all"
                      >
                        <Upload className="w-3 h-3" /> Select Avatar
                      </button>
                      <input
                        ref={memberFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, (base64) => setNewMember(prev => ({ ...prev, image: base64 })))}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button 
                    type="button" 
                    onClick={addTeamMember}
                    className="bg-zinc-800 hover:bg-zinc-950 text-white font-extrabold text-[10px] py-1.5 px-4 rounded-lg transition-colors"
                  >
                    Insert Member
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-zinc-100">
                <button
                  onClick={() => handleSave("Team Leadership", { team })}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? "Uploading..." : "Save Team Changes"}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: CTA SETTINGS */}
          {activeTab === "cta" && (
            <div className="space-y-5">
              <div className="border-b border-zinc-100 pb-3">
                <h3 className="font-extrabold text-zinc-950 text-base">Call-To-Action (CTA)</h3>
                <p className="text-zinc-400 text-[10px] mt-0.5">Customize the footer callout details.</p>
              </div>

              <div>
                <label className={labelCls}>CTA Title Header</label>
                <input 
                  type="text" 
                  value={ctaForm.ctaTitle} 
                  onChange={(e) => setCtaForm({ ...ctaForm, ctaTitle: e.target.value })} 
                  className={inputCls}
                />
              </div>

              <div>
                <label className={labelCls}>CTA Description Text</label>
                <textarea 
                  rows={3}
                  value={ctaForm.ctaDesc} 
                  onChange={(e) => setCtaForm({ ...ctaForm, ctaDesc: e.target.value })} 
                  className={inputCls + " resize-none"}
                />
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => handleSave("Call To Action", ctaForm)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save CTA Settings"}
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
