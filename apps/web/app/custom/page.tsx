"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import { Upload, Move, RotateCw, ZoomIn, Plus, Minus, ShoppingBag, Eye, HelpCircle } from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';



const COLORS = [
  { name: 'White', hex: '#FFFFFF', border: 'border-zinc-300' },
  { name: 'Black', hex: '#18181B', border: 'border-transparent' },
  { name: 'Navy Blue', hex: '#1E3A8A', border: 'border-transparent' },
  { name: 'Heather Grey', hex: '#94A3B8', border: 'border-transparent' },
  { name: 'Sage Green', hex: '#A8C69F', border: 'border-transparent' },
  { name: 'Peach', hex: '#F9A37E', border: 'border-transparent' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// ── REALISTIC SHADED GARMENT SVGS ──

const RealisticTShirtSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="tshirtShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
      </linearGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    {/* Soft Drop Shadow */}
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlur)" />
    
    {/* Base Fabric Outline */}
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 C 154,86 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,86 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
    
    {/* Volumetric Shading */}
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 C 154,86 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,86 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" fill="url(#tshirtShade)" pointerEvents="none" />
    
    {/* Seams and folds */}
    <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#000" strokeWidth="2" opacity="0.35" />
    <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#fff" strokeWidth="0.8" opacity="0.25" />
    
    {/* Armpit wrinkles */}
    <path d="M 58,95 C 66,99 64,106 61,114" fill="none" stroke="#000" strokeWidth="2" opacity="0.2" filter="url(#softBlur)" />
    <path d="M 142,95 C 134,99 136,106 139,114" fill="none" stroke="#000" strokeWidth="2" opacity="0.2" filter="url(#softBlur)" />
    
    {/* Shoulder highlights */}
    <path d="M 40,30 C 50,30 65,34 75,34" fill="none" stroke="#fff" strokeWidth="2" opacity="0.2" />
    <path d="M 160,30 C 150,30 135,34 125,34" fill="none" stroke="#fff" strokeWidth="2" opacity="0.2" />
    
    {/* Fabric drape folds */}
    <path d="M 96,44 Q 82,110 74,180" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.12" filter="url(#softBlur)" />
    <path d="M 104,44 Q 118,110 126,180" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.12" filter="url(#softBlur)" />
  </svg>
);

const RealisticPoloSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="poloShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
      </linearGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlur)" />
    
    {/* Base Polo shape */}
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" fill="url(#poloShade)" pointerEvents="none" />
    
    {/* Collar Details with shadows */}
    <path d="M 75,37 L 90,56 L 100,56 L 110,56 L 125,37" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 75,37 Q 100,44 125,37" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.3" />
    <path d="M 90,56 L 100,78 L 110,56" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" />
    <path d="M 100,56 L 100,92" fill="none" stroke="#18181b" strokeWidth="1.5" />
    
    {/* Buttons with thread crosses */}
    <circle cx="100" cy="64" r="2" fill="#E8E2D6" stroke="#222" strokeWidth="0.5" />
    <circle cx="100" cy="76" r="2" fill="#E8E2D6" stroke="#222" strokeWidth="0.5" />
    <circle cx="100" cy="88" r="2" fill="#E8E2D6" stroke="#222" strokeWidth="0.5" />

    {/* Sleeve ribs */}
    <path d="M 33,63 C 38,72 40,75 42,78" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.15" />
    <path d="M 167,63 C 162,72 160,75 158,78" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.15" />
    
    {/* Folds */}
    <path d="M 58,102 Q 70,105 82,102" fill="none" stroke="#000" strokeWidth="2" opacity="0.1" filter="url(#softBlur)" />
    <path d="M 142,102 Q 130,105 118,102" fill="none" stroke="#000" strokeWidth="2" opacity="0.1" filter="url(#softBlur)" />
    <path d="M 97,94 Q 85,140 80,185" fill="none" stroke="#000" strokeWidth="3" opacity="0.12" filter="url(#softBlur)" />
    <path d="M 103,94 Q 115,140 120,185" fill="none" stroke="#000" strokeWidth="3" opacity="0.12" filter="url(#softBlur)" />
  </svg>
);

const RealisticShirtSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
    <defs>
      <linearGradient id="shirtShade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
      </linearGradient>
      <filter id="softBlur">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlur)" />
    
    {/* Base Button down Shirt Outline */}
    <path d="M 45,28 C 52,28 65,34 75,34 C 85,34 90,32 100,32 C 110,32 115,34 125,34 C 135,34 148,28 155,28 C 163,28 168,34 168,40 C 168,48 160,78 156,84 C 152,90 142,90 142,90 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,90 C 58,90 48,90 44,84 C 40,78 32,48 32,40 C 32,34 37,28 45,28 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" strokeLinejoin="round" />
    <path d="M 45,28 C 52,28 65,34 75,34 C 85,34 90,32 100,32 C 110,32 115,34 125,34 C 135,34 148,28 155,28 C 163,28 168,34 168,40 C 168,48 160,78 156,84 C 152,90 142,90 142,90 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,90 C 58,90 48,90 44,84 C 40,78 32,48 32,40 C 32,34 37,28 45,28 Z" fill="url(#shirtShade)" pointerEvents="none" />
    
    {/* Collar Folds */}
    <path d="M 75,34 L 88,48 L 100,48" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 125,34 L 112,48 L 100,48" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 75,34 C 88,38 112,38 125,34" fill="none" stroke="#000" strokeWidth="2.5" opacity="0.3" />
    
    {/* Left and Right overlapping panels */}
    <path d="M 100,48 L 100,195" fill="none" stroke="#18181b" strokeWidth="2" />
    <path d="M 103,48 L 103,195" fill="none" stroke="#000" strokeWidth="0.8" opacity="0.15" />
    
    {/* Buttons */}
    {[58, 83, 108, 133, 158, 183].map(y => (
      <circle key={y} cx="100" cy={y} r="2.2" fill="#FFFFFF" stroke="#18181b" strokeWidth="0.6" />
    ))}

    {/* Pocket outline with stitching */}
    <path d="M 68,75 L 85,75 L 85,98 C 85,98 81,104 76.5,104 C 72,104 68,98 68,98 Z" fill="none" stroke="#18181b" strokeWidth="1.2" />
    <path d="M 69,76 L 84,76 L 84,97 C 84,97 80,103 76.5,103 C 73,103 69,97 69,97 Z" fill="none" stroke="#000" strokeWidth="1" strokeDasharray="1,1" opacity="0.4" />
    
    {/* Fabric Crease Lines */}
    <path d="M 58,98 C 66,104 68,112 65,124" fill="none" stroke="#000" strokeWidth="2" opacity="0.18" filter="url(#softBlur)" />
    <path d="M 142,98 C 134,104 132,112 135,124" fill="none" stroke="#000" strokeWidth="2" opacity="0.18" filter="url(#softBlur)" />
    <path d="M 82,115 Q 75,150 72,185" fill="none" stroke="#000" strokeWidth="2" opacity="0.08" filter="url(#softBlur)" />
    <path d="M 118,115 Q 125,150 128,185" fill="none" stroke="#000" strokeWidth="2" opacity="0.08" filter="url(#softBlur)" />
  </svg>
);

