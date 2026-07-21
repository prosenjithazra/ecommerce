"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getApiUrl } from '../components/ApiConfig';
import Link from 'next/link';
import { ArrowRight, Paintbrush, ShieldCheck, Sparkles, ShoppingBag, Flame, Truck, Layers, Leaf, Palette, Play, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ReviewCard } from '../components/InfoCards';
import { Product } from '../components/AppContext';
import { Slider, EmptyState } from '../components/UIComponents';

// Dynamic catalog fetching active

/* ─── Hero Slides Data ─── */
interface Slide {
  id: number | string;
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
  const [animKey, setAnimKey] = useState(0);
  const [loading, setLoading] = useState(true);

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
    setAnimKey(k => k + 1);
  }, []);

  if (loading) {
    return (
      <section className="relative overflow-hidden select-none min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center bg-[#F4F4F4]">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          {/* Left Column Skeleton */}
          <div className="space-y-6 text-center lg:text-left order-1">
            {/* Badge */}
            <div className="h-6 w-32 mx-auto lg:mx-0 rounded-[36px] bg-zinc-250 animate-pulse" />
            
            {/* Headlines */}
            <div className="space-y-3">
              <div className="h-12 sm:h-16 w-3/4 mx-auto lg:mx-0 rounded bg-zinc-250 animate-pulse" />
              <div className="h-12 sm:h-16 w-1/2 mx-auto lg:mx-0 rounded bg-zinc-250 animate-pulse" />
            </div>

            {/* Subtitle */}
            <div className="space-y-2 max-w-sm mx-auto lg:mx-0">
              <div className="h-4 w-full rounded bg-zinc-250 animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-zinc-250 animate-pulse" />
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col items-center lg:items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-zinc-250 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-zinc-250 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="flex justify-center lg:justify-start pt-3">
              <div className="h-12 w-40 rounded-md bg-zinc-250 animate-pulse" />
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="flex items-center justify-center order-2">
            <div className="w-64 h-64 sm:w-[380px] sm:h-[380px] lg:w-[450px] lg:h-[450px] rounded-full bg-zinc-200/60 animate-pulse flex items-center justify-center">
              <img
                src="/kliamologoNew.png"
                alt="Loading Logo"
                className="w-28 sm:w-44 h-auto object-contain opacity-35 animate-pulse"
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const slide = slides[current] || HERO_SLIDES[0]!;
  const slideBadges = slide.badges || (
    (slide.accent === '#1E40AF' || slide.headline2 === 'TO IMPRESS')
      ? [
          { icon: "👕", label: "PREMIUM QUALITY\nFABRIC" },
          { icon: "🖨️", label: "LONG LASTING\nPRINTS" },
          { icon: "👥", label: "UNISEX\nCOLLECTION" },
        ]
      : (!slide.textDark || slide.headline2 === 'REAL YOU.')
        ? [
            { icon: "🌿", label: "SOFT &\nBREATHABLE" },
            { icon: "🎨", label: "VIBRANT\nPRINTS" },
            { icon: "🛡️", label: "DURABLE\nQUALITY" },
          ]
        : [
            { icon: "🌿", label: "100%\nCOTTON" },
            { icon: "🎨", label: "HIGH QUALITY\nPRINT" },
            { icon: "🛡️", label: "DURABLE &\nLONG LASTING" },
            { icon: "🚚", label: "FAST\nDELIVERY" },
          ]
  );
  const isDarkTheme = !slide.textDark;
  const hasBgImg = !!(slide.bgImg && slide.bgImg.length > 10);
  const headline1Color = slide.headline1Color || (isDarkTheme ? '#FFFFFF' : '#2E2B26');
  const subColor = slide.subColor || (isDarkTheme ? '#D4D4D8' : '#52525B');
  const badgeColor = slide.badgeColor || slide.accent || '#E5A93B';

  // Parse overlay color (hex → rgba with opacity)
  const overlayHex = slide.overlayColor || '#000000';
  const overlayR = parseInt(overlayHex.slice(1, 3), 16);
  const overlayG = parseInt(overlayHex.slice(3, 5), 16);
  const overlayB = parseInt(overlayHex.slice(5, 7), 16);
  const overlayRgba = (opacity: number) => `rgba(${overlayR},${overlayG},${overlayB},${opacity})`;

  return (
    <section
      className="relative overflow-hidden select-none min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center"
      style={{
        backgroundColor: hasBgImg ? '#111' : (isDarkTheme ? '#111' : (slide.bg || '#F4F4F4')),
      }}
    >
      {/* Full-width background image */}
      {hasBgImg && (
        <img
          src={slide.bgImg}
          alt="banner background"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center', zIndex: 0 }}
        />
      )}

      {/* Overlay — dynamic color from admin, always on top of bgImg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: hasBgImg
            ? `linear-gradient(to right, ${overlayRgba(0.92)} 0%, ${overlayRgba(0.45)} 50%, ${overlayRgba(0.38)} 100%)`
            : (isDarkTheme
              ? `radial-gradient(circle at 30% 50%, ${overlayRgba(0.55)} 0%, ${overlayRgba(0.35)} 100%)`
              : `linear-gradient(135deg, ${overlayRgba(0.07)} 0%, ${overlayRgba(0.01)} 100%)`)
        }}
      />

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center relative" style={{ zIndex: 10 }}>

        {/* ─── LEFT COLUMN: Text and Actions ─── */}
        <div key={`content-${animKey}`} className="space-y-3 md:space-y-6 animate-slide-in-left text-center lg:text-left order-1 lg:order-1">

          {/* Chip Badge */}
          {slide.badge && (
            <span
              className="inline-block text-[10px] font-black tracking-[0.2em] uppercase px-4 py-1.5 rounded-[36px] mb-1"
              style={{ backgroundColor: badgeColor, color: '#fff' }}
            >
              {slide.badge}
            </span>
          )}

          {/* Headlines */}
          <div className="space-y-[8px] md:space-y-1">
            <h1
              className="text-3xl sm:text-[65px] lg:text-[70px] font-black leading-none tracking-tight normal"
              style={{
                fontFamily: "'Faculty Glyphic', sans-serif",
                color: headline1Color,
                textShadow: hasBgImg ? '0 2px 12px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {slide.headline1}
            </h1>
            <h2
              className="text-3xl sm:text-[65px] lg:text-[70px] font-black leading-none tracking-tight normal"
              style={{
                fontFamily: "'Faculty Glyphic', sans-serif",
                color: slide.headline2Color || '#E5A93B',
                textShadow: hasBgImg ? '0 2px 12px rgba(0,0,0,0.45)' : 'none',
              }}
            >
              {slide.headline2}
            </h2>
          </div>

          {/* Subtitle */}
          <p
            className="text-sm sm:text-base font-bold leading-relaxed max-w-lg mx-auto lg:mx-0"
            style={{ color: subColor }}
          >
            {slide.sub}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-y-4 pt-1">
            {slideBadges.map((b: { icon: string; label: string }, idx: number) => {
              const labelKey = b.label.replace(/\n/g, ' ').trim().toUpperCase();
              const IconComp = FEATURE_ICONS[labelKey] || Leaf;
              const featureColor = hasBgImg || isDarkTheme ? '#e4e4e7' : '#3f3f46';
              const dividerColor = hasBgImg || isDarkTheme ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)';
              return (
                <div key={idx} className="flex items-center max-w-[100%] sm:max-w-[30%] w-full">
                  {idx > 0 && (
                    <div className="hidden sm:block h-8 w-px mx-2 sm:mx-4" style={{ backgroundColor: dividerColor }} />
                  )}
                  <div className="flex flex-col items-center lg:items-start gap-1.5 w-full">
                    <IconComp className="w-5 h-5" style={{ color: featureColor }} strokeWidth={1.8} />
                    <span
                      className="text-[9px] w-full font-black tracking-widest uppercase leading-tight text-center lg:text-left"
                      style={{ color: featureColor }}
                    >
                      {b.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center lg:justify-start pt-3">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-black text-xs md:text-sm px-6 py-3 md:px-8 md:py-4 text-white rounded-md transition-all hover:scale-105 active:scale-95 shadow-lg"
              style={{ backgroundColor: slide.accent || '#E5A93B' }}
            >
              SHOP NOW &rarr;
            </Link>
          </div>
        </div>

        {/* ─── RIGHT COLUMN: Product Image ─── */}
        <div key={`img-${animKey}`} className="relative flex items-center justify-center order-2 lg:order-2 animate-slide-in-right">
          <img
            src={slide.productImg}
            alt={slide.headline1}
            className="w-64 h-64 sm:w-[380px] sm:h-[380px] lg:w-full lg:h-full max-h-[550px] object-contain drop-shadow-2xl transition-all duration-700 ease-in-out hover:scale-105"
          />
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2.5 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="transition-all duration-300"
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
      .catch(() => {
        // Fallback quietly
      })
      .finally(() => {
        setGalleryLoading(false);
      });

    setProductsLoading(true);
    setCategoriesLoading(true);
    fetch(getApiUrl("/products"))
      .then(res => (res.ok ? res.json() : []))
      .then(prodData => {
        if (Array.isArray(prodData) && prodData.length > 0) {
          setProducts(prodData);
        }
        // Fetch categories and map real-time item counts dynamically from products
        return fetch(getApiUrl("/category"))
          .then(res => (res.ok ? res.json() : []))
          .then(catData => {
            if (Array.isArray(catData) && catData.length > 0) {
              const mapped = catData.map((c: any) => {
                const realCount = (Array.isArray(prodData) ? prodData : []).filter(
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
      })
      .catch(() => {})
      .finally(() => {
        setProductsLoading(false);
        setCategoriesLoading(false);
      });


    return () => clearTimeout(timer);
  }, []);

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'best': return products.filter(p => p.tag === 'Best Seller');
      case 'new':  return products.filter(p => p.tag === 'New' || p.tag === 'Eco');
      default:     return products;
    }
  };

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

  const reviews = [
    { name: "Alex Mercer",     rating: 5, date: "2 days ago",   comment: "Print quality exceeded expectations! Vibrant colors and super soft fabric.", verified: true },
    { name: "Sarah Jenkins",   rating: 5, date: "1 week ago",   comment: "Intuitive designer and incredibly fast delivery. Outstanding service!",       verified: true },
    { name: "Marcus Thorne",   rating: 4, date: "2 weeks ago",  comment: "Great material, lovely fit. The canvas text editor is really fun to use.",    verified: true },
  ];

  return (
    <div className="space-y-6 sm:space-y-16 pb-16">

      {/* ── HERO SLIDER ── */}
      <HeroBanner />

      {/* ── TRUST BAR ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-[#A8C69F]" />, label: "Quality Guarantee" },
            { icon: <Truck className="w-5 h-5 text-[#F9A37E]" />,       label: "48hr Fulfillment" },
            { icon: <Layers className="w-5 h-5 text-[#A8C69F]" />,      label: "No MOQ" },
            { icon: <Sparkles className="w-5 h-5 text-[#F9A37E]" />,    label: "Premium Prints" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg">
              <div className="w-8 h-8 bg-[#E8E2D6] rounded-lg flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-xs font-bold text-[#4A453E] leading-tight">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED CATEGORIES ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">Shop by Category</h2>
            <p className="text-xs text-[#7A736A] mt-0.5">Premium blanks ready for your design</p>
          </div>
          <Link href="/products" className="text-xs font-bold text-[#F9A37E] hover:text-[#E8855A] flex items-center gap-1 transition-colors">
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
      </section>

      {/* ── PRODUCT TABS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#F9A37E]" /> Hot off the Press
            </h2>
            <p className="text-xs text-[#7A736A] mt-0.5">Curated blanks for your custom look</p>
          </div>
          <div className="flex bg-[#E8E2D6] p-1 rounded-lg self-start sm:self-auto">
            {(['trending', 'best', 'new'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-bold py-1.5 px-3 rounded-lg transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-white text-[#4A453E] shadow-sm'
                    : 'text-[#7A736A] hover:text-[#4A453E]'
                }`}
              >
                {tab === 'trending' ? 'Trending' : tab === 'best' ? 'Best Sellers' : 'New'}
              </button>
            ))}
          </div>
        </div>
        {productsLoading || loading ? (
          <Slider desktopCols={4}>
            {Array(4).fill(0).map((_, i) => <ProductCard key={i} loading={true} />)}
          </Slider>
        ) : getFilteredProducts().length === 0 ? (
          <div className="w-full py-4">
            <EmptyState
              title="No featured products found"
              description="Our custom print blanks catalog is temporarily offline. Please check back shortly!"
              icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
            />
          </div>
        ) : (
          <Slider desktopCols={4}>
            {getFilteredProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Slider>
        )}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 sm:py-16" style={{ background: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
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

      {/* ── CUSTOMER REVIEWS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">Loved by Creators</h2>
          <p className="text-xs text-[#7A736A] mt-1">See what our customers have designed.</p>
        </div>
        <Slider desktopCols={3}>
          {reviews.map((rev) => (
            <ReviewCard key={rev.name} name={rev.name} rating={rev.rating} date={rev.date} comment={rev.comment} verified={rev.verified} />
          ))}
        </Slider>
      </section>

      {/* ── INSTAGRAM GALLERY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E]">#WearYourCreativity</h2>
          <p className="text-xs text-[#7A736A] mt-1">Tag us on Instagram to get featured</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {activeGallery.map((item, i) => {
            const isVideo = item.mediaType === "video";
            const cardMarkup = (
              <div className="relative aspect-square rounded-lg overflow-hidden group bg-zinc-100 border border-zinc-200">
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
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-4 space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] text-center">Frequently Asked Questions</h2>
        <div className="rounded-lg bg-white border border-[#E8E2D6] overflow-hidden divide-y divide-[#E8E2D6]">
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
      </section>

    </div>
  );
}
