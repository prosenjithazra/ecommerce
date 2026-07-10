"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Trash2, Tag, Calendar, ShieldCheck } from 'lucide-react';
import { useApp } from '../../components/AppContext';
import { Breadcrumb, EmptyState, Price } from '../../components/UIComponents';
import { CouponCard } from '../../components/InfoCards';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQty, showToast } = useApp();
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + tax + shipping - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'CREATOR10') {
      setDiscountAmount(subtotal * 0.10);
      showToast("Coupon Applied", "10% discount applied to your order.", "success");
    } else {
      showToast("Invalid Coupon", "This promo code does not exist or has expired.", "error");
    }
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    today.setDate(today.getDate() + 5);
    return today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-16">
      <Breadcrumb items={[{ name: "Shopping Cart" }]} />
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight">Shopping Cart</h1>

      {cart.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Design custom items or browse premium blanks to fill your cart."
          actionText="Start Shopping"
          actionHref="/products"
          icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="p-4 border border-[#E8E2D6] bg-white rounded-2xl flex gap-4 hover:shadow-sm transition-shadow">
                <div className="w-18 h-18 min-w-[4.5rem] bg-[#E8E2D6] rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-extrabold text-sm text-[#4A453E] truncate">{item.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[#A89B8A] hover:text-red-400 transition-colors p-1 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-[#A89B8A] mt-0.5">
                      Size: <span className="font-bold text-[#7A736A]">{item.size}</span> · Color: <span className="font-bold text-[#7A736A]">{item.color}</span>
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 border border-[#E8E2D6] rounded-xl px-2 py-1 bg-[#FDFAF6]">
                      <button onClick={() => updateCartQty(item.id, item.quantity - 1)} className="px-2 text-sm font-bold text-[#A89B8A] hover:text-[#4A453E]">-</button>
                      <span className="text-xs font-extrabold w-4 text-center text-[#4A453E]">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.id, item.quantity + 1)} className="px-2 text-sm font-bold text-[#A89B8A] hover:text-[#4A453E]">+</button>
                    </div>
                    <span className="font-extrabold text-sm text-[#4A453E]">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Coupons */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-[#4A453E]">Available Offers</h4>
              <CouponCard code="CREATOR10" discountDesc="Get 10% off your entire order" expiry="Dec 31, 2026" />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white border border-[#E8E2D6] rounded-3xl p-5 space-y-5 shadow-sm">
              <h3 className="font-extrabold text-base text-[#4A453E] pb-3 border-b border-[#E8E2D6]">Order Summary</h3>

              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#A89B8A] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text" placeholder="Coupon code"
                    value={couponCode} onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-2.5 pl-9 pr-3 text-xs outline-none focus:border-[#F9A37E] uppercase text-[#4A453E] font-mono"
                  />
                </div>
                <button type="submit" className="bg-[#A8C69F] hover:bg-[#92b089] text-white rounded-2xl py-2.5 px-6 text-xs font-extrabold transition-all shadow-lg shadow-[#A8C69F]/20 flex-shrink-0">
                  Apply
                </button>
              </form>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#7A736A]">Cart Subtotal</span>
                  <span className="font-extrabold text-[#4A453E]">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#7A736A]">Tax / GST (18%)</span>
                  <span className="font-extrabold text-[#4A453E]">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7A736A]">Standard Shipping</span>
                  <span className="font-extrabold text-[#A8C69F]">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#E8E2D6] text-sm font-black">
                  <span className="text-[#4A453E]">Total Amount</span>
                  <span className="text-[#F9A37E]">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Delivery estimate */}
              <div className="p-3 bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#A8C69F] mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-[#7A736A]">
                  <span className="font-bold text-[#4A453E] block">Estimated Delivery</span>
                  <span className="mt-0.5 block">{getEstimatedDelivery()}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F9A37E]/25"
              >
                Proceed to Checkout
              </Link>
            </div>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#A89B8A]">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>SSL Secured & 256-Bit Encrypted Payments</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