export default function CustomizerPage() {
  const router = useRouter();
  const { addToCart, showToast, currentUser, companySettings, settingsLoading, settingsResponseTime } = useApp();

  React.useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Active configurations
  const [garmentType, setGarmentType] = useState<'tshirt' | 'polo' | 'shirt'>('tshirt');
  const [selectedColor, setSelectedColor] = useState<(typeof COLORS)[number]>(COLORS[0]!);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [activeTab, setActiveTab] = useState<'style' | 'graphics'>('style');

  // Design artwork layers (separate for Front and Back)
  const [frontDesign, setFrontDesign] = useState({
    imageSrc: '',
    imageX: 50,
    imageY: 50,
    imageScale: 40,
    imageRotation: 0,
  });

  const [backDesign, setBackDesign] = useState({
    imageSrc: '',
    imageX: 50,
    imageY: 45,
    imageScale: 50,
    imageRotation: 0,
  });

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic garment base pricing from api metadata
  const PRICES = {
    tshirt: Number(companySettings?.customTshirtPrice || 599),
    polo: Number(companySettings?.customPoloPrice || 799),
    shirt: Number(companySettings?.customShirtPrice || 999),
  };

  const GARMENT_TYPES = [
    { id: 'tshirt', name: 'T-Shirt', basePrice: PRICES.tshirt, desc: 'Classic crew neck soft cotton tee' },
    { id: 'polo', name: 'Polo T-Shirt', basePrice: PRICES.polo, desc: 'Premium ribbed collar sporty polo' },
    { id: 'shirt', name: 'Casual Shirt', basePrice: PRICES.shirt, desc: 'Button-down casual premium cotton shirt' },
  ];

  // Render skeleton loading state
  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 w-48 bg-zinc-200 animate-pulse rounded" />

          {/* Main Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Design mockup workspace skeleton */}
            <div className="lg:col-span-7 bg-white border border-[#E8E2D6] rounded-2xl p-6 sm:p-12 shadow-sm relative aspect-square flex items-center justify-center animate-pulse">
              <div className="w-80 h-80 bg-zinc-150 rounded-full opacity-60" />
            </div>

            {/* Right: Styles options sidebar skeleton */}
            <div className="lg:col-span-5 bg-white border border-[#E8E2D6] rounded-2xl p-6 shadow-sm space-y-6 animate-pulse">
              <div className="h-6 w-3/4 bg-zinc-200 rounded" />
              <div className="h-4 w-1/2 bg-zinc-200 rounded" />
              <div className="space-y-3">
                <div className="h-12 w-full bg-zinc-100 rounded-xl" />
                <div className="h-12 w-full bg-zinc-100 rounded-xl" />
                <div className="h-12 w-full bg-zinc-100 rounded-xl" />
              </div>
              <div className="h-8 w-1/3 bg-zinc-200 rounded" />
              <div className="h-12 w-full bg-[#FBD5C1]/40 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Compute values
  const activeDesign = currentView === 'front' ? frontDesign : backDesign;
  const setActiveDesign = currentView === 'front' ? setFrontDesign : setBackDesign;

  const basePrice = PRICES[garmentType];
  const frontCustomized = !!frontDesign.imageSrc;
  const backCustomized = !!backDesign.imageSrc;
  const customizationFee = (frontCustomized ? 150 : 0) + (backCustomized ? 150 : 0);
  const itemPrice = basePrice + customizationFee;
  const totalPrice = itemPrice * quantity;

  // File uploading handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setActiveDesign(prev => ({ ...prev, imageSrc: base64 }));
      showToast("Design Loaded", "Graphic successfully positioned on mockup workspace.", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleResetDesign = () => {
    setActiveDesign(prev => ({
      ...prev,
      imageSrc: '',
      imageX: 50,
      imageY: 50,
      imageScale: 40,
      imageRotation: 0,
    }));
    showToast("Design Removed", "Positioning coordinates reset.", "info");
  };

  // Add customized item to cart
  const handleAddToCart = async () => {
    setUploading(true);
    let frontUploadedUrl = '';
    let backUploadedUrl = '';

    try {
      if (frontDesign.imageSrc) {
        const res = await fetch(getApiUrl('/cloudinary/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: frontDesign.imageSrc }),
        });
        const data = await res.json();
        frontUploadedUrl = data.url || frontDesign.imageSrc;
      }

      if (backDesign.imageSrc) {
        const res = await fetch(getApiUrl('/cloudinary/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: backDesign.imageSrc }),
        });
        const data = await res.json();
        backUploadedUrl = data.url || backDesign.imageSrc;
      }

      const customDesignMeta = {
        productType: garmentType,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        front: {
          imageUrl: frontUploadedUrl,
          imageX: frontDesign.imageX,
          imageY: frontDesign.imageY,
          imageScale: frontDesign.imageScale,
          imageRotation: frontDesign.imageRotation,
        },
        back: {
          imageUrl: backUploadedUrl,
          imageX: backDesign.imageX,
          imageY: backDesign.imageY,
          imageScale: backDesign.imageScale,
          imageRotation: backDesign.imageRotation,
        }
      };

      const thumbnailImage = frontDesign.imageSrc || '/kliamologoNew.png';

      addToCart({
        productId: `custom-${garmentType}`,
        name: `Custom ${garmentType.charAt(0).toUpperCase() + garmentType.slice(1)} (${selectedColor.name})`,
        price: itemPrice,
        quantity: quantity,
        image: thumbnailImage,
        size: selectedSize,
        color: selectedColor.name,
        customDesign: {
          textLayers: [],
          imageLayers: [],
          view: 'front',
          productColor: selectedColor.hex,
          baseImage: JSON.stringify(customDesignMeta),
        }
      });

      router.push('/cart');
    } catch (err) {
      console.error(err);
      showToast("Submission Error", "Error syncing custom design with Cloudinary.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6 pb-12 md:pb-16">
      <div className="flex justify-between items-center flex-wrap gap-2">
        <Breadcrumb items={[{ name: "Design Studio" }]} />
        {settingsResponseTime !== null && (
          <span className="text-[10px] font-extrabold text-zinc-400 bg-zinc-100 border border-zinc-200/60 rounded-full px-2.5 py-1 tracking-wider uppercase flex items-center gap-1 animate-fade-in">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            API Latency: {settingsResponseTime}ms
          </span>
        )}
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* LEFT COLUMN: VISUAL DESIGN CANVAS WORKSPACE */}
        <div className="flex-1 flex flex-col items-center justify-between border border-[#E8E2D6] bg-white rounded-2xl p-3 md:p-6 relative overflow-hidden min-h-[500px]">
          
          <div className="w-full flex items-center justify-between z-10 flex-col gap-2 sm:flex-row flex-wrap">
            <div className="flex gap-2 bg-[#FDFAF6] border border-[#E8E2D6] rounded-full p-1 shadow-sm">
              <button
                onClick={() => setCurrentView('front')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'front' ? 'bg-[#F9A37E] text-white' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Front View
              </button>
              <button
                onClick={() => setCurrentView('back')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'back' ? 'bg-[#F9A37E] text-white' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Back View
              </button>
            </div>
            
            <button
              onClick={handleResetDesign}
              className="text-xs font-extrabold text-[#7A736A] hover:text-[#4A453E] px-3 py-1.5 border border-[#E8E2D6] rounded-lg hover:bg-zinc-50 transition-colors"
            >
              Remove Design
            </button>
          </div>

          {/* Shaded apparel canvas */}
          <div className="relative w-full max-w-sm aspect-square my-auto flex items-center justify-center p-1 sm:p-4">
            
            <div className="w-full h-full">
              {garmentType === 'tshirt' && <RealisticTShirtSvg color={selectedColor.hex} />}
              {garmentType === 'polo' && <RealisticPoloSvg color={selectedColor.hex} />}
              {garmentType === 'shirt' && <RealisticShirtSvg color={selectedColor.hex} />}
            </div>

            {/* Bounding box print area */}
            <div 
              className="absolute border border-dashed border-[#F9A37E]/40 bg-[#F9A37E]/2 rounded-lg z-10 flex items-center justify-center pointer-events-none"
              style={{
                width: garmentType === 'shirt' ? '30%' : '38%',
                height: '42%',
                top: garmentType === 'shirt' ? '32%' : '28%',
                left: garmentType === 'shirt' ? '38%' : '31%',
              }}
            >
              <span className="absolute -top-5 text-[8px] font-bold text-[#F9A37E] uppercase tracking-wider">Printable Area</span>
              
              {activeDesign.imageSrc && (
                <div
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${activeDesign.imageX}%`,
                    top: `${activeDesign.imageY}%`,
                    transform: `translate(-50%, -50%) scale(${activeDesign.imageScale / 100}) rotate(${activeDesign.imageRotation}deg)`,
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={activeDesign.imageSrc}
                    alt="Design Graphic Overlay"
                    className="w-full h-full object-contain pointer-events-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#A89B8A] bg-[#FDFAF6] border border-[#E8E2D6] px-4 py-2 rounded-full w-full max-w-sm justify-center">
            <HelpCircle className="w-3.5 h-3.5 text-[#F9A37E]" />
            <span>Position your artwork exactly inside the dotted boundary</span>
          </div>

        </div>

        {/* RIGHT COLUMN: PREPARATION CONTROLS */}
        <div className="w-full lg:w-96 flex flex-col gap-5">
          
          <div className="bg-white border border-[#E8E2D6] rounded-2xl p-3 sm:p-5 shadow-sm space-y-5">
            
            <div className="flex border-b border-[#E8E2D6] pb-3 gap-2">
              {[
                { id: 'style', name: 'Garment Options', icon: ShoppingBag },
                { id: 'graphics', name: 'Graphic Design', icon: Upload },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`flex-1 flex flex-col items-center py-2 rounded-lg font-extrabold text-[10px] uppercase tracking-wider transition-all border ${activeTab === t.id ? 'border-[#F9A37E] bg-[#FDFAF6] text-[#e8855a]' : 'border-transparent text-[#7A736A] hover:bg-[#FDFAF6]'}`}
                  >
                    <Icon className="w-4 h-4 mb-1" />
                    {t.name}
                  </button>
                );
              })}
            </div>

            {/* TAB: STYLE OPTIONS */}
            {activeTab === 'style' && (
              <div className="space-y-4 animate-fade-in-up duration-200">
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A453E]">Garment Type</label>
                  <div className="space-y-2">
                    {GARMENT_TYPES.map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGarmentType(g.id as any)}
                        className={`w-full text-left p-3 border rounded-xl flex items-center justify-between transition-all ${garmentType === g.id ? 'border-[#F9A37E] bg-[#F9A37E]/5' : 'border-[#E8E2D6] hover:border-zinc-300 bg-white'}`}
                      >
                        <div>
                          <p className="font-extrabold text-xs text-[#4A453E]">{g.name}</p>
                          <p className="text-[10px] text-[#A89B8A] mt-0.5">{g.desc}</p>
                        </div>
                        <span className="font-black text-xs text-[#4A453E]">₹{g.basePrice}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A453E]">Garment Color: <span className="text-[#F9A37E]">{selectedColor.name}</span></label>
                  <div className="flex gap-2 flex-wrap">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c)}
                        title={c.name}
                        className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${selectedColor.name === c.name ? 'border-[#F9A37E] scale-110' : 'border-zinc-200'}`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor.name === c.name && (
                          <div className={`w-2 h-2 rounded-full ${c.name === 'White' ? 'bg-[#18181B]' : 'bg-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A453E]">Select Size</label>
                  <div className="flex gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`w-10 h-10 rounded-lg border font-black text-xs transition-all ${selectedSize === s ? 'border-[#F9A37E] bg-[#F9A37E] text-white shadow-md' : 'border-[#E8E2D6] bg-white text-[#7A736A] hover:border-zinc-300'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A453E]">Quantity</label>
                  <div className="flex items-center border border-[#E8E2D6] rounded-lg bg-[#FDFAF6] h-10 w-32 overflow-hidden shadow-sm">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="flex-1 text-sm font-black text-center text-[#4A453E]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: GRAPHIC WORKSPACE SLIDERS */}
            {activeTab === 'graphics' && (
              <div className="space-y-4 animate-fade-in-up duration-200">
                
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#4A453E]">Upload Custom Artwork</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {activeDesign.imageSrc ? (
                    <div className="p-3 border border-[#E8E2D6] rounded-xl flex items-center gap-3 bg-[#FDFAF6]">
                      <div className="w-12 h-12 bg-white border border-[#E8E2D6] rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={activeDesign.imageSrc} alt="Thumbnail preview" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[#4A453E] truncate">Custom Artwork Active</p>
                        <p className="text-[10px] text-[#A89B8A] mt-0.5">Click replace to upload new image</p>
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[10px] font-bold text-[#F9A37E] hover:underline"
                      >
                        Replace
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-[#E8E2D6] hover:border-[#F9A37E] rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-[#FDFAF6] transition-all"
                    >
                      <Upload className="w-6 h-6 text-[#A8C69F]" />
                      <p className="text-xs font-bold text-[#4A453E]">Select Image (PNG / JPG)</p>
                      <p className="text-[9px] text-[#A89B8A]">Transparent PNGs work best</p>
                    </button>
                  )}
                </div>

                {activeDesign.imageSrc && (
                  <div className="space-y-3 pt-3 border-t border-[#E8E2D6]">
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#4A453E]">
                        <span>Graphic Size (Scale)</span>
                        <span className="text-[#F9A37E]">{activeDesign.imageScale}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={activeDesign.imageScale}
                        onChange={(e) => setActiveDesign(prev => ({ ...prev, imageScale: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#F9A37E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#4A453E]">
                        <span>Rotation</span>
                        <span className="text-[#F9A37E]">{activeDesign.imageRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={activeDesign.imageRotation}
                        onChange={(e) => setActiveDesign(prev => ({ ...prev, imageRotation: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#F9A37E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#4A453E]">
                        <span>Horizontal Position</span>
                        <span className="text-[#F9A37E]">{activeDesign.imageX - 50} px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={activeDesign.imageX}
                        onChange={(e) => setActiveDesign(prev => ({ ...prev, imageX: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#F9A37E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-[#4A453E]">
                        <span>Vertical Position</span>
                        <span className="text-[#F9A37E]">{activeDesign.imageY - 50} px</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="90"
                        value={activeDesign.imageY}
                        onChange={(e) => setActiveDesign(prev => ({ ...prev, imageY: parseInt(e.target.value) }))}
                        className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#F9A37E]"
                      />
                    </div>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* ── REALISTIC FINAL COMPOSITE REVIEW SECTION ── */}
          {(frontDesign.imageSrc || backDesign.imageSrc) && (
            <div className="bg-white border border-[#E8E2D6] rounded-2xl p-5 shadow-sm space-y-4 animate-fade-in-up duration-300">
              <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-2">
                <h3 className="font-extrabold text-xs text-[#4A453E] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#F9A37E]" />
                  Final Realistic Review
                </h3>
                <span className="text-[9px] bg-emerald-50 text-emerald-600 font-extrabold px-2 py-0.5 rounded-full uppercase">Ready</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 justify-center items-center py-2 bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl">
                {/* Front Side Composite Mini Preview */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full">
                      {garmentType === 'tshirt' && <RealisticTShirtSvg color={selectedColor.hex} />}
                      {garmentType === 'polo' && <RealisticPoloSvg color={selectedColor.hex} />}
                      {garmentType === 'shirt' && <RealisticShirtSvg color={selectedColor.hex} />}
                    </div>
                    {frontDesign.imageSrc && (
                      <div 
                        className="absolute pointer-events-none"
                        style={{
                          width: garmentType === 'shirt' ? '30%' : '38%',
                          height: '42%',
                          top: garmentType === 'shirt' ? '32%' : '28%',
                          left: garmentType === 'shirt' ? '38%' : '31%',
                        }}
                      >
                        <div
                          className="absolute w-full h-full"
                          style={{
                            left: `${frontDesign.imageX}%`,
                            top: `${frontDesign.imageY}%`,
                            transform: `translate(-50%, -50%) scale(${frontDesign.imageScale / 100}) rotate(${frontDesign.imageRotation}deg)`,
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <img src={frontDesign.imageSrc} alt="" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-[#7A736A] uppercase tracking-wider">Front Preview</span>
                </div>

                {/* Back Side Composite Mini Preview */}
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-28 h-28 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full">
                      {garmentType === 'tshirt' && <RealisticTShirtSvg color={selectedColor.hex} />}
                      {garmentType === 'polo' && <RealisticPoloSvg color={selectedColor.hex} />}
                      {garmentType === 'shirt' && <RealisticShirtSvg color={selectedColor.hex} />}
                    </div>
                    {backDesign.imageSrc && (
                      <div 
                        className="absolute pointer-events-none"
                        style={{
                          width: garmentType === 'shirt' ? '30%' : '38%',
                          height: '42%',
                          top: garmentType === 'shirt' ? '32%' : '28%',
                          left: garmentType === 'shirt' ? '38%' : '31%',
                        }}
                      >
                        <div
                          className="absolute w-full h-full"
                          style={{
                            left: `${backDesign.imageX}%`,
                            top: `${backDesign.imageY}%`,
                            transform: `translate(-50%, -50%) scale(${backDesign.imageScale / 100}) rotate(${backDesign.imageRotation}deg)`,
                            width: '100%',
                            height: '100%',
                          }}
                        >
                          <img src={backDesign.imageSrc} alt="" className="w-full h-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-bold text-[#7A736A] uppercase tracking-wider">Back Preview</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing summary & CTA */}
          <div className="bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl p-3 sm:p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-sm text-[#4A453E] border-b border-[#E8E2D6] pb-2">Pricing Details</h3>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-[#7A736A]">
                <span>Base Apparel</span>
                <span className="font-bold text-[#4A453E]">₹{basePrice.toFixed(2)}</span>
              </div>
              
              {customizationFee > 0 && (
                <div className="flex justify-between text-[#7A736A]">
                  <span>Custom Design Fee</span>
                  <span className="font-bold text-[#4A453E]">₹{customizationFee.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-[#7A736A]">
                <span>Quantity</span>
                <span className="font-bold text-[#4A453E]">x {quantity}</span>
              </div>

              <div className="flex justify-between border-t border-[#E8E2D6] pt-2 text-sm font-black">
                <span className="text-[#4A453E]">Total</span>
                <span className="text-[#F9A37E]">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={uploading}
              className="w-full bg-[#F9A37E] hover:bg-[#E8855A] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-[#F9A37E]/25 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span>Uploading design...</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Add Custom Apparel to Cart
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
