"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../components/AppContext';
import { Breadcrumb } from '../../components/UIComponents';
import {
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Triangle,
  Star,
  Layers,
  RotateCcw,
  RotateCw,
  Trash2,
  Lock,
  Unlock,
  Move,
  ArrowUp,
  ArrowDown,
  ShoppingBag,
  Eye,
  HelpCircle,
  Upload,
  Minus,
  Plus,
  Copy,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Sparkles,
  Palette,
  Check
} from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';
import * as fabric from 'fabric';

const COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#18181B' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Heather Grey', hex: '#94A3B8' },
  { name: 'Sage Green', hex: '#A8C69F' },
  { name: 'Peach', hex: '#F9A37E' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Mustard Yellow', hex: '#F59E0B' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const FONTS = [
  { name: 'Inter', family: 'var(--font-elms-sans), sans-serif' },
  { name: 'Kaushan Script', family: 'var(--font-kaushan-script), cursive' },
  { name: 'Impact', family: 'Impact, sans-serif' },
  { name: 'Georgia', family: 'Georgia, serif' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
  { name: 'Courier New', family: 'monospace' },
];

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

  // Exact Garment Silhouette Paths
  const tshirtPath = "M 40,30 C 50,29 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,29 160,30 C 168,31 173,36 173,42 C 173,49 163,71 158,78 C 154,85 142,88 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 C 58,88 46,85 42,78 C 37,71 27,49 27,42 C 27,36 32,31 40,30 Z";
  const poloPath = "M 40,30 C 50,29 65,37 75,37 C 85,37 90,32 100,32 C 110,32 115,37 125,37 C 135,37 150,29 160,30 C 168,31 173,36 173,42 C 173,49 163,71 158,78 L 142,88 L 142,185 C 142,192 135,195 128,195 L 72,195 C 65,195 58,192 58,185 L 58,88 L 42,78 C 37,71 27,49 27,42 C 27,36 32,31 40,30 Z";

  const activePath = isPolo ? poloPath : tshirtPath;

  return (
    <div className={`relative ${className} flex items-center justify-center overflow-hidden`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id={`fabricShading-${garmentType}-${view}`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isBlack ? "0.15" : "0.35"} />
            <stop offset="35%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="70%" stopColor="#000000" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity={isWhite ? "0.3" : "0.45"} />
          </linearGradient>

          <radialGradient id={`chestHighlight-${garmentType}-${view}`} cx="50%" cy="35%" r="45%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={isBlack ? "0.12" : "0.25"} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          <filter id="fabricSoftBlur" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
        </defs>

        {/* Soft Ground Shadow */}
        <ellipse cx="100" cy="191" rx="58" ry="6.5" fill="#000000" opacity="0.22" filter="url(#fabricSoftBlur)" />

        {/* Dynamic Garment Body Silhouette Fill (ONLY SHIRT CHANGES COLOR) */}
        <path
          d={activePath}
          style={{ fill: colorHex }}
          stroke="#111113"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />

        {/* Volumetric Fabric Shading */}
        <path
          d={activePath}
          fill={`url(#fabricShading-${garmentType}-${view})`}
          pointerEvents="none"
        />

        {/* Studio Lighting Highlight Sheen */}
        <path
          d={activePath}
          fill={`url(#chestHighlight-${garmentType}-${view})`}
          pointerEvents="none"
        />

        {/* Garment Details & Collars */}
        {!isPolo ? (
          !isBack ? (
            <>
              {/* T-Shirt Front Crew Neck & Label */}
              <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37 Q 100,48 75,37" fill="#27272a" opacity="0.35" />
              <text x="100" y="42" textAnchor="middle" fontSize="3.5" fontWeight="bold" fill="#ffffff" opacity="0.6">KLIAMO 100% COTTON</text>
              <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#000000" strokeWidth="2.8" opacity="0.38" />
              <path d="M 75,37 C 85,37 90,43 100,43 C 110,43 115,37 125,37" fill="none" stroke="#ffffff" strokeWidth="0.9" opacity="0.25" />
            </>
          ) : (
            <>
              {/* T-Shirt Back Neck Line */}
              <path d="M 75,37 C 85,34 90,33 100,33 C 110,33 115,34 125,37" fill="none" stroke="#000000" strokeWidth="3" opacity="0.45" />
              <path d="M 75,37 C 85,34 90,33 100,33 C 110,33 115,34 125,37" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
              <path d="M 46,40 C 65,43 135,43 154,40" fill="none" stroke="#000000" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.25" />
            </>
          )
        ) : (
          !isBack ? (
            <>
              {/* Polo Front Collar Wings & Buttons */}
              <path d="M 75,37 L 91,58 L 100,58 L 109,58 L 125,37" style={{ fill: colorHex }} stroke="#111113" strokeWidth="1.6" />
              <path d="M 75,37 Q 100,45 125,37" fill="none" stroke="#000000" strokeWidth="2.8" opacity="0.32" />
              <path d="M 91,58 L 100,79 L 109,58" style={{ fill: colorHex }} stroke="#111113" strokeWidth="1.2" />
              <path d="M 94,58 L 106,58 L 106,94 L 94,94 Z" fill="#f4f4f5" opacity="0.15" stroke="#111113" strokeWidth="1.2" />
              <path d="M 100,58 L 100,94" fill="none" stroke="#111113" strokeWidth="1.5" />
              <circle cx="100" cy="65" r="2.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.6" />
              <circle cx="100" cy="77" r="2.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.6" />
              <circle cx="100" cy="89" r="2.2" fill="#F8FAFC" stroke="#334155" strokeWidth="0.6" />
            </>
          ) : (
            <>
              {/* Polo Back Collar Stand */}
              <path d="M 75,37 C 88,34 112,34 125,37" fill="none" stroke="#111113" strokeWidth="3" opacity="0.4" />
              <path d="M 75,37 C 88,34 112,34 125,37" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.2" />
              <path d="M 46,42 C 70,45 130,45 154,42" fill="none" stroke="#000000" strokeWidth="1.2" strokeDasharray="2,2" opacity="0.25" />
            </>
          )
        )}

        {/* Seams & Sleeve Ribs */}
        <path d="M 40,30 C 50,30 65,34 75,34" fill="none" stroke="#000000" strokeWidth="1.2" opacity="0.25" />
        <path d="M 160,30 C 150,30 135,34 125,34" fill="none" stroke="#000000" strokeWidth="1.2" opacity="0.25" />
        <path d="M 42,78 Q 50,83 58,88" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.2" />
        <path d="M 158,78 Q 150,83 142,88" fill="none" stroke="#000000" strokeWidth="1.5" opacity="0.2" />

        {/* Realistic Armpit Wrinkles & Drapery */}
        <path d="M 58,95 C 67,100 64,108 61,118" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" filter="url(#fabricSoftBlur)" />
        <path d="M 142,95 C 133,100 136,108 139,118" fill="none" stroke="#000000" strokeWidth="2.5" opacity="0.2" filter="url(#fabricSoftBlur)" />
        <path d="M 94,44 Q 80,115 73,184" fill="none" stroke="#000000" strokeWidth="3" opacity="0.12" filter="url(#fabricSoftBlur)" />
        <path d="M 106,44 Q 120,115 127,184" fill="none" stroke="#000000" strokeWidth="3" opacity="0.12" filter="url(#fabricSoftBlur)" />
      </svg>
    </div>
  );
};

export default function CustomizerPage() {
  const router = useRouter();
  const { addToCart, showToast, currentUser, companySettings, settingsLoading } = useApp();

  // Authentication check
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Garment & Cart State
  const [garmentType, setGarmentType] = useState<'tshirt' | 'polo'>('tshirt');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]!);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [activeLeftTab, setActiveLeftTab] = useState<'text' | 'upload' | 'shapes' | 'layers'>('text');
  const [uploading, setUploading] = useState(false);

  // Dynamic garment base pricing
  const PRICES = {
    tshirt: Number(companySettings?.customTshirtPrice || 599),
    polo: Number(companySettings?.customPoloPrice || 799),
  };

  const GARMENT_TYPES: Array<{ id: 'tshirt' | 'polo'; name: string; basePrice: number; desc: string }> = [
    { id: 'tshirt', name: 'T-Shirt', basePrice: PRICES.tshirt, desc: 'Classic crew neck soft cotton tee' },
    { id: 'polo', name: 'Polo T-Shirt', basePrice: PRICES.polo, desc: 'Premium ribbed collar sporty polo' },
  ];

  // Fabric.js Canvas State & Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  // Canvas View States (Front & Back JSONs)
  const frontStateRef = useRef<any>(null);
  const backStateRef = useRef<any>(null);

  // History Undo/Redo State
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef<number>(-1);
  const isUndoRedoRef = useRef<boolean>(false);

  // Text Styling Form Controls
  const [textInput, setTextInput] = useState('YOUR TEXT');
  const [selectedFont, setSelectedFont] = useState(FONTS[0]!.family);
  const [fontSize, setFontSize] = useState(28);
  const [textColor, setTextColor] = useState('#18181B');
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setTextItalic] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');

  // Object Styling Controls
  const [objectFillColor, setObjectFillColor] = useState('#F9A37E');
  const [objectStrokeColor, setObjectStrokeColor] = useState('#18181B');
  const [objectOpacity, setObjectOpacity] = useState(100);

  // Object Layers List for Layer Management Sidebar
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);

  // Front and Back Side Composite Data URLs for Previews
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string>('');
  const [backPreviewUrl, setBackPreviewUrl] = useState<string>('');

  // ── 1. INITIALIZE FABRIC CANVAS ──
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 250,
      height: 300,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
    });

    setFabricCanvas(canvas);

    // Save initial history
    const initialJson = JSON.stringify(canvas.toJSON());
    historyRef.current = [initialJson];
    historyIdxRef.current = 0;

    // Canvas Event Listeners
    const updateState = () => {
      const active = canvas.getActiveObject();
      setActiveObject(active || null);

      // Sync objects array for layers panel
      setCanvasObjects([...canvas.getObjects()]);

      // Sync form controls if object is text
      if (active && active.type === 'i-text') {
        const textObj = active as fabric.IText;
        setTextInput(textObj.text || '');
        setFontSize(textObj.fontSize || 28);
        setTextColor((textObj.fill as string) || '#18181B');
        setTextBold(textObj.fontWeight === 'bold');
        setTextItalic(textObj.fontStyle === 'italic');
        setTextAlign((textObj.textAlign as any) || 'center');
      }

      if (active) {
        setObjectFillColor((active.fill as string) || '#F9A37E');
        setObjectStrokeColor((active.stroke as string) || '#18181B');
        setObjectOpacity(Math.round((active.opacity || 1) * 100));
      }

      // Capture snapshot for current view preview
      const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 1.5 });
      if (currentView === 'front') {
        setFrontPreviewUrl(dataUrl);
      } else {
        setBackPreviewUrl(dataUrl);
      }

      // Record history step if not performing undo/redo
      if (!isUndoRedoRef.current) {
        const json = JSON.stringify(canvas.toJSON());
        const history = historyRef.current.slice(0, historyIdxRef.current + 1);
        history.push(json);
        historyRef.current = history;
        historyIdxRef.current = history.length - 1;
      }
      isUndoRedoRef.current = false;
    };

    canvas.on('selection:created', updateState);
    canvas.on('selection:updated', updateState);
    canvas.on('selection:cleared', () => {
      setActiveObject(null);
    });
    canvas.on('object:modified', updateState);
    canvas.on('object:added', updateState);
    canvas.on('object:removed', updateState);

    return () => {
      canvas.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 2. HANDLE VIEW SWITCHING (FRONT / BACK) ──
  const switchView = async (targetView: 'front' | 'back') => {
    if (!fabricCanvas || targetView === currentView) return;

    // Save current view JSON
    const currentJson = fabricCanvas.toJSON();
    const currentDataUrl = fabricCanvas.toDataURL({ format: 'png', multiplier: 1.5 });

    if (currentView === 'front') {
      frontStateRef.current = currentJson;
      setFrontPreviewUrl(currentDataUrl);
    } else {
      backStateRef.current = currentJson;
      setBackPreviewUrl(currentDataUrl);
    }

    // Load target view JSON
    const targetJson = targetView === 'front' ? frontStateRef.current : backStateRef.current;
    setCurrentView(targetView);

    isUndoRedoRef.current = true;
    fabricCanvas.clear();

    if (targetJson) {
      await fabricCanvas.loadFromJSON(targetJson);
      fabricCanvas.renderAll();
    }
  };

  // ── 3. UNDO / REDO CONTROLS ──
  const handleUndo = async () => {
    if (!fabricCanvas || historyIdxRef.current <= 0) return;
    historyIdxRef.current -= 1;
    isUndoRedoRef.current = true;
    const json = historyRef.current[historyIdxRef.current];
    if (json) {
      await fabricCanvas.loadFromJSON(JSON.parse(json));
      fabricCanvas.renderAll();
    }
  };

  const handleRedo = async () => {
    if (!fabricCanvas || historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current += 1;
    isUndoRedoRef.current = true;
    const json = historyRef.current[historyIdxRef.current];
    if (json) {
      await fabricCanvas.loadFromJSON(JSON.parse(json));
      fabricCanvas.renderAll();
    }
  };

  // ── 4. ADD TEXT TO CANVAS ──
  const handleAddText = () => {
    if (!fabricCanvas) return;

    const iText = new fabric.IText(textInput || 'YOUR TEXT', {
      left: 125,
      top: 150,
      originX: 'center',
      originY: 'center',
      fontFamily: selectedFont,
      fontSize: fontSize,
      fill: textColor,
      fontWeight: textBold ? 'bold' : 'normal',
      fontStyle: textItalic ? 'italic' : 'normal',
      textAlign: textAlign,
      cornerColor: '#F9A37E',
      cornerStyle: 'circle',
      borderColor: '#F9A37E',
      cornerSize: 8,
    });

    fabricCanvas.add(iText);
    fabricCanvas.setActiveObject(iText);
    fabricCanvas.renderAll();
    showToast("Text Added", "Text object added to printable canvas.", "success");
  };

  // Update text object dynamically on property change
  const updateActiveText = (key: string, value: any) => {
    if (!fabricCanvas) return;
    const active = fabricCanvas.getActiveObject();
    if (active && active.type === 'i-text') {
      active.set(key as any, value);
      fabricCanvas.renderAll();
    }
  };

  // ── 5. UPLOAD IMAGE TO CANVAS ──
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgObj = new Image();
      imgObj.src = event.target?.result as string;
      imgObj.onload = () => {
        const fabImg = new fabric.Image(imgObj, {
          left: 125,
          top: 150,
          originX: 'center',
          originY: 'center',
          cornerColor: '#F9A37E',
          cornerStyle: 'circle',
          borderColor: '#F9A37E',
          cornerSize: 8,
        });

        // Scale down if image is larger than printable area
        if (fabImg.width! > 180 || fabImg.height! > 180) {
          fabImg.scaleToWidth(160);
        }

        fabricCanvas.add(fabImg);
        fabricCanvas.setActiveObject(fabImg);
        fabricCanvas.renderAll();
        showToast("Artwork Uploaded", "Graphic placed on garment workspace.", "success");
      };
    };
    reader.readAsDataURL(file);
  };

  // ── 6. ADD SHAPES TO CANVAS ──
  const handleAddShape = (shapeType: 'rect' | 'circle' | 'triangle' | 'star') => {
    if (!fabricCanvas) return;

    let shapeObj: fabric.Object;
    const commonProps = {
      left: 125,
      top: 150,
      originX: 'center' as const,
      originY: 'center' as const,
      fill: objectFillColor,
      stroke: objectStrokeColor,
      strokeWidth: 2,
      cornerColor: '#F9A37E',
      cornerStyle: 'circle' as const,
      borderColor: '#F9A37E',
      cornerSize: 8,
    };

    if (shapeType === 'rect') {
      shapeObj = new fabric.Rect({ ...commonProps, width: 80, height: 80 });
    } else if (shapeType === 'circle') {
      shapeObj = new fabric.Circle({ ...commonProps, radius: 45 });
    } else if (shapeType === 'triangle') {
      shapeObj = new fabric.Triangle({ ...commonProps, width: 80, height: 80 });
    } else {
      shapeObj = new fabric.Rect({ ...commonProps, width: 70, height: 70, rx: 10, ry: 10 });
    }

    fabricCanvas.add(shapeObj);
    fabricCanvas.setActiveObject(shapeObj);
    fabricCanvas.renderAll();
    showToast("Shape Added", `${shapeType.toUpperCase()} shape added to canvas.`, "info");
  };

  // ── 7. LAYER & ALIGNMENT ACTIONS ──
  const alignActiveObject = (mode: 'centerH' | 'centerV') => {
    if (!fabricCanvas || !activeObject) return;
    if (mode === 'centerH') {
      fabricCanvas.centerObjectH(activeObject);
    } else {
      fabricCanvas.centerObjectV(activeObject);
    }
    fabricCanvas.renderAll();
  };

  const moveLayer = (direction: 'up' | 'down') => {
    if (!fabricCanvas || !activeObject) return;
    if (direction === 'up') {
      fabricCanvas.bringObjectForward(activeObject);
    } else {
      fabricCanvas.sendObjectBackwards(activeObject);
    }
    fabricCanvas.renderAll();
  };

  const deleteActiveObject = () => {
    if (!fabricCanvas || !activeObject) return;
    fabricCanvas.remove(activeObject);
    fabricCanvas.discardActiveObject();
    fabricCanvas.renderAll();
    showToast("Object Removed", "Selected element deleted from canvas.", "info");
  };

  const duplicateActiveObject = async () => {
    if (!fabricCanvas || !activeObject) return;
    const cloned = await activeObject.clone();
    cloned.set({
      left: (cloned.left || 125) + 15,
      top: (cloned.top || 150) + 15,
    });
    fabricCanvas.add(cloned);
    fabricCanvas.setActiveObject(cloned);
    fabricCanvas.renderAll();
    showToast("Object Duplicated", "Copy created on canvas.", "info");
  };

  const clearCanvas = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.renderAll();
    showToast("Canvas Cleared", "All design elements removed.", "info");
  };

  // ── 8. ADD CUSTOM APPAREL TO CART ──
  const handleAddToCart = async () => {
    setUploading(true);
    try {
      // Save current side before export
      const currentJson = fabricCanvas?.toJSON();
      const currentUrl = fabricCanvas?.toDataURL({ format: 'png', multiplier: 2 });

      let finalFrontUrl = frontPreviewUrl;
      let finalBackUrl = backPreviewUrl;

      if (currentView === 'front') {
        frontStateRef.current = currentJson;
        finalFrontUrl = currentUrl || frontPreviewUrl;
      } else {
        backStateRef.current = currentJson;
        finalBackUrl = currentUrl || backPreviewUrl;
      }

      // Cloudinary upload
      let uploadedFrontCloud = '';
      let uploadedBackCloud = '';

      if (finalFrontUrl) {
        const res = await fetch(getApiUrl('/cloudinary/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: finalFrontUrl }),
        });
        const data = await res.json();
        uploadedFrontCloud = data.url || finalFrontUrl;
      }

      if (finalBackUrl) {
        const res = await fetch(getApiUrl('/cloudinary/upload'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: finalBackUrl }),
        });
        const data = await res.json();
        uploadedBackCloud = data.url || finalBackUrl;
      }

      const hasFrontPrint = !!frontStateRef.current?.objects?.length;
      const hasBackPrint = !!backStateRef.current?.objects?.length;

      const customizationFee = (hasFrontPrint ? 150 : 0) + (hasBackPrint ? 150 : 0);
      const itemPrice = PRICES[garmentType] + customizationFee;

      const customDesignMeta = {
        productType: garmentType,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        front: {
          imageUrl: uploadedFrontCloud,
          imageX: 50,
          imageY: 50,
          imageScale: 100,
          imageRotation: 0,
        },
        back: {
          imageUrl: uploadedBackCloud,
          imageX: 50,
          imageY: 50,
          imageScale: 100,
          imageRotation: 0,
        }
      };

      addToCart({
        productId: `custom-${garmentType}`,
        name: `Custom ${garmentType === 'polo' ? 'Polo T-Shirt' : 'T-Shirt'} (${selectedColor.name})`,
        price: itemPrice,
        quantity: quantity,
        image: uploadedFrontCloud || uploadedBackCloud || '/kliamologoNew.png',
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

      showToast("Added to Cart", "Custom apparel saved to shopping bag.", "success");
      router.push('/cart');
    } catch (err) {
      console.error(err);
      showToast("Submission Error", "Failed to process custom apparel order.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Pricing calculations
  const hasFrontPrint = !!frontPreviewUrl;
  const hasBackPrint = !!backPreviewUrl;
  const customizationFee = (hasFrontPrint ? 150 : 0) + (hasBackPrint ? 150 : 0);
  const unitPrice = PRICES[garmentType] + customizationFee;
  const totalPrice = unitPrice * quantity;

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center p-8">
        <Sparkles className="w-8 h-8 text-[#F9A37E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-16">
      
      {/* HEADER BAR */}
      <div className="flex items-center justify-between flex-wrap gap-3 py-2 border-b border-[#E8E2D6]">
        <Breadcrumb items={[{ name: "Design Studio" }]} />

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIdxRef.current <= 0}
            className="p-2 border border-[#E8E2D6] rounded-xl hover:bg-white text-[#7A736A] disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdxRef.current >= historyRef.current.length - 1}
            className="p-2 border border-[#E8E2D6] rounded-xl hover:bg-white text-[#7A736A] disabled:opacity-40 transition-colors"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-[#E8E2D6] mx-1" />
          <button
            onClick={clearCanvas}
            className="text-xs font-bold text-red-500 hover:text-red-600 px-3 py-1.5 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear
          </button>
        </div>
      </div>

      {/* THREE-COLUMN WORKSPACE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── LEFT SIDEBAR: CREATIVE TOOLS ── */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-5">
          
          {/* Tool Selector Tabs */}
          <div className="grid grid-cols-4 gap-1 bg-[#FDFAF6] border border-[#E8E2D6] p-1 rounded-xl">
            {[
              { id: 'text', label: 'Text', icon: Type },
              { id: 'upload', label: 'Upload', icon: Upload },
              { id: 'shapes', label: 'Shapes', icon: Square },
              { id: 'layers', label: 'Layers', icon: Layers },
            ].map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveLeftTab(t.id as any)}
                  className={`flex flex-col items-center py-2 rounded-lg text-[10px] font-extrabold transition-all ${activeLeftTab === t.id ? 'bg-[#F9A37E] text-white shadow-sm' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: ADD & EDIT TEXT */}
          {activeLeftTab === 'text' && (
            <div className="space-y-4 animate-fade-in-up duration-200">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#4A453E]">Text Content</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => {
                      setTextInput(e.target.value);
                      updateActiveText('text', e.target.value);
                    }}
                    placeholder="Enter custom text..."
                    className="flex-1 px-3 py-2 text-xs font-medium border border-[#E8E2D6] rounded-xl outline-none focus:border-[#F9A37E]"
                  />
                  <button
                    onClick={handleAddText}
                    className="bg-[#F9A37E] hover:bg-[#E8855A] text-white px-4 py-2 rounded-xl text-xs font-black transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A453E]">Font Family</label>
                <select
                  value={selectedFont}
                  onChange={(e) => {
                    setSelectedFont(e.target.value);
                    updateActiveText('fontFamily', e.target.value);
                  }}
                  className="w-full bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl py-2 px-3 text-xs font-bold outline-none cursor-pointer"
                >
                  {FONTS.map(f => (
                    <option key={f.name} value={f.family}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Font Size & Alignment Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#4A453E]">Size: {fontSize}px</label>
                  <input
                    type="range"
                    min="12"
                    max="90"
                    value={fontSize}
                    onChange={(e) => {
                      const sz = parseInt(e.target.value);
                      setFontSize(sz);
                      updateActiveText('fontSize', sz);
                    }}
                    className="w-full accent-[#F9A37E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#4A453E]">Style</label>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        const b = !textBold;
                        setTextBold(b);
                        updateActiveText('fontWeight', b ? 'bold' : 'normal');
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-black ${textBold ? 'bg-[#F9A37E] text-white border-[#F9A37E]' : 'border-[#E8E2D6] bg-[#FDFAF6]'}`}
                    >
                      <Bold className="w-3.5 h-3.5 mx-auto" />
                    </button>
                    <button
                      onClick={() => {
                        const i = !textItalic;
                        setTextItalic(i);
                        updateActiveText('fontStyle', i ? 'italic' : 'normal');
                      }}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-black ${textItalic ? 'bg-[#F9A37E] text-white border-[#F9A37E]' : 'border-[#E8E2D6] bg-[#FDFAF6]'}`}
                    >
                      <Italic className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Text Alignment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A453E]">Alignment</label>
                <div className="flex gap-2">
                  {[
                    { id: 'left', icon: AlignLeft },
                    { id: 'center', icon: AlignCenter },
                    { id: 'right', icon: AlignRight },
                  ].map(a => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.id}
                        onClick={() => {
                          setTextAlign(a.id as any);
                          updateActiveText('textAlign', a.id);
                        }}
                        className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center ${textAlign === a.id ? 'bg-[#F9A37E] text-white border-[#F9A37E]' : 'border-[#E8E2D6] bg-[#FDFAF6]'}`}
                      >
                        <Icon className="w-4 h-4" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Color Swatches */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#4A453E]">Text Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setTextColor(c.hex);
                        updateActiveText('fill', c.hex);
                      }}
                      className={`w-6 h-6 rounded-full border border-zinc-300 transition-transform ${textColor === c.hex ? 'scale-125 ring-2 ring-[#F9A37E]' : ''}`}
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD IMAGE */}
          {activeLeftTab === 'upload' && (
            <div className="space-y-4 animate-fade-in-up duration-200">
              <label className="block text-xs font-bold text-[#4A453E]">Upload Custom Artwork</label>
              <label className="border-2 border-dashed border-[#E8E2D6] hover:border-[#F9A37E] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#FDFAF6] hover:bg-white cursor-pointer transition-all">
                <Upload className="w-8 h-8 text-[#F9A37E]" />
                <p className="text-xs font-bold text-[#4A453E]">Choose Image (PNG / JPG)</p>
                <p className="text-[10px] text-[#A89B8A]">High resolution transparent PNGs recommended</p>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
          )}

          {/* TAB 3: SHAPES */}
          {activeLeftTab === 'shapes' && (
            <div className="space-y-4 animate-fade-in-up duration-200">
              <label className="block text-xs font-bold text-[#4A453E]">Add Vector Shape</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'rect', label: 'Rectangle', icon: Square },
                  { id: 'circle', label: 'Circle', icon: Circle },
                  { id: 'triangle', label: 'Triangle', icon: Triangle },
                  { id: 'star', label: 'Rounded Box', icon: Star },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.id}
                      onClick={() => handleAddShape(s.id as any)}
                      className="p-3 border border-[#E8E2D6] rounded-xl hover:border-[#F9A37E] bg-[#FDFAF6] hover:bg-white flex flex-col items-center justify-center gap-1 transition-all"
                    >
                      <Icon className="w-5 h-5 text-[#F9A37E]" />
                      <span className="text-[10px] font-extrabold text-[#4A453E]">{s.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Shape Color controls */}
              <div className="space-y-2 pt-2 border-t border-[#E8E2D6]">
                <label className="block text-xs font-bold text-[#4A453E]">Shape Fill Color</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button
                      key={c.name}
                      onClick={() => {
                        setObjectFillColor(c.hex);
                        if (activeObject) {
                          activeObject.set('fill', c.hex);
                          fabricCanvas?.renderAll();
                        }
                      }}
                      className="w-6 h-6 rounded-full border border-zinc-300"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYERS & OBJECT ACTIONS */}
          {activeLeftTab === 'layers' && (
            <div className="space-y-4 animate-fade-in-up duration-200">
              <label className="block text-xs font-bold text-[#4A453E]">Layer Management</label>

              {canvasObjects.length === 0 ? (
                <p className="text-xs text-[#A89B8A] italic">No active design elements on canvas.</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {canvasObjects.map((obj, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        fabricCanvas?.setActiveObject(obj);
                        fabricCanvas?.renderAll();
                      }}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-all ${activeObject === obj ? 'border-[#F9A37E] bg-[#FDFAF6]' : 'border-[#E8E2D6] bg-white'}`}
                    >
                      <span className="capitalize text-[#4A453E]">{obj.type} Layer #{idx + 1}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          fabricCanvas?.remove(obj);
                          fabricCanvas?.renderAll();
                        }}
                        className="text-red-500 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions Panel */}
              {activeObject && (
                <div className="p-3 border border-[#E8E2D6] rounded-xl bg-[#FDFAF6] space-y-2">
                  <span className="text-[10px] font-black uppercase text-[#F9A37E]">Object Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => alignActiveObject('centerH')} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <AlignCenter className="w-3 h-3" /> Align Horiz
                    </button>
                    <button onClick={() => alignActiveObject('centerV')} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <Move className="w-3 h-3" /> Align Vert
                    </button>
                    <button onClick={duplicateActiveObject} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <Copy className="w-3 h-3" /> Duplicate
                    </button>
                    <button onClick={deleteActiveObject} className="py-1.5 px-2 bg-white border border-red-200 text-red-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* ── CENTER WORKSPACE: REAL APPAREL CANVAS ── */}
        <div className="lg:col-span-5 flex flex-col items-center justify-between border border-[#E8E2D6] bg-white rounded-2xl p-4 relative min-h-[520px] shadow-sm">
          
          {/* Top View Switcher */}
          <div className="w-full flex items-center justify-between z-10">
            <div className="flex gap-2 bg-[#FDFAF6] border border-[#E8E2D6] rounded-full p-1 shadow-sm">
              <button
                onClick={() => switchView('front')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'front' ? 'bg-[#F9A37E] text-white shadow-sm' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Front View
              </button>
              <button
                onClick={() => switchView('back')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'back' ? 'bg-[#F9A37E] text-white shadow-sm' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Back View
              </button>
            </div>

            <span className="text-[10px] font-black text-[#e8855a] uppercase tracking-wider bg-[#FDFAF6] border border-[#E8E2D6] px-3 py-1 rounded-full">
              {currentView.toUpperCase()} VIEW ACTIVE
            </span>
          </div>

          {/* Studio Garment Background with Fabric.js Interactive Overlay */}
          <div className="relative w-full max-w-md aspect-square my-auto flex items-center justify-center">
            
            {/* Real Studio Photo Garment Background */}
            <div className="w-full h-full absolute inset-0">
              <RealPhotoGarment garmentType={garmentType} colorHex={selectedColor.hex} view={currentView} />
            </div>

            {/* Bounded Printable Area Box */}
            <div
              className="absolute border-2 border-dashed border-[#F9A37E] bg-[#F9A37E]/5 rounded-xl z-20 pointer-events-none flex items-center justify-center"
              style={{
                width: '42%',
                height: '48%',
                top: '25%',
                left: '29%',
              }}
            >
              <span className="absolute -top-6 text-[8px] font-black text-[#e8855a] uppercase tracking-wider bg-white/95 px-2 py-0.5 rounded-full border border-[#F9A37E]/40 shadow-xs">
                Print Zone ({currentView.toUpperCase()})
              </span>

              {/* Corner Indicators */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#e8855a]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#e8855a]" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#e8855a]" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#e8855a]" />
            </div>

            {/* Fabric.js Dynamic Overlay Canvas */}
            <div
              className="absolute z-30"
              style={{
                width: '42%',
                height: '48%',
                top: '25%',
                left: '29%',
              }}
            >
              <canvas ref={canvasRef} />
            </div>

          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#A89B8A] bg-[#FDFAF6] border border-[#E8E2D6] px-4 py-2 rounded-full w-full max-w-sm justify-center">
            <HelpCircle className="w-3.5 h-3.5 text-[#F9A37E]" />
            <span>Click & drag text, logos, or shapes inside the printable box</span>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR: GARMENT & ORDER OPTIONS ── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Garment Selector */}
          <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-[#4A453E] border-b border-[#E8E2D6] pb-2">1. Apparel Options</h3>
            
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">Garment Type</label>
              <div className="grid grid-cols-2 gap-2">
                {GARMENT_TYPES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGarmentType(g.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${garmentType === g.id ? 'border-[#F9A37E] bg-[#FDFAF6] shadow-sm' : 'border-[#E8E2D6] hover:border-zinc-300'}`}
                  >
                    <p className="font-black text-xs text-[#4A453E]">{g.name}</p>
                    <p className="text-[10px] text-[#F9A37E] font-bold mt-0.5">₹{g.basePrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">
                Color: <span className="text-[#4A453E] font-extrabold">{selectedColor.name}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${selectedColor.name === c.name ? 'scale-110 border-[#F9A37E] shadow-md ring-2 ring-[#F9A37E]/20' : 'border-zinc-300'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">Select Size</label>
              <div className="flex gap-1.5">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 py-2 rounded-lg border text-xs font-black transition-all ${selectedSize === s ? 'border-[#F9A37E] bg-[#F9A37E] text-white shadow-sm' : 'border-[#E8E2D6] text-[#7A736A] hover:border-zinc-300'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">Quantity</label>
              <div className="flex items-center border border-[#E8E2D6] rounded-xl bg-[#FDFAF6] h-9 w-32 overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-9 h-full flex items-center justify-center text-[#7A736A] hover:bg-[#E8E2D6]/40"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="flex-1 text-xs font-black text-center text-[#4A453E]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-full flex items-center justify-center text-[#7A736A] hover:bg-[#E8E2D6]/40"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

          </div>

          {/* Live Side-by-Side Review Cards */}
          {(frontPreviewUrl || backPreviewUrl) && (
            <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="font-extrabold text-xs text-[#4A453E]">2. Side-by-Side Preview</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-[#E8E2D6] rounded-xl p-2 bg-[#FDFAF6] flex flex-col items-center">
                  <div className="w-16 h-16 relative overflow-hidden flex items-center justify-center">
                    <RealPhotoGarment garmentType={garmentType} colorHex={selectedColor.hex} view="front" />
                    {frontPreviewUrl && <img src={frontPreviewUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                  </div>
                  <span className="text-[8px] font-bold text-[#7A736A] mt-1 uppercase">Front</span>
                </div>
                <div className="border border-[#E8E2D6] rounded-xl p-2 bg-[#FDFAF6] flex flex-col items-center">
                  <div className="w-16 h-16 relative overflow-hidden flex items-center justify-center">
                    <RealPhotoGarment garmentType={garmentType} colorHex={selectedColor.hex} view="back" />
                    {backPreviewUrl && <img src={backPreviewUrl} alt="" className="absolute inset-0 w-full h-full object-contain pointer-events-none" />}
                  </div>
                  <span className="text-[8px] font-bold text-[#7A736A] mt-1 uppercase">Back</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-[#4A453E] border-b border-[#E8E2D6] pb-1.5">3. Summary</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A736A]">
                <span>Base Apparel</span>
                <span className="font-bold text-[#4A453E]">₹{PRICES[garmentType].toFixed(2)}</span>
              </div>
              {customizationFee > 0 && (
                <div className="flex justify-between text-[#7A736A]">
                  <span>Print Customization</span>
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
                <span>Generating Apparel...</span>
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
