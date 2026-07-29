"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../components/ApiConfig';
import Link from 'next/link';
import { ArrowRight, Paintbrush, ShieldCheck, Sparkles, ShoppingBag, Flame, Truck, Layers, Leaf, Palette, Play, SlidersHorizontal, Printer, Code2, CheckCircle2, Terminal, Loader2, X, ChevronLeft, ChevronRight, Shirt, Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ReviewCard } from '../components/InfoCards';
import { Product } from '../components/AppContext';
import { Slider, EmptyState } from '../components/UIComponents';

// Dynamic catalog fetching active

/* ─── Hero Slides Data ─── */
interface Slide {
  id: number | string;
  title?: string;
  desktopImage?: string;
  mobileImage?: string;
  link?: string;
  badge?: string;
  headline1?: string;
  headline2?: string;
  headline2Color?: string;
  sub?: string;
  badges?: { icon: string; label: string }[];
  bg?: string;
  accent?: string;
  textDark?: boolean;
  productImg?: string;
  bgImg?: string;
  headline1Color?: string;
  subColor?: string;
  badgeColor?: string;
  overlayColor?: string;
}

const HERO_SLIDES: Slide[] = [
  {
    id: 1,
    badge: "NEW COLLECTION",
    headline1: "PRINTED",
    headline2: "T-SHIRTS",
    headline2Color: "#E5A93B",
    sub: "Express Your Style with Unique Prints & Premium Quality",
    badges: [
      { icon: "🌿", label: "100%\nCOTTON" },
      { icon: "🎨", label: "HIGH QUALITY\nPRINT" },
      { icon: "🛡️", label: "DURABLE &\nLONG LASTING" },
      { icon: "🚚", label: "FAST\nDELIVERY" },
    ],
    bg: "#F4F4F4",
    accent: "#E5A93B",
    textDark: true,
    productImg: "https://res.cloudinary.com/mywtapmm/image/upload/v1783943689/my-turborepo-ecommerce/iabnpywsmj5rodkneylp.png",
  },
  {
    id: 2,
    badge: "",
    headline1: "PRINTED",
    headline2: "TO IMPRESS",
    headline2Color: "#1E40AF",
    sub: "Comfort You Feel, Style You Love.",
    badges: [
      { icon: "👕", label: "PREMIUM QUALITY\nFABRIC" },
      { icon: "🖨️", label: "LONG LASTING\nPRINTS" },
      { icon: "👥", label: "UNISEX\nCOLLECTION" },
    ],
    bg: "#F0F4F8",
    accent: "#1E40AF",
    textDark: true,
    productImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    badge: "",
    headline1: "BOLD DESIGNS.",
    headline2: "REAL YOU.",
    headline2Color: "#E5A93B",
    sub: "PRINTED T-SHIRTS",
    badges: [
      { icon: "🌿", label: "SOFT &\nBREATHABLE" },
      { icon: "🎨", label: "VIBRANT\nPRINTS" },
      { icon: "🛡️", label: "DURABLE\nQUALITY" },
    ],
    bg: "#121212",
    accent: "#E5A93B",
    textDark: false,
    productImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop&q=80",
  },
];

const FEATURE_ICONS: Record<string, React.ElementType> = {
  "100% COTTON": Leaf,
  "HIGH QUALITY PRINT": Palette,
  "DURABLE & LONG LASTING": ShieldCheck,
  "FAST DELIVERY": Truck,
  "SOFT & BREATHABLE": Leaf,
  "VIBRANT PRINTS": Palette,
  "DURABLE QUALITY": ShieldCheck,
  "PREMIUM QUALITY FABRIC": Leaf,
  "LONG LASTING PRINTS": Palette,
  "UNISEX COLLECTION": Layers,
};

