"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight, Paintbrush, ShieldCheck, Sparkles, ShoppingBag, Flame, Truck, Layers } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { CategoryCard } from '../components/CategoryCard';
import { ReviewCard } from '../components/InfoCards';
import { Product } from '../components/AppContext';

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Soft Cotton Tee",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"],
    category: "T-Shirts",
    tag: "Best Seller",
    description: "Tailored with a modern fit and crafted from ultra-soft combed cotton, this premium t-shirt is the perfect base for your high-quality custom prints.",
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Black", hex: "#0f172a" }],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "p2",
    name: "Heavyweight Fleece Hoodie",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80"],
    category: "Hoodies",
    tag: "New",
    description: "Stay warm in style. Heavy fleece hoodie with comfortable boxy fit and double-stitched kangaroo pocket.",
    colors: [{ name: "Black", hex: "#0f172a" }, { name: "Sand", hex: "#e2e8f0" }],
    sizes: ["M", "L", "XL"],
    inStock: true
  },
  {
    id: "p3",
    name: "Classic Organic Crewneck",
    price: 34.99,
    originalPrice: 44.99,
    rating: 4.7,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=800&auto=format&fit=crop&q=80"],
    category: "Sweatshirts",
    tag: "Eco",
    description: "100% certified organic cotton crewneck with cozy brushed interior and premium flatlock seams.",
    colors: [{ name: "Heather Grey", hex: "#94a3b8" }],
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "p4",
    name: "Premium Canvas Tote Bag",
    price: 19.99,
    originalPrice: 24.99,
    rating: 4.6,
    reviewsCount: 31,
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80",
    images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"],
    category: "Accessories",
    tag: "Essential",
    description: "Heavy canvas material with reinforced shoulder straps. The perfect blank canvas for your design.",
    colors: [{ name: "Natural", hex: "#f8fafc" }],
    sizes: ["One Size"],
    inStock: true
  }
];

/* ─── Hero Slides Data ─── */
const HERO_SLIDES = [
  {
    id: 1,
    badge: "NEW COLLECTION",
    headline1: "PRINTED",
    headline2: "T-SHIRTS",
    headline2Color: "#F9A37E",
    sub: "Express Your Style with Unique Prints & Premium Quality",
    badges: [
      { icon: "🌿", label: "100%\nCOTTON" },
      { icon: "🎨", label: "HIGH QUALITY\nPRINT" },
      { icon: "🛡️", label: "DURABLE &\nLONG LASTING" },
      { icon: "🚚", label: "FAST\nDELIVERY" },
    ],
    bg: "#E8E2D6",
    accent: "#F9A37E",
    textDark: true,
    productImg: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    badge: "BOLD DESIGNS",
    headline1: "BOLD DESIGNS.",
    headline2: "REAL YOU.",
    headline2Color: "#F9A37E",
    sub: "PRINTED T-SHIRTS",
    badges: [
      { icon: "🌿", label: "SOFT &\nBREATHABLE" },
      { icon: "🎨", label: "VIBRANT\nPRINTS" },
      { icon: "🛡️", label: "DURABLE\nQUALITY" },
    ],
    bg: "#4A453E",
    accent: "#F9A37E",
    textDark: false,
    productImg: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    badge: "CUSTOM STUDIO",
    headline1: "DESIGN IT.",
    headline2: "OWN IT.",
    headline2Color: "#A8C69F",
    sub: "Create unique hoodies, totes & accessories with our drag-and-drop studio.",
    badges: [
      { icon: "✏️", label: "DESIGN\nSTUDIO" },
      { icon: "🎯", label: "NO MIN.\nORDER" },
      { icon: "⚡", label: "48HR\nFULFILLMENT" },
    ],
    bg: "#FDFAF6",
    accent: "#A8C69F",
    textDark: true,
    productImg: "https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=700&auto=format&fit=crop&q=80",
  },
];

