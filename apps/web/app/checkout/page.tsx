"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, addresses, addAddress } = useApp();
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || "");
  const [sameAsBilling, setSameAsBilling] = useState(true);
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [gstNumber, setGstNumber] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: ""
  });

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shippingFee = shippingMethod === 'express' ? 14.99 : (subtotal > 50 ? 0 : 5.99);
  const total = subtotal + tax + shippingFee;

  const inputClass = "w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg py-2.5 px-4 text-xs outline-none focus:border-[#F9A37E] text-[#4A453E] placeholder-[#A89B8A]";

  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.street || !newAddr.city) return;
    addAddress({ ...newAddr, isDefault: false });
    setShowAddForm(false);
    setNewAddr({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "" });
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }
    router.push(`/payment?addressId=${selectedAddressId}&shipping=${shippingMethod}&notes=${encodeURIComponent(orderNotes)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-8 sm:pb-16">
      <Breadcrumb items={[{ name: "Cart", href: "/cart" }, { name: "Checkout" }]} />
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 items-start">

        {/* ── Left: Form Steps ── */}
        <div className="lg:col-span-2 space-y-3.5 sm:space-y-5">

          {/* 1. Shipping Address */}
          <div className="bg-white border border-[#E8E2D6] rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-[#4A453E]">1. Shipping Address</h3>
              {!showAddForm && (
                <button onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] transition-colors">
                  + Add New
                </button>
              )}
            </div>

            {showAddForm ? (
              <form onSubmit={handleAddNewAddress} className="space-y-3 p-4 border border-[#E8E2D6] rounded-lg bg-[#FDFAF6]">
                <h4 className="font-bold text-xs text-[#4A453E]">New Shipping Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Full Name" required value={newAddr.fullName}
                    onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })} className={inputClass} />
                  <input type="tel" placeholder="Phone Number" required value={newAddr.phone}
                    onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} className={inputClass} />
                </div>
                <input type="text" placeholder="Street address, Suite, Apartment" required value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })} className={inputClass} />
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="City" required value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="State" required value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} className={inputClass} />
                  <input type="text" placeholder="ZIP" required value={newAddr.zip}
                    onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })} className={inputClass} />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowAddForm(false)}
                    className="text-xs font-bold text-[#A89B8A] py-2 px-4 rounded-lg hover:bg-[#E8E2D6] transition-colors">
                    Cancel
                  </button>
                  <button type="submit"
                    className="bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/20">
                    Save Address
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map(addr => (
                  <div key={addr.id} onClick={() => setSelectedAddressId(addr.id)}
                    className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-[#F9A37E] bg-[#FBD5C1]/10'
                        : 'border-[#E8E2D6] hover:border-[#A89B8A]'
                    }`}>
                    <span className="font-extrabold text-xs text-[#4A453E]">{addr.fullName}</span>
                    <p className="text-[10px] text-[#A89B8A] mt-0.5">{addr.street}, {addr.city}</p>
                    <p className="text-[10px] text-[#A89B8A]">Phone: {addr.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2. Billing address */}
          <div className="bg-white border border-[#E8E2D6] rounded-lg p-4 sm:p-5">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={sameAsBilling}
                onChange={(e) => setSameAsBilling(e.target.checked)}
                className="w-4 h-4 rounded border-[#E8E2D6] accent-[#F9A37E]" />
              <span className="text-xs font-bold text-[#4A453E]">Billing address same as shipping</span>
            </label>
          </div>

          {/* 3. Shipping method */}
          <div className="bg-white border border-[#E8E2D6] rounded-lg p-4 sm:p-5 space-y-2.5 sm:space-y-3">
            <h3 className="font-extrabold text-sm text-[#4A453E]">2. Shipping Method</h3>
            <div className="space-y-2">
              {[
                { id: 'standard', label: 'Standard Ground Shipping', sub: '4–6 business days', price: subtotal > 50 ? 'FREE' : '₹5.99' },
                { id: 'express', label: 'Express Air Shipping', sub: '2–3 business days', price: '₹14.99' }
              ].map(opt => (
                <label key={opt.id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
                    shippingMethod === opt.id
                      ? 'border-[#F9A37E] bg-[#FBD5C1]/10'
                      : 'border-[#E8E2D6] hover:border-[#A89B8A]'
                  }`}
                  onClick={() => setShippingMethod(opt.id as 'standard' | 'express')}
                >
                  <div className="flex items-center gap-3">
                    <input type="radio" checked={shippingMethod === opt.id} readOnly className="accent-[#F9A37E]" />
                    <div className="text-xs">
                      <span className="font-extrabold text-[#4A453E] block">{opt.label}</span>
                      <span className="text-[10px] text-[#A89B8A] mt-0.5 block">{opt.sub}</span>
                    </div>
                  </div>
                  <span className="font-extrabold text-xs text-[#F9A37E]">{opt.price}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 4. Additional details */}
          <div className="bg-white border border-[#E8E2D6] rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A453E]">3. Additional Details</h3>
            <div>
              <label className="block text-xs font-bold text-[#4A453E] mb-1.5">GSTIN (Optional)</label>
              <input type="text" placeholder="29AAAAA0000A1Z5" value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
                className={`${inputClass} uppercase font-mono`} />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#4A453E] mb-1.5">Order Notes / Instructions</label>
              <textarea rows={3} placeholder="Packaging notes, custom print sizing..."
                value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                className={`${inputClass} resize-none`} />
            </div>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="bg-white border border-[#E8E2D6] rounded-lg p-4 sm:p-5 space-y-3.5 sm:space-y-5 shadow-sm sticky top-20">
          <h3 className="font-extrabold text-base text-[#4A453E] pb-2 sm:pb-3 border-b border-[#E8E2D6]">Order Summary</h3>

          {/* Items */}
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {cart.map(item => (
              <div key={item.id} className="flex gap-3 justify-between items-center text-xs">
                <div className="flex gap-2 items-center min-w-0">
                  <div className="w-9 h-9 bg-[#E8E2D6] rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-bold text-[#4A453E] truncate">
                    {item.name} <span className="text-[10px] text-[#A89B8A]">×{item.quantity}</span>
                  </span>
                </div>
                <span className="font-extrabold text-[#4A453E] flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2.5 text-xs pt-3 border-t border-[#E8E2D6]">
            <div className="flex justify-between">
              <span className="text-[#7A736A]">Subtotal</span>
              <span className="font-bold text-[#4A453E]">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A736A]">Tax / GST (18%)</span>
              <span className="font-bold text-[#4A453E]">₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7A736A]">Shipping</span>
              <span className="font-bold text-[#A8C69F]">{shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#E8E2D6] text-sm font-black">
              <span className="text-[#4A453E]">Estimated Total</span>
              <span className="text-[#F9A37E]">₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleProceedToPayment}
            className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 flex items-center justify-center active:scale-95">
            Continue to Payment →
          </button>
        </div>
      </div>
    </div>
  );
}
