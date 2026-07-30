"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Globe, Save, Code2, Printer, Terminal, CheckCircle2 as CheckCircle, Loader2 } from "lucide-react";
import { AdminTopbar } from "../AdminSidebar";
import { useApp, Product } from "../../../components/AppContext";

export default function AdminSettingsPage() {
  const { companySettings, updateCompanySettings, settingsLoading } = useApp();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    address: "",
    hours: "",
    twitterUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
    facebookUrl: "",
    customTshirtPrice: 599,
    customPoloPrice: 799,
    customShirtPrice: 999,
  });
  const [saving, setSaving] = useState(false);

  // Qikink API check state
  const [qikApiType, setQikApiType] = useState<'token' | 'create_order' | 'get_orders' | null>(null);
  const [qikApiResponse, setQikApiResponse] = useState<any>(null);
  const [qikLoading, setQikLoading] = useState(false);
  const [qikCopied, setQikCopied] = useState(false);

  const testQikinkApi = async (type: 'token' | 'create_order' | 'get_orders') => {
    setQikApiType(type);
    setQikLoading(true);
    setQikApiResponse(null);
    try {
      if (type === 'token') {
        const res = await fetch('/api/qikink/auth?refresh=true');
        const data = await res.json();
        setQikApiResponse(data);
      } else if (type === 'get_orders') {
        const res = await fetch('/api/qikink/orders');
        const data = await res.json();
        setQikApiResponse(data);
      } else if (type === 'create_order') {
        const sampleOrderNo = `QIK${Date.now().toString().slice(-8)}`;
        const testOrder = {
          order_number: sampleOrderNo,
          qikink_shipping: 1,
          gateway: 'Prepaid',
          total_order_value: 599,
          shipping_address: {
            first_name: 'Qikink',
            last_name: 'Customer',
            address1: '123 POD Innovation Hub',
            address2: 'Suite 4B',
            phone: '9876543210',
            email: 'partner@qikink.com',
            city: 'Bengaluru',
            zip: '560001',
            province: 'Karnataka',
            country_code: 'IN',
          },
          line_items: [
            {
              search_from_my_products: 0,
              quantity: 1,
              price: '599.00',
              sku: 'MVnHs-Wh-S',
              print_type_id: 1,
              designs: [
                {
                  design_code: 'iPhoneXR',
                  placement_sku: 'fr',
                  width_inches: '',
                  height_inches: '',
                  design_link: 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg',
                  mockup_link: 'https://sgp1.digitaloceanspaces.com/cdn.qikink.com/erp2/assets/designs/83/1696668376.jpg',
                },
              ],
            },
          ],
        };

        const res = await fetch('/api/qikink/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(testOrder),
        });
        const data = await res.json();
        setQikApiResponse(data);
      }
    } catch (err: any) {
      setQikApiResponse({ error: err.message || 'API request failed' });
    } finally {
      setQikLoading(false);
    }
  };

  useEffect(() => {
    if (companySettings) {
      setFormData({
        email: companySettings.email || "",
        phone: companySettings.phone || "",
        address: companySettings.address || "",
        hours: companySettings.hours || "",
        twitterUrl: companySettings.twitterUrl || "",
        youtubeUrl: companySettings.youtubeUrl || "",
        instagramUrl: companySettings.instagramUrl || "",
        facebookUrl: companySettings.facebookUrl || "",
        customTshirtPrice: companySettings.customTshirtPrice || 599,
        customPoloPrice: companySettings.customPoloPrice || 799,
        customShirtPrice: companySettings.customShirtPrice || 999,
      });
    }
  }, [companySettings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateCompanySettings(formData);
    setSaving(false);
  };

  if (settingsLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Store Settings" subtitle="Loading configuration..." />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-zinc-50/50 space-y-6">
          <div className="max-w-4xl mx-auto bg-white border border-zinc-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-1/4 bg-zinc-200 rounded" />
              <div className="h-3 w-1/2 bg-zinc-100 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-1/3 bg-zinc-200 rounded" />
                  <div className="h-10 w-full bg-zinc-50 border border-zinc-100 rounded-lg" />
                </div>
              ))}
            </div>
            <div className="border-t border-zinc-150 pt-8 space-y-2">
              <div className="h-4 w-1/4 bg-zinc-200 rounded" />
              <div className="h-3 w-1/2 bg-zinc-100 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-3 w-1/2 bg-zinc-200 rounded" />
                    <div className="h-10 w-full bg-zinc-50 border border-zinc-100 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <AdminTopbar title="Store Settings" subtitle="Configure global storefront metadata, contact cards, and social handles" />

      <main className="flex-1 overflow-y-auto p-5 sm:p-8 bg-zinc-50/50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
          
          {/* Main Card */}
          <div className="bg-white border border-zinc-200 rounded-lg shadow-sm p-6 sm:p-8 space-y-8">
            <div className="flex justify-between items-start gap-2 flex-wrap">
              <div>
                <h3 className="font-extrabold text-sm text-[#4A453E] uppercase tracking-wider mb-1">Contact Details</h3>
                <p className="text-xs text-zinc-450">These values populate in the footer, contact page cards, and header banners dynamically.</p>
              </div>
              {useApp().settingsResponseTime !== null && (
                <span className="text-[9px] font-extrabold text-zinc-400 bg-zinc-50 border border-zinc-200 rounded-full px-2.5 py-1 tracking-wider uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  API Latency: {useApp().settingsResponseTime}ms
                </span>
              )}
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
                  placeholder="support@kliamofashion.com"
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
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
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
                />
              </div>
            </div>

            <div className="border-t border-zinc-150 pt-8">
              <h3 className="font-extrabold text-sm text-[#4A453E] uppercase tracking-wider mb-1">Social Media Profiles</h3>
              <p className="text-xs text-zinc-450 mb-6">Enter URLs for custom brand redirection links.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Facebook */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" /> Facebook Link
                  </label>
                  <input
                    type="url"
                    value={formData.facebookUrl}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/kliamo"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
                  />
                </div>

                {/* YouTube */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-zinc-400" /> YouTube Link
                  </label>
                  <input
                    type="url"
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@kliamo"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
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
                    placeholder="https://instagram.com/kliamo"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-150 pt-8">
              <h3 className="font-extrabold text-sm text-[#4A453E] uppercase tracking-wider mb-1">Custom Design Garment Prices</h3>
              <p className="text-xs text-zinc-450 mb-6">Set base pricing (in ₹) for custom blank items in the online design creator studio workspace.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* T-Shirt Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650">
                    Custom T-Shirt Base Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.customTshirtPrice}
                    onChange={(e) => setFormData({ ...formData, customTshirtPrice: parseInt(e.target.value) || 0 })}
                    placeholder="599"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
                  />
                </div>

                {/* Polo Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650">
                    Custom Polo Base Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.customPoloPrice}
                    onChange={(e) => setFormData({ ...formData, customPoloPrice: parseInt(e.target.value) || 0 })}
                    placeholder="799"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
                  />
                </div>

                {/* Shirt Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-650">
                    Custom Casual Shirt Base Price (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.customShirtPrice}
                    onChange={(e) => setFormData({ ...formData, customShirtPrice: parseInt(e.target.value) || 0 })}
                    placeholder="999"
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-2.5 px-3 text-xs outline-none focus:border-[#df794d] text-zinc-800 font-medium"
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
              className="bg-[#df794d] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-8 rounded-lg transition-all shadow-md shadow-[#df794d]/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* ── QIKINK DASHBOARD LINKAGE GUIDE CARD ── */}
        <div className="max-w-4xl mx-auto mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 border-b border-amber-200/60 pb-3">
            <div className="p-2 bg-amber-500/20 text-amber-800 rounded-lg shrink-0 font-bold">
              ⚡
            </div>
            <div>
              <h3 className="font-extrabold text-amber-950 text-sm">Fixing "No store is linked to your account" & Product Push Setup</h3>
              <p className="text-xs text-amber-800 font-medium">Follow these official steps to link your Qikink seller account with your website:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-amber-900 font-medium">
            <div className="bg-white/80 border border-amber-200 rounded-lg p-4 space-y-2">
              <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                Link Store on Qikink Dashboard
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed text-amber-900">
                <li>Log in to your account at <a href="https://dashboard.qikink.com" target="_blank" rel="noreferrer" className="underline font-bold text-amber-800 hover:text-amber-950">dashboard.qikink.com</a>.</li>
                <li>Go to <strong>Integrations</strong> → <strong>Custom API</strong>.</li>
                <li>Click <strong>Add Store / Create Integration</strong>.</li>
                <li>Enter your Store URL and copy your <strong>ClientId</strong> &amp; <strong>Client Secret</strong>.</li>
              </ol>
            </div>

            <div className="bg-white/80 border border-amber-200 rounded-lg p-4 space-y-2">
              <h4 className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <span className="w-5 h-5 bg-amber-500 text-white rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                Product & Order Push Workflow
              </h4>
              <ul className="list-disc list-inside space-y-1 text-[11px] leading-relaxed text-amber-900">
                <li>Products created in your site's Admin Panel are stored dynamically in your store database.</li>
                <li>When customers place an order, your site automatically packages product images, designs, and mockups (<code>search_from_my_products: 0</code>).</li>
                <li>Qikink prints and fulfills every product directly without needing pre-created dashboard SKUs!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── QIKINK PRINT-ON-DEMAND INTEGRATION API CHECK ── */}
        <div className="max-w-4xl mx-auto mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-white shadow-xl space-y-6">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase mb-2">
                Live Qikink Custom API Status Check
              </div>
              <h3 className="text-base font-extrabold text-white">Qikink API Integration Console</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Verify authorization status, query order history, and submit live test transactions directly to Qikink.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => testQikinkApi('token')}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Code2 className="w-3.5 h-3.5" />
                Auth Token
              </button>
              <button
                onClick={() => testQikinkApi('create_order')}
                className="px-3 py-1.5 bg-[#df794d] hover:bg-[#e8855a] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Submit Test Order
              </button>
              <button
                onClick={() => testQikinkApi('get_orders')}
                className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-bold transition-all border border-zinc-750 flex items-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-3.5 h-3.5 text-amber-300" />
                Sync Orders
              </button>
            </div>
          </div>

          {/* Tester API response console output */}
          {qikApiType && (
            <div className="bg-zinc-950 rounded-xl border border-zinc-850 p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[10px] text-zinc-400 border-b border-zinc-900 pb-2">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
                  <CheckCircle className="w-3.5 h-3.5" />
                  API Command: {qikApiType === 'token' ? 'POST /api/token' : qikApiType === 'create_order' ? 'POST /api/order/create' : 'GET /api/order'}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(qikApiResponse, null, 2));
                    setQikCopied(true);
                    setTimeout(() => setQikCopied(false), 2000);
                  }}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white rounded border border-zinc-800 transition-colors cursor-pointer"
                >
                  {qikCopied ? 'Copied!' : 'Copy JSON'}
                </button>
              </div>

              {qikLoading ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                  <span className="text-[11px] text-zinc-400">Requesting Qikink Live API...</span>
                </div>
              ) : qikApiResponse ? (
                <pre className="text-emerald-400 overflow-x-auto text-[11px] leading-relaxed max-h-[300px] overflow-y-auto">
                  {JSON.stringify(qikApiResponse, null, 2)}
                </pre>
              ) : null}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