function HeroBanner() {
  const [slides, setSlides] = useState<Slide[]>(HERO_SLIDES);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // Drag & Touch gesture state
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(getApiUrl("/banner"))
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("unreachable");
      })
      .then(data => {
        if (data && data.length > 0) {
          setSlides(data);
        }
      })
      .catch(() => {
        // fallback quietly to HERO_SLIDES
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setDragOffset(0);
  }, []);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent(prev => (prev + 1) % slides.length);
    setDragOffset(0);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrent(prev => (prev - 1 + slides.length) % slides.length);
    setDragOffset(0);
  }, [slides.length]);

  // Auto-play timer (4.5s)
  useEffect(() => {
    if (slides.length <= 1 || isDragging || loading) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length, isDragging, loading]);

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!e.targetTouches[0]) return;
    setDragStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null || !e.targetTouches[0]) return;
    const diff = e.targetTouches[0].clientX - dragStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (dragStartX !== null) {
      const minSwipeDistance = 40;
      if (dragOffset < -minSwipeDistance) {
        nextSlide();
      } else if (dragOffset > minSwipeDistance) {
        prevSlide();
      }
    }
    setDragStartX(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  // Mouse Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a, button')) return;
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
    if (isDragging && dragStartX !== null) {
      const minSwipeDistance = 40;
      if (dragOffset < -minSwipeDistance) {
        nextSlide();
      } else if (dragOffset > minSwipeDistance) {
        prevSlide();
      }
    }
    setDragStartX(null);
    setIsDragging(false);
    setDragOffset(0);
  };

  if (loading) {
    return (
      <section className="relative overflow-hidden select-none min-h-[220px] sm:min-h-[380px] lg:min-h-[480px] flex items-center bg-[#F4F4F4] animate-pulse">
        <div className="w-full h-full flex items-center justify-center py-16">
          <img src="/kliamologoNew.png" alt="Loading Banner" className="w-32 sm:w-44 h-auto opacity-40 animate-pulse" />
        </div>
      </section>
    );
  }

  const slide = slides[current] || HERO_SLIDES[0]!;
  const desktopImg = slide.desktopImage || slide.bgImg || "";
  const mobileImg = slide.mobileImage || slide.productImg || desktopImg;
  const targetLink = slide.link || "/products";

  const isImageBanner = !!(slide.desktopImage || slide.mobileImage || (!slide.headline1 && (desktopImg || mobileImg)));

  if (isImageBanner) {
    const bannerContent = (
      <div className="relative w-full overflow-hidden group">
        {/* Desktop Banner Image (Visible on Medium+ screens) */}
        {desktopImg && (
          <img
            src={desktopImg}
            alt={slide.title || "Desktop Storefront Banner"}
            className="hidden md:block w-full h-auto max-h-[580px] object-cover transition-transform duration-700 group-hover:scale-[1.01]"
          />
        )}
        {/* Mobile Banner Image (Visible on Small screens) */}
        {mobileImg && (
          <img
            src={mobileImg}
            alt={slide.title || "Mobile Storefront Banner"}
            className="block md:hidden w-full h-auto object-cover"
          />
        )}
      </div>
    );

    return (
      <section
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`w-full relative overflow-hidden bg-zinc-100 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        {targetLink ? (
          <Link href={targetLink} className="block w-full cursor-pointer">
            {bannerContent}
          </Link>
        ) : (
          bannerContent
        )}

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 z-20 pointer-events-auto">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goTo(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${idx === current ? 'w-6 h-2 bg-[#F9A37E]' : 'w-2 h-2 bg-white/70 shadow-xs'}`}
              />
            ))}
          </div>
        )}
      </section>
    );
  }

  const isDarkTheme = !slide.textDark;
  const hasBgImg = !!(slide.bgImg && slide.bgImg.length > 10);
  const headline1Color = slide.headline1Color || (isDarkTheme ? '#FFFFFF' : '#2E2B26');
  const subColor = slide.subColor || (isDarkTheme ? '#D4D4D8' : '#52525B');
  const badgeColor = slide.badgeColor || slide.accent || '#E5A93B';

  const overlayHex = slide.overlayColor || '#000000';
  const overlayR = parseInt(overlayHex.slice(1, 3), 16) || 0;
  const overlayG = parseInt(overlayHex.slice(3, 5), 16) || 0;
  const overlayB = parseInt(overlayHex.slice(5, 7), 16) || 0;
  const overlayRgba = (opacity: number) => `rgba(${overlayR},${overlayG},${overlayB},${opacity})`;

  return (
    <section
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative overflow-hidden select-none w-full bg-[#111] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      style={{
        backgroundColor: hasBgImg ? '#111' : (isDarkTheme ? '#111' : (slide.bg || '#F4F4F4')),
        transition: 'background-color 0.5s ease',
      }}
    >
      {/* Background Image */}
      {hasBgImg && (
        <img
          key={`bg-${current}`}
          src={slide.bgImg}
          alt="banner background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-700"
          style={{ objectPosition: 'center', zIndex: 0 }}
        />
      )}

      {/* Dynamic Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          zIndex: 2,
          background: hasBgImg
            ? `linear-gradient(to right, ${overlayRgba(0.92)} 0%, ${overlayRgba(0.45)} 50%, ${overlayRgba(0.38)} 100%)`
            : (isDarkTheme
              ? `radial-gradient(circle at 30% 50%, ${overlayRgba(0.55)} 0%, ${overlayRgba(0.35)} 100%)`
              : `linear-gradient(135deg, ${overlayRgba(0.07)} 0%, ${overlayRgba(0.01)} 100%)`)
        }}
      />

      {/* Relative Content Grid */}
      <div
        key={`slide-${current}`}
        className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative z-10 animate-slide-fade-in transition-all duration-500 ease-out"
        style={{
          opacity: isDragging ? Math.max(0.3, 1 - Math.abs(dragOffset) / 350) : undefined,
          transform: isDragging ? `translateX(${dragOffset * 0.35}px)` : undefined,
        }}
      >
        {/* Left Column: Text & CTA */}
        <div className="space-y-4 sm:space-y-6 text-center lg:text-left order-1">
          {slide.badge && (
            <span
              className="inline-block text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-[36px]"
              style={{ backgroundColor: badgeColor, color: '#fff' }}
            >
              {slide.badge}
            </span>
          )}

          <div className="space-y-2 md:space-y-3">
            <h1
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
              style={{
                fontFamily: "'Faculty Glyphic', sans-serif",
                color: headline1Color,
                textShadow: hasBgImg ? '0 2px 12px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {slide.headline1}
            </h1>
            <h2
              className="text-3xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight"
              style={{
                fontFamily: "'Faculty Glyphic', sans-serif",
                color: slide.headline2Color || '#E5A93B',
                textShadow: hasBgImg ? '0 2px 12px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {slide.headline2}
            </h2>
          </div>

          <p
            className="text-sm sm:text-base font-bold leading-relaxed max-w-lg mx-auto lg:mx-0"
            style={{ color: subColor }}
          >
            {slide.sub}
          </p>

          <div className="flex justify-center lg:justify-start pt-3">
            <Link
              href={targetLink}
              className="inline-flex items-center gap-2 font-black text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 text-white rounded-md transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: slide.accent || '#E5A93B' }}
            >
              SHOP NOW &rarr;
            </Link>
          </div>
        </div>

        {/* Right Column: Product Image */}
        <div className="relative flex items-center justify-center order-2">
          {slide.productImg && (
            <img
              src={slide.productImg}
              alt={slide.headline1 || "Product"}
              className="w-64 h-64 sm:w-[380px] sm:h-[380px] lg:w-full lg:h-full max-h-[500px] object-contain drop-shadow-2xl transition-all duration-700 ease-in-out hover:scale-105"
            />
          )}
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-4 sm:bottom-6 left-0 right-0 flex items-center justify-center gap-2.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="transition-all duration-300 cursor-pointer"
            style={{
              width: idx === current ? '24px' : '7px',
              height: '7px',
              borderRadius: '99px',
              backgroundColor: idx === current ? (slide.accent || '#E5A93B') : 'rgba(255,255,255,0.35)',
            }}
          />
        ))}
      </div>
    </section>
  );
}

