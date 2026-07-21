"use client";

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
  Move,
  ShoppingBag,
  Eye,
  HelpCircle,
  Upload,
  Minus,
  Plus,
  Copy,
  AlignCenter,
  Bold,
  Italic,
  Sparkles,
  Check,
  UserCheck,
  Shield,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { getApiUrl } from '../../components/ApiConfig';
import { CustomGarmentPreview } from '../../components/CustomGarmentPreview';
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
  { name: 'Sans-Serif (Inter)', family: 'var(--font-elms-sans), sans-serif' },
  { name: 'Athletic Block (Impact)', family: 'Impact, sans-serif' },
  { name: 'Cursive (Kaushan)', family: 'var(--font-kaushan-script), cursive' },
  { name: 'Classic Serif (Georgia)', family: 'Georgia, serif' },
  { name: 'Modern (Montserrat)', family: 'Montserrat, sans-serif' },
  { name: 'Monospace (Courier)', family: 'monospace' },
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
  const isWhite = !colorHex || colorHex.toUpperCase() === '#FFFFFF' || colorHex.toUpperCase() === '#FFF';

  const imageSrc = isPolo
    ? (isBack ? '/polo_back.png' : '/polo_front.png')
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



export default function CustomizerPage() {
  const router = useRouter();
  const { addToCart, showToast, currentUser, companySettings, settingsLoading } = useApp();

  // Authentication check - wait until AppContext finishes loading
  useEffect(() => {
    if (settingsLoading) return;
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    if (!token && !currentUser) {
      router.push('/login');
    }
  }, [currentUser, settingsLoading, router]);

  // Garment & Cart State
  const [garmentType, setGarmentType] = useState<'tshirt' | 'polo'>('tshirt');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]!);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [activeLeftTab, setActiveLeftTab] = useState<'text' | 'upload' | 'shapes' | 'roster' | 'layers'>('text');
  const [uploading, setUploading] = useState(false);
  const [studioZoom, setStudioZoom] = useState(1);

  // Size Breakdown Matrix (CustomInk style)
  const [sizeQuantities, setSizeQuantities] = useState<{ [key: string]: number }>({
    S: 0,
    M: 1,
    L: 0,
    XL: 0,
    XXL: 0,
  });

  const totalQuantity = Object.values(sizeQuantities).reduce((sum, q) => sum + Math.max(0, q), 0) || 1;

  // Tiered Volume Discount Logic (1-5 standard, 6-11: 10% off, 12+: 20% off)
  let discountPercent = 0;
  if (totalQuantity >= 12) {
    discountPercent = 20;
  } else if (totalQuantity >= 6) {
    discountPercent = 10;
  }

  // Dynamic garment base pricing
  const PRICES = {
    tshirt: Number(companySettings?.customTshirtPrice || 599),
    polo: Number(companySettings?.customPoloPrice || 799),
  };

  const GARMENT_TYPES: Array<{ id: 'tshirt' | 'polo'; name: string; basePrice: number; desc: string }> = [
    { id: 'tshirt', name: 'Crewneck T-Shirt', basePrice: PRICES.tshirt, desc: 'Classic crew neck soft cotton tee' },
    { id: 'polo', name: 'Polo Shirt', basePrice: PRICES.polo, desc: 'Premium ribbed collar sporty polo' },
  ];

  // Fabric.js Canvas Refs (Single source of truth via useRef)
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
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

  // Jersey Personalization Roster State
  const [jerseyName, setJerseyName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');

  // Object Layers List for Layer Management Sidebar
  const [canvasObjects, setCanvasObjects] = useState<fabric.Object[]>([]);

  // Front and Back Side Composite Data URLs for Previews
  const [frontPreviewUrl, setFrontPreviewUrl] = useState<string>('');
  const [backPreviewUrl, setBackPreviewUrl] = useState<string>('');
  const [frontMockupPreviewUrl, setFrontMockupPreviewUrl] = useState<string>('');
  const [backMockupPreviewUrl, setBackMockupPreviewUrl] = useState<string>('');

  // Raw Uploaded Original Artwork Files
  const rawFrontArtworkRef = useRef<string>('');
  const rawBackArtworkRef = useRef<string>('');

  // Synchronous View Ref to prevent cross-contamination during view switching or editing
  const currentViewRef = useRef<'front' | 'back'>('front');
  const isSwitchingViewRef = useRef<boolean>(false);

  // Fixed Virtual Canvas Resolution for 100% Position Accuracy Across All Screens (Desktop, Mobile, Tablet)
  const VIRTUAL_WIDTH = 280;
  const VIRTUAL_HEIGHT = 320;
  const [canvasScale, setCanvasScale] = useState<number>(1);

  // ── 1. INITIALIZE FABRIC CANVAS ──
  useLayoutEffect(() => {
    if (settingsLoading) return;

    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    // Clean up any stale fabric instance on remount/refresh
    if (fabricCanvasRef.current) {
      try {
        fabricCanvasRef.current.dispose();
      } catch (err) {
        console.warn("Fabric cleanup warning:", err);
      }
      fabricCanvasRef.current = null;
    }

    const canvas = new fabric.Canvas(canvasEl, {
      width: VIRTUAL_WIDTH,
      height: VIRTUAL_HEIGHT,
      backgroundColor: 'transparent',
      preserveObjectStacking: true,
      selection: true,
    });

    fabricCanvasRef.current = canvas;

    // Restore saved state from ref or sessionStorage if available
    const savedState = currentViewRef.current === 'front'
      ? (frontStateRef.current || (typeof window !== 'undefined' ? sessionStorage.getItem('custom_front_state') : null))
      : (backStateRef.current || (typeof window !== 'undefined' ? sessionStorage.getItem('custom_back_state') : null));

    if (savedState) {
      const parsed = typeof savedState === 'string' ? JSON.parse(savedState) : savedState;
      canvas.loadFromJSON(parsed).then(() => {
        canvas.renderAll();
        const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2.5 });
        if (currentViewRef.current === 'front') {
          setFrontPreviewUrl(dataUrl);
        } else {
          setBackPreviewUrl(dataUrl);
        }
      }).catch(() => {
        canvas.renderAll();
      });
    } else {
      const initialJson = JSON.stringify(canvas.toJSON());
      historyRef.current = [initialJson];
      historyIdxRef.current = 0;
    }

    const updateScale = () => {
      if (!canvasContainerRef.current) return;
      const cw = canvasContainerRef.current.clientWidth || VIRTUAL_WIDTH;
      const ch = canvasContainerRef.current.clientHeight || VIRTUAL_HEIGHT;
      const scale = Math.min(cw / VIRTUAL_WIDTH, ch / VIRTUAL_HEIGHT);
      setCanvasScale(scale || 1);
      canvas.calcOffset();
    };

    updateScale();

    const resizeObserver = new ResizeObserver(() => {
      updateScale();
    });
    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }
    window.addEventListener('resize', updateScale);

    // Canvas Event Listeners
    const updateState = () => {
      const fc = fabricCanvasRef.current;
      if (!fc || isSwitchingViewRef.current) return;

      const active = fc.getActiveObject();
      setActiveObject(active || null);
      setCanvasObjects([...fc.getObjects()]);

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

      const dataUrl = fc.toDataURL({ format: 'png', multiplier: 2.5 });
      const currentJson = fc.toJSON();

      if (currentViewRef.current === 'front') {
        setFrontPreviewUrl(dataUrl);
        frontStateRef.current = currentJson;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('custom_front_state', JSON.stringify(currentJson));
        }
      } else {
        setBackPreviewUrl(dataUrl);
        backStateRef.current = currentJson;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('custom_back_state', JSON.stringify(currentJson));
        }
      }

      if (!isUndoRedoRef.current) {
        const json = JSON.stringify(currentJson);
        const history = historyRef.current.slice(0, historyIdxRef.current + 1);
        history.push(json);
        historyRef.current = history;
        historyIdxRef.current = history.length - 1;
      }
      isUndoRedoRef.current = false;
    };

    canvas.on('selection:created', updateState);
    canvas.on('selection:updated', updateState);
    canvas.on('selection:cleared', () => setActiveObject(null));
    canvas.on('object:modified', updateState);
    canvas.on('object:added', updateState);
    canvas.on('object:removed', updateState);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScale);
      if (fabricCanvasRef.current) {
        try {
          fabricCanvasRef.current.dispose();
        } catch (err) {
          console.warn("Fabric dispose warning:", err);
        }
        fabricCanvasRef.current = null;
      }
    };
  }, [settingsLoading]);

  // ── AUTO-GENERATE REAL VIEW SHIRT MOCKUPS ON DESIGN / COLOR CHANGE ──
  useEffect(() => {
    let active = true;
    const syncRealMockups = async () => {
      const frontMock = await generateRealViewMockup(garmentType, selectedColor.hex, 'front', frontPreviewUrl);
      if (active) setFrontMockupPreviewUrl(frontMock);

      const backMock = await generateRealViewMockup(garmentType, selectedColor.hex, 'back', backPreviewUrl);
      if (active) setBackMockupPreviewUrl(backMock);
    };
    syncRealMockups();
    return () => { active = false; };
  }, [frontPreviewUrl, backPreviewUrl, garmentType, selectedColor.hex]);


  // ── 2. HANDLE VIEW SWITCHING (FRONT / BACK) ──
  const switchView = async (targetView: 'front' | 'back') => {
    const fc = fabricCanvasRef.current;
    if (!fc || targetView === currentViewRef.current) return;

    isSwitchingViewRef.current = true;
    try {
      // Save current view JSON
      const currentJson = fc.toJSON();
      const currentDataUrl = fc.toDataURL({ format: 'png', multiplier: 2.5 });

      if (currentViewRef.current === 'front') {
        frontStateRef.current = currentJson;
        setFrontPreviewUrl(currentDataUrl);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('custom_front_state', JSON.stringify(currentJson));
        }
      } else {
        backStateRef.current = currentJson;
        setBackPreviewUrl(currentDataUrl);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('custom_back_state', JSON.stringify(currentJson));
        }
      }

      // Load target view JSON
      const targetJson = targetView === 'front' 
        ? (frontStateRef.current || (typeof window !== 'undefined' ? sessionStorage.getItem('custom_front_state') : null))
        : (backStateRef.current || (typeof window !== 'undefined' ? sessionStorage.getItem('custom_back_state') : null));
      
      currentViewRef.current = targetView;
      setCurrentView(targetView);

      isUndoRedoRef.current = true;
      fc.clear();

      if (targetJson) {
        const parsed = typeof targetJson === 'string' ? JSON.parse(targetJson) : targetJson;
        await fc.loadFromJSON(parsed);
        fc.renderAll();
        const dataUrl = fc.toDataURL({ format: 'png', multiplier: 2.5 });
        if (targetView === 'front') {
          setFrontPreviewUrl(dataUrl);
        } else {
          setBackPreviewUrl(dataUrl);
        }
      }
    } finally {
      isSwitchingViewRef.current = false;
    }
  };

  // ── 3. UNDO / REDO CONTROLS ──
  const handleUndo = async () => {
    const fc = fabricCanvasRef.current;
    if (!fc || historyIdxRef.current <= 0) return;
    historyIdxRef.current -= 1;
    isUndoRedoRef.current = true;
    const json = historyRef.current[historyIdxRef.current];
    if (json) {
      await fc.loadFromJSON(JSON.parse(json));
      fc.renderAll();
    }
  };

  const handleRedo = async () => {
    const fc = fabricCanvasRef.current;
    if (!fc || historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current += 1;
    isUndoRedoRef.current = true;
    const json = historyRef.current[historyIdxRef.current];
    if (json) {
      await fc.loadFromJSON(JSON.parse(json));
      fc.renderAll();
    }
  };

  // ── 4. ADD TEXT TO CANVAS ──
  const handleAddText = () => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    const iText = new fabric.IText(textInput || 'YOUR TEXT', {
      left: VIRTUAL_WIDTH / 2,
      top: VIRTUAL_HEIGHT / 2,
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

    fc.add(iText);
    fc.setActiveObject(iText);
    fc.renderAll();
    showToast("Text Added", "Text object added to printable canvas.", "success");
  };

  // Update text object dynamically on property change
  const updateActiveText = (key: string, value: any) => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    const active = fc.getActiveObject();
    if (active && active.type === 'i-text') {
      active.set(key as any, value);
      fc.renderAll();
    }
  };

  // ── 5. UPLOAD IMAGE TO CANVAS ──
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const fc = fabricCanvasRef.current;
    if (!file || !fc) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) return;

      const img = new Image();
      img.onload = () => {
        try {
          const fabImg = new fabric.FabricImage(img, {
            originX: 'center',
            originY: 'center',
            cornerColor: '#F9A37E',
            cornerStyle: 'circle',
            borderColor: '#F9A37E',
            cornerSize: 8,
            transparentCorners: false,
          });

          // Scale down proportionally if image is larger than printable bounds
          const maxW = fc.getWidth() * 0.8;
          const maxH = fc.getHeight() * 0.8;
          if (img.width > maxW || img.height > maxH) {
            const scale = Math.min(maxW / img.width, maxH / img.height);
            fabImg.scale(scale);
          }

          // Center image on canvas
          const canvasCenterX = fc.getWidth() / 2;
          const canvasCenterY = fc.getHeight() / 2;
          fabImg.set({ left: canvasCenterX, top: canvasCenterY });

          fc.add(fabImg);
          fc.setActiveObject(fabImg);
          fc.requestRenderAll();

          // Store raw uploaded artwork file
          if (currentViewRef.current === 'front') {
            rawFrontArtworkRef.current = dataUrl;
          } else {
            rawBackArtworkRef.current = dataUrl;
          }

          // Update preview snapshot after render
          setTimeout(() => {
            const previewUrl = fc.toDataURL({ format: 'png', multiplier: 2.5 });
            if (currentViewRef.current === 'front') {
              setFrontPreviewUrl(previewUrl);
            } else {
              setBackPreviewUrl(previewUrl);
            }
          }, 50);

          showToast('Artwork Uploaded', 'Graphic placed on garment workspace.', 'success');
        } catch (err) {
          console.error('Error creating FabricImage:', err);
          showToast('Upload Error', 'Could not render artwork on canvas.', 'error');
        }
      };
      img.onerror = () => {
        showToast('Error', 'Invalid image file provided.', 'error');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // ── 6. ADD SHAPES TO CANVAS ──
  const handleAddShape = (shapeType: 'rect' | 'circle' | 'triangle' | 'star' | 'shield') => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    let shapeObj: fabric.Object;
    const commonProps = {
      left: VIRTUAL_WIDTH / 2,
      top: VIRTUAL_HEIGHT / 2,
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
    } else if (shapeType === 'star') {
      shapeObj = new fabric.Rect({ ...commonProps, width: 70, height: 70, rx: 12, ry: 12 });
    } else {
      shapeObj = new fabric.Rect({ ...commonProps, width: 85, height: 85, rx: 20, ry: 20 });
    }

    fc.add(shapeObj);
    fc.setActiveObject(shapeObj);
    fc.renderAll();
    showToast("Shape Added", `${shapeType.toUpperCase()} shape added to canvas.`, "info");
  };

  // ── 7. JERSEY PERSONALIZATION (ROSTER NAME & NUMBER) ──
  const handleAddJerseyRoster = () => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;

    if (jerseyName.trim()) {
      const nameText = new fabric.IText(jerseyName.toUpperCase(), {
        left: VIRTUAL_WIDTH / 2,
        top: VIRTUAL_HEIGHT / 2 - 40,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Impact, sans-serif',
        fontSize: 32,
        fill: textColor,
        fontWeight: 'bold',
        cornerColor: '#F9A37E',
        cornerStyle: 'circle',
        borderColor: '#F9A37E',
        cornerSize: 8,
      });
      fc.add(nameText);
    }

    if (jerseyNumber.trim()) {
      const numText = new fabric.IText(jerseyNumber, {
        left: VIRTUAL_WIDTH / 2,
        top: VIRTUAL_HEIGHT / 2 + 30,
        originX: 'center',
        originY: 'center',
        fontFamily: 'Impact, sans-serif',
        fontSize: 64,
        fill: textColor,
        fontWeight: 'bold',
        cornerColor: '#F9A37E',
        cornerStyle: 'circle',
        borderColor: '#F9A37E',
        cornerSize: 8,
      });
      fc.add(numText);
    }

    fc.renderAll();
    showToast("Roster Added", "Player name and number placed on garment.", "success");
  };

  // ── 8. LAYER & ALIGNMENT ACTIONS ──
  const alignActiveObject = (mode: 'centerH' | 'centerV') => {
    const fc = fabricCanvasRef.current;
    if (!fc || !activeObject) return;
    if (mode === 'centerH') {
      fc.centerObjectH(activeObject);
    } else {
      fc.centerObjectV(activeObject);
    }
    fc.renderAll();
  };

  const moveLayer = (direction: 'up' | 'down') => {
    const fc = fabricCanvasRef.current;
    if (!fc || !activeObject) return;
    if (direction === 'up') {
      fc.bringObjectForward(activeObject);
    } else {
      fc.sendObjectBackwards(activeObject);
    }
    fc.renderAll();
  };

  const deleteActiveObject = () => {
    const fc = fabricCanvasRef.current;
    if (!fc || !activeObject) return;
    fc.remove(activeObject);
    fc.discardActiveObject();
    fc.renderAll();
    showToast("Object Removed", "Selected element deleted from canvas.", "info");
  };

  const duplicateActiveObject = async () => {
    const fc = fabricCanvasRef.current;
    if (!fc || !activeObject) return;
    const cloned = await activeObject.clone();
    cloned.set({
      left: (cloned.left || VIRTUAL_WIDTH / 2) + 15,
      top: (cloned.top || VIRTUAL_HEIGHT / 2) + 15,
    });
    fc.add(cloned);
    fc.setActiveObject(cloned);
    fc.renderAll();
    showToast("Object Duplicated", "Copy created on canvas.", "info");
  };

  const clearCanvas = () => {
    const fc = fabricCanvasRef.current;
    if (!fc) return;
    fc.clear();
    fc.renderAll();
    if (currentViewRef.current === 'front') {
      frontStateRef.current = null;
      setFrontPreviewUrl('');
      if (typeof window !== 'undefined') sessionStorage.removeItem('custom_front_state');
    } else {
      backStateRef.current = null;
      setBackPreviewUrl('');
      if (typeof window !== 'undefined') sessionStorage.removeItem('custom_back_state');
    }
    showToast("Canvas Cleared", "All design elements removed.", "info");
  };

  // Composite Canvas Mockup Generator for Download & Admin Review
  const generateRealViewMockup = async (
    garmentType: string,
    colorHex: string,
    view: 'front' | 'back',
    artworkUrl?: string
  ): Promise<string> => {
    return new Promise((resolve) => {
      const isPolo = garmentType === 'polo';
      const isBack = view === 'back';
      const isWhite = !colorHex || colorHex.toUpperCase() === '#FFFFFF' || colorHex.toUpperCase() === '#FFF';

      const baseImgSrc = isPolo
        ? (isBack ? '/polo_back.png' : '/polo_front.png')
        : (isBack ? '/whiteTshirtBack.png' : '/whiteTshirtFront.png');

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 800;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve('');

      const baseImg = new Image();
      baseImg.crossOrigin = 'anonymous';
      baseImg.src = baseImgSrc;

      baseImg.onload = () => {
        if (!isWhite) {
          // 1. Draw base image to establish alpha shape of garment
          ctx.drawImage(baseImg, 0, 0, 800, 800);

          // 2. Fill color strictly inside garment silhouette
          ctx.globalCompositeOperation = 'source-in';
          ctx.fillStyle = colorHex;
          ctx.fillRect(0, 0, 800, 800);

          // 3. Composite garment shading and fabric texture
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(baseImg, 0, 0, 800, 800);

          ctx.globalCompositeOperation = 'source-over';
        } else {
          ctx.drawImage(baseImg, 0, 0, 800, 800);
        }

        if (!artworkUrl) {
          return resolve(canvas.toDataURL('image/png'));
        }

        const artImg = new Image();
        artImg.crossOrigin = 'anonymous';
        artImg.src = artworkUrl;
        artImg.onload = () => {
          const printW = 336;
          const printH = 384;
          const printX = (800 - printW) / 2;
          const printY = 200;

          const scale = Math.min(printW / artImg.width, printH / artImg.height);
          const drawW = artImg.width * scale;
          const drawH = artImg.height * scale;
          const drawX = printX + (printW - drawW) / 2;
          const drawY = printY + (printH - drawH) / 2;

          ctx.drawImage(artImg, drawX, drawY, drawW, drawH);
          resolve(canvas.toDataURL('image/png'));
        };
        artImg.onerror = () => resolve(canvas.toDataURL('image/png'));
      };
      baseImg.onerror = () => resolve('');
    });
  };

  // ── 9. ADD CUSTOM APPAREL TO CART ──
  const handleAddToCart = async () => {
    if (totalQuantity <= 0) {
      showToast("Select Quantity", "Please enter quantity for at least one size.", "info");
      return;
    }

    setUploading(true);
    try {
      const fc = fabricCanvasRef.current;
      // Save current side before export
      const currentJson = fc?.toJSON();
      const currentUrl = fc?.toDataURL({ format: 'png', multiplier: 2.5 });

      let finalFrontUrl = frontPreviewUrl;
      let finalBackUrl = backPreviewUrl;

      if (currentViewRef.current === 'front') {
        frontStateRef.current = currentJson;
        finalFrontUrl = currentUrl || frontPreviewUrl;
      } else {
        backStateRef.current = currentJson;
        finalBackUrl = currentUrl || backPreviewUrl;
      }

      // Cloudinary upload for transparent design PNGs
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

      // Generate Real View Shirt Mockup Images
      const frontMockupData = await generateRealViewMockup(garmentType, selectedColor.hex, 'front', finalFrontUrl);
      const backMockupData = await generateRealViewMockup(garmentType, selectedColor.hex, 'back', finalBackUrl);

      let uploadedFrontMockup = '';
      let uploadedBackMockup = '';

      if (frontMockupData) {
        try {
          const res = await fetch(getApiUrl('/cloudinary/upload'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: frontMockupData }),
          });
          const data = await res.json();
          uploadedFrontMockup = data.url || frontMockupData;
        } catch {
          uploadedFrontMockup = frontMockupData;
        }
      }

      if (backMockupData) {
        try {
          const res = await fetch(getApiUrl('/cloudinary/upload'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: backMockupData }),
          });
          const data = await res.json();
          uploadedBackMockup = data.url || backMockupData;
        } catch {
          uploadedBackMockup = backMockupData;
        }
      }

      // Upload raw uploaded original artwork files to Cloudinary if available
      let uploadedRawFrontCloud = '';
      let uploadedRawBackCloud = '';

      if (rawFrontArtworkRef.current) {
        try {
          const res = await fetch(getApiUrl('/cloudinary/upload'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: rawFrontArtworkRef.current }),
          });
          const data = await res.json();
          uploadedRawFrontCloud = data.url || rawFrontArtworkRef.current;
        } catch {
          uploadedRawFrontCloud = rawFrontArtworkRef.current;
        }
      }

      if (rawBackArtworkRef.current) {
        try {
          const res = await fetch(getApiUrl('/cloudinary/upload'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: rawBackArtworkRef.current }),
          });
          const data = await res.json();
          uploadedRawBackCloud = data.url || rawBackArtworkRef.current;
        } catch {
          uploadedRawBackCloud = rawBackArtworkRef.current;
        }
      }

      const hasFrontPrint = !!frontStateRef.current?.objects?.length;
      const hasBackPrint = !!backStateRef.current?.objects?.length;

      const customizationFee = (hasFrontPrint ? 150 : 0) + (hasBackPrint ? 150 : 0);
      const baseUnitPrice = (PRICES[garmentType] + customizationFee) * (1 - discountPercent / 100);

      const customDesignMeta = {
        productType: garmentType,
        color: selectedColor.name,
        colorHex: selectedColor.hex,
        sizeQuantities: sizeQuantities,
        discountPercent: discountPercent,
        front: {
          imageUrl: uploadedFrontCloud || finalFrontUrl,
          rawArtworkUrl: uploadedRawFrontCloud || rawFrontArtworkRef.current,
        },
        back: {
          imageUrl: uploadedBackCloud || finalBackUrl,
          rawArtworkUrl: uploadedRawBackCloud || rawBackArtworkRef.current,
        },
        frontDesignUrl: uploadedFrontCloud || finalFrontUrl,
        backDesignUrl: uploadedBackCloud || finalBackUrl,
        rawFrontArtworkUrl: uploadedRawFrontCloud || rawFrontArtworkRef.current,
        rawBackArtworkUrl: uploadedRawBackCloud || rawBackArtworkRef.current,
        frontMockupUrl: uploadedFrontMockup || frontMockupData,
        backMockupUrl: uploadedBackMockup || backMockupData,
      };

      const selectedSizesSummary = Object.entries(sizeQuantities)
        .filter(([_, q]) => q > 0)
        .map(([s, q]) => `${s}: ${q}`)
        .join(', ');

      addToCart({
        productId: `custom-${garmentType}`,
        name: `Custom ${garmentType === 'polo' ? 'Polo Shirt' : 'T-Shirt'} (${selectedColor.name})`,
        price: baseUnitPrice,
        quantity: totalQuantity,
        image: uploadedFrontMockup || frontMockupData || uploadedFrontCloud || '/kliamologoNew.png',
        size: selectedSizesSummary || 'M',
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
  const rawUnitPrice = PRICES[garmentType] + customizationFee;
  const unitPrice = rawUnitPrice * (1 - discountPercent / 100);
  const totalPrice = unitPrice * totalQuantity;

  if (settingsLoading) {
    return (
      <div className="min-h-screen bg-[#FDFAF6] flex items-center justify-center p-8">
        <Sparkles className="w-8 h-8 text-[#F9A37E] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4 pb-16">
      
      {/* ── HEADER BAR (CustomInk Lab Style) ── */}
      <div className="flex items-center justify-between flex-wrap gap-3 py-3 border-b border-[#E8E2D6] bg-white rounded-2xl px-5 shadow-xs">
        <div className="flex items-center gap-3">
          <Breadcrumb items={[{ name: "Design Studio" }]} />
          <span className="hidden md:inline-block h-4 w-px bg-[#E8E2D6]" />
          <div className="hidden md:flex items-center gap-2 text-xs text-[#7A736A]">
            <Shield className="w-3.5 h-3.5 text-[#F9A37E]" />
            <span className="font-extrabold text-[#4A453E]">{garmentType === 'polo' ? 'Polo Shirt' : 'Crewneck Tee'}</span>
            <span>• {selectedColor.name}</span>
          </div>
        </div>

        {/* Action Controls & Top CTA */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIdxRef.current <= 0}
            className="p-2 border border-[#E8E2D6] rounded-xl hover:bg-[#FDFAF6] text-[#7A736A] disabled:opacity-40 transition-colors"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIdxRef.current >= historyRef.current.length - 1}
            className="p-2 border border-[#E8E2D6] rounded-xl hover:bg-[#FDFAF6] text-[#7A736A] disabled:opacity-40 transition-colors"
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
          <button
            onClick={handleAddToCart}
            disabled={uploading}
            className="ml-2 bg-[#F9A37E] hover:bg-[#E8855A] text-white font-extrabold text-xs px-5 py-2 rounded-xl transition-all shadow-md flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Order Now (₹{totalPrice.toFixed(0)})
          </button>
        </div>
      </div>

      {/* ── THREE-COLUMN DESIGN LAB GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── 1. LEFT SIDEBAR: UPLOAD ARTWORK DRAWER ── */}
        <div className="lg:col-span-4 bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-4">
          
          <div className="flex items-center gap-2 border-b border-[#E8E2D6] pb-3">
            <Upload className="w-5 h-5 text-[#F9A37E]" />
            <h3 className="font-extrabold text-sm text-[#4A453E]">Upload Custom Artwork</h3>
          </div>

          <div className="space-y-4 animate-fade-in duration-150">
            <label className="border-2 border-dashed border-[#E8E2D6] hover:border-[#F9A37E] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#FDFAF6] hover:bg-white cursor-pointer transition-all">
              <Upload className="w-8 h-8 text-[#F9A37E]" />
              <p className="text-xs font-bold text-[#4A453E]">Choose Image (PNG / JPG / SVG)</p>
              <p className="text-[10px] text-[#A89B8A] text-center">High resolution transparent artwork recommended</p>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {activeObject && (
              <div className="p-3 border border-[#E8E2D6] rounded-xl bg-[#FDFAF6] space-y-2">
                <span className="text-[10px] font-black uppercase text-[#F9A37E]">Artwork Position Controls</span>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => alignActiveObject('centerH')} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:border-[#F9A37E]">
                    <AlignCenter className="w-3 h-3" /> Center Horiz
                  </button>
                  <button onClick={() => alignActiveObject('centerV')} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:border-[#F9A37E]">
                    <Move className="w-3 h-3" /> Center Vert
                  </button>
                  <button onClick={duplicateActiveObject} className="py-1.5 px-2 bg-white border border-[#E8E2D6] rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:border-[#F9A37E]">
                    <Copy className="w-3 h-3" /> Duplicate
                  </button>
                  <button onClick={deleteActiveObject} className="py-1.5 px-2 bg-white border border-red-200 text-red-500 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 hover:bg-red-50">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── 2. CENTER WORKSPACE: REAL APPAREL STUDIO CANVAS ── */}
        <div className="overflow-hidden lg:col-span-5 flex flex-col items-center justify-between border border-[#E8E2D6] bg-white rounded-2xl p-4 relative min-h-[540px] shadow-sm">
          
          {/* Top View Switcher & Zoom Controls */}
          <div className="w-full flex items-center justify-center sm:justify-between z-10 flex-wrap gap-2">
            <div className="flex gap-2 bg-[#FDFAF6] border border-[#E8E2D6] rounded-full p-1 shadow-xs">
              <button
                onClick={() => switchView('front')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'front' ? 'bg-[#F9A37E] text-white shadow-xs' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Front View
              </button>
              <button
                onClick={() => switchView('back')}
                className={`text-xs font-extrabold px-4 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${currentView === 'back' ? 'bg-[#F9A37E] text-white shadow-xs' : 'text-[#7A736A] hover:bg-[#E8E2D6]/40'}`}
              >
                <Eye className="w-3.5 h-3.5" />
                Back View
              </button>
            </div>

            <div className="flex items-center gap-1 bg-[#FDFAF6] border border-[#E8E2D6] rounded-full px-2 py-1">
              <button onClick={() => setStudioZoom(Math.max(0.8, studioZoom - 0.1))} className="p-1 text-[#7A736A] hover:text-[#4A453E]">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-black text-[#4A453E] w-8 text-center">{Math.round(studioZoom * 100)}%</span>
              <button onClick={() => setStudioZoom(Math.min(1.4, studioZoom + 0.1))} className="p-1 text-[#7A736A] hover:text-[#4A453E]">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Studio Garment Background with Fabric.js Interactive Overlay */}
          <div 
            className="relative w-full max-w-md aspect-square my-auto flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${studioZoom})` }}
          >
            
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
              <span className="absolute -top-10 sm:-top-6 text-center text-[8px] font-black text-[#e8855a] uppercase tracking-wider bg-white/95 px-2 py-0.5 rounded-full border border-[#F9A37E]/40 shadow-xs">
                Print Area ({currentView.toUpperCase()})
              </span>

              {/* Corner Indicators */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#e8855a]" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#e8855a]" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#e8855a]" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#e8855a]" />
            </div>

            {/* Fabric.js Dynamic Overlay Canvas */}
            <div
              ref={canvasContainerRef}
              className="absolute z-30 flex items-center justify-center overflow-visible pointer-events-none"
              style={{
                width: '42%',
                height: '48%',
                top: '25%',
                left: '29%',
              }}
            >
              <div
                style={{
                  width: `${VIRTUAL_WIDTH}px`,
                  height: `${VIRTUAL_HEIGHT}px`,
                  transform: `scale(${canvasScale})`,
                  transformOrigin: 'center center',
                  pointerEvents: 'auto',
                  position: 'relative',
                }}
              >
                <canvas
                  ref={canvasRef}
                  width={VIRTUAL_WIDTH}
                  height={VIRTUAL_HEIGHT}
                  style={{ display: 'block' }}
                />
              </div>
            </div>

          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-[#A89B8A] bg-[#FDFAF6] border border-[#E8E2D6] px-4 py-2 rounded-full w-full max-w-sm justify-center">
            <HelpCircle className="w-3.5 h-3.5 text-[#F9A37E]" />
            <span>Click & drag your artwork graphics inside the dashed printable box</span>
          </div>

        </div>

        {/* ── 3. RIGHT SIDEBAR: OPTIONS, SIZES & LIVE PRICING MATRIX ── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Garment Options */}
          <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs text-[#4A453E] border-b border-[#E8E2D6] pb-2">1. Select Style & Color</h3>
            
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">Garment Style</label>
              <div className="grid grid-cols-2 gap-2">
                {GARMENT_TYPES.map(g => (
                  <button
                    key={g.id}
                    onClick={() => setGarmentType(g.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${garmentType === g.id ? 'border-[#F9A37E] bg-[#FDFAF6] shadow-xs' : 'border-[#E8E2D6] hover:border-zinc-300'}`}
                  >
                    <p className="font-black text-xs text-[#4A453E]">{g.name}</p>
                    <p className="text-[10px] text-[#F9A37E] font-bold mt-0.5">₹{g.basePrice}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches Grid */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#7A736A]">
                Garment Color: <span className="text-[#4A453E] font-extrabold">{selectedColor.name}</span>
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

            {/* Size Breakdown Quantity Matrix (CustomInk Style) */}
            <div className="space-y-2 pt-2 border-t border-[#E8E2D6]">
              <div className="flex justify-between items-center">
                <label className="block text-[11px] font-bold text-[#7A736A]">Size & Quantity Roster</label>
                <span className="text-[10px] font-black text-[#F9A37E]">Total: {totalQuantity} pcs</span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-center">
                {SIZES.map(s => (
                  <div key={s} className="border border-[#E8E2D6] rounded-xl p-1 bg-[#FDFAF6]">
                    <span className="block text-[10px] font-black text-[#4A453E] mb-1">{s}</span>
                    <input
                      type="number"
                      min="0"
                      value={sizeQuantities[s] || 0}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setSizeQuantities(prev => ({ ...prev, [s]: val }));
                      }}
                      className="w-full text-center bg-white border border-[#E8E2D6] rounded-lg text-xs font-bold py-1 text-[#4A453E] focus:outline-none focus:border-[#F9A37E]"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Volume Bulk Discount Banner */}
            {discountPercent > 0 ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-center">
                <p className="text-xs font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Bulk Savings Applied ({discountPercent}% OFF)
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-[#A89B8A] italic text-center">Order 6+ shirts to unlock 10% volume discount!</p>
            )}

          </div>

          {/* Live Side-by-Side Review Cards */}
          {(frontPreviewUrl || backPreviewUrl) && (
            <div className="bg-white border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-3">
              <h4 className="font-extrabold text-xs text-[#4A453E]">2. Real-View Live Shirt Preview</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-[#E8E2D6] rounded-xl p-2 bg-[#FDFAF6] flex flex-col items-center">
                  <div className="w-24 h-24 relative overflow-hidden flex items-center justify-center bg-white rounded-lg border border-[#E8E2D6]">
                    {frontMockupPreviewUrl ? (
                      <img src={frontMockupPreviewUrl} alt="Real View Front" className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                      <CustomGarmentPreview
                        customDesign={{
                          baseImage: JSON.stringify({
                            productType: garmentType,
                            colorHex: selectedColor.hex,
                            frontDesignUrl: frontPreviewUrl,
                          })
                        }}
                        view="front"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <span className="text-[8px] font-black text-[#7A736A] mt-1 uppercase">Front View</span>
                </div>
                <div className="border border-[#E8E2D6] rounded-xl p-2 bg-[#FDFAF6] flex flex-col items-center">
                  <div className="w-24 h-24 relative overflow-hidden flex items-center justify-center bg-white rounded-lg border border-[#E8E2D6]">
                    {backMockupPreviewUrl ? (
                      <img src={backMockupPreviewUrl} alt="Real View Back" className="w-full h-full object-contain pointer-events-none" />
                    ) : (
                      <CustomGarmentPreview
                        customDesign={{
                          baseImage: JSON.stringify({
                            productType: garmentType,
                            colorHex: selectedColor.hex,
                            backDesignUrl: backPreviewUrl,
                          })
                        }}
                        view="back"
                        className="w-full h-full"
                      />
                    )}
                  </div>
                  <span className="text-[8px] font-black text-[#7A736A] mt-1 uppercase">Back View</span>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & CTA */}
          <div className="bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl p-4 shadow-sm space-y-4">
            <h4 className="font-extrabold text-xs text-[#4A453E] border-b border-[#E8E2D6] pb-1.5">3. All-Inclusive Summary</h4>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A736A]">
                <span>Base Garment ({totalQuantity} pcs)</span>
                <span className="font-bold text-[#4A453E]">₹{(PRICES[garmentType] * totalQuantity).toFixed(2)}</span>
              </div>
              {customizationFee > 0 && (
                <div className="flex justify-between text-[#7A736A]">
                  <span>Print Fee ({hasFrontPrint && hasBackPrint ? '2 Sides' : '1 Side'})</span>
                  <span className="font-bold text-[#4A453E]">₹{(customizationFee * totalQuantity).toFixed(2)}</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Volume Discount ({discountPercent}%)</span>
                  <span>-₹{((rawUnitPrice * totalQuantity) * (discountPercent / 100)).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[#E8E2D6] pt-2 text-sm font-black">
                <span className="text-[#4A453E]">Total Estimated Price</span>
                <span className="text-[#F9A37E]">₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={uploading}
              className="w-full bg-[#F9A37E] hover:bg-[#E8855A] disabled:opacity-60 text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-[#F9A37E]/25 flex items-center justify-center gap-2"
            >
              {uploading ? (
                <span>Processing Order...</span>
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
