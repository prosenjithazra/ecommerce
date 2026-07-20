"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { OrderCard } from '../../components/InfoCards';
import { ShoppingBag, Search, Loader2 } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

export default function OrdersPage() {
  const router = useRouter();
  const { currentUser } = useApp();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
      return;
    }

    if (currentUser?.email) {
      setLoading(true);
      const startTime = performance.now();
      fetch(getApiUrl(`/orders?email=${encodeURIComponent(currentUser.email)}`))
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load orders");
          return res.text().then(text => text ? JSON.parse(text) : []);
        })
        .then((data) => {
          // Map backend order structure
          const mapped = data.map((o: any) => ({
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
          }));
          setOrders(mapped);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error loading user orders:", err);
          setLoading(false);
        });
    }
  }, [currentUser, router]);

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesQuery = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item: any) => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-6">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-zinc-200 animate-pulse rounded" />
          <div className="h-4 w-32 bg-zinc-100 animate-pulse rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-zinc-150 rounded-xl p-5 bg-white space-y-4 animate-pulse">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100">
                <div className="space-y-1">
                  <div className="h-3.5 w-32 bg-zinc-200 rounded" />
                  <div className="h-3 w-24 bg-zinc-150 rounded" />
                </div>
                <div className="h-6 w-16 bg-zinc-100 rounded-full" />
              </div>
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-zinc-200 rounded-lg" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-zinc-200 rounded" />
                  <div className="h-3 w-1/4 bg-zinc-150 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-6 pb-12 md:pb-16">
      <Breadcrumb items={[{ name: "My Orders" }]} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Order History</h1>
          <p className="text-xs text-[#A89B8A] mt-1">View and track all your orders.</p>
        </div>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white border border-[#E8E2D6] p-2.5 sm:p-4 rounded-lg">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-[10px] sm:text-xs font-extrabold py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-lg border transition-all ${
                statusFilter === status
                  ? 'bg-[#A8C69F] border-[#A8C69F] text-white shadow-md shadow-[#A8C69F]/20'
                  : 'bg-transparent text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-60 flex-shrink-0">
          <Search className="w-4 h-4 text-[#A89B8A] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text" placeholder="Search orders..."
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E]"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="You haven't placed any print orders matching this query."
          actionText="Browse Products"
          actionHref="/products"
          icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={(id) => router.push(`/orders/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