function HeroBanner() {
  const [current, setCurrent] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const goTo = useCallback((idx: number) => {
    setCurrent(idx);
    setAnimKey(k => k + 1);
  }, []);

  const next = useCallback(() => goTo((current + 1) % HERO_SLIDES.length), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + HERO_SLIDES.length) % HERO_SLIDES.length), [current, goTo]);

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = HERO_SLIDES[current]!;

  return (
    <section
      className="relative overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: slide.bg, minHeight: '420px' }}
    >
      {/* Decorative brush-stroke blobs */}
      <div
        className="absolute top-0 right-0 w-72 h-72 opacity-20 pointer-events-none"
        style={{
          background: slide.accent,
          borderRadius: '0 0 0 80%',
          transform: 'translate(30%, -30%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-48 h-48 opacity-15 pointer-events-none"
        style={{
          background: slide.accent,
          borderRadius: '0 80% 0 0',
          transform: 'translate(-30%, 30%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-center relative z-10">

        {/* Left: Content */}
        <div key={`content-${animKey}`} className="space-y-4 animate-slide-in-left text-center lg:text-left order-2 lg:order-1">
          {/* Badge */}
          <span
            className="inline-block text-[10px] font-extrabold tracking-[0.2em] uppercase px-3 py-1 rounded-full border"
            style={{
              borderColor: slide.accent,
              color: slide.accent,
              backgroundColor: slide.textDark ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.12)',
            }}
          >
            {slide.badge}
          </span>

          {/* Headline */}
          <div className="space-y-1">
            <h1
              className="text-4xl sm:text-6xl font-black leading-none tracking-tight"
              style={{ color: slide.textDark ? '#2E2B26' : '#FFFFFF' }}
            >
              {slide.headline1}
            </h1>
            <h2
              className="text-4xl sm:text-6xl font-black leading-none tracking-tight italic"
              style={{ color: slide.headline2Color }}
            >
              {slide.headline2}
            </h2>
          </div>

          {/* Subtext */}
          <p
            className="text-xs sm:text-sm leading-relaxed max-w-sm mx-auto lg:mx-0"
            style={{ color: slide.textDark ? '#7A736A' : 'rgba(255,255,255,0.75)' }}
          >
            {slide.sub}
          </p>

          {/* Feature badges row */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 py-2">
            {slide.badges.map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-xl">{b.icon}</span>
                <span
                  className="text-[9px] font-extrabold tracking-wide whitespace-pre-line leading-tight"
                  style={{ color: slide.textDark ? '#4A453E' : 'rgba(255,255,255,0.85)' }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-1">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 font-extrabold text-xs px-6 py-3 rounded-none transition-all hover:scale-105 active:scale-95"
              style={{ background: slide.textDark ? '#4A453E' : slide.accent, color: '#FFFFFF' }}
            >
              SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right: Product image */}
        <div key={`img-${animKey}`} className="relative flex items-center justify-center order-1 lg:order-2 animate-slide-in-right">
          <img
            src={slide.productImg}
            alt={slide.headline1}
            className="w-56 h-56 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px] object-cover rounded-full shadow-2xl"
            style={{ objectFit: 'cover' }}
          />
          {/* Accent ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              border: `3px solid ${slide.accent}`,
              transform: 'scale(1.08)',
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3 z-10">
        {HERO_SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className="transition-all duration-300"
            style={{
              width: idx === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '99px',
              backgroundColor: idx === current ? slide.accent : 'rgba(0,0,0,0.2)',
            }}
          />
        ))}
      </div>
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.8)', color: '#4A453E' }}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
        style={{ background: 'rgba(255,255,255,0.8)', color: '#4A453E' }}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'trending' | 'best' | 'new'>('trending');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getFilteredProducts = () => {
    switch (activeTab) {
      case 'best': return INITIAL_PRODUCTS.filter(p => p.tag === 'Best Seller');
      case 'new':  return INITIAL_PRODUCTS.filter(p => p.tag === 'New' || p.tag === 'Eco');
      default:     return INITIAL_PRODUCTS;
    }
  };

  const categories = [
    { name: "T-Shirts",    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80", count: 18, href: "/products" },
    { name: "Hoodies",     image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80", count: 12, href: "/products" },
    { name: "Accessories", image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=500&auto=format&fit=crop&q=80", count: 9,  href: "/products" },
    { name: "Drinkware",   image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80", count: 6,  href: "/products" },
  ];

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
    <div className="space-y-12 sm:space-y-16 pb-16">

      {/* ── HERO SLIDER ── */}
      <HeroBanner />

      {/* ── TRUST BAR ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <ShieldCheck className="w-5 h-5 text-[#A8C69F]" />, label: "Quality Guarantee" },
            { icon: <Truck className="w-5 h-5 text-[#F9A37E]" />,       label: "48hr Fulfillment" },
            { icon: <Layers className="w-5 h-5 text-[#A8C69F]" />,      label: "No MOQ" },
            { icon: <Sparkles className="w-5 h-5 text-[#F9A37E]" />,    label: "Custom Studio" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2.5 p-3 bg-[#FDFAF6] border border-[#E8E2D6] rounded-2xl">
              <div className="w-8 h-8 bg-[#E8E2D6] rounded-xl flex items-center justify-center flex-shrink-0">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.name} name={cat.name} image={cat.image} count={cat.count} href={cat.href} />
          ))}
        </div>
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
          <div className="flex bg-[#E8E2D6] p-1 rounded-xl self-start sm:self-auto">
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {getFilteredProducts().map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-12 sm:py-16" style={{ background: '#F5F0E8' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] tracking-tight">How It Works</h2>
            <p className="text-xs text-[#7A736A] mt-1">From studio to your doorstep in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {processSteps.map((step, idx) => (
              <div key={step.name} className="relative p-6 bg-white rounded-3xl shadow-sm text-center">
                <div className="w-12 h-12 bg-[#FBD5C1] text-[#F9A37E] rounded-2xl flex items-center justify-center mx-auto mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((rev) => (
            <ReviewCard key={rev.name} name={rev.name} rating={rev.rating} date={rev.date} comment={rev.comment} verified={rev.verified} />
          ))}
        </div>
      </section>

      {/* ── INSTAGRAM GALLERY ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E]">#WearYourCreativity</h2>
          <p className="text-xs text-[#7A736A] mt-1">Tag us on Instagram to get featured</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&auto=format&fit=crop&q=80",
          ].map((src, i) => (
            <div key={i} className="aspect-square rounded-2xl overflow-hidden group">
              <img src={src} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto px-4 space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#4A453E] text-center">Frequently Asked Questions</h2>
        <div className="rounded-3xl bg-white border border-[#E8E2D6] overflow-hidden divide-y divide-[#E8E2D6]">
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