interface GalleryItem {
  id: string;
  mediaUrl: string;
  link?: string;
  mediaType: string;
  isActive: boolean;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "g1", mediaUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80", link: "https://instagram.com", mediaType: "image", isActive: true },
  { id: "g2", mediaUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80", link: "https://instagram.com", mediaType: "image", isActive: true },
  { id: "g3", mediaUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80", link: "https://instagram.com", mediaType: "image", isActive: true },
  { id: "g4", mediaUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80", link: "https://instagram.com", mediaType: "image", isActive: true },
];

/* ─── GALLERY DEFINITION ─── */

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'best' | 'new'>('trending');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [_galleryLoading, setGalleryLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [activeProductIdx, setActiveProductIdx] = useState(0);
  const mobileProductScrollRef = React.useRef<HTMLDivElement>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);

    setGalleryLoading(true);
    fetch(getApiUrl("/gallery"))
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("failed");
      })
      .then((data) => {
        if (data && data.length > 0) {
          setGallery(data);
        }
      })
      .catch(() => {})
      .finally(() => { setGalleryLoading(false); });

    setTestimonialsLoading(true);
    fetch(getApiUrl('/testimonials'))
      .then(res => res.ok ? res.json() : [])
      .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
      .catch(() => {})
      .finally(() => setTestimonialsLoading(false));

