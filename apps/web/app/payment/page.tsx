"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, Price, Select } from '../../components/UIComponents';
import { CreditCard, Wallet, Landmark, PhoneCall, ShieldCheck, CheckCircle2 } from 'lucide-react';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, addresses, createOrder, showToast } = useApp();

  const addressId = searchParams?.get('addressId') || "";
  const shippingMethod = searchParams?.get('shipping') || "standard";
  const address = addresses.find(a => a.id === addressId) || addresses[0];

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbank' | 'wallet'>('card');
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [upiId, setUpiId] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [selectedWallet, setSelectedWallet] = useState("");

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shippingFee = shippingMethod === 'express' ? 14.99 : (subtotal > 50 ? 0 : 5.99);
  const total = subtotal + tax + shippingFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      alert("Invalid checkout configuration.");
      return;
    }

    if (paymentMethod === 'card' && (!cardDetails.name || !cardDetails.number)) {
      alert("Please fill in card details.");
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      alert("Please enter UPI ID.");
      return;
    }

    // Call context to create actual order
    const order = createOrder(address, paymentMethod.toUpperCase());
    showToast("Payment Successful", `Order ${order.id} has been placed successfully!`, "success");
    router.push(`/thank-you?orderId=${order.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-16">
      <Breadcrumb items={[{ name: "Shopping Cart", href: "/cart" }, { name: "Checkout", href: "/checkout" }, { name: "Payment" }]} />

      <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Payment Gateway</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Payment Gateways Selector */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 space-y-6">
            <h3 className="font-extrabold text-base text-zinc-909 dark:text-white">Select Payment Method</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg gap-2 font-bold text-xs transition-all ${paymentMethod === 'card' ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600' : 'border-zinc-150 text-zinc-550'}`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Card</span>
              </button>
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg gap-2 font-bold text-xs transition-all ${paymentMethod === 'upi' ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600' : 'border-zinc-150 text-zinc-550'}`}
              >
                <PhoneCall className="w-5 h-5" />
                <span>UPI Pay</span>
              </button>
              <button
                onClick={() => setPaymentMethod('netbank')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg gap-2 font-bold text-xs transition-all ${paymentMethod === 'netbank' ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600' : 'border-zinc-150 text-zinc-550'}`}
              >
                <Landmark className="w-5 h-5" />
                <span>Net Banking</span>
              </button>
              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`flex flex-col items-center justify-center p-4 border rounded-lg gap-2 font-bold text-xs transition-all ${paymentMethod === 'wallet' ? 'border-indigo-600 bg-indigo-50/10 text-indigo-600' : 'border-zinc-150 text-zinc-550'}`}
              >
                <Wallet className="w-5 h-5" />
                <span>Wallets</span>
              </button>
            </div>

            {/* Sub fields */}
            <form onSubmit={handlePay} className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
              
              {paymentMethod === 'card' && (
                <div className="space-y-4 animate-fade-in-up duration-200">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-350">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      placeholder="Jane Doe"
                      className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-350">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                      placeholder="4000 1234 5678 9010"
                      className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-350">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        required
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-zinc-650 dark:text-zinc-350">CVV</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        required
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4 animate-fade-in-up duration-200">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-650">UPI ID / Virtual Payment Address</label>
                    <input
                      type="text"
                      placeholder="jane.doe@okaxis"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["GPay", "PhonePe", "Paytm"].map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setUpiId(`jane.doe@ok${p.toLowerCase()}`)}
                        className="text-[10px] font-bold py-1 px-3 border rounded-lg bg-zinc-50 hover:bg-zinc-100"
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {paymentMethod === 'netbank' && (
                <div className="space-y-4 animate-fade-in-up duration-200">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-650">Select Bank</label>
                    <Select
                      value={selectedBank}
                      onChange={(val) => setSelectedBank(val)}
                      placeholder="-- Choose Bank --"
                      options={[
                        { value: "chase", label: "Chase Bank" },
                        { value: "bofa", label: "Bank of America" },
                        { value: "wells", label: "Wells Fargo" }
                      ]}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-4 animate-fade-in-up duration-200">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-zinc-650">Select Wallet</label>
                    <Select
                      value={selectedWallet}
                      onChange={(val) => setSelectedWallet(val)}
                      placeholder="-- Choose Wallet --"
                      options={[
                        { value: "apple", label: "Apple Pay" },
                        { value: "amazon", label: "Amazon Pay" }
                      ]}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-4 rounded-lg transition-all shadow-lg flex items-center justify-center mt-6"
              >
                Pay ₹{total.toFixed(2)} Securely
              </button>

            </form>
          </div>
        </div>

        {/* Right Side: Payment breakdowns summary */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 shadow-xl space-y-6">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150 dark:border-zinc-800">
              Payment Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Checkout Subtotal</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tax / GST (18%)</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Shipping Fees</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  {shippingFee === 0 ? "FREE" : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-zinc-150 dark:border-zinc-800 text-sm font-black">
                <span className="text-zinc-900 dark:text-white">Amount Due</span>
                <span className="text-indigo-600 dark:text-indigo-400">₹{total.toFixed(2)}</span>
              </div>
            </div>

            {address && (
              <div className="p-3.5 bg-zinc-50 dark:bg-zinc-850 rounded-lg space-y-1.5 text-[10px]">
                <span className="font-bold text-zinc-800 dark:text-zinc-200 block uppercase">Shipping Destination</span>
                <p className="text-zinc-500 dark:text-zinc-400">{address.fullName}</p>
                <p className="text-zinc-500 dark:text-zinc-400 truncate">{address.street}, {address.city}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Secure 256-bit Payment Verification</span>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-zinc-400">Loading Payment Gateway...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}
