"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, Select } from '../../components/UIComponents';
import { CreditCard, Wallet, Landmark, PhoneCall, ShieldCheck, Loader2, CheckCircle2, AlertCircle, X, Layers, Package } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { cart, addresses, createOrder, showToast, currentUser, profileLoading } = useApp();

  React.useEffect(() => {
    if (profileLoading) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, profileLoading, router]);

  const addressId = searchParams?.get('addressId') || "";
  const shippingMethod = searchParams?.get('shipping') || "standard";
  const address = addresses.find(a => a.id === addressId) || addresses.find(a => a.isDefault) || addresses[0];



  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbank' | 'wallet'>('card');
  const [paymentMode, setPaymentMode] = useState<'online' | 'cod'>('online');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [simulatedError, setSimulatedError] = useState<string | null>(null);

  if (profileLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16 pt-8">
        <div className="h-4 w-48 bg-zinc-200 animate-pulse rounded" />
        <div className="h-8 w-32 bg-zinc-200 animate-pulse rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-40 w-full bg-white border border-[#E8E2D6] rounded-lg p-5 animate-pulse space-y-3">
              <div className="h-4 w-1/4 bg-zinc-200 rounded" />
              <div className="h-10 w-full bg-zinc-100 rounded" />
            </div>
          </div>
          <div className="h-60 w-full bg-white border border-[#E8E2D6] rounded-lg p-5 animate-pulse space-y-4">
            <div className="h-6 w-1/2 bg-zinc-200 rounded" />
            <div className="h-12 w-full bg-zinc-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const handleCodOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      showToast("Checkout Error", "Please verify your shipping details before paying.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      const order = createOrder(address!, "COD", "COD_PAYMENT_" + Math.floor(100000 + Math.random() * 900000), "Pending");
      showToast("Order Placed", `Your COD Order ${order.id} has been placed successfully!`, "success");
      router.push(`/thank-you?orderId=${order.id}`);
    } catch (err: any) {
      showToast("Error", err.message || "Failed to place COD order.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shippingFee = shippingMethod === 'express' ? 14.99 : (subtotal > 50 ? 0 : 5.99);
  const total = subtotal + tax + shippingFee;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      showToast("Checkout Error", "Please verify your shipping details before paying.", "error");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create Razorpay order on backend
      const res = await fetch(getApiUrl('/orders/razorpay-create'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });

      if (!res.ok) {
        throw new Error('Failed to communicate with payment server.');
      }

      const razorpayOrder = await res.json();

      // 2. Check if sandbox/simulation is active
      if (razorpayOrder.simulated) {
        setSimulatedOrderId(razorpayOrder.id);
        setShowSimulatedModal(true);
        setIsProcessing(false);
        return;
      }

      // 3. Load the Razorpay Checkout SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please verify your internet connection.');
      }

      // 4. Open Razorpay options
      const options = {
        key: razorpayOrder.key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ecommerce Store",
        description: "Secure Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (paymentRes: any) {
          try {
            setIsProcessing(true);

            // 5. Verify signature on backend
            const verifyRes = await fetch(getApiUrl('/orders/razorpay-verify'), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpayOrderId: paymentRes.razorpay_order_id,
                razorpayPaymentId: paymentRes.razorpay_payment_id,
                razorpaySignature: paymentRes.razorpay_signature,
              }),
            });

            if (!verifyRes.ok) {
              throw new Error('Payment signature verification failed.');
            }

            const verifyData = await verifyRes.json();
            if (!verifyData.verified) {
              throw new Error('Verification failed. Payment invalid.');
            }

            // 6. Create order in PostgreSQL + Qikink sync
            const order = createOrder(address!, "RAZORPAY", paymentRes.razorpay_payment_id, "Paid");
            showToast("Payment Success", `Order ${order.id} placed successfully!`, "success");
            router.push(`/thank-you?orderId=${order.id}`);
          } catch (err: any) {
            showToast("Payment Verification Error", err.message || "Failed to confirm payment details.", "error");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: currentUser?.name || address.fullName,
          email: currentUser?.email || "customer@example.com",
          contact: address.phone || "",
        },
        theme: {
          color: "#F9A37E",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setIsProcessing(false);
    } catch (err: any) {
      showToast("Payment Gateway Error", err.message || "Could not launch Razorpay Checkout.", "error");
      setIsProcessing(false);
    }
  };

  const handleSimulatedSuccess = async () => {
    setShowSimulatedModal(false);
    setIsProcessing(true);

    try {
      // 1. Verify payment on backend (will bypass checks because ID starts with order_sim_)
      const verifyRes = await fetch(getApiUrl('/orders/razorpay-verify'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: simulatedOrderId,
          razorpayPaymentId: 'pay_sim_' + Math.random().toString(36).substring(2, 10),
          razorpaySignature: 'sig_sim_' + Math.random().toString(36).substring(2, 10),
        }),
      });

      if (!verifyRes.ok) throw new Error('Sandbox verification failed');
      const verifyData = await verifyRes.json();
      if (!verifyData.verified) throw new Error('Sandbox payment invalid');

      // 2. Save order in PostgreSQL database and sync to print partner Qikink
      const order = createOrder(address!, "RAZORPAY_SANDBOX", "pay_simulated", "Paid");
      showToast("Order Created", `Sandbox Order ${order.id} verified and placed!`, "success");
      router.push(`/thank-you?orderId=${order.id}`);
    } catch (err: any) {
      showToast("Error", err.message || "Payment verification failed", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8 pb-8 sm:pb-16 relative">
      <Breadcrumb items={[{ name: "Shopping Cart", href: "/cart" }, { name: "Checkout", href: "/checkout" }, { name: "Payment" }]} />

      <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">Payment Gateway</h1>

      {/* Processing Loader Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-white/70 dark:bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-[#F9A37E]" />
          <p className="text-sm font-black text-zinc-900 dark:text-white uppercase tracking-wider">Processing Payment Securely...</p>
          <p className="text-xs text-zinc-400">Verifying signature & synchronizing order with print partner...</p>
        </div>
      )}

      {/* Simulated Razorpay Checkout Modal (Sandbox simulation) */}
      {showSimulatedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-fade-in-up">
            <button 
              onClick={() => { setShowSimulatedModal(false); setSimulatedError(null); }}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-400 hover:text-zinc-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="bg-[#FBD5C1] text-[#e8855a] px-2 py-0.5 rounded text-[10px] font-black uppercase">Razorpay Sandbox</span>
            </div>

            <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white">Razorpay Checkout</h3>

            {simulatedError ? (
              <div className="space-y-4 py-4 animate-fade-in-up">
                <div className="flex justify-center">
                  <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center border border-red-100 dark:border-red-900/30">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="text-center space-y-1.5">
                  <h4 className="font-extrabold text-sm text-red-650 dark:text-red-400">Payment could not be completed</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium px-2 leading-relaxed">
                    {simulatedError}
                  </p>
                </div>

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setSimulatedError(null)}
                    className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all shadow-md"
                  >
                    Try Another Payment Method
                  </button>
                  <button
                    onClick={() => { setShowSimulatedModal(false); setSimulatedError(null); }}
                    className="w-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 text-zinc-550 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700 font-bold text-xs py-3 px-4 rounded-xl transition-all"
                  >
                    Cancel & Close
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-zinc-450 dark:text-zinc-400 mt-1">This simulation handles card validation and verifies payments through backend endpoints.</p>

                <div className="my-5 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Merchant</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">Custom T-Shirt Studio</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-400">Order ID</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{simulatedOrderId}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-dashed border-zinc-200 dark:border-zinc-800 pt-3">
                    <span className="text-zinc-400 font-bold">Amount Due</span>
                    <span className="font-black text-sm text-[#e8855a]">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleSimulatedSuccess}
                    className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Simulate Successful Payment
                  </button>
                  <button
                    onClick={() => {
                      setSimulatedError("International cards are not supported. Please contact our support team for help");
                    }}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs py-3.5 px-4 rounded-xl transition-all border border-red-200 flex items-center justify-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Simulate Payment Failure / Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8 items-start">
        
        {/* Left Side: Payment Gateways Selector */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-4 sm:p-6 space-y-5">
            <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150 dark:border-zinc-850">
              Choose Payment Method
            </h3>

            {/* Top-level Payment Mode Selector */}
            <div className="grid grid-cols-2 gap-4 pb-1">
              <button
                type="button"
                onClick={() => setPaymentMode('online')}
                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl gap-2 font-black text-xs transition-all ${
                  paymentMode === 'online'
                    ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950/20'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Online Payment</span>
                <span className="text-[9px] font-medium text-zinc-400 mt-0.5">Card, UPI, Net Banking, Wallet</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMode('cod')}
                className={`flex flex-col items-center justify-center p-5 border-2 rounded-xl gap-2 font-black text-xs transition-all ${
                  paymentMode === 'cod'
                    ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-950/20'
                }`}
              >
                <Layers className="w-5 h-5" />
                <span>Cash on Delivery (COD)</span>
                <span className="text-[9px] font-medium text-zinc-400 mt-0.5">Pay in cash upon delivery</span>
              </button>
            </div>

            {paymentMode === 'online' ? (
              <form onSubmit={handlePay} className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4 animate-fade-in-up duration-200">
                <div className="flex justify-between items-center pb-2">
                  <div>
                    <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Razorpay Secure Checkout</h4>
                    <p className="text-[10px] text-zinc-400 mt-0.5">Redirects to Razorpay payment gateway modal</p>
                  </div>
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                    className="h-5 dark:brightness-110" 
                    alt="Razorpay Logo" 
                  />
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg gap-1.5 sm:gap-2 font-bold text-xs transition-all ${paymentMethod === 'card' ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]' : 'border-zinc-150 text-zinc-550'}`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit / Debit Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg gap-1.5 sm:gap-2 font-bold text-xs transition-all ${paymentMethod === 'upi' ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]' : 'border-zinc-150 text-zinc-550'}`}
                  >
                    <PhoneCall className="w-5 h-5" />
                    <span>UPI (GPay / PhonePe)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbank')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg gap-1.5 sm:gap-2 font-bold text-xs transition-all ${paymentMethod === 'netbank' ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]' : 'border-zinc-150 text-zinc-550'}`}
                  >
                    <Landmark className="w-5 h-5" />
                    <span>Net Banking</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`flex flex-col items-center justify-center p-3 sm:p-4 border rounded-lg gap-1.5 sm:gap-2 font-bold text-xs transition-all ${paymentMethod === 'wallet' ? 'border-[#e8855a] bg-[#FBD5C1]/10 text-[#e8855a]' : 'border-zinc-150 text-zinc-550'}`}
                  >
                    <Wallet className="w-5 h-5" />
                    <span>Wallets</span>
                  </button>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-extrabold text-zinc-850 dark:text-zinc-100">Razorpay Trusted & Secured Payment Gateway</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">
                    Clicking the payment button below will open the secure Razorpay overlay where you can finish your payment using your chosen {paymentMethod === 'card' ? 'Credit or Debit Card' : paymentMethod === 'upi' ? 'UPI App (GPay, PhonePe, Paytm)' : paymentMethod === 'netbank' ? 'Net Banking Portal' : 'Mobile Wallet'}.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-4 sm:mt-6"
                >
                  Pay ₹{total.toFixed(2)} Securely with Razorpay
                </button>
              </form>
            ) : (
              <form onSubmit={handleCodOrder} className="pt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4 animate-fade-in-up duration-200">
                <div>
                  <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white">Cash on Delivery (COD)</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Pay in cash when the delivery executive arrives at your door</p>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-150 dark:border-zinc-850 rounded-xl space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#e8855a]" />
                    <span className="text-xs font-extrabold text-zinc-850 dark:text-zinc-100">COD Ordering Notice</span>
                  </div>
                  <p className="text-[10px] text-zinc-550 leading-relaxed">
                    By choosing Cash on Delivery, your order will be sent to our production queue immediately. A confirmation call or text might be sent to <span className="font-bold text-zinc-700 dark:text-zinc-300">{address?.phone}</span> before shipment. Please ensure the exact cash amount is ready during delivery.
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-3.5 px-4 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 mt-4 sm:mt-6 shadow-[#A8C69F]/20"
                >
                  Place Cash on Delivery Order (₹{total.toFixed(2)})
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Payment breakdowns summary */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-4 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
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
                <span className="text-[#e8855a]">₹{total.toFixed(2)}</span>
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
