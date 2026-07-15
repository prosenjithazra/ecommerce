"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp, Address } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import { User, MapPin, ShieldAlert, KeyRound, Sliders, LogOut, LayoutDashboard, Upload, Camera, X, ShoppingBag, Loader2, Calendar, CreditCard, ExternalLink, ChevronDown, ChevronUp, XCircle, Package, Truck, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { AddressCard } from '../../components/InfoCards';
import { getApiUrl } from '../../components/ApiConfig';
import { CustomGarmentPreview } from '../../components/CustomGarmentPreview';

const STATUS_STYLES: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30",
  Processing: "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30",
  Pending: "bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/50",
  Shipped: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/30",
  Cancelled: "bg-red-50 text-red-650 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30",
  Returned: "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-950/20 dark:text-violet-455 dark:border-violet-900/30",
};

interface OrderListItemProps {
  order: any;
  onCancel: (orderId: string, reason: string) => void;
  cancelling: boolean;
  onReturn: (orderId: string, reason: string) => void;
  returning: boolean;
}

const STATUS_STEPS = [
  { key: 'Pending', label: 'Order Placed', Icon: Clock },
  { key: 'Processing', label: 'Processing', Icon: Package },
  { key: 'Shipped', label: 'Shipped', Icon: Truck },
  { key: 'Delivered', label: 'Delivered', Icon: CheckCircle2 },
];

