"use client";

import React, { useState } from 'react';
import { Copy, MapPin, Truck, Calendar, Download, FileText, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Address, Order, Transaction, useApp } from './AppContext';
import { StatusBadge, Rating, Price } from './UIComponents';
import { CustomGarmentPreview } from './CustomGarmentPreview';
import { downloadOrderInvoice } from '../utils/invoiceGenerator';

/* 1. PRODUCT GALLERY (Draggable Fade-Slide Slider) */
export const ProductGallery: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const galleryImages = images && images.length > 0 ? images : ["/placeholder.png"];
  const total = galleryImages.length;

  React.useEffect(() => {
    setActiveIdx(0);
  }, [images]);

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % total);
    setDragOffset(0);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + total) % total);
    setDragOffset(0);
  };

  // Mouse Drag Events
  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return;
    const diff = e.clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (isDragging && Math.abs(dragOffset) > 40) {
      if (dragOffset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragOffset(0);
  };

  // Touch Swipe Events
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && e.touches.length === 1) {
      setDragStartX(touch.clientX);
      setIsDragging(true);
      setDragOffset(0);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && isDragging && dragStartX !== null && e.touches.length === 1) {
      const diff = touch.clientX - dragStartX;
      setDragOffset(diff);
    }
  };

  const handleTouchEnd = () => {
    if (isDragging && Math.abs(dragOffset) > 40) {
      if (dragOffset < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setIsDragging(false);
    setDragStartX(null);
    setDragOffset(0);
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      {/* Thumbnails list */}
      {total > 1 && (
        <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => { setActiveIdx(idx); setDragOffset(0); }}
              className={`relative w-14 h-14 rounded-lg overflow-hidden bg-[#F5F0E8] flex-shrink-0 transition-all focus:outline-none ${
                activeIdx === idx ? 'shadow-sm' : ''
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${idx + 1}`} width={80} height={80} loading="lazy" className="w-full h-full object-cover" />
              <div
                className={`absolute inset-0 rounded-lg border-2 pointer-events-none transition-colors ${
                  activeIdx === idx ? 'border-[#F9A37E]' : 'border-[#E8E2D6]/40'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Slider with Drag / Swipe & Cross-Fade Effect */}
      <div
        className="relative aspect-square w-full bg-[#F5F0E8] rounded-lg overflow-hidden order-1 md:order-2 border border-[#E8E2D6] select-none touch-pan-y"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {galleryImages.map((img, idx) => {
          const isActive = idx === activeIdx;
          return (
            <div
              key={idx}
              className={`absolute inset-0 w-full h-full transition-all duration-500 ease-out ${
                isActive
                  ? 'opacity-100 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 scale-95 pointer-events-none z-0'
              }`}
              style={
                isActive && dragOffset !== 0
                  ? {
                      transform: `translateX(${dragOffset}px) scale(0.98)`,
                      opacity: Math.max(0.4, 1 - Math.abs(dragOffset) / 300),
                      transition: 'none',
                    }
                  : undefined
              }
            >
              <img
                src={img}
                alt={`${name} slide ${idx + 1}`}
                width={600}
                height={600}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          );
        })}

        {/* Slide Counter Badge */}
        {total > 1 && (
          <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-xs text-white text-[10px] font-extrabold py-1 px-2.5 rounded-full pointer-events-none">
            {activeIdx + 1} / {total}
          </div>
        )}
      </div>
    </div>
  );
};

/* 2. REVIEW CARD */
interface ReviewCardProps { name: string; rating: number; date: string; comment: string; verified: boolean; }
export const ReviewCard: React.FC<ReviewCardProps> = ({ name, rating, date, comment, verified }) => (
  <div className="p-4 border border-[#E8E2D6] rounded-lg bg-white space-y-3">
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-extrabold text-sm text-[#4A453E]">{name}</span>
          {verified && (
            <span className="inline-flex items-center text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md whitespace-nowrap">
              Verified Purchase
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#A89B8A] block">{date}</span>
      </div>
      <div className="flex-shrink-0 self-start sm:self-auto">
        <Rating value={rating} size={3.5} />
      </div>
    </div>
    <p className="text-xs text-[#7A736A] leading-relaxed">{comment}</p>
  </div>
);

/* 3. COUPON CARD */
export const CouponCard: React.FC<{ code: string; discountDesc: string; expiry: string }> = ({ code, discountDesc, expiry }) => {
  const { showToast } = useApp();
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    showToast("Coupon Copied", `Promo code ${code} copied!`, "success");
  };
  return (
    <div className="border border-dashed border-[#F9A37E]/50 bg-[#FBD5C1]/20 rounded-lg p-4 flex items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-xs text-[#4A453E] bg-white border border-[#E8E2D6] py-1 px-2.5 rounded-lg tracking-wider font-mono">
            {code}
          </span>
          <span className="text-xs font-bold text-[#F9A37E]">{discountDesc}</span>
        </div>
        <p className="text-[10px] text-[#A89B8A]">Expires: {expiry}</p>
      </div>
      <button onClick={handleCopy} className="p-2 bg-[#F9A37E] hover:bg-[#E8855A] text-white rounded-lg transition-all hover:scale-105" title="Copy Code">
        <Copy className="w-4 h-4" />
      </button>
    </div>
  );
};

/* 4. ADDRESS CARD */
interface AddressCardProps { address: Address; onEdit: (a: Address) => void; onDelete: (id: string) => void; onSetDefault: (id: string) => void; }
export const AddressCard: React.FC<AddressCardProps> = ({ address, onEdit, onDelete, onSetDefault }) => (
  <div className={`p-4 border rounded-lg bg-white flex flex-col justify-between gap-3 transition-all ${address.isDefault ? 'border-[#F9A37E] shadow-sm shadow-[#F9A37E]/20' : 'border-[#E8E2D6]'}`}>
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-extrabold text-sm text-[#4A453E]">{address.fullName}</h4>
        {address.isDefault && (
          <span className="bg-[#FBD5C1] text-[#E8855A] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#F9A37E]/30">
            Default
          </span>
        )}
      </div>
      <div className="space-y-1 text-xs text-[#7A736A]">
        <p className="flex items-start gap-1.5">
          <MapPin className="w-3.5 h-3.5 mt-0.5 text-[#A89B8A] flex-shrink-0" />
          <span>{address.street}, {address.city}, {address.state} {address.zip}, {address.country}</span>
        </p>
        <p>Phone: {address.phone}</p>
      </div>
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D6]">
      {!address.isDefault ? (
        <button onClick={() => onSetDefault(address.id)} className="text-[10px] font-bold text-[#A89B8A] hover:text-[#F9A37E] transition-colors">
          Set Default
        </button>
      ) : (
        <span className="text-[10px] text-[#A89B8A] flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Default Shipping
        </span>
      )}
      <div className="flex gap-3 text-[10px] font-bold">
        <button onClick={() => onEdit(address)} className="text-[#7A736A] hover:text-[#4A453E]">Edit</button>
        <button onClick={() => onDelete(address.id)} className="text-red-400 hover:text-red-600">Delete</button>
      </div>
    </div>
  </div>
);

/* 5. ORDER CARD */
export const OrderCard: React.FC<{ order: Order; onViewDetails: (id: string) => void }> = ({ order, onViewDetails }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);

  const handleDownloadInvoice = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      await downloadOrderInvoice(order.id, order);
    } catch (err) {
      console.error("Error downloading invoice:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="p-4 border border-[#E8E2D6] rounded-lg bg-white space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E8E2D6]">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-sm text-[#4A453E]">{order.id}</span>
          <StatusBadge status={order.status} />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#A89B8A]">
          <Calendar className="w-3.5 h-3.5" />
          <span>{order.date}</span>
        </div>
      </div>
      <div className="flex gap-3">
        <CustomGarmentPreview
          customDesign={order.itemsJson && Array.isArray(order.itemsJson) ? order.itemsJson[0]?.customDesign : undefined}
          defaultImage={order.items[0]?.image}
          view="front"
          className="w-14 h-14"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-xs text-[#4A453E] truncate">{order.items[0]?.name}</h4>
          <p className="text-[10px] text-[#A89B8A] mt-0.5">
            Size: {order.items[0]?.size} · Color: {order.items[0]?.color} · Qty: {order.items[0]?.quantity}
          </p>
          {order.items.length > 1 && (
            <p className="text-[10px] text-[#F9A37E] font-extrabold mt-1">+{order.items.length - 1} more item(s)</p>
          )}
        </div>
        <div className="text-right">
          <span className="font-extrabold text-sm text-[#4A453E]">₹{order.total.toFixed(2)}</span>
          <p className="text-[10px] text-[#A89B8A] mt-1">({itemsCount} units)</p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-3 border-t border-[#E8E2D6] text-xs">
        <div className="flex items-center gap-1 text-[#A89B8A]">
          <Truck className="w-3.5 h-3.5 text-[#A8C69F]" />
          <span className="text-[10px]">Tracking: <span className="font-semibold text-[#4A453E]">{order.trackingNumber || "N/A"}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadInvoice}
            disabled={isDownloading}
            className="flex items-center gap-1 text-xs font-bold text-zinc-700 hover:text-[#E8855A] border border-[#E8E2D6] hover:border-[#F9A37E] px-2.5 py-1 rounded transition-colors disabled:opacity-50"
            title="Download PDF Invoice"
          >
            {isDownloading ? <Loader2 className="w-3 h-3 animate-spin text-[#F9A37E]" /> : <Download className="w-3 h-3 text-[#F9A37E]" />}
            <span>Invoice</span>
          </button>
          <button onClick={() => onViewDetails(order.id)} className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] hover:underline">
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

/* 6. TRANSACTION CARD */
export const TransactionCard: React.FC<{ txn: Transaction }> = ({ txn }) => (
  <div className="p-4 border border-[#E8E2D6] rounded-lg bg-white flex items-center justify-between gap-4">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-[#E8E2D6] rounded-lg flex items-center justify-center">
        <FileText className="w-5 h-5 text-[#A8C69F]" />
      </div>
      <div>
        <span className="font-bold text-xs text-[#4A453E] block">{txn.id}</span>
        <span className="text-[10px] text-[#A89B8A] mt-0.5 block">Order: {txn.orderId} · {txn.date}</span>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className="text-right">
        <span className="font-extrabold text-xs text-[#4A453E] block">
          {txn.type === 'Payment' ? '-' : '+'}₹{txn.amount.toFixed(2)}
        </span>
        <span className="text-[9px] mt-0.5 inline-block"><StatusBadge status={txn.status} /></span>
      </div>
      <button
        className="p-2 border border-[#E8E2D6] text-[#A89B8A] hover:text-[#4A453E] rounded-lg transition-all"
        title="Download Receipt"
        onClick={() => alert("Simulating invoice download...")}
      >
        <Download className="w-4 h-4" />
      </button>
    </div>
  </div>
);
