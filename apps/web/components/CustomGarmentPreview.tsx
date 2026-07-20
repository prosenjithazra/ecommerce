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
  showMarkers?: boolean; // display exact placement boundary and center marker
}

// ── PHOTOREALISTIC SHADED GARMENT SVGS WITH EXACT SILHOUETTE CLIPPING ──

const RealPhotoGarment = ({
  garmentType,
  colorHex,
  view = 'front',
  className = 'w-full h-full'
}: {
  garmentType: 'tshirt' | 'polo' | string;
  colorHex: string;
  view?: 'front' | 'back';
  className?: string;
}) => {
  const isPolo = garmentType === 'polo';
  const isBack = view === 'back';
  const isWhite = colorHex.toUpperCase() === '#FFFFFF';
  const isBlack = colorHex.toUpperCase() === '#18181B' || colorHex.toUpperCase() === '#000000';

  const tshirtPath = "M 40,30 C 50,29 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,29 160,30 C 168,31 173,36 173,42 C 173,49 163,71 158,78 C 154,85 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,85 42,78 C 37,71 27,49 27,42 C 27,36 32,31 40,30 Z";
  const poloPath = "M 40,30 C 50,29 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,29 160,30 C 168,31 173,36 173,42 C 173,49 163,71 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 37,71 27,49 27,42 C 27,36 32,31 40,30 Z";

  const activePath = isPolo ? poloPath : tshirtPath;

  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-md">
        <defs>
          <linearGradient id={`fabricShadingPrev-${garmentType}-${view}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isBlack ? "0.15" : "0.35"} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity={isWhite ? "0.3" : "0.45"} />
          </linearGradient>

          <radialGradient id={`chestHighlightPrev-${garmentType}-${view}`} cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isBlack ? "0.12" : "0.25"} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="fabricSoftBlurPrev" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        <ellipse cx="100" cy="191" rx="58" ry="6.5" fill="#000000" opacity="0.22" filter="url(#fabricSoftBlurPrev)" />

        <path
          d={activePath}
          style={{ fill: colorHex }}
          stroke="#111113"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        <path
          d={activePath}
          fill={`url(#fabricShadingPrev-${garmentType}-${view})`}
          pointerEvents="none"
        />

        <path
          d={activePath}
          fill={`url(#chestHighlightPrev-${garmentType}-${view})`}
          pointerEvents="none"
        />

        {!isPolo ? (
          !isBack ? (
            <>
              <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#000000" strokeWidth="2.8" opacity="0.38" />
              <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.25" />
            </>
          ) : (
            <path d="M 75,37 C 85,34 90,33 100,33 C 110,33 115,34 125,37" fill="none" stroke="#000000" strokeWidth="3" opacity="0.45" />
          )
        ) : (
          !isBack ? (
            <>
              <path d="M 75,37 L 91,58 L 100,58 L 109,58 L 125,37" style={{ fill: colorHex }} stroke="#111113" strokeWidth="1.6" />
              <path d="M 91,58 L 100,79 L 109,58" style={{ fill: colorHex }} stroke="#111113" strokeWidth="1.2" />
              <path d="M 100,58 L 100,94" fill="none" stroke="#111113" strokeWidth="1.5" />
              <circle cx="100" cy="65" r="2.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.6" />
              <circle cx="100" cy="77" r="2.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.6" />
            </>
          ) : (
            <path d="M 75,37 C 88,34 112,34 125,37" fill="none" stroke="#111113" strokeWidth="3" opacity="0.4" />
          )
        )}

        <path d="M 58,95 C 67,100 64,108 61,118" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" filter="url(#fabricSoftBlurPrev)" />
        <path d="M 142,95 C 133,100 136,108 139,118" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" filter="url(#fabricSoftBlurPrev)" />
      </svg>
    </div>
  );
};

const SingleViewPreview = ({ type, colorHex, design, side, showMarkers }: { type: string; colorHex: string; design: any; side: 'front' | 'back'; showMarkers?: boolean }) => {
  const sideData = side === 'front' ? design.front : design.back;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        <RealPhotoGarment garmentType={type} colorHex={colorHex || '#FFFFFF'} view={side} />
      </div>

      <div 
        className={`absolute pointer-events-none ${showMarkers ? 'border border-dashed border-[#e8855a] bg-[#F9A37E]/5' : ''}`}
        style={{
          width: '38%',
          height: '42%',
          top: '28%',
          left: '31%',
        }}
      >
        {/* Placement Center Marker Point */}
        {showMarkers && sideData?.imageUrl && (
          <div 
            className="absolute z-20 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#e8855a] shadow flex items-center justify-center"
            style={{
              left: `${sideData.imageX}%`,
              top: `${sideData.imageY}%`,
            }}
          >
            <span className="w-1 h-1 rounded-full bg-white" />
          </div>
        )}

        {sideData?.imageUrl && (
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
  className = 'w-14 h-14',
  showMarkers = false,
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
          <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side="front" showMarkers={showMarkers} />
        </div>
        <div className={className}>
          <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side="back" showMarkers={showMarkers} />
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg p-1`}>
      <SingleViewPreview type={productType} colorHex={colorHex} design={designMeta} side={view} showMarkers={showMarkers} />
    </div>
  );
};