    setProductsLoading(true);
    setCategoriesLoading(true);
    fetch(getApiUrl("/products"))
      .then(res => (res.ok ? res.json() : []))
      .then(prodData => {
        const hasProducts = Array.isArray(prodData) && prodData.length > 0;
        const loadCategories = (prods: any[]) => {
          return fetch(getApiUrl("/category"))
            .then(res => (res.ok ? res.json() : []))
            .then(catData => {
              if (Array.isArray(catData) && catData.length > 0) {
                const mapped = catData.map((c: any) => {
                  const realCount = prods.filter(
                    (p: any) => p.category?.toLowerCase() === c.name?.toLowerCase()
                  ).length;
                  return {
                    name: c.name,
                    image: c.image || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80",
                    count: realCount,
                    href: `/products?category=${encodeURIComponent(c.name)}`,
                  };
                });
                setCategories(mapped);
              }
            });
        };

        if (hasProducts) {
          setProducts(prodData);
          return loadCategories(prodData);
        } else {
          return fetch('/api/qikink/products')
            .then(r => r.json())
            .then(qData => {
              const qProds = qData.products || [];
              setProducts(qProds);
              return loadCategories(qProds);
            });
        }
      })
      .catch(() => {
        fetch('/api/qikink/products')
          .then(r => r.json())
          .then(qData => {
            setProducts(qData.products || []);
          })
          .catch(() => {});
      })
      .finally(() => {
        setProductsLoading(false);
        setCategoriesLoading(false);
      });


