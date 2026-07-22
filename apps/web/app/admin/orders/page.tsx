"use client";

import { useState, useEffect } from "react";
import { AdminTopbar } from "../AdminSidebar";
import { Search, Loader2, X, ShoppingBag, Mail, Calendar, CreditCard, Tag, Download, ExternalLink, Eye } from "lucide-react";
import { useApp } from "../../../components/AppContext";
import { getApiUrl } from "../../../components/ApiConfig";
import { CustomGarmentPreview } from "../../../components/CustomGarmentPreview";

const STATUS_OPTIONS = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"];
const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Processing: "bg-amber-50 text-amber-700 border-amber-100",
  Pending: "bg-zinc-100 text-zinc-600 border-zinc-200",
  Shipped: "bg-sky-50 text-sky-700 border-sky-100",
  Cancelled: "bg-red-50 text-red-650 border-red-100",
  Returned: "bg-violet-50 text-violet-700 border-violet-100",
};

interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  items: number;
  total: number;
  status: string;
  itemsJson?: any;
  paymentMethod?: string;
  paymentId?: string;
  paymentStatus?: string;
  cancelReason?: string;
  returnReason?: string;
}

export default function AdminOrdersPage() {
  const { showToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  
  // Selected order details drawer state
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showRawJson, setShowRawJson] = useState(false);

  useEffect(() => {
    fetch(getApiUrl("/orders"))
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load orders");
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to load orders.", "error");
        setOrders([]);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id: string, status: string) => {
    fetch(getApiUrl(`/orders/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to update order status");
      })
      .then(updatedOrder => {
        setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: updatedOrder.status } : o));
        
        // Update selectedOrder if open
        if (selectedOrder?.id === id) {
          setSelectedOrder(prev => prev ? { ...prev, status } : null);
        }
        
        showToast("Status Updated", `Order ${id} status changed to ${status}.`, "success");
      })
      .catch(err => {
        showToast("Error", err.message || "Failed to update status.", "error");
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <AdminTopbar title="Orders" subtitle="Loading..." />
        <main className="flex-1 flex items-center justify-center p-8 bg-[#FDFAF6]">
          <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden relative">
      <AdminTopbar title="Orders" subtitle={`${orders.length} total orders`} />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-xs font-medium bg-white border border-zinc-200 rounded-lg outline-none focus:border-[#F9A37E] transition-colors text-zinc-700 placeholder:text-zinc-400"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["All", ...STATUS_OPTIONS].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg border transition-all ${filterStatus === s ? "bg-[#F9A37E]/15 border-[#F9A37E] text-[#e8855a]" : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
          {STATUS_OPTIONS.map((s) => {
            const count = orders.filter((o) => o.status === s).length;
            return (
              <div key={s} className="bg-white border border-zinc-200 rounded-lg px-4 py-3 text-center shadow-sm">
                <p className="text-2xl font-black text-zinc-900">{count}</p>
                <p className="text-[10px] font-bold text-zinc-400 mt-0.5">{s}</p>
              </div>
            );
          })}
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-zinc-200 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  {["Order ID", "Customer", "Date", "Items", "Total", "Status", "Actions"].map((h) => (
                    <th key={h} className="py-3.5 px-5 font-extrabold text-zinc-500 text-[10px] uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map((o) => (
                  <tr 
                    key={o.id} 
                    className="hover:bg-zinc-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedOrder(o)}
                  >
                    <td className="py-4 px-5 font-extrabold text-zinc-900">{o.id}</td>
                    <td className="py-4 px-5">
                      <span className="font-bold text-zinc-900 block">{o.customer}</span>
                      <span className="text-zinc-400 text-[10px]">{o.email}</span>
                    </td>
                    <td className="py-4 px-5 text-zinc-500">{o.date}</td>
                    <td className="py-4 px-5 font-bold text-zinc-700">{o.items} items</td>
                    <td className="py-4 px-5 font-black text-zinc-900">₹{o.total.toLocaleString()}</td>
                    <td className="py-4 px-5">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLES[o.status]}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-5" onClick={(e) => e.stopPropagation()}>
                      <div className="relative inline-block w-28">
                        <select
                          value={o.status}
                          onChange={(e) => updateStatus(o.id, e.target.value)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg py-1.5 pl-2.5 pr-8 text-[10px] font-black text-zinc-700 outline-none hover:border-[#F9A37E] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1rem_1rem] bg-[right_0.4rem_center] bg-no-repeat"
                        >
                          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <p className="py-12 text-center text-zinc-400 text-sm font-bold">No orders match your search.</p>
          )}
        </div>
      </main>

      {/* ── DETAILED ORDER OVERLAY DRAWER ── */}
      {selectedOrder && (
        <div className="absolute inset-0 z-30 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/30 transition-opacity" 
            onClick={() => { setSelectedOrder(null); setShowRawJson(false); }} 
          />
          <div className="relative w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200 animate-slide-in-right">
            
            {/* Header */}
            <div className="p-5 border-b border-zinc-150 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900">Order Details</h3>
                <p className="text-[10px] text-zinc-400 font-bold mt-0.5">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => { setSelectedOrder(null); setShowRawJson(false); }}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* Order Status Control */}
              <div className="bg-[#FDFAF6] border border-zinc-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase">Current Status</span>
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLES[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-zinc-650">Change Status:</span>
                  <div className="relative flex-1">
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                      className="w-full bg-white border border-zinc-200 rounded-lg py-2 pl-3 pr-10 text-xs font-bold text-zinc-700 outline-none hover:border-[#F9A37E] transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.1rem_1.1rem] bg-[right_0.5rem_center] bg-no-repeat"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                {/* Conditional cancellation details */}
                {selectedOrder.status === 'Cancelled' && selectedOrder.cancelReason && (
                  <div className="border-t border-red-100/60 pt-2.5 text-[10px] font-bold text-red-600 bg-red-50/20 p-2.5 rounded-lg border border-red-100/40">
                    Reason for Cancellation: <span className="font-extrabold text-red-705">{selectedOrder.cancelReason}</span>
                  </div>
                )}

                {/* Conditional return details */}
                {selectedOrder.status === 'Returned' && selectedOrder.returnReason && (
                  <div className="border-t border-violet-100/60 pt-2.5 text-[10px] font-bold text-violet-650 bg-violet-50/20 p-2.5 rounded-lg border border-violet-100/40">
                    Reason for Return: <span className="font-extrabold text-violet-700">{selectedOrder.returnReason}</span>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Customer Info</h4>
                <div className="space-y-2 text-xs font-medium text-zinc-700">
                  <div className="flex items-center gap-2.5">
                    <ShoppingBag className="w-4 h-4 text-zinc-400" />
                    <span>{selectedOrder.customer}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>{selectedOrder.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-zinc-400" />
                    <span>Ordered on {selectedOrder.date}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-zinc-400" />
                    <span className="font-extrabold">Total paid: ₹{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="bg-[#FDFAF6] border border-zinc-200 rounded-xl p-4 space-y-3">
                <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Payment Details</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Method</span>
                    <span className="font-extrabold text-zinc-800 uppercase">
                      {selectedOrder.paymentMethod === 'COD' ? 'COD' : 'Online'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block font-bold">Status</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wide inline-block ${
                      selectedOrder.paymentStatus === 'Paid' || selectedOrder.paymentStatus === 'Success'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : selectedOrder.paymentStatus === 'Refunded'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                    }`}>
                      {selectedOrder.paymentStatus || 'Pending'}
                    </span>
                  </div>
                  {selectedOrder.paymentId && (
                    <div className="col-span-2 border-t border-zinc-200/60 pt-2">
                      <span className="text-[10px] text-zinc-450 block font-bold">Transaction / Payment ID</span>
                      <span className="font-mono text-xs text-zinc-700 select-all">{selectedOrder.paymentId}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3 pt-2">
                <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider">Items in Order</h4>
                
                {selectedOrder.itemsJson && Array.isArray(selectedOrder.itemsJson) ? (
                  <div className="space-y-3">
                    {selectedOrder.itemsJson.map((item: any, i: number) => {
                      let designMeta: any = null;
                      const baseImg = item.customDesign?.baseImage;
                      if (baseImg) {
                        if (typeof baseImg === 'string') {
                          try {
                            designMeta = JSON.parse(baseImg);
                          } catch {
                            designMeta = null;
                          }
                        } else if (typeof baseImg === 'object') {
                          designMeta = baseImg;
                        }
                      }
                      if (!designMeta && item.customDesign && typeof item.customDesign === 'object') {
                        designMeta = item.customDesign;
                      }

                      const triggerDownload = (url: string, filename: string) => {
                        if (!url) return;
                        if (url.startsWith('data:')) {
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          return;
                        }
                        const downloadUrl = `/api/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
                        const a = document.createElement('a');
                        a.href = downloadUrl;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                      };

                      const generateRealViewMockupPng = async (
                        garmentType: string = 'tshirt',
                        colorHex: string = '#FFFFFF',
                        view: 'front' | 'back' = 'front',
                        artworkUrl?: string
                      ): Promise<string> => {
                        return new Promise((resolve) => {
                          const isPolo = garmentType === 'polo';
                          const isBack = view === 'back';
                          const isWhite = !colorHex || colorHex.toUpperCase() === '#FFFFFF' || colorHex.toUpperCase() === '#FFF';

                          const baseImgSrc = isPolo
                            ? (isBack ? '/poloTshirtBack.png' : '/poloTshirtFront.png')
                            : (isBack ? '/whiteTshirtBack.png' : '/whiteTshirtFront.png');

                          const canvas = document.createElement('canvas');
                          canvas.width = 800;
                          canvas.height = 800;
                          const ctx = canvas.getContext('2d');
                          if (!ctx) return resolve('');

                          const baseImg = new Image();
                          baseImg.crossOrigin = 'anonymous';
                          baseImg.src = baseImgSrc;

                          baseImg.onload = () => {
                            if (!isWhite) {
                              ctx.drawImage(baseImg, 0, 0, 800, 800);
                              ctx.globalCompositeOperation = 'source-in';
                              ctx.fillStyle = colorHex;
                              ctx.fillRect(0, 0, 800, 800);
                              ctx.globalCompositeOperation = 'multiply';
                              ctx.drawImage(baseImg, 0, 0, 800, 800);
                              ctx.globalCompositeOperation = 'source-over';
                            } else {
                              ctx.drawImage(baseImg, 0, 0, 800, 800);
                            }

                            if (!artworkUrl) {
                              return resolve(canvas.toDataURL('image/png'));
                            }

                            const artImg = new Image();
                            artImg.crossOrigin = 'anonymous';
                            artImg.src = artworkUrl;
                            artImg.onload = () => {
                              const printW = 336;
                              const printH = 384;
                              const printX = (800 - printW) / 2;
                              const printY = 200;

                              const scale = Math.min(printW / artImg.width, printH / artImg.height);
                              const drawW = artImg.width * scale;
                              const drawH = artImg.height * scale;
                              const drawX = printX + (printW - drawW) / 2;
                              const drawY = printY + (printH - drawH) / 2;

                              ctx.drawImage(artImg, drawX, drawY, drawW, drawH);
                              resolve(canvas.toDataURL('image/png'));
                            };
                            artImg.onerror = () => resolve(canvas.toDataURL('image/png'));
                          };
                          baseImg.onerror = () => resolve('');
                        });
                      };

                      const frontDesignUrl = designMeta?.frontDesignUrl || designMeta?.front?.imageUrl || item.customDesign?.frontDesignUrl;
                      const backDesignUrl = designMeta?.backDesignUrl || designMeta?.back?.imageUrl || item.customDesign?.backDesignUrl;
                      const rawFrontArtwork = designMeta?.rawFrontArtworkUrl || designMeta?.front?.rawArtworkUrl || frontDesignUrl;
                      const rawBackArtwork = designMeta?.rawBackArtworkUrl || designMeta?.back?.rawArtworkUrl || backDesignUrl;
                      const frontMockupUrl = designMeta?.frontMockupUrl || item.customDesign?.frontMockupUrl;
                      const backMockupUrl = designMeta?.backMockupUrl || item.customDesign?.backMockupUrl;

                      const hasFrontSide = !!(frontDesignUrl || frontMockupUrl || rawFrontArtwork);
                      const hasBackSide = !!(backDesignUrl || backMockupUrl || (rawBackArtwork && rawBackArtwork !== rawFrontArtwork));

                      const handleDownloadMockup = async (view: 'front' | 'back') => {
                        let targetUrl = view === 'front' ? frontMockupUrl : backMockupUrl;
                        if (!targetUrl) {
                          const dUrl = view === 'front' ? frontDesignUrl : backDesignUrl;
                          targetUrl = await generateRealViewMockupPng(
                            designMeta?.productType || 'tshirt',
                            designMeta?.colorHex || '#FFFFFF',
                            view,
                            dUrl
                          );
                        }
                        triggerDownload(targetUrl, `real_view_${view}_${selectedOrder.id}.png`);
                      };

                      return (
                        <div key={i} className="border border-zinc-200 rounded-xl p-3 bg-white space-y-3">
                          <div className="flex gap-3 items-center justify-between">
                            <div className="flex gap-3 items-center min-w-0">
                              <CustomGarmentPreview
                                customDesign={item.customDesign}
                                defaultImage={item.image}
                                view="front"
                                className="w-12 h-12"
                              />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-extrabold text-xs text-zinc-800 truncate">{item.name}</h5>
                                <p className="text-[10px] text-zinc-400 mt-0.5">
                                  Size: <span className="font-bold text-zinc-650">{item.size}</span> · Qty: <span className="font-bold text-zinc-650">{item.quantity}</span>
                                </p>
                                <p className="text-xs font-black text-zinc-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDownloadMockup('front')}
                              className="px-2.5 py-1.5 bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-[10px] rounded-lg transition-all flex items-center gap-1 shadow-xs flex-shrink-0 cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          </div>

                          {/* Dynamic Custom Mockups & Downloads */}
                          {(designMeta || item.customDesign || item.image) && (
                            <div className="p-3 bg-zinc-50 rounded-lg border border-dashed border-zinc-200 space-y-3">
                              <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-[#e8855a] uppercase">
                                <Tag className="w-3.5 h-3.5" />
                                <span>Custom Print Specifications</span>
                              </div>
                              
                              {/* Side-by-side composite previews with print markers */}
                              <div className="flex justify-center">
                                <CustomGarmentPreview
                                  customDesign={item.customDesign}
                                  defaultImage={item.image}
                                  view="both"
                                  className="w-20 h-20"
                                  showMarkers={true}
                                />
                              </div>

                              {/* Specs summary */}
                              {designMeta && (
                                <div className="text-[9px] text-zinc-500 space-y-1.5 border-t border-zinc-150 pt-2 font-medium">
                                  <p>Garment Style: <span className="font-extrabold capitalize text-zinc-800">{designMeta.productType === 'polo' ? 'Polo T-Shirt' : 'Crewneck T-Shirt'}</span></p>
                                  {designMeta.color && <p>Garment Color: <span className="font-extrabold text-zinc-800">{designMeta.color}</span> ({designMeta.colorHex})</p>}
                                  <p>Print Positions: <span className="font-extrabold text-[#e8855a]">{hasFrontSide && hasBackSide ? 'Front & Back Both Sides' : hasBackSide ? 'Back Side Only' : 'Front Side Only'}</span></p>
                                  {designMeta.sizeQuantities && (
                                    <p>Size Matrix: <span className="font-bold text-zinc-800">{
                                      Object.entries(designMeta.sizeQuantities)
                                        .filter(([_, q]: any) => Number(q) > 0)
                                        .map(([s, q]: any) => `${s}: ${q}`)
                                        .join(', ') || item.size
                                    }</span></p>
                                  )}
                                </div>
                              )}

                              {/* Real View Garment Mockups & Original Artwork Downloads */}
                              <div className="border-t border-zinc-150 pt-2.5 space-y-3">
                                {/* Real View Shirt Mockups Section */}
                                <div>
                                  <p className="text-[9px] font-black uppercase text-[#e8855a] tracking-wider mb-2 flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> Real View Product Mockup Downloads
                                  </p>
                                  <div className={`grid grid-cols-1 ${hasFrontSide && hasBackSide ? 'sm:grid-cols-1' : ''} gap-2`}>
                                    {hasFrontSide && (
                                      <div className="p-2.5 border border-zinc-200 rounded-xl bg-white flex flex-col items-center gap-2 shadow-xs">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase">Real View Front Product</span>
                                        <div className="w-24 h-24 border border-zinc-150 rounded-lg flex items-center justify-center bg-[#FDFAF6] overflow-hidden">
                                          {frontMockupUrl ? (
                                            <img src={frontMockupUrl} className="w-full h-full object-contain" alt="Real View Front" />
                                          ) : (
                                            <CustomGarmentPreview customDesign={item.customDesign} defaultImage={item.image} view="front" className="w-full h-full" />
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadMockup('front')}
                                          className="w-full text-center bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-[9px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                                        >
                                          <Download className="w-3 h-3" />
                                          Download Front Mockup
                                        </button>
                                      </div>
                                    )}

                                    {hasBackSide && (
                                      <div className="p-2.5 border border-zinc-200 rounded-xl bg-white flex flex-col items-center gap-2 shadow-xs">
                                        <span className="text-[9px] font-black text-zinc-600 uppercase">Real View Back Product</span>
                                        <div className="w-24 h-24 border border-zinc-150 rounded-lg flex items-center justify-center bg-[#FDFAF6] overflow-hidden">
                                          {backMockupUrl ? (
                                            <img src={backMockupUrl} className="w-full h-full object-contain" alt="Real View Back" />
                                          ) : (
                                            <CustomGarmentPreview customDesign={item.customDesign} defaultImage={item.image} view="back" className="w-full h-full" />
                                          )}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDownloadMockup('back')}
                                          className="w-full text-center bg-[#F9A37E] hover:bg-[#e8855a] text-white font-extrabold text-[9px] py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                                        >
                                          <Download className="w-3 h-3" />
                                          Download Back Mockup
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Original Print Artwork Section */}
                                <div>
                                  <p className="text-[9px] font-black uppercase text-zinc-500 tracking-wider mb-2">
                                    Original Artwork Files (Print Resolution PNG)
                                  </p>
                                  <div className={`grid grid-cols-1 ${hasFrontSide && hasBackSide ? 'sm:grid-cols-1' : ''} gap-2`}>
                                    {hasFrontSide && (rawFrontArtwork || frontDesignUrl) && (
                                      <div className="p-2 border border-zinc-200 rounded-lg bg-white flex flex-col items-center gap-1.5">
                                        <span className="text-[8px] font-bold text-zinc-400 uppercase">Front Artwork File</span>
                                        <div className="w-16 h-16 border border-zinc-150 rounded flex items-center justify-center bg-zinc-50 overflow-hidden">
                                          <img src={rawFrontArtwork || frontDesignUrl} className="w-full h-full object-contain" alt="Original Front Design" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => triggerDownload(rawFrontArtwork || frontDesignUrl, `print_front_artwork_${selectedOrder.id}.png`)}
                                          className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[9px] py-1 rounded border border-indigo-150 flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <Download className="w-2.5 h-2.5" />
                                          Download Front Artwork
                                        </button>
                                      </div>
                                    )}

                                    {hasBackSide && (rawBackArtwork || backDesignUrl) && (
                                      <div className="p-2 border border-zinc-200 rounded-lg bg-white flex flex-col items-center gap-1.5">
                                        <span className="text-[8px] font-bold text-zinc-400 uppercase">Back Artwork File</span>
                                        <div className="w-16 h-16 border border-zinc-150 rounded flex items-center justify-center bg-zinc-50 overflow-hidden">
                                          <img src={rawBackArtwork || backDesignUrl} className="w-full h-full object-contain" alt="Original Back Design" />
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => triggerDownload(rawBackArtwork || backDesignUrl, `print_back_artwork_${selectedOrder.id}.png`)}
                                          className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[9px] py-1 rounded border border-indigo-150 flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                          <Download className="w-2.5 h-2.5" />
                                          Download Back Artwork
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (hasFrontSide) {
                                      await handleDownloadMockup('front');
                                      if (rawFrontArtwork || frontDesignUrl) {
                                        triggerDownload(rawFrontArtwork || frontDesignUrl, `print_front_artwork_${selectedOrder.id}.png`);
                                      }
                                    }
                                    if (hasBackSide) {
                                      await handleDownloadMockup('back');
                                      if (rawBackArtwork || backDesignUrl) {
                                        triggerDownload(rawBackArtwork || backDesignUrl, `print_back_artwork_${selectedOrder.id}.png`);
                                      }
                                    }
                                  }}
                                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-[11px] py-2 px-1 rounded-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-3"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download All Items (Mockups & Artworks)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">No item details saved. Standard order format.</p>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
