"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '../../../components/AppContext';
import { Breadcrumb, StatusBadge, ConfirmDialog } from '../../../components/UIComponents';
import { Download, Calendar, Truck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CustomGarmentPreview } from '../../../components/CustomGarmentPreview';
import { getApiUrl } from '../../../components/ApiConfig';
import { printPdfInvoice } from '../../../utils/invoiceGenerator';

export default function OrderDetailPage() {
  const params = useParams();
  const { orders, cancelOrder } = useApp();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = (params?.id as string) || "";

  useEffect(() => {
    // 1. First look in context orders
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setOrder(found);
      setLoading(false);
      return;
    }

    // 2. Fetch directly from the backend API if not in context
    setLoading(true);
    fetch(getApiUrl(`/orders/${orderId}`))
      .then(res => {
        if (!res.ok) throw new Error("Order not found");
        return res.text().then(text => text ? JSON.parse(text) : null);
      })
      .then(o => {
        if (!o) {
          setOrder(null);
          setLoading(false);
          return;
        }
        // Map backend order structure
        const mapped = {
          id: o.id,
          date: o.date || new Date(o.createdAt).toLocaleDateString(),
          status: o.status,
          total: Number(o.total || 0),
          address: o.itemsJson && Array.isArray(o.itemsJson) && o.itemsJson[0]?.address ? o.itemsJson[0].address : {
            id: 'default', fullName: o.customer || 'Customer', street: 'Address details on invoice', city: '', state: '', zip: '', country: '', phone: '', isDefault: true
          },
          paymentMethod: o.paymentMethod || 'CARD',
          paymentId: o.paymentId,
          paymentStatus: o.paymentStatus,
          trackingNumber: o.trackingNumber,
          trackingTimeline: o.trackingTimeline,
          cancelReason: o.cancelReason,
          returnReason: o.returnReason,
          items: o.itemsJson && Array.isArray(o.itemsJson) ? o.itemsJson.map((it: any) => ({
            productId: it.productId,
            name: it.name,
            price: Number(it.price || 0),
            quantity: Number(it.quantity || 1),
            image: it.image,
            size: it.size,
            color: it.color,
            colorHex: it.colorHex,
            category: it.category,
            customDesign: it.customDesign
          })) : [
            { productId: 'standard', name: 'Order Item', price: o.total, quantity: o.items || 1, image: '/kliamologoNew.png', size: 'M', color: 'White' }
          ],
          itemsJson: o.itemsJson,
          email: o.email
        };
        setOrder(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching order:", err);
        setOrder(null);
        setLoading(false);
      });
  }, [orderId, orders]);

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirm = window.confirm("Are you sure you want to cancel this order? Note: A 20% cancellation fee will be deducted from your refund.");
    if (!confirm) return;
    const reason = window.prompt("Please enter a reason for cancellation:") || "Cancelled by customer";
    try {
      await cancelOrder(order.id, reason);
      setOrder((prev: any) => prev ? { ...prev, status: 'Cancelled', cancelReason: reason } : null);
    } catch (e) {
      // already handles error inside cancelOrder toast
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        <p className="text-xs text-zinc-400 font-bold">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link href="/profile" className="text-[#F9A37E] hover:text-[#e8855a] hover:underline font-bold">Back to Profile</Link>
      </div>
    );
  }

  const isCancellable = order.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 pb-12 sm:pb-16">
      <Breadcrumb items={[{ name: "My Profile", href: "/profile" }, { name: `Order ${order.id}` }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight" style={{
                fontFamily: "'Faculty Glyphic', sans-serif",}}>{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-zinc-450 flex items-center gap-1.5 mt-1">
            <Calendar className="w-3.5 h-3.5" /> Ordered on {order.date}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => printPdfInvoice(order)}
            className="w-full sm:w-auto justify-center border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-[#F9A37E]" /> Download Invoice
          </button>
          <Link
            href={`/orders/${order.id}/track`}
            className="w-full sm:w-auto justify-center bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-2.5 px-4 rounded-lg transition-all flex items-center gap-1.5 text-center"
          >
            <Truck className="w-4 h-4" /> Track Shipment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        
        {/* Left 2 Columns: Items & Address */}
        <div className="md:col-span-2 space-y-3 sm:space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-1.5 border-b border-zinc-100 dark:border-zinc-850">Items in this shipment</h3>
            <div className="divide-y divide-zinc-150 dark:divide-zinc-800 space-y-4">
              {order.items.map((item: any, index: number) => {
                const itemJson = order.itemsJson && Array.isArray(order.itemsJson) ? order.itemsJson[index] : null;
                const design = itemJson?.customDesign || item.customDesign;
                let designMeta: any = null;
                if (design?.baseImage) {
                  if (typeof design.baseImage === 'string') {
                    try { designMeta = JSON.parse(design.baseImage); } catch {}
                  } else {
                    designMeta = design.baseImage;
                  }
                }
                if (!designMeta && design && typeof design === 'object') {
                  designMeta = design;
                }

                const sizeQuantities = designMeta?.sizeQuantities;
                const sizeSummary = sizeQuantities
                  ? Object.entries(sizeQuantities)
                      .filter(([_, q]: any) => Number(q) > 0)
                      .map(([s, q]: any) => `${s}: ${q}`)
                      .join(', ')
                  : null;

                return (
                  <div key={index} className="pt-4 first:pt-0 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex gap-3 sm:gap-4 items-center w-full sm:w-auto">
                        <CustomGarmentPreview
                          customDesign={design}
                          defaultImage={item.image}
                          view="both"
                          className="w-14 h-14 sm:w-20 sm:h-20"
                          showMarkers={true}
                        />
                        <div className="flex-1 min-w-0 sm:hidden">
                          <h4 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200 truncate">{item.name}</h4>
                          <p className="text-[10px] text-zinc-500 mt-0.5">
                            Size: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.size}</span> · Qty: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.quantity}</span>
                          </p>
                          <span className="font-black text-xs text-zinc-900 dark:text-white mt-1 block">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="hidden sm:block flex-1 min-w-0">
                        <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 truncate">{item.name}</h4>
                        <p className="text-xs text-zinc-500 mt-1">
                          Size: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.size}</span> | Color: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.color}</span> | Quantity: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.quantity}</span>
                        </p>
                        {sizeSummary && (
                          <p className="text-[11px] text-[#e8855a] font-bold mt-1.5 bg-[#FDFAF6] px-2 py-0.5 rounded-md inline-block border border-[#F9A37E]/30">
                            Size Breakdown: {sizeSummary}
                          </p>
                        )}
                      </div>
                      <span className="hidden sm:block font-black text-sm text-zinc-900 dark:text-white">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                      {/* Mobile extra details */}
                      <div className="w-full sm:hidden pt-1.5 border-t border-zinc-100 dark:border-zinc-800 space-y-1 text-[10px] text-zinc-500">
                        <p>Color: <span className="font-bold text-zinc-700 dark:text-zinc-300">{item.color}</span></p>
                        {sizeSummary && (
                          <p className="text-[10px] text-[#e8855a] font-bold bg-[#FDFAF6] px-2 py-0.5 rounded-md inline-block border border-[#F9A37E]/30 mt-1">
                            Size Breakdown: {sizeSummary}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery destination */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 space-y-2.5 sm:space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-1.5 border-b border-zinc-100 dark:border-zinc-850">Shipping Information</h3>
            <div className="space-y-1 text-zinc-500 dark:text-zinc-400 font-medium">
              <p className="font-extrabold text-zinc-850 dark:text-zinc-250">{order.address.fullName}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zip}, {order.address.country}</p>
              <p className="pt-1.5 sm:pt-2">Phone: {order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment summaries */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 shadow-xs space-y-3 sm:space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-2 border-b border-zinc-150">Payment Breakdown</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Payment Method</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250 uppercase">
                  {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                </span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250">₹{(order.total / 1.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500 font-medium">
                <span>Tax / GST (18%)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250">₹{(order.total - order.total / 1.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-150 dark:border-zinc-800 font-extrabold text-sm text-zinc-900 dark:text-white">
                <span>Total Amount Paid</span>
                <span className="text-[#e8855a] dark:text-[#F9A37E] font-black">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Option */}
          {isCancellable && (
            <button
              onClick={() => setCancelOpen(true)}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 py-2.5 sm:py-3 rounded-lg text-xs font-extrabold transition-all cursor-pointer shadow-xs border border-rose-100 dark:border-rose-950/50"
            >
              Cancel Order
            </button>
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={handleCancelOrder}
        title="Cancel Custom Order?"
        description="Are you sure you want to cancel this order? This will process an immediate refund of your transactions minus a 20% processing fee."
      />
    </div>
  );
}
