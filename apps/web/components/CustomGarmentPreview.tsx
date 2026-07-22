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
  const isWhite = !colorHex || colorHex.toUpperCase() === '#FFFFFF' || colorHex.toUpperCase() === '#FFF';

  const imageSrc = isPolo
    ? (isBack ? '/poloTshirtBack.png' : '/poloTshirtFront.png')
    : (isBack ? '/whiteTshirtBack.png' : '/whiteTshirtFront.png');

  const maskId = `garmentMask-${garmentType}-${view}-${(colorHex || 'white').replace('#', '')}`;

  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-xl pointer-events-none" preserveAspectRatio="xMidYMid meet">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="500" height="500">
            <image href={imageSrc} x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid meet" />
          </mask>
        </defs>

        {/* Base T-shirt photo texture */}
        <image href={imageSrc} x="0" y="0" width="500" height="500" preserveAspectRatio="xMidYMid meet" />

        {/* Garment-only color fill overlay */}
        {!isWhite && (
          <rect
            x="0"
            y="0"
            width="500"
            height="500"
            fill={colorHex}
            mask={`url(#${maskId})`}
            style={{ mixBlendMode: 'multiply' }}
          />
        )}
      </svg>
    </div>
  );
};




const SingleViewPreview = ({ type, colorHex, design, side, showMarkers }: { type: string; colorHex: string; design: any; side: 'front' | 'back'; showMarkers?: boolean }) => {
  const sideData = side === 'front' ? design?.front : design?.back;
  const artworkUrl = sideData?.imageUrl || (side === 'front' ? design?.frontDesignUrl : design?.backDesignUrl);
  const mockupUrl = side === 'front' ? design?.frontMockupUrl : design?.backMockupUrl;

  if (!artworkUrl && mockupUrl) {
    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <img src={mockupUrl} alt="Real View Shirt" className="w-full h-full object-contain pointer-events-none" />
        <span className="absolute bottom-1 right-4 sm:right-2 text-[7px] font-black uppercase text-zinc-400/80 tracking-widest">{side}</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-full h-full">
        <RealPhotoGarment garmentType={type} colorHex={colorHex || '#FFFFFF'} view={side} />
      </div>

      {artworkUrl && (
        <div 
          className={`absolute pointer-events-none ${showMarkers ? 'border border-dashed border-[#e8855a] bg-[#F9A37E]/5' : ''}`}
          style={{
            width: '42%',
            height: '48%',
            top: '25%',
            left: '29%',
          }}
        >
          {/* Placement Center Marker Point */}
          {showMarkers && (
            <div 
              className="absolute z-20 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white bg-[#e8855a] shadow flex items-center justify-center"
              style={{
                left: `50%`,
                top: `50%`,
              }}
            >
              <span className="w-1 h-1 rounded-full bg-white" />
            </div>
          )}

          <img
            src={artworkUrl}
            alt="Design overlay"
            className="w-full h-full object-contain pointer-events-none"
          />
        </div>
      )}
      <span className="absolute bottom-1 right-4 sm:right-2 text-[7px] font-black uppercase text-zinc-400/80 tracking-widest">{side}</span>
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
