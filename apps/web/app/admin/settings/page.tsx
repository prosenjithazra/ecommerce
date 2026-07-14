"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Globe, Save } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

export default function AdminSettingsPage() {
  const { companySettings, updateCompanySettings } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    hours: "",
    twitterUrl: "",
    instagramUrl: "",
    facebookUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (companySettings) {
      setFormData({
        email: companySettings.email || "",
        phone: companySettings.phone || "",
        address: companySettings.address || "",
        hours: companySettings.hours || "",
        twitterUrl: companySettings.twitterUrl || "",
        instagramUrl: companySettings.instagramUrl || "",
        facebookUrl: companySettings.facebookUrl || "",
      });
    }
  }, [companySettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateCompanySettings(formData);
    setSaving(false);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Store Settings" subtitle="Configure global storefront metadata, contact cards, and social handles" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-zinc-50/50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Card */}
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
            <div>
              <h3 className="font-extrabold text-sm text-[#4A453E] uppercase tracking-wider mb-1">Contact Details</h3>
              <p className="text-xs text-zinc-450">These values populate in the footer, contact page cards, and header banners dynamically.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" /> Support Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="support@kaivafashion.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" /> Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0199"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-400" /> Studio Address
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Creative Street, Suite 100, New York, NY 10001"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                />
              </div>

              {/* Working Hours */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" /> Operating Hours
                </label>
                <input
                  type="text"
                  required
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="Mon - Fri, 9am - 6pm EST"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                />
              </div>
            </div>

            <div className="border-t border-zinc-150 pt-8">
              <h3 className="font-extrabold text-sm text-[#4A453E] uppercase tracking-wider mb-1">Social Media Profiles</h3>
              <p className="text-xs text-zinc-450 mb-6">Enter URLs for custom brand redirection links.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Twitter / X */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-zinc-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    Twitter / X Link
                  </label>
                  <input
                    type="url"
                    value={formData.twitterUrl}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://x.com/kaiva"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                  />
                </div>

                {/* Instagram */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" /> Instagram Link
                  </label>
                  <input
                    type="url"
                    value={formData.instagramUrl}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/kaiva"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                  />
                </div>

                {/* Facebook */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" /> Facebook Link
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/kaiva"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#F9A37E] text-zinc-800 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-8 rounded-lg transition-all shadow-md shadow-[#F9A37E]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Global Settings
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