const OrderListItem: React.FC<OrderListItemProps> = ({ order, onCancel, cancelling, onReturn, returning }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [cancelReasonSelection, setCancelReasonSelection] = useState("Changed my mind");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [returnReasonSelection, setReturnReasonSelection] = useState("Size doesn't fit");
  const [customReturnReason, setCustomReturnReason] = useState("");
  const items = order.itemsJson && Array.isArray(order.itemsJson) ? order.itemsJson : [];

  const isCancelled = order.status === 'Cancelled';
  const isReturned = order.status === 'Returned';
  const canCancel = ['Pending', 'Processing'].includes(order.status);
  const canReturn = order.status === 'Delivered';

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950/20 shadow-sm transition-all hover:shadow-md">
      {/* Header Summary */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-colors"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-zinc-900 dark:text-white">{order.id}</span>
            <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLES[order.status] || STATUS_STYLES.Pending}`}>
              {order.status}
            </span>
          </div>
          <p className="text-[10px] text-zinc-450 dark:text-zinc-400 font-bold flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            Ordered on {order.date}
          </p>
        </div>

        <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-end">
          <div className="text-right">
            <p className="text-[10px] text-zinc-400 font-bold">{order.items} {order.items === 1 ? 'item' : 'items'}</p>
            <p className="text-sm font-black text-zinc-900 dark:text-white mt-0.5">₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="p-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isOpen && (
        <div className="border-t border-zinc-150 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800/60">

          {/* Status Progress Tracker */}
          {!isCancelled && (
            <div className="px-5 py-5 bg-zinc-50/50 dark:bg-zinc-900/10">
              <p className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider mb-4">Order Progress</p>
              <div className="flex items-center gap-0">
                {STATUS_STEPS.map((step, idx) => {
                  const isCompleted = currentStepIndex >= idx;
                  const isActive = currentStepIndex === idx;
                  const StepIcon = step.Icon;
                  return (
                    <React.Fragment key={step.key}>
                      <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? 'bg-[#F9A37E] border-[#F9A37E] text-white shadow-md shadow-[#F9A37E]/30'
                            : isCompleted
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-400'
                        }`}>
                          <StepIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className={`text-[8.5px] font-extrabold uppercase text-center leading-tight max-w-[52px] ${
                          isActive ? 'text-[#e8855a]' : isCompleted ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STATUS_STEPS.length - 1 && (
                        <div className={`h-0.5 flex-1 mx-1 mb-5 rounded-full transition-all ${
                          currentStepIndex > idx ? 'bg-emerald-400' : 'bg-zinc-200 dark:bg-zinc-700'
                        }`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}

          {/* Cancelled Banner */}
          {isCancelled && (
            <div className="px-5 py-4 bg-red-50/60 dark:bg-red-950/10 flex items-center gap-3">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-red-600 dark:text-red-400">Order Cancelled</p>
                <p className="text-[10px] text-red-500/80 dark:text-red-500/60 mt-0.5">This order was cancelled and will not be fulfilled.</p>
              </div>
            </div>
          )}

          {/* Returned Banner */}
          {isReturned && (
            <div className="px-5 py-4 bg-violet-50/60 dark:bg-violet-950/10 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-violet-550 flex-shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-violet-650 dark:text-violet-400">Product Returned</p>
                <p className="text-[10px] text-violet-550/85 dark:text-violet-550/60 mt-0.5">This order has been returned successfully.</p>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider">Order Items</p>
            {items.length > 0 ? (
              <div className="space-y-3">
                {items.map((item: any, i: number) => {
                  const designStr = item.customDesign?.baseImage;
                  let designMeta = null;
                  if (designStr) {
                    try { designMeta = JSON.parse(designStr); }
                    catch (e) { /* silently skip */ }
                  }

                  return (
                    <div key={i} className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/40">
                      {/* Item Header */}
                      <div className="flex gap-3 p-3.5">
                        <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-zinc-150 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                          <CustomGarmentPreview
                            customDesign={item.customDesign}
                            defaultImage={item.image}
                            view="front"
                            className="w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-extrabold text-xs text-zinc-800 dark:text-zinc-200 leading-tight">{item.name}</h5>

                          {/* Tags row */}
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {item.size && (
                              <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-[9px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded flex items-center gap-1">
                                {item.colorHex && (
                                  <span className="w-2 h-2 rounded-full inline-block border border-zinc-300" style={{ background: item.colorHex }} />
                                )}
                                {item.color}
                              </span>
                            )}
                            {item.category && (
                              <span className="text-[9px] font-bold bg-[#FBD5C1]/30 text-[#e8855a] px-2 py-0.5 rounded">
                                {item.category}
                              </span>
                            )}
                          </div>

                          {/* Price row */}
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-[10px] text-zinc-500 font-bold">
                              ₹{Number(item.price).toLocaleString('en-IN')} × {item.quantity}
                            </p>
                            <p className="text-xs font-black text-zinc-900 dark:text-white">
                              ₹{(Number(item.price) * Number(item.quantity)).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Custom print specs */}
                      {designMeta && (
                        <div className="border-t border-dashed border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/60 dark:bg-zinc-950/20 space-y-3">
                          <p className="text-[9px] font-extrabold text-[#e8855a] uppercase tracking-wider">🎨 Custom Print Specifications</p>
                          <div className="flex gap-3 items-start">
                            <div className="flex gap-2">
                              {designMeta.front?.imageUrl && (
                                <div className="text-center">
                                  <div className="w-14 h-14 border border-zinc-200 rounded-lg overflow-hidden bg-white">
                                    <img src={designMeta.front.imageUrl} className="w-full h-full object-contain" alt="Front artwork" />
                                  </div>
                                  <p className="text-[8px] font-bold text-zinc-400 mt-1 uppercase">Front</p>
                                </div>
                              )}
                              {designMeta.back?.imageUrl && (
                                <div className="text-center">
                                  <div className="w-14 h-14 border border-zinc-200 rounded-lg overflow-hidden bg-white">
                                    <img src={designMeta.back.imageUrl} className="w-full h-full object-contain" alt="Back artwork" />
                                  </div>
                                  <p className="text-[8px] font-bold text-zinc-400 mt-1 uppercase">Back</p>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 space-y-1 text-[9px] text-zinc-500 dark:text-zinc-400 font-medium">
                              <p>Style: <span className="font-bold capitalize text-zinc-700 dark:text-zinc-300">{designMeta.productType}</span></p>
                              <p>Color: <span className="font-bold text-zinc-700 dark:text-zinc-300">{designMeta.color}</span></p>
                              {designMeta.front?.position && <p>Front: <span className="font-bold text-zinc-700 dark:text-zinc-300">{designMeta.front.position}</span></p>}
                              {designMeta.back?.position && <p>Back: <span className="font-bold text-zinc-700 dark:text-zinc-300">{designMeta.back.position}</span></p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-zinc-400 italic">
                <Package className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                No detailed item data available for this order.
              </div>
            )}
          </div>

          {/* Payment Details Block */}
          <div className="px-5 py-4 bg-zinc-55 dark:bg-zinc-950/20 space-y-2">
            <p className="text-[10px] font-extrabold text-[#e8855a] uppercase tracking-wider mb-2">💳 Payment Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <p className="text-zinc-400 dark:text-zinc-500 font-bold">Payment Method</p>
                <p className="font-extrabold text-zinc-800 dark:text-zinc-200 uppercase">
                  {order.paymentMethod === 'COD' ? 'COD' : 'Online'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-zinc-400 dark:text-zinc-500 font-bold">Payment Status</p>
                <p className={`font-extrabold inline-block px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${
                  order.paymentStatus === 'Paid' || order.paymentStatus === 'Success'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                    : order.paymentStatus === 'Refunded'
                    ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                    : 'bg-zinc-100 text-zinc-650 border border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-400 dark:border-zinc-700/50'
                }`}>
                  {order.paymentStatus || 'Pending'}
                </p>
              </div>
              {order.paymentId && (
                <div className="space-y-1 sm:col-span-2 border-t border-zinc-150 dark:border-zinc-800/60 pt-2">
                  <p className="text-zinc-400 dark:text-zinc-500 font-bold">Transaction / Reference ID</p>
                  <p className="font-mono text-xs text-zinc-650 dark:text-zinc-350 select-all">
                    {order.paymentId}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Footer */}
          <div className="px-5 py-4 bg-zinc-50/60 dark:bg-zinc-900/10 space-y-2">
            <p className="text-[10px] font-extrabold text-zinc-450 dark:text-zinc-400 uppercase tracking-wider mb-3">Order Summary</p>
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Subtotal ({order.items} items)</span>
              <span className="font-bold">₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-xs text-zinc-600 dark:text-zinc-400">
              <span className="font-medium">Shipping</span>
              <span className="font-bold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-sm font-black text-zinc-900 dark:text-white border-t border-zinc-200 dark:border-zinc-800 pt-2 mt-2">
              <span>Total Paid</span>
              <span>₹{Number(order.total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Display Cancellation Reason if Cancelled */}
          {isCancelled && order.cancelReason && (
            <div className="px-5 py-3 bg-red-50/30 dark:bg-red-950/5 border-t border-red-100/50 text-[10px] font-bold text-red-600">
              Reason for Cancellation: <span className="font-extrabold text-red-700">{order.cancelReason}</span>
            </div>
          )}

          {/* Display Return Reason if Returned */}
          {isReturned && order.returnReason && (
            <div className="px-5 py-3 bg-violet-50/30 dark:bg-violet-950/5 border-t border-violet-100/50 text-[10px] font-bold text-violet-600">
              Reason for Return: <span className="font-extrabold text-violet-750">{order.returnReason}</span>
            </div>
          )}

          {/* Cancel Order Action */}
          {canCancel && !showCancelConfirm && (
            <div className="px-5 py-4 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(true); }}
                className="flex items-center gap-1.5 text-xs font-extrabold text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-all"
              >
                <XCircle className="w-3.5 h-3.5" />
                Cancel Order
              </button>
            </div>
          )}

          {/* Cancel Confirmation Dialog with Reasons */}
          {showCancelConfirm && (
            <div className="px-5 py-4 bg-red-50/80 dark:bg-red-950/10 border-t border-red-100 dark:border-red-900/30 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4.5 h-4.5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-extrabold text-red-750 dark:text-red-400">Cancel this order?</p>
                  <p className="text-[10px] text-red-650 dark:text-red-400 leading-relaxed font-bold bg-white dark:bg-zinc-900/50 p-2.5 rounded-lg border border-red-100 dark:border-red-900/40">
                    ⚠️ Notice: A 20% cancellation fee (₹{(Number(order.total) * 0.20).toLocaleString('en-IN', { minimumFractionDigits: 2 })}) will be deducted. The remaining amount will be sent directly to your bank account.
                  </p>
                  
                  {/* Select reason */}
                  <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                    <label className="text-[9px] font-black uppercase text-zinc-400">Reason for Cancellation</label>
                    <div className="relative">
                      <select
                        value={cancelReasonSelection}
                        onChange={(e) => setCancelReasonSelection(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:border-red-450 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                      >
                        <option value="Changed my mind">Changed my mind</option>
                        <option value="Ordered wrong size/color">Ordered wrong size/color</option>
                        <option value="Found a cheaper price elsewhere">Found a cheaper price elsewhere</option>
                        <option value="Delayed shipping estimate">Delayed shipping estimate</option>
                        <option value="Other (Please specify below)">Other (Please specify below)</option>
                      </select>
                    </div>
                  </div>

                  {cancelReasonSelection === "Other (Please specify below)" && (
                    <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Please write the cancellation reason..."
                        value={customCancelReason}
                        onChange={(e) => setCustomCancelReason(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:border-red-450 transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const finalReason = cancelReasonSelection === 'Other (Please specify below)' ? (customCancelReason || 'Other reason') : cancelReasonSelection;
                        onCancel(order.id, finalReason);
                        setShowCancelConfirm(false);
                      }}
                      disabled={cancelling}
                      className="flex items-center gap-1.5 text-xs font-extrabold bg-red-650 hover:bg-red-700 active:scale-95 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-red-500/10 cursor-pointer"
                    >
                      {cancelling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                      {cancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowCancelConfirm(false); }}
                      className="text-xs font-bold text-zinc-650 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      Keep Order
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Return Order Action */}
          {canReturn && !showReturnConfirm && (
            <div className="px-5 py-4 flex justify-end">
              <button
                onClick={(e) => { e.stopPropagation(); setShowReturnConfirm(true); }}
                className="flex items-center gap-1.5 text-xs font-extrabold text-violet-500 hover:text-violet-600 border border-violet-200 hover:border-violet-300 bg-violet-50 hover:bg-violet-100 px-4 py-2 rounded-lg transition-all cursor-pointer"
              >
                <Package className="w-3.5 h-3.5" />
                Return Product
              </button>
            </div>
          )}

          {/* Return Confirmation Dialog with Reasons */}
          {showReturnConfirm && (
            <div className="px-5 py-4 bg-violet-50/80 dark:bg-violet-950/10 border-t border-violet-100 dark:border-violet-900/30 space-y-3">
              <div className="flex items-start gap-3">
                <Package className="w-4.5 h-4.5 text-violet-550 flex-shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-extrabold text-violet-755 dark:text-violet-400">Return this product?</p>
                  <p className="text-[10px] text-violet-650 dark:text-violet-400 leading-relaxed font-bold bg-white dark:bg-zinc-900/50 p-2.5 rounded-lg border border-violet-100 dark:border-violet-900/40">
                    ⚠️ Notice: A 20% processing fee (₹{(Number(order.total) * 0.20).toLocaleString('en-IN', { minimumFractionDigits: 2 })}) will be deducted. The remaining amount will be sent directly to your bank account after product inspection.
                  </p>
                  
                  {/* Select reason */}
                  <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                    <label className="text-[9px] font-black uppercase text-zinc-400">Reason for Return</label>
                    <div className="relative">
                      <select
                        value={returnReasonSelection}
                        onChange={(e) => setReturnReasonSelection(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none hover:border-violet-450 transition-all cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2371717A%22%20stroke-width%3D%221.66667%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10"
                      >
                        <option value="Size doesn't fit">Size doesn't fit</option>
                        <option value="Color/Style different from website">Color/Style different from website</option>
                        <option value="Defective/Damaged product">Defective/Damaged product</option>
                        <option value="Quality not up to expectations">Quality not up to expectations</option>
                        <option value="Other (Please specify below)">Other (Please specify below)</option>
                      </select>
                    </div>
                  </div>

                  {returnReasonSelection === "Other (Please specify below)" && (
                    <div className="space-y-1" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder="Please write the return reason..."
                        value={customReturnReason}
                        onChange={(e) => setCustomReturnReason(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg py-2 px-3 text-xs font-semibold text-zinc-800 dark:text-zinc-200 outline-none focus:border-violet-455 transition-colors"
                      />
                    </div>
                  )}

                  <div className="flex gap-2.5 pt-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const finalReason = returnReasonSelection === 'Other (Please specify below)' ? (customReturnReason || 'Other reason') : returnReasonSelection;
                        onReturn(order.id, finalReason);
                        setShowReturnConfirm(false);
                      }}
                      disabled={returning}
                      className="flex items-center gap-1.5 text-xs font-extrabold bg-violet-600 hover:bg-violet-750 active:scale-95 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-all shadow-md shadow-violet-650/10 cursor-pointer"
                    >
                      {returning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {returning ? 'Submitting...' : 'Confirm Return'}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setShowReturnConfirm(false); }}
                      className="text-xs font-bold text-zinc-650 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 px-4 py-2 rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      Keep Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const { 
    currentUser, 
    logout, 
    addresses, 
    deleteAddress, 
    setDefaultAddress, 
    addAddress, 
    updateAddress, 
    showToast, 
    updateUserProfile,
    updateUserPreferences
  } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'address' | 'orders' | 'password' | 'preferences'>('info');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [returningOrderId, setReturningOrderId] = useState<string | null>(null);

  // Personal Info Form
  const [name, setName] = useState(currentUser?.name || "Jane Doe");
  const [email, setEmail] = useState(currentUser?.email || "jane@example.com");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Preferences form state
  const [prefOrderEmail, setPrefOrderEmail] = useState(currentUser?.preferences?.orderEmail ?? true);
  const [prefNewsletter, setPrefNewsletter] = useState(currentUser?.preferences?.newsletter ?? false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone || "");
      setAvatar(currentUser.avatar || "");
      setPrefOrderEmail(currentUser.preferences?.orderEmail ?? true);
      setPrefNewsletter(currentUser.preferences?.newsletter ?? false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.email) {
      setOrdersLoading(true);
      fetch(getApiUrl(`/orders?email=${encodeURIComponent(currentUser.email)}`))
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to load orders");
        })
        .then((data) => {
          setOrders(data);
          setOrdersLoading(false);
        })
        .catch((err) => {
          console.error("Error loading user orders:", err);
          setOrdersLoading(false);
        });
    }
  }, [currentUser]);

  // Password Form
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  // Address inline add/edit state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrForm, setAddrForm] = useState({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(name, avatar, phone);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatar(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      showToast("Error", "New passwords do not match!", "error");
      return;
    }
    const token = localStorage.getItem("token");
    fetch(getApiUrl("/user/profile/change-password"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ current: passwords.current, new: passwords.new })
    })
    .then(async res => {
      const data = await res.json();
      if (res.ok) {
        showToast("Password Updated", "Your password has been changed successfully.", "success");
        setPasswords({ current: "", new: "", confirm: "" });
      } else {
        throw new Error(data.message || "Failed to update password");
      }
    })
    .catch(err => {
      showToast("Error", err.message || "Could not change password.", "error");
    });
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddress) {
      updateAddress({ ...addrForm, id: editingAddress.id });
    } else {
      addAddress(addrForm);
    }
    setShowAddressForm(false);
    setEditingAddress(null);
    setAddrForm({ fullName: "", street: "", city: "", state: "", zip: "", country: "United States", phone: "", isDefault: false });
  };

  const handleEditAddressClick = (addr: Address) => {
    setEditingAddress(addr);
    setAddrForm(addr);
    setShowAddressForm(true);
  };

  const handleDeleteAccount = () => {
    const confirm = window.confirm("Are you sure you want to permanently delete your account?");
    if (confirm) {
      logout();
      window.location.href = '/';
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    setCancellingOrderId(orderId);
    try {
      const res = await fetch(getApiUrl(`/orders/${orderId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Cancelled', cancelReason: reason }),
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status, cancelReason: updated.cancelReason } : o));
      showToast('Order Cancelled', `Order ${orderId} has been successfully cancelled. 20% processing fee will be deducted.`, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Could not cancel order.', 'error');
    } finally {
      setCancellingOrderId(null);
    }
  };

  const handleReturnOrder = async (orderId: string, reason: string) => {
    setReturningOrderId(orderId);
    try {
      const res = await fetch(getApiUrl(`/orders/${orderId}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Returned', returnReason: reason }),
      });
      if (!res.ok) throw new Error('Failed to return order');
      const updated = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status, returnReason: updated.returnReason } : o));
      showToast('Return Requested', `Return request for Order ${orderId} has been submitted successfully.`, 'success');
    } catch (err: any) {
      showToast('Error', err.message || 'Could not return order.', 'error');
    } finally {
      setReturningOrderId(null);
    }
  };

  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
  const isProfileDataLoading = token && !currentUser;

  if (isProfileDataLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8 pb-10 md:pb-16 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-36 bg-zinc-200 dark:bg-zinc-800 rounded mt-6"></div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 items-start">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:flex bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-5 flex-col gap-4 w-full">
            <div className="h-8 bg-zinc-250 dark:bg-zinc-800 rounded-lg w-full"></div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800/60 rounded-lg w-full"></div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800/60 rounded-lg w-full"></div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800/60 rounded-lg w-full"></div>
            <div className="h-8 bg-zinc-200 dark:bg-zinc-800/60 rounded-lg w-full"></div>
          </div>

          {/* Form Skeleton */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 sm:p-8 space-y-6">
            <div className="h-6 bg-zinc-250 dark:bg-zinc-800 rounded w-1/4 pb-3"></div>
            <div className="flex items-center gap-5 border-t border-zinc-100 dark:border-zinc-805 pt-6">
              <div className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3"></div>
                <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-1/2"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-10 bg-zinc-100 dark:bg-zinc-850 rounded-lg w-full"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4"></div>
                <div className="h-10 bg-zinc-100 dark:bg-zinc-850 rounded-lg w-full"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/6"></div>
              <div className="h-10 bg-zinc-100 dark:bg-zinc-850 rounded-lg w-full"></div>
            </div>
            <div className="h-10 bg-zinc-250 dark:bg-zinc-800 rounded-lg w-32 pt-2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 md:space-y-8 pb-10 md:pb-16">
      <Breadcrumb items={[{ name: "My Profile" }]} />

      {/* MOBILE SIDEBAR DRAWER OVERLAY */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex !m-0 top-0">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
          />
          {/* Drawer Content */}
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-zinc-900 h-full flex flex-col p-5 shadow-2xl z-10 animate-slide-from-left">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50 dark:border-zinc-800">
              <h3 className="font-extrabold text-sm text-zinc-800 dark:text-white">Account Menu</h3>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1.5">
              <button
                onClick={() => { setActiveTab('info'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'info' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <User className="w-4 h-4" /> Personal Info
              </button>
              <button
                onClick={() => { setActiveTab('address'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'address' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <MapPin className="w-4 h-4" /> Address Book
              </button>
              <button
                onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'orders' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <ShoppingBag className="w-4 h-4" /> My Orders
              </button>
              <button
                onClick={() => { setActiveTab('password'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'password' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <KeyRound className="w-4 h-4" /> Change Password
              </button>
              <button
                onClick={() => { setActiveTab('preferences'); setIsMobileSidebarOpen(false); }}
                className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'preferences' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
              >
                <Sliders className="w-4 h-4" /> Preferences
              </button>
              
              {currentUser?.role === 'admin' && (
                <div className="border-t border-[#E8E2D6] my-1.5 pt-1.5">
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="flex items-center gap-2.5 text-xs font-extrabold py-2.5 px-4 rounded-lg text-left transition-all text-[#F9A37E] hover:bg-[#FBD5C1]/10"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Console
                  </Link>
                </div>
              )}

              <div className="border-t border-zinc-200/50 dark:border-zinc-800 my-1.5 pt-1.5">
                <button
                  onClick={() => { logout(); setIsMobileSidebarOpen(false); }}
                  className="w-full flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Drawer Trigger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg px-4 py-3.5 text-xs font-bold text-zinc-750 dark:text-zinc-300 shadow-sm hover:border-[#F9A37E] transition-colors"
        >
          <span className="flex items-center gap-2">
            {activeTab === 'info' && <><User className="w-4.5 h-4.5 text-[#E8855A]" /> Personal Info</>}
            {activeTab === 'address' && <><MapPin className="w-4.5 h-4.5 text-[#E8855A]" /> Address Book</>}
            {activeTab === 'orders' && <><ShoppingBag className="w-4.5 h-4.5 text-[#E8855A]" /> My Orders</>}
            {activeTab === 'password' && <><KeyRound className="w-4.5 h-4.5 text-[#E8855A]" /> Change Password</>}
            {activeTab === 'preferences' && <><Sliders className="w-4.5 h-4.5 text-[#E8855A]" /> Preferences</>}
          </span>
          <span className="text-[10px] text-[#e8855a] font-extrabold uppercase tracking-wider flex items-center gap-1">
            Menu ➔
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8 items-start">
        
        {/* Sidebar Tabs Select - Desktop Only */}
        <div className="hidden lg:flex bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-4 flex-col gap-1.5 w-full">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'info' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <User className="w-4 h-4" /> Personal Info
          </button>
          <button
            onClick={() => setActiveTab('address')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'address' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <MapPin className="w-4 h-4" /> Address Book
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'orders' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <ShoppingBag className="w-4 h-4" /> My Orders
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'password' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all ${activeTab === 'preferences' ? 'bg-[#FBD5C1]/30 text-[#E8855A]' : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'}`}
          >
            <Sliders className="w-4 h-4" /> Preferences
          </button>
          
          {currentUser?.role === 'admin' && (
            <div className="border-t border-[#E8E2D6] my-1.5 pt-1.5">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 text-xs font-extrabold py-2.5 px-4 rounded-lg text-left transition-all text-[#F9A37E] hover:bg-[#FBD5C1]/10"
              >
                <LayoutDashboard className="w-4 h-4" /> Admin Console
              </Link>
            </div>
          )}

          <div className="border-t border-zinc-200/50 dark:border-zinc-800 my-1.5 pt-1.5">
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 text-xs font-bold py-2.5 px-4 rounded-lg text-left transition-all text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <LogOut className="w-4 h-4" /> Log Out
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800 rounded-lg p-6 sm:p-8">
          
          {/* 1. Personal Info Tab */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Personal Information</h3>
              
              {/* Avatar Upload */}
              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#FBD5C1] bg-zinc-100 flex items-center justify-center font-black text-xl text-[#7A736A] shadow-sm">
                    {avatar ? (
                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-1.5 bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-full shadow transition-all hover:scale-110"
                    title="Change Avatar"
                  >
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-800">Avatar Image</h4>
                  <p className="text-[12px] text-zinc-400 mt-1">Upload a custom square avatar for your creator profile.</p>
                 
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-650 mb-1.5">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-55 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                />
              </div>
              <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all">
                Save Changes
              </button>
            </form>
          )}

          {/* 2. Address Book Tab */}
          {activeTab === 'address' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-150">
                <h3 className="font-extrabold text-base text-zinc-900 dark:text-white">Shipping Addresses</h3>
                {!showAddressForm && (
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressForm(true);
                    }}
                    className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] transition-colors"
                  >
                    + Add New Address
                  </button>
                )}
              </div>

              {showAddressForm ? (
                <form onSubmit={handleAddressSubmit} className="space-y-4 p-4 border border-zinc-200 dark:border-zinc-850 rounded-lg bg-zinc-50 dark:bg-zinc-950/20">
                  <h4 className="font-bold text-xs text-zinc-800 dark:text-zinc-200">
                    {editingAddress ? "Edit Address details" : "Add New Address"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Receiver name"
                      required
                      value={addrForm.fullName}
                      onChange={(e) => setAddrForm({ ...addrForm, fullName: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      required
                      value={addrForm.phone}
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Street, suite, flat"
                    required
                    value={addrForm.street}
                    onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                    className="w-full bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={addrForm.city}
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      required
                      value={addrForm.state}
                      onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Zip"
                      required
                      value={addrForm.zip}
                      onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })}
                      className="bg-white dark:bg-zinc-800 border border-zinc-250 rounded-lg py-2 px-3 text-xs"
                    />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={addrForm.isDefault}
                      onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                      className="w-4 h-4 rounded border border-zinc-200 accent-indigo-600"
                    />
                    <span className="text-xs text-zinc-550 dark:text-zinc-400 font-medium">Set as primary shipping address</span>
                  </label>
                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddressForm(false);
                        setEditingAddress(null);
                      }}
                      className="text-xs font-bold text-zinc-400 py-2 px-4 rounded-lg hover:bg-zinc-100"
                    >
                      Cancel
                    </button>
                    <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2 px-4 rounded-lg shadow-md">
                      Save Details
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <AddressCard
                      key={addr.id}
                      address={addr}
                      onEdit={handleEditAddressClick}
                      onDelete={deleteAddress}
                      onSetDefault={setDefaultAddress}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {/* 3. Change Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-650 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 rounded-lg py-3 px-4 text-xs outline-none"
                  />
                </div>
              </div>
              <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-3 px-6 rounded-lg transition-all">
                Update credentials
              </button>
            </form>
          )}

          {/* My Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">My Orders</h3>
              
              {ordersLoading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 text-[#F9A37E] animate-spin" />
                  <p className="text-xs text-zinc-500 font-bold">Loading your orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/10 p-6">
                  <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-850 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShoppingBag className="w-6 h-6 text-zinc-400" />
                  </div>
                  <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200">No Orders Placed Yet</h4>
                  <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">You haven't placed any orders yet. Head to the custom shop to create your custom design shirt!</p>
                  <Link
                    href="/custom"
                    className="mt-4 inline-block bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2.5 px-5 rounded-lg shadow-sm transition-all"
                  >
                    Start Customizing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <OrderListItem
                      key={order.id}
                      order={order}
                      onCancel={handleCancelOrder}
                      cancelling={cancellingOrderId === order.id}
                      onReturn={handleReturnOrder}
                      returning={returningOrderId === order.id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. Preferences Settings Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-8">
              <h3 className="font-extrabold text-base text-zinc-900 dark:text-white pb-3 border-b border-zinc-150">Preferences</h3>

              <form onSubmit={(e) => { e.preventDefault(); updateUserPreferences({ orderEmail: prefOrderEmail, newsletter: prefNewsletter }); }} className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={prefOrderEmail}
                    onChange={(e) => setPrefOrderEmail(e.target.checked)}
                    className="w-4 h-4 rounded border border-zinc-200 accent-[#F9A37E] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Order Status Emails</span>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Receive real-time automated updates regarding print statuses and courier delivery tracking.</span>
                  </div>
                </label>

                <label className="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors">
                  <input
                    type="checkbox"
                    checked={prefNewsletter}
                    onChange={(e) => setPrefNewsletter(e.target.checked)}
                    className="w-4 h-4 rounded border border-zinc-200 accent-[#F9A37E] mt-0.5"
                  />
                  <div>
                    <span className="text-xs font-bold text-zinc-800 block">Marketing Newsletter</span>
                    <span className="text-[10px] text-zinc-400 mt-1 block">Subscribe to our newsletter for exclusive drops, holiday sales, and special product customizer design ideas.</span>
                  </div>
                </label>

                <button type="submit" className="bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs py-2.5 px-6 rounded-lg transition-colors shadow-sm">
                  Save Preferences
                </button>
              </form>

              {/* Danger zone delete */}
              <div className="p-6 border border-red-200/50 bg-red-50/20 dark:border-red-950/40 dark:bg-red-950/10 rounded-lg space-y-4">
                <div className="flex gap-3">
                  <ShieldAlert className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <span className="font-extrabold text-red-650 dark:text-red-400 block">Delete Account</span>
                    <span className="text-zinc-500 dark:text-zinc-400 mt-1 block">Deleting your account is permanent. All design canvas setups, wishlist saves, and order invoices history ledger will be deleted forever.</span>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs py-2 px-4 rounded-lg transition-colors shadow"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
