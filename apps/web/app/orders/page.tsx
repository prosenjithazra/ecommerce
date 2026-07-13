"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { OrderCard } from '../../components/InfoCards';
import { ShoppingBag, Search } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();
  const { orders } = useApp();
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered'>('All');
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesQuery = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      <Breadcrumb items={[{ name: "My Orders" }]} />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Order History</h1>
        <p className="text-xs text-[#A89B8A] mt-1">View and track all your print-on-demand orders.</p>
      </div>

      {/* Filters + Search */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white border border-[#E8E2D6] p-4 rounded-lg">
        <div className="flex flex-wrap gap-1.5">
          {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-xs font-extrabold py-2 px-4 rounded-lg border transition-all ${
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
