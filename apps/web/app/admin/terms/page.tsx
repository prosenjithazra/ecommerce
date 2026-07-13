"use client";

import { useState } from "react";
import { Save, FileText, Shield } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp } from "../../../components/AppContext";

export default function AdminTermsPage() {
  const { showToast } = useApp();

  const [terms, setTerms] = useState(`Welcome to PrintHub — a print-on-demand storefront specializing in custom-printed merchandise.

By accessing our POD studio editor, placing bulk print orders, or customizing templates, you agree to comply with the following:

1. INTELLECTUAL PROPERTY
All designs submitted for printing must be original works owned by you, or properly licensed for commercial print use. PrintHub does not accept responsibility for copyright violations caused by customer-submitted designs.

2. ORDER FULFILMENT
Orders are fulfilled via our integration with the Qikink Print-on-Demand API. Once an order is confirmed and payment is received, the design file is dispatched for printing. Cancellations are only accepted before the order reaches the "Processing & Print" stage.

3. RETURNS & REFUNDS
Defective or misprinted products are eligible for a full reprint or refund within 7 days of delivery. Size exchange requests are evaluated case-by-case.

4. ACCOUNTS
User accounts are personal and non-transferable. PrintHub reserves the right to suspend accounts that violate these terms.`);

  const [privacy, setPrivacy] = useState(`At PrintHub, we are committed to protecting your personal data.

1. DATA WE COLLECT
We collect design assets, customer delivery coordinates, and payment metadata exclusively to process and fulfill customized merchandise orders.

2. HOW WE USE IT
Your information is used to: (a) process and deliver your orders, (b) provide customer support, (c) send order status notifications, and (d) improve our platform experience.

3. DATA SHARING
We share necessary data with our printing and logistics partners (Qikink API, courier services) only to the extent required to fulfill your order. Your credentials are never sold or shared with third-party marketing platforms.

4. SECURITY
All sensitive payment data is processed through PCI-compliant gateways. We do not store card numbers or CVVs.

5. YOUR RIGHTS
You may request access, correction, or deletion of your personal data by contacting our support team.`);

  const [saving, setSaving] = useState<"" | "terms" | "privacy" | "both">("");

  const handleSave = async (section: "terms" | "privacy" | "both") => {
    setSaving(section);
    await new Promise((r) => setTimeout(r, 700));
    setSaving("");
    const label = section === "both" ? "All legal policies" : section === "terms" ? "Terms of Service" : "Privacy Policy";
    showToast("Policies Saved", `${label} updated successfully.`, "success");
  };

  const textareaCls = "w-full bg-[#FDFAF6] border border-zinc-200 rounded-xl py-4 px-5 text-xs text-zinc-700 leading-relaxed outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/10 resize-none transition-all font-mono";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Terms & Privacy" subtitle="Edit legal policy content for the storefront" />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6 max-w-full mx-auto w-full">

        {/* Terms of Service */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#F9A37E]/15 flex items-center justify-center">
                <FileText className="w-4 h-4 text-[#F9A37E]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900">Terms of Service</h3>
                <p className="text-[10px] text-zinc-400">Displayed on the /terms page of the storefront</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("terms")}
              disabled={saving === "terms"}
              className="flex items-center gap-1.5 bg-[#F9A37E] hover:bg-[#e8855a] disabled:opacity-60 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition-all shadow-sm shadow-[#F9A37E]/20"
            >
              <Save className="w-3.5 h-3.5" />
              {saving === "terms" ? "Saving..." : "Save Terms"}
            </button>
          </div>
          <div className="p-5">
            <textarea
              rows={14}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className={textareaCls}
            />
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#A8C69F]/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-[#A8C69F]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900">Privacy Policy</h3>
                <p className="text-[10px] text-zinc-400">Displayed on the /privacy page of the storefront</p>
              </div>
            </div>
            <button
              onClick={() => handleSave("privacy")}
              disabled={saving === "privacy"}
              className="flex items-center gap-1.5 bg-[#A8C69F] hover:bg-[#7dab73] disabled:opacity-60 text-white font-extrabold text-xs py-2 px-4 rounded-xl transition-all shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              {saving === "privacy" ? "Saving..." : "Save Privacy"}
            </button>
          </div>
          <div className="p-5">
            <textarea
              rows={14}
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
              className={textareaCls}
            />
          </div>
        </div>

        {/* Save Both */}
        <div className="flex justify-end pb-8">
          <button
            onClick={() => handleSave("both")}
            disabled={!!saving}
            className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-60 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md"
          >
            <Save className="w-4 h-4" />
            {saving === "both" ? "Publishing..." : "Publish All Changes"}
          </button>
        </div>
      </main>
    </div>
  );
}
