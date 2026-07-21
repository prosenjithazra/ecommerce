"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Minus, Plus, X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { useApp, Product } from '../../../components/AppContext';
import { ProductGallery, ReviewCard } from '../../../components/InfoCards';
import { ProductCard } from '../../../components/ProductCard';
import { Breadcrumb, Price, Rating, Slider, SkeletonLoader, EmptyState } from '../../../components/UIComponents';
import { StickyAddToCart } from '../../../components/StickyAddToCart';
import { getApiUrl } from '../../../components/ApiConfig';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const slug = (params?.slug as string) || "";

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'print' | 'ship'>('desc');
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  // Load product details by slug (falls back to id lookup for legacy URLs)
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(getApiUrl(`/products/slug/${slug}`))
      .then(res => {
        if (res.ok) return res.json();
        // fallback: try by id
        return fetch(getApiUrl(`/products/${slug}`)).then(r => r.ok ? r.json() : null);
      })
      .then(data => {
        if (!data) throw new Error('Not found');
        setProduct(data);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0].name);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        setLoading(false);
      });
  }, [slug]);

  // Load related products
  useEffect(() => {
    fetch(getApiUrl("/products"))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRelatedProducts(data.filter(p => p.slug !== slug && p.id !== slug));
        }
      })
      .catch(err => console.error("Error loading related products:", err));
  }, [slug]);

  const isSaved = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      size: selectedSize || "M",
      color: selectedColor || "White"
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <SkeletonLoader type="detail" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Product Not Found"
          description="The product you are looking for does not exist or has been removed from our catalog."
          actionText="Browse Blanks Catalog"
          actionHref="/products"
          icon={<ShoppingBag className="w-8 h-8 text-[#A8C69F]" />}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-5 pb-12 sm:pb-24">
      <Breadcrumb items={[{ name: "Products", href: "/products" }, { name: product.name }]} />

      {/* ── Product Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start">

        {/* Gallery */}
        <ProductGallery images={product.images || [product.image]} name={product.name} />

        {/* Product Info */}
        <div className="space-y-3.5 sm:space-y-5">

          {/* Category + Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold text-[#F9A37E] tracking-wider">
              {product.category}
            </span>
            {product.tag && (
              <span className="bg-[#4A453E] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                {product.tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A453E] tracking-tight leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Rating value={product.rating || 5} />
            <span className="text-xs font-bold text-[#4A453E]">{product.rating || 5}</span>
            <span className="text-xs text-[#A89B8A]">({product.reviewsCount || 0} verified reviews)</span>
          </div>

          {/* Price */}
          <div className="pb-2.5 sm:pb-4 border-b border-[#E8E2D6]">
            <Price value={product.price} original={product.originalPrice} size="lg" />
          </div>

          {/* Color picker */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#4A453E]">
                Color: <span className="text-[#F9A37E]">{selectedColor}</span>
              </span>
              <div className="flex gap-2.5">
                {product.colors.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-105 ${
                      selectedColor === color.name
                        ? 'border-[#F9A37E] scale-110 shadow-md shadow-[#F9A37E]/30'
                        : 'border-[#E8E2D6]'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-[#4A453E]">
                  Size: <span className="text-[#F9A37E] uppercase">{selectedSize}</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-xs font-bold text-[#A89B8A] hover:text-[#F9A37E] transition-colors cursor-pointer"
                >
                  Size Chart
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-10 h-10 px-3 rounded-lg text-xs font-extrabold border transition-all ${
                      selectedSize === size
                        ? 'bg-[#4A453E] text-white border-[#4A453E]'
                        : 'bg-transparent text-[#7A736A] border-[#E8E2D6] hover:border-[#A89B8A]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-[#4A453E]">Quantity</span>
            <div className="flex items-center border border-[#E8E2D6] rounded-lg overflow-hidden bg-[#FDFAF6] h-10 w-28">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-9 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                type="button"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="flex-1 text-xs font-bold text-center text-[#4A453E]">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-9 h-full flex items-center justify-center text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/40 transition-colors"
                type="button"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-[14px] py-2 px-4 sm:py-3.5 sm:px-6 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/25 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-[14px] py-2 px-4 sm:py-3.5 sm:px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
            >
              Buy It Now
            </button>
          </div>

          {/* Wishlist row */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex items-center gap-2 text-xs font-bold transition-colors ${
              isSaved ? 'text-rose-400' : 'text-[#A89B8A] hover:text-rose-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            {isSaved ? 'Saved to Wishlist' : 'Add to Wishlist'}
          </button>

          {/* Trust indicators */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 py-3 sm:py-4 border-t border-[#E8E2D6] text-[10px] text-[#7A736A] text-center">
            <div className="space-y-1.5">
              <ShieldCheck className="w-5 h-5 text-[#A8C69F] mx-auto" />
              <span className="font-bold text-[#4A453E] block">Safe Print</span>
            </div>
            <div className="space-y-1.5">
              <Truck className="w-5 h-5 text-[#A8C69F] mx-auto" />
              <span className="font-bold text-[#4A453E] block">Fast Delivery</span>
            </div>
            <div className="space-y-1.5">
              <RefreshCw className="w-5 h-5 text-[#A8C69F] mx-auto" />
              <span className="font-bold text-[#4A453E] block">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs: Description / Print / Shipping ── */}
      <section className="space-y-3 pt-1.5 sm:pt-2 border-t border-[#E8E2D6]">
        <div className="flex border-b border-[#E8E2D6] text-xs">
          {(['desc', 'print', 'ship'] as const).map((tab, i) => {
            const labels = ['Description', 'Print Details', 'Shipping & Returns'];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-[12px] sm:text-sm md:text-lg font-bold p-2 sm:px-4 transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-[#4A453E] border-[#F9A37E]'
                    : 'text-[#A89B8A] border-transparent hover:text-[#4A453E]'
                }`}
              >
                {labels[i]}
              </button>
            );
          })}
        </div>
        <div className="text-sm text-[#7A736A] leading-relaxed max-w-3xl font-medium">
          {activeTab === 'desc' && <p>{product.description}</p>}
          {activeTab === 'print' && (
            <p>We use high-fidelity Direct-To-Garment (DTG) digital printing with ecological, water-based inks that penetrate deep into the fibers. Crisp designs that won&apos;t peel, crack, or flake — even after multiple machine washes.</p>
          )}
          {activeTab === 'ship' && (
            <p>Custom apparel is made to order. Production takes 2–3 business days. Standard US shipping is 3–5 business days. Hassle-free returns on print errors or defective blanks within 30 days of receipt.</p>
          )}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="space-y-3 pt-1.5 sm:pt-2 border-t border-[#E8E2D6]">
        <h2 className="text-xl font-extrabold text-[#4A453E] tracking-tight">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReviewCard name="Jane Doe" rating={5} date="3 days ago" comment="Perfect sizing and very comfortable fabric. The print came out exactly as shown!" verified={true} />
          <ReviewCard name="Robert Fletcher" rating={5} date="1 week ago" comment="Highly durable. Washed it three times already and the print looks brand new." verified={true} />
          <ReviewCard name="Mila Vance" rating={4} date="2 weeks ago" comment="Soft material and print lines are extremely clean. Fits perfectly!" verified={true} />
        </div>
      </section>

      {/* ── Related Products ── */}
      {relatedProducts.length > 0 && (
        <section className="space-y-3 pt-3.5 sm:pt-10 border-t border-[#E8E2D6]">
          <h2 className="text-xl font-extrabold text-[#4A453E] tracking-tight">You May Also Like</h2>
          {relatedProducts.length > 4 ? (
            <Slider desktopCols={4}>
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </Slider>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 grid-cols-mobile-single">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </section>
      )}

      {/* Size Chart Popup Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
      />

      {/* Sticky mobile add to cart */}
      <StickyAddToCart
        name={product.name}
        price={product.price}
        image={product.image}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onAddToCart={handleAddToCart}
        inStock={product.inStock}
      />
    </div>
  );
}

interface SizeChartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SizeChartModal({ isOpen, onClose }: SizeChartModalProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom & pan when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 4));
  const handleZoomOut = () => {
    setScale(prev => {
      const nextScale = Math.max(prev - 0.5, 1);
      if (nextScale === 1) setPosition({ x: 0, y: 0 });
      return nextScale;
    });
  };

  const handleResetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setScale(prev => Math.min(prev + 0.25, 4));
    } else {
      setScale(prev => {
        const nextScale = Math.max(prev - 0.25, 1);
        if (nextScale === 1) setPosition({ x: 0, y: 0 });
        return nextScale;
      });
    }
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      handleResetZoom();
    } else {
      setScale(2);
    }
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    if (!touch) return;
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm transition-all"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-4 sm:p-6 overflow-hidden border border-[#E8E2D6] space-y-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D6] pb-3 flex-shrink-0">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#4A453E] tracking-tight">
              Garment Size Chart
            </h3>
            <p className="text-[10px] sm:text-xs text-[#A89B8A]">
              Drag to move • Scroll or use controls to zoom • Double click to toggle zoom
            </p>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-[#FDFAF6] border border-[#E8E2D6] rounded-lg p-1">
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="p-1.5 rounded text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="text-[11px] font-extrabold text-[#4A453E] px-1.5 min-w-[36px] text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                type="button"
                onClick={handleZoomIn}
                disabled={scale >= 4}
                className="p-1.5 rounded text-[#7A736A] hover:text-[#4A453E] hover:bg-[#E8E2D6]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {scale > 1 && (
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className="p-1.5 rounded text-[#F9A37E] hover:bg-[#F9A37E]/10 transition-colors"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A89B8A] hover:text-[#4A453E] hover:bg-[#FDFAF6] transition-colors"
              title="Close Size Chart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Container with Zoom & Drag */}
        <div
          className="flex-1 flex items-center justify-center bg-[#FDFAF6] rounded-xl p-2 sm:p-4 overflow-hidden relative min-h-0 select-none touch-none"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          style={{
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
          }}
        >
          <img
            src="/sizecart.webp"
            alt="Garment Size Chart"
            draggable={false}
            className="w-full h-auto object-contain max-h-[70vh] rounded-lg shadow-sm transition-transform duration-75 ease-out pointer-events-none"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center center',
            }}
          />
        </div>
      </div>
    </div>
  );
}

