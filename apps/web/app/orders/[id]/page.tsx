"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '../../../components/AppContext';
import { Breadcrumb, StatusBadge, ConfirmDialog } from '../../../components/UIComponents';
import { Download, Calendar, Truck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { orders, cancelOrder } = useApp();
  const [cancelOpen, setCancelOpen] = useState(false);

  const orderId = (params?.id as string) || "";
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Order not found</h2>
        <Link href="/orders" className="text-indigo-600 hover:underline">Back to Orders</Link>
      </div>
    );
  }

  const handleCancelOrder = () => {
    cancelOrder(order.id);
  };

  const isCancellable = order.status === 'Pending';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "My Orders", href: "/orders" }, { name: order.id }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-909 dark:text-white tracking-tight">{order.id}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-xs text-zinc-450 flex items-center gap-1.5 mt-1">
            <Calendar className="w-4 h-4" /> Ordered on {order.date}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Downloading PDF Invoice...")}
            className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Invoice
          </button>
          <Link
            href={`/orders/${order.id}/track`}
            className="bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-1.5"
          >
            <Truck className="w-4 h-4" /> Track Shipment
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Items & Address */}
        <div className="md:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">Items in this shipment</h3>
            <div className="divide-y divide-zinc-150 dark:divide-zinc-800">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200 truncate">{item.name}</h4>
                    <p className="text-[10px] text-zinc-400 mt-1">
                      Size: {item.size} | Color: {item.color} | Quantity: {item.quantity}
                    </p>
                  </div>
                  <span className="font-extrabold text-xs text-zinc-900 dark:text-white">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery destination */}
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 space-y-3 text-xs">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">Shipping Information</h3>
            <div className="space-y-1 text-zinc-500 dark:text-zinc-400">
              <p className="font-extrabold text-zinc-850 dark:text-zinc-250">{order.address.fullName}</p>
              <p>{order.address.street}</p>
              <p>{order.address.city}, {order.address.state} {order.address.zip}, {order.address.country}</p>
              <p className="pt-2">Phone: {order.address.phone}</p>
            </div>
          </div>
        </div>

        {/* Right Column: Payment summaries */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-3xl p-6 shadow space-y-4 text-xs">
            <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-2 border-b border-zinc-150">Payment Breakdown</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-zinc-500">
                <span>Payment Method</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250">₹{(order.total / 1.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>Tax / GST (18%)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-250">₹{(order.total - order.total / 1.18).toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-150 dark:border-zinc-800 font-extrabold text-sm text-zinc-900 dark:text-white">
                <span>Total Amount Paid</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Cancellation Option */}
          {isCancellable && (
            <button
              onClick={() => setCancelOpen(true)}
              className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 py-3 rounded-2xl text-xs font-extrabold transition-all"
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
        description="Are you sure you want to cancel this order? This will process an immediate refund of your transactions."
      />
    </div>
  );
}
