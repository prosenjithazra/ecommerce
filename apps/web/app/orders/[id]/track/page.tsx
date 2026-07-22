"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '../../../../components/AppContext';
import { Breadcrumb } from '../../../../components/UIComponents';
import { Truck, CheckCircle2, Clock, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getApiUrl } from '../../../../components/ApiConfig';

export default function TrackOrderPage() {
  const params = useParams();
  const { orders } = useApp();
  const [order, setOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const orderId = (params?.id as string) || "";

  useEffect(() => {
    // 1. Look in context orders
    const found = orders.find(o => o.id === orderId);
    if (found) {
      setOrder(found);
      setLoading(false);
      return;
    }

    // 2. Fetch directly from backend
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
          itemsJson: o.itemsJson,
          email: o.email
        };
        setOrder(mapped);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching tracking info:", err);
        setOrder(null);
        setLoading(false);
      });
  }, [orderId, orders]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
        <p className="text-xs text-zinc-450 font-bold">Loading tracking information...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link href="/profile" className="text-[#F9A37E] hover:text-[#e8855a] font-bold hover:underline">Back to Profile</Link>
      </div>
    );
  }

  // Calculate timeline progress dynamically
  const statusOrder = ["Pending", "Processing", "Shipped", "Delivered"];
  const currentIdx = statusOrder.indexOf(order.status);

  const timeline = order.trackingTimeline || [
    { status: "Order Placed", date: order.date, desc: "Order confirmed and logged.", done: currentIdx >= 0 || order.status === 'Cancelled' || order.status === 'Returned' },
    { status: "Processing & Print", date: "Estimated Tomorrow", desc: "Design printing onto base blank.", done: currentIdx >= 1 },
    { status: "Shipped", date: "Estimated 2 days", desc: "Dispatched via courier partner.", done: currentIdx >= 2 },
    { status: "Delivered", date: "Estimated 5 days", desc: "Package delivered at doorstep.", done: currentIdx >= 3 }
  ];

  // Derive dynamic tracking ID and courier info
  const dynamicTrackingId = order.trackingNumber || `TRK-${order.id.replace('ORD-', '')}`;
  const customerName = order.address?.fullName || order.customer || order.email || "Customer";
  const addressLine = order.address?.street
    ? `${order.address.street}, ${order.address.city || ''} ${order.address.state || ''} ${order.address.zip || ''} ${order.address.country || ''}`
    : `Shipping details logged on order invoice (${order.email || 'Registered Email'})`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 pb-8 sm:pb-16">
      <Breadcrumb items={[{ name: "My Profile", href: "/profile" }, { name: `Order ${order.id}`, href: `/orders/${order.id}` }, { name: "Track" }]} />

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-[#F9A37E] uppercase tracking-wider flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Courier: Standard Express Partner
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Track Package
        </h1>
        <p className="text-xs text-zinc-500">
          Tracking ID: <span className="font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">{dynamicTrackingId}</span>
        </p>
      </div>

      {order.status === 'Cancelled' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-bold">
          ⚠️ Notice: Order {order.id} has been Cancelled.
        </div>
      )}

      {order.status === 'Returned' && (
        <div className="p-4 bg-violet-50 border border-violet-200 text-violet-750 rounded-lg text-xs font-bold">
          ℹ️ Notice: Order {order.id} has been Returned.
        </div>
      )}

      {/* Main timeline tracker */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-3 sm:p-10 shadow">
        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-2 sm:ml-3 pl-4 sm:pl-6 sm:pl-8 space-y-5 sm:space-y-8 py-1 sm:py-2">
          
          {timeline.map((step: any, index: number) => (
            <div key={index} className="relative">
              {/* Timeline circle icon */}
              <span className={`absolute -left-[30px] sm:-left-[48px] top-0 sm:top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-white dark:bg-zinc-900 ${step.done ? 'text-emerald-500' : 'text-zinc-300 dark:border-zinc-800'}`}>
                {step.done ? (
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-5 sm:h-5 fill-white dark:fill-zinc-900" />
                ) : (
                  <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                )}
              </span>

              {/* Step info */}
              <div className="space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
                  <h4 className={`font-extrabold text-xs sm:text-sm ${step.done ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                    {step.status}
                  </h4>
                  <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium">{step.date}</span>
                </div>
                <p className="text-[11px] sm:text-xs text-zinc-550 dark:text-zinc-400 leading-normal max-w-lg">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      {/* Delivery Summary destination */}
      <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-800 rounded-lg p-3 sm:p-4 sm:p-6 flex gap-3 sm:gap-4 items-start">
        <MapPin className="w-6 h-6 text-[#F9A37E] mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <span className="font-extrabold text-zinc-900 dark:text-white block">Delivery Destination</span>
          <p className="text-zinc-800 dark:text-zinc-200 font-bold">{customerName}</p>
          <p className="text-zinc-500 dark:text-zinc-400">{addressLine}</p>
        </div>
      </div>
    </div>
  );
}
