"use client";

import React from 'react';

interface PreviewSpecs {
  productType: string;
  color: string;
  colorHex: string;
  front?: {
    imageUrl: string;
    imageX: number;
    imageY: number;
    imageScale: number;
    imageRotation: number;
  };
  back?: {
    imageUrl: string;
    imageX: number;
    imageY: number;
    imageScale: number;
    imageRotation: number;
  };
}

interface CustomGarmentPreviewProps {
  customDesign?: {
    baseImage?: string; // stringified JSON of PreviewSpecs
    productColor?: string;
  };
  defaultImage?: string;
  view?: 'front' | 'back' | 'both';
  className?: string; // container dimension, e.g. "w-20 h-20"
}

// ── REALISTIC SHADED SVG GARMENT DEFINITIONS ──

const TShirtSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
    <defs>
      <linearGradient id="tshirtShadePrev" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
      </linearGradient>
      <filter id="softBlurPrev">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlurPrev)" />
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 C 154,86 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,86 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" />
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 C 154,86 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,86 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" fill="url(#tshirtShadePrev)" pointerEvents="none" />
    <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#000" strokeWidth="2" opacity="0.35" />
    <path d="M 58,95 C 66,99 64,106 61,114" fill="none" stroke="#000" strokeWidth="2" opacity="0.2" filter="url(#softBlurPrev)" />
    <path d="M 142,95 C 134,99 136,106 139,114" fill="none" stroke="#000" strokeWidth="2" opacity="0.2" filter="url(#softBlurPrev)" />
  </svg>
);

const PoloSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
    <defs>
      <linearGradient id="poloShadePrev" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
      </linearGradient>
      <filter id="softBlurPrev">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlurPrev)" />
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" />
    <path d="M 40,30 C 50,30 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,30 160,30 C 168,30 172,36 172,42 C 172,48 162,70 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 38,70 28,48 28,42 C 28,36 32,30 40,30 Z" fill="url(#poloShadePrev)" pointerEvents="none" />
    <path d="M 75,37 L 90,56 L 100,56 L 110,56 L 125,37" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 90,56 L 100,78 L 110,56" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" />
    <path d="M 100,56 L 100,92" fill="none" stroke="#18181b" strokeWidth="1.5" />
    <circle cx="100" cy="64" r="2" fill="#E8E2D6" stroke="#222" strokeWidth="0.5" />
    <circle cx="100" cy="76" r="2" fill="#E8E2D6" stroke="#222" strokeWidth="0.5" />
  </svg>
);

const ShirtSvg = ({ color }: { color: string }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
    <defs>
      <linearGradient id="shirtShadePrev" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
      </linearGradient>
      <filter id="softBlurPrev">
        <feGaussianBlur stdDeviation="1.8" />
      </filter>
    </defs>
    <ellipse cx="100" cy="190" rx="55" ry="6" fill="#000" opacity="0.18" filter="url(#softBlurPrev)" />
    <path d="M 45,28 C 52,28 65,34 75,34 C 85,34 90,32 100,32 C 110,32 115,34 125,34 C 135,34 148,28 155,28 C 163,28 168,34 168,40 C 168,48 160,78 156,84 C 152,90 142,90 142,90 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,90 C 58,90 48,90 44,84 C 40,78 32,48 32,40 C 32,34 37,28 45,28 Z" style={{ fill: color }} stroke="#18181b" strokeWidth="1.2" />
    <path d="M 45,28 C 52,28 65,34 75,34 C 85,34 90,32 100,32 C 110,32 115,34 125,34 C 135,34 148,28 155,28 C 163,28 168,34 168,40 C 168,48 160,78 156,84 C 152,90 142,90 142,90 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,90 C 58,90 48,90 44,84 C 40,78 32,48 32,40 C 32,34 37,28 45,28 Z" fill="url(#shirtShadePrev)" pointerEvents="none" />
    <path d="M 75,34 L 88,48 L 100,48" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 125,34 L 112,48 L 100,48" style={{ fill: color }} stroke="#18181b" strokeWidth="1.5" />
    <path d="M 100,48 L 100,195" fill="none" stroke="#18181b" strokeWidth="2" />
    {[58, 83, 108, 133, 158].map(y => (
      <circle key={y} cx="100" cy={y} r="2.2" fill="#FFFFFF" stroke="#18181b" strokeWidth="0.6" />
    ))}
  </svg>
);

const SingleViewPreview = ({ type, colorHex, design, side }: { type: string; colorHex: string; design: any; side: 'front' | 'back' }) => {
  const sideData = side === 'front' ? design.front : design.back;
  if (!sideData) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        {type === 'tshirt' && <TShirtSvg color={colorHex || '#FFFFFF'} />}
        {type === 'polo' && <PoloSvg color={colorHex || '#FFFFFF'} />}
        {type === 'shirt' && <ShirtSvg color={colorHex || '#FFFFFF'} />}
      </div>

      <div 
        className="absolute pointer-events-none"
        style={{
          width: type === 'shirt' ? '30%' : '38%',
          height: '42%',
          top: type === 'shirt' ? '32%' : '28%',
          left: type === 'shirt' ? '38%' : '31%',
        }}
      >
        {sideData.imageUrl && (
          <div
            className="absolute w-full h-full"
            style={{
              left: `${sideData.imageX}%`,
              top: `${sideData.imageY}%`,
              transform: `translate(-50%, -50%) scale(${sideData.imageScale / 100}) rotate(${sideData.imageRotation}deg)`,
              width: '100%',
              height: '100%',
            }}
          >
            <img
              src={sideData.imageUrl}
              alt="Design overlay"
              className="w-full h-full object-contain"
            />
          </div>
        )}
      </div>
      <span className="absolute bottom-1 right-2 text-[7px] font-black uppercase text-zinc-400/80 tracking-widest">{side}</span>
    </div>
  );
};

export const CustomGarmentPreview: React.FC<CustomGarmentPreviewProps> = ({
  customDesign,
  defaultImage,
  view = 'front',
  className = 'w-14 h-14'
}) => {
  // Parse customization metadata if present
  let designMeta: PreviewSpecs | null = null;
  if (customDesign?.baseImage) {
    try {
      designMeta = JSON.parse(customDesign.baseImage);
    } catch (e) {
      // Ignored
    }
  }

  // Fallback to standard rendering if not custom
  if (!designMeta) {
    return (
      <div className={`${className} bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg overflow-hidden flex-shrink-0`}>
        <img
          src={defaultImage || '/kliamologoNew.png'}
          alt="Product thumbnail"
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const { productType, colorHex } = designMeta;

  if (view === 'both') {
    return (
      <div className="flex gap-1 bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg p-1">
        <div className={className}>
          <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side="front" />
        </div>
        <div className={className}>
          <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side="back" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg p-1`}>
      <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side={view} />
    </div>
  );
};
