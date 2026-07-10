"use client";

import React, { useState } from 'react';
import { useApp, Address } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import { AddressCard } from '../../components/InfoCards';
import { MapPin } from 'lucide-react';

export default function AddressesPage() {
  const { addresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingAddr, setEditingAddr] = useState<Address | null>(null);
  const [form, setForm] = useState({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddr) {
      updateAddress({ ...form, id: editingAddr.id });
    } else {
      addAddress(form);
    }
    setShowForm(false);
    setEditingAddr(null);
    setForm({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });
  };

  const handleEdit = (addr: Address) => {
    setEditingAddr(addr);
    setForm(addr);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Address Book" }]} />

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-zinc-909 dark:text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-indigo-500" /> Address Book
          </h1>
          <p className="text-xs text-zinc-400">Add, edit, or delete shipping destinations.</p>
        </div>
        {!showForm && (
          <button
            onClick={() => {
              setEditingAddr(null);
              setShowForm(true);
            }}
            className="bg-zinc-950 hover:bg-zinc-900 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-extrabold text-xs py-2.5 px-4 rounded-xl transition-all shadow"
          >
            + Add New Address
          </button>
        )}
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="max-w-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">
            {editingAddr ? "Modify Address" : "New Address Details"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-650 mb-1.5">Receiver Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full bg-zinc-55 border rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-650 mb-1.5">Phone Number</label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-zinc-55 border rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-650 mb-1.5">Street Address</label>
            <input
              type="text"
              required
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full bg-zinc-55 border rounded-xl py-2 px-3 text-xs outline-none focus:border-indigo-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="bg-zinc-55 border rounded-xl py-2 px-3 text-xs"
            />
            <input
              type="text"
              placeholder="State"
              required
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              className="bg-zinc-55 border rounded-xl py-2 px-3 text-xs"
            />
            <input
              type="text"
              placeholder="ZIP"
              required
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              className="bg-zinc-55 border rounded-xl py-2 px-3 text-xs"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border accent-indigo-650"
            />
            <span className="text-xs text-zinc-550 font-medium">Set as primary default shipping address</span>
          </label>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingAddr(null);
              }}
              className="text-xs font-bold text-zinc-400 py-2 px-4 rounded-xl hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs py-2 px-4 rounded-xl shadow-md">
              Save Shipping Details
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map(addr => (
            <AddressCard
              key={addr.id}
              address={addr}
              onEdit={handleEdit}
              onDelete={deleteAddress}
              onSetDefault={setDefaultAddress}
            />
          ))}
        </div>
      )}
    </div>
  );
}
