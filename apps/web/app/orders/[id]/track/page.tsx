"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import { useApp } from '../../../../components/AppContext';
import { Breadcrumb } from '../../../../components/UIComponents';
import { Truck, CheckCircle2, Clock, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function TrackOrderPage() {
  const params = useParams();
  const { orders } = useApp();

  const orderId = (params?.id as string) || "";
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link href="/orders" className="text-indigo-650 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  // Fallback default timeline if not populated
  const timeline = order.trackingTimeline || [
    { status: "Order Placed", date: order.date, desc: "Order confirmed and logged.", done: true },
    { status: "Processing & Print", date: "Estimated Tomorrow", desc: "Design printing onto base blank.", done: false },
    { status: "Shipped", date: "Estimated 2 days", desc: "Dispatched via DHL Express.", done: false },
    { status: "Delivered", date: "Estimated 5 days", desc: "Package delivered at doorstep.", done: false }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "My Orders", href: "/orders" }, { name: order.id, href: `/orders/${order.id}` }, { name: "Track" }]} />

      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
          <Truck className="w-3.5 h-3.5" /> Courier: DHL Express
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Track Package
        </h1>
        <p className="text-xs text-zinc-450">
          Tracking ID: <span className="font-extrabold text-zinc-800 dark:text-zinc-200 font-mono">{order.trackingNumber || "TRK-2849301"}</span>
        </p>
      </div>

      {/* Main timeline tracker */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow">
        <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-3 pl-8 space-y-8 py-2">
          
          {timeline.map((step, index) => (
            <div key={index} className="relative">
              {/* Timeline circle icon */}
              <span className={`absolute -left-[45px] top-1.5 w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white dark:bg-zinc-900 ${step.done ? 'border-emerald-500 text-emerald-500' : 'border-zinc-200 text-zinc-300 dark:border-zinc-800'}`}>
                {step.done ? <CheckCircle2 className="w-5 h-5 fill-white dark:fill-zinc-900" /> : <Clock className="w-4 h-4" />}
              </span>

              {/* Step info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <h4 className={`font-extrabold text-sm ${step.done ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`}>
                    {step.status}
                  </h4>
                  <span className="text-[10px] text-zinc-400 font-medium">{step.date}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal max-w-lg">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
          
        </div>
      </div>

      {/* Delivery Summary destination */}
      <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-800 rounded-3xl p-6 flex gap-4 items-start">
        <MapPin className="w-6 h-6 text-indigo-500 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <span className="font-extrabold text-zinc-900 dark:text-white block">Delivery Destination</span>
          <p className="text-zinc-500 dark:text-zinc-400">{order.address.fullName}</p>
          <p className="text-zinc-550 dark:text-zinc-400">{order.address.street}, {order.address.city}, {order.address.state} {order.address.zip}</p>
        </div>
      </div>
    </div>
  );
}
