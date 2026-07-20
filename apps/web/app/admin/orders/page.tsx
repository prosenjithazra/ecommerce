"use client";

import { useState, useEffect } from "react";
import { AdminTopbar } from "../AdminSidebar";
import { Search, Loader2, X, ShoppingBag, Mail, Calendar, CreditCard, Tag, Download, ExternalLink } from "lucide-react";
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
                      const designStr = item.customDesign?.baseImage;
                      let designMeta = null;
                      if (designStr) {
                        try {
                          designMeta = JSON.parse(designStr);
                        } catch (err) {
                          console.warn("Error parsing design meta:", err);
                        }
                      }

                      return (
                        <div key={i} className="border border-zinc-200 rounded-xl p-3 bg-white space-y-3">
                          <div className="flex gap-3">
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

                          {/* Dynamic Custom Mockups */}
                          {designMeta && (
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
                              <div className="text-[9px] text-zinc-500 space-y-1 border-t border-zinc-150 pt-2 font-medium">
                                <p>Garment style: <span className="font-bold capitalize text-zinc-700">{designMeta.productType === 'polo' ? 'Polo T-Shirt' : 'T-Shirt'}</span></p>
                                <p>Color: <span className="font-bold text-zinc-700">{designMeta.color}</span> ({designMeta.colorHex})</p>
                                {designMeta.front?.imageUrl && (
                                  <p>Front Placement: <span className="font-mono font-bold text-zinc-700">X: {designMeta.front.imageX}% | Y: {designMeta.front.imageY}% | Scale: {designMeta.front.imageScale}% | Rot: {designMeta.front.imageRotation}°</span></p>
                                )}
                                {designMeta.back?.imageUrl && (
                                  <p>Back Placement: <span className="font-mono font-bold text-zinc-700">X: {designMeta.back.imageX}% | Y: {designMeta.back.imageY}% | Scale: {designMeta.back.imageScale}% | Rot: {designMeta.back.imageRotation}°</span></p>
                                )}
                              </div>

                              {/* Standalone original graphics download panel */}
                              <div className="border-t border-zinc-150 pt-2.5 space-y-2">
                                <p className="text-[8px] font-black uppercase text-zinc-400 tracking-wider">Original Graphic Files (Original Resolution)</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                  {designMeta.front?.imageUrl && (
                                    <div className="p-2 border border-zinc-200 rounded-lg bg-white flex flex-col items-center gap-1.5">
                                      <span className="text-[8px] font-bold text-zinc-400 uppercase">Front Artwork</span>
                                      <div className="w-12 h-12 border border-zinc-150 rounded flex items-center justify-center bg-zinc-50 overflow-hidden">
                                        <img src={designMeta.front.imageUrl} className="w-full h-full object-contain" alt="" />
                                      </div>
                                      <a
                                        href={designMeta.front.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[8px] py-1 rounded border border-indigo-150 flex items-center justify-center gap-1"
                                      >
                                        <Download className="w-2.5 h-2.5" />
                                        Download Original
                                      </a>
                                    </div>
                                  )}
                                  {designMeta.back?.imageUrl && (
                                    <div className="p-2 border border-zinc-200 rounded-lg bg-white flex flex-col items-center gap-1.5">
                                      <span className="text-[8px] font-bold text-zinc-400 uppercase">Back Artwork</span>
                                      <div className="w-12 h-12 border border-zinc-150 rounded flex items-center justify-center bg-zinc-50 overflow-hidden">
                                        <img src={designMeta.back.imageUrl} className="w-full h-full object-contain" alt="" />
                                      </div>
                                      <a
                                        href={designMeta.back.imageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full text-center bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-extrabold text-[8px] py-1 rounded border border-indigo-150 flex items-center justify-center gap-1"
                                      >
                                        <Download className="w-2.5 h-2.5" />
                                        Download Original
                                      </a>
                                    </div>
                                  )}
                                </div>
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