    return () => clearTimeout(timer);
  }, []);

  const trendingProducts = React.useMemo(() => {
    return products.slice(0, 8);
  }, [products]);

  const bestSellerProducts = React.useMemo(() => {
    const list = products.filter(p => p.tag === 'Best Seller');
    if (list.length >= 4) return list.slice(0, 8);
    const remaining = products.filter(p => !list.includes(p));
    return [...list, ...remaining].slice(0, 8);
  }, [products]);

  const mensProducts = React.useMemo(() => {
    const list = products.filter(p => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return (cat.includes('men') && !cat.includes('women')) || name.includes('men') || name.includes('polo') || name.includes('hoodie');
    });
    if (list.length >= 4) return list.slice(0, 8);
    const remaining = products.filter(p => !list.includes(p));
    return [...list, ...remaining].slice(0, 8);
  }, [products]);

  const womensProducts = React.useMemo(() => {
    const list = products.filter(p => {
      const cat = (p.category || '').toLowerCase();
      const name = (p.name || '').toLowerCase();
      return cat.includes('women') || name.includes('women') || name.includes('lady') || name.includes('crop') || name.includes('female');
    });
    if (list.length >= 4) return list.slice(0, 8);
    const remaining = products.filter(p => !list.includes(p));
    return [...list, ...remaining].slice(0, 8);
  }, [products]);

  const newArrivalProducts = React.useMemo(() => {
    const list = products.filter(p => p.tag === 'New' || p.tag === 'Eco' || p.tag === 'Trending');
    if (list.length >= 4) return list.slice(0, 8);
    const remaining = products.filter(p => !list.includes(p));
    return [...list, ...remaining].slice(0, 8);
  }, [products]);



  const activeGallery = gallery.length > 0 ? gallery.filter(item => item.isActive) : DEFAULT_GALLERY;

  const processSteps = [
    { step: "01", name: "Select Product",      icon: <ShoppingBag className="w-5 h-5" />, desc: "Choose from premium blank tees, hoodies, and accessories." },
    { step: "02", name: "Create Your Design",  icon: <Paintbrush className="w-5 h-5" />,  desc: "Use our drag-and-drop studio to upload graphics or write custom text." },
    { step: "03", name: "We Print & Ship",     icon: <Truck className="w-5 h-5" />,       desc: "DTG printer fulfills and ships directly to your doorstep within 48 hours." },
  ];

  const faqs = [
    { q: "What printing methods do you support?", a: "We use Direct-To-Garment (DTG) printing for detailed multi-color designs, and sublimation for drinkware. High-resolution results that do not fade over time." },
    { q: "Is there a minimum order quantity?",    a: "No minimum orders! Order one custom t-shirt or one thousand. We also offer bulk discounts for orders of 15+ units." },
    { q: "How long does shipping take?",          a: "Production takes 2-3 business days. Domestic shipping takes 3-5 days. Express options are available at checkout." },
  ];



  return (
    <div className="pb-10 sm:pb-16">

      {/* ── HERO SLIDER ── */}
      <HeroBanner />

      {/* ── TRUST BAR ── */}
      <section className="w-full bg-[#FDFAF6] py-6 sm:py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6">
            {[
              { icon: <ShieldCheck className="w-5 h-5 text-[#A8C69F]" />, label: "Quality Guarantee" },
              { icon: <Truck className="w-5 h-5 text-[#F9A37E]" />,       label: "48hr Fulfillment" },
              { icon: <Layers className="w-5 h-5 text-[#A8C69F]" />,      label: "No MOQ" },
              { icon: <Sparkles className="w-5 h-5 text-[#F9A37E]" />,    label: "Premium Prints" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 md:gap-3 p-2 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-white border border-zinc-100 shadow-md sm:shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#FDFAF6] border border-[#E8E2D6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs">
                  {item.icon}
                </div>
                <span className="text-xs md:text-sm font-extrabold text-[#4A453E] leading-tight">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ── */}
      <section className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">Shop by Category</h2>
              <p className="text-xs text-[#7A736A] mt-0.5">Premium blanks ready for your design</p>
            </div>
            <Link href="/categories" className="text-xs font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {categoriesLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array(4).fill(0).map((_, i) => <CategoryCard key={i} loading={true} />)}
            </div>
          ) : categories.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No categories found"
                description="Our blanks categories collection is currently empty. Please check back later!"
                icon={<SlidersHorizontal className="w-8 h-8 text-[#F9A37E]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <CategoryCard key={cat.name} name={cat.name} image={cat.image} count={cat.count} href={cat.href} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 1. TRENDING PRODUCTS (Full Warm Beige Band) ── */}
      <section className="w-full bg-[#FAF7F2] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight flex items-center gap-2">
                <Flame className="w-5.5 h-5.5 text-[#F9A37E]" /> Hot off the Press
              </h2>
              <p className="text-xs text-[#7A736A] mt-0.5">Curated blanks and trending designs for your custom look</p>
            </div>
            <Link href="/products" className="text-xs shrink-0 font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all self-start sm:self-auto py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {productsLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : trendingProducts.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No featured products found"
                description="Our custom print blanks catalog is temporarily offline. Please check back shortly!"
                icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={`trending-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 2. BEST SELLERS (Full Rich Sand Band) ── */}
      <section className="w-full bg-[#F5F0E8] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight flex items-center gap-2">
                <Sparkles className="w-5.5 h-5.5 text-[#F9A37E]" /> Best Sellers
              </h2>
              <p className="text-xs text-[#7A736A] mt-0.5">Most popular choices ordered by our custom print community</p>
            </div>
            <Link href="/products?tag=best" className="text-xs shrink-0 font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all self-start sm:self-auto py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {productsLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : bestSellerProducts.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No best sellers found"
                description="Our custom print catalog is updating. Check back shortly!"
                icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {bestSellerProducts.map((product) => (
                <ProductCard key={`best-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 3. MEN'S COLLECTION (Full Cool Slate Band) ── */}
      <section className="w-full bg-[#F0F4F8] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#334E68] tracking-tight flex items-center gap-2">
                <Shirt className="w-5.5 h-5.5 text-[#F9A37E]" /> Men's Collection
              </h2>
              <p className="text-xs text-[#627D98] mt-0.5">Tailored tees, polos, hoodies, and streetwear essentials for men</p>
            </div>
            <Link href="/products?category=Men" className="text-xs shrink-0 font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all self-start sm:self-auto py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {productsLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : mensProducts.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No men's products found"
                description="Men's collection catalog is updating. Check back shortly!"
                icon={<Shirt className="w-8 h-8 text-[#3B82F6]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {mensProducts.map((product) => (
                <ProductCard key={`mens-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 4. WOMEN'S COLLECTION (Full Soft Blush Band) ── */}
      <section className="w-full bg-[#FAF0F4] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#702444] tracking-tight flex items-center gap-2">
                <Heart className="w-5.5 h-5.5 text-[#F9A37E]" /> Women's Collection
              </h2>
              <p className="text-xs text-[#9E4A6F] mt-0.5">Stylish cropped tees, relaxed fits, and premium blanks for women</p>
            </div>
            <Link href="/products?category=Women" className="text-xs shrink-0 font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all self-start sm:self-auto py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {productsLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : womensProducts.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No women's products found"
                description="Women's collection catalog is updating. Check back shortly!"
                icon={<Heart className="w-8 h-8 text-[#EC4899]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {womensProducts.map((product) => (
                <ProductCard key={`womens-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── 5. NEW ARRIVALS (Full Fresh Mint Band) ── */}
      <section className="w-full bg-[#F2F7F2] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex flex-row sm:items-center justify-between gap-1 sm:gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#264D29] tracking-tight flex items-center gap-2">
                <Paintbrush className="w-5.5 h-5.5 text-[#F9A37E]" /> New Arrivals
              </h2>
              <p className="text-xs text-[#446E47] mt-0.5">Fresh drops and newest blank garments ready for customization</p>
            </div>
            <Link href="/products?tag=new" className="text-xs shrink-0 font-bold text-white bg-[#F9A37E] hover:bg-[#E8855A] flex items-center gap-1.5 transition-all self-start sm:self-auto py-1.5 px-3.5 rounded-full shadow-xs hover:shadow-md">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {productsLoading || loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {Array(4).fill(0).map((_, i) => (
                <ProductCard key={i} loading={true} />
              ))}
            </div>
          ) : newArrivalProducts.length === 0 ? (
            <div className="w-full py-4">
              <EmptyState
                title="No new arrivals found"
                description="Our custom print catalog is updating. Check back shortly!"
                icon={<ShoppingBag className="w-8 h-8 text-[#10B981]" />}
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {newArrivalProducts.map((product) => (
                <ProductCard key={`new-${product.id}`} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full bg-[#F5F0E8] py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">How It Works</h2>
            <p className="text-xs text-[#7A736A] mt-1">From studio to your doorstep in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {processSteps.map((step, _idx) => (
              <div key={step.name} className="relative p-6 bg-white rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-[#FBD5C1] text-[#F9A37E] rounded-lg flex items-center justify-center mx-auto mb-4">
                  {step.icon}
                </div>
                <span className="font-black text-4xl text-[#E8E2D6] absolute top-4 right-4 leading-none">{step.step}</span>
                <h4 className="font-extrabold text-sm text-[#4A453E] mb-2">{step.name}</h4>
                <p className="text-xs text-[#7A736A] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="w-full bg-[#FDFAF6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">Loved by Creators</h2>
            <p className="text-xs text-[#7A736A] mt-1">See what our customers have designed.</p>
          </div>
          {testimonialsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1,2,3].map(i => (
                <div key={i} className="p-4 rounded-lg bg-white space-y-3 animate-pulse">
                  <div className="h-3 bg-zinc-100 rounded w-1/2" />
                  <div className="h-2 bg-zinc-100 rounded w-1/3" />
                  <div className="h-8 bg-zinc-100 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <Slider desktopCols={3}>
              {testimonials.map((rev) => (
                <ReviewCard
                  key={rev.id}
                  name={rev.name}
                  rating={rev.rating}
                  date={new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  comment={rev.comment}
                  verified={true}
                />
              ))}
            </Slider>
          )}
        </div>
      </section>

      {/* ── INSTAGRAM GALLERY ── */}
      <section className="w-full bg-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E]">#WearYourCreativity</h2>
            <p className="text-xs text-[#7A736A] mt-1">Tag us on Instagram to get featured</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeGallery.map((item, i) => {
              const isVideo = item.mediaType === "video";
              const cardMarkup = (
                <div className="relative aspect-square rounded-lg overflow-hidden group bg-zinc-100">
                  <img
                    src={item.mediaUrl}
                    alt={`Gallery ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-10 h-10 bg-white/95 text-[#4A453E] rounded-full flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              );

              if (item.link) {
                return (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer"
                  >
                    {cardMarkup}
                  </a>
                );
              }

              return (
                <div key={item.id}>
                  {cardMarkup}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="w-full bg-[#FDFAF6] py-10 sm:py-14">
        <div className="max-w-2xl mx-auto px-4 space-y-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] text-center">Frequently Asked Questions</h2>
          <div className="rounded-lg bg-white overflow-hidden">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left font-bold text-sm text-[#4A453E]"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#F9A37E] ml-3 text-base leading-none font-black flex-shrink-0">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <p className="text-xs text-[#7A736A] mt-3 leading-relaxed animate-fade-in-up">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
