"use client";

import React, { useState } from 'react';
import { Copy, MapPin, Truck, Calendar, Download, FileText, CheckCircle2 } from 'lucide-react';
import { Address, Order, Transaction, useApp } from './AppContext';
import { StatusBadge, Rating, Price } from './UIComponents';
import { CustomGarmentPreview } from './CustomGarmentPreview';

/* 1. PRODUCT GALLERY */
export const ProductGallery: React.FC<{ images: string[]; name: string }> = ({ images, name }) => {
  const [activeImage, setActiveImage] = useState(images[0] || "");
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(2)' });
  };

  return (
    <div className="flex flex-col md:flex-row gap-3">
      <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`w-14 h-14 rounded-lg overflow-hidden border-2 bg-[#F5F0E8] flex-shrink-0 transition-all ${activeImage === img ? 'border-[#F9A37E] scale-105' : 'border-transparent'}`}
          >
            <img src={img} alt={`${name} ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <div
        className="relative aspect-square w-full bg-[#F5F0E8] rounded-lg overflow-hidden cursor-zoom-in order-1 md:order-2 border border-[#E8E2D6]"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomStyle({})}
      >
        <img src={activeImage} alt={name} style={zoomStyle} className="w-full h-full object-cover transition-transform duration-75" />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-[10px] font-bold py-1 px-2.5 rounded-full pointer-events-none">
          Hover to Zoom
        </div>
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
  const itemsCount = order.items.reduce((acc, it) => acc + it.quantity, 0);
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
        <button onClick={() => onViewDetails(order.id)} className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] hover:underline">
          View Details →
        </button>
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
