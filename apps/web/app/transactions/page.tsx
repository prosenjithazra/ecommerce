"use client";

import React, { useState } from 'react';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState } from '../../components/UIComponents';
import { TransactionCard } from '../../components/InfoCards';
import { FileText, Search } from 'lucide-react';

export default function TransactionsPage() {
  const { transactions } = useApp();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<'All' | 'Payment' | 'Refund'>('All');

  const filteredTxns = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(search.toLowerCase()) || 
                          txn.orderId.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'All' || txn.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Transaction History" }]} />

      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-zinc-909 dark:text-white tracking-tight flex items-center gap-2">
          <FileText className="w-7 h-7 text-[#F9A37E]" /> Transaction Ledger
        </h1>
        <p className="text-xs text-zinc-400">Ledger of all invoice transactions and refund statuses.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-150 dark:border-zinc-800 rounded-lg">
        <div className="flex gap-2">
          {(['All', 'Payment', 'Refund'] as const).map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`text-xs font-bold py-1.5 px-3.5 rounded-lg border transition-all ${
                typeFilter === type
                  ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-900'
                  : 'bg-white border-zinc-200 text-zinc-550 dark:bg-transparent dark:border-zinc-800 hover:border-zinc-400'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search txn or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg py-2 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] focus:ring-2 focus:ring-[#F9A37E]/20 text-zinc-900 dark:text-white"
          />
        </div>
      </div>

      {filteredTxns.length === 0 ? (
        <EmptyState
          title="No transactions"
          description="We couldn't find any financial transactions matching your query."
          icon={<FileText className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {filteredTxns.map(txn => (
            <TransactionCard key={txn.id} txn={txn} />
          ))}
        </div>
      )}
    </div>
  );
}
