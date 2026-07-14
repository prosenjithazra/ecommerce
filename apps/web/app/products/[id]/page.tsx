"use client";

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Minus, Plus } from 'lucide-react';
import { useApp, Product } from '../../../components/AppContext';
import { ProductGallery, ReviewCard } from '../../../components/InfoCards';
import { ProductCard } from '../../../components/ProductCard';
import { Breadcrumb, Price, Rating, Slider } from '../../../components/UIComponents';
import { StickyAddToCart } from '../../../components/StickyAddToCart';

const PRODUCTS_DB: Record<string, Product> = {
  p1: {
    id: "p1",
    name: "Premium Soft Cotton Tee",
    price: 29.99, originalPrice: 39.99, rating: 4.8, reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80"
    ],
    category: "T-Shirts", tag: "Best Seller",
    description: "Tailored with a modern fit and crafted from ultra-soft combed cotton, this premium t-shirt is designed to be the perfect base for your high-quality custom prints. Featuring reinforced stitching and a premium ribbed collar that holds its shape.",
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#0f172a" },
      { name: "Heather Grey", hex: "#94a3b8" },
      { name: "Navy Blue", hex: "#1e3a8a" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    inStock: true
  },
  p2: {
    id: "p2",
    name: "Heavyweight Fleece Hoodie",
    price: 49.99, originalPrice: 59.99, rating: 4.9, reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Hoodies", tag: "New",
    description: "Stay warm in style. This heavy fleece hoodie offers a comfortable boxy fit, lined hood, double-stitched kangaroo pocket, and premium cuffs. Ideal for bold back designs and cozy vibes.",
    colors: [
      { name: "Black", hex: "#0f172a" },
      { name: "Sand", hex: "#e2e8f0" },
      { name: "Forest Green", hex: "#14532d" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();

  const id = (params?.id as string) || "p1";
  const product = (PRODUCTS_DB[id] || PRODUCTS_DB.p1) as Product;

  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "White");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "M");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'print' | 'ship'>('desc');

  const isSaved = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
      size: selectedSize,
      color: selectedColor
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const relatedProducts = Object.values(PRODUCTS_DB).filter(p => p.id !== product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-5 pb-12 sm:pb-24">
      <Breadcrumb items={[{ name: "Products", href: "/products" }, { name: product.name }]} />

      {/* ── Product Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-12 items-start">

        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} />

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
            <Rating value={product.rating} />
            <span className="text-xs font-bold text-[#4A453E]">{product.rating}</span>
            <span className="text-xs text-[#A89B8A]">({product.reviewsCount} verified reviews)</span>
          </div>

          {/* Price */}
          <div className="pb-2.5 sm:pb-4 border-b border-[#E8E2D6]">
            <Price value={product.price} original={product.originalPrice} size="lg" />
          </div>

          {/* Color picker */}
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

          {/* Size selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-[#4A453E]">
                Size: <span className="text-[#F9A37E] uppercase">{selectedSize}</span>
              </span>
              <button className="text-xs font-bold text-[#A89B8A] hover:text-[#F9A37E] transition-colors">
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
              className="flex items-center justify-center gap-2 bg-[#A8C69F] hover:bg-[#92b089] text-white font-extrabold text-xs py-2 px-4 sm:py-3.5 sm:px-6 rounded-lg transition-all shadow-lg shadow-[#A8C69F]/25 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="bg-[#F9A37E] hover:bg-[#e28e6c] text-white font-extrabold text-xs py-2 px-4 sm:py-3.5 sm:px-6 rounded-lg transition-all shadow-lg shadow-[#F9A37E]/25 active:scale-95"
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
        <div className="text-sm text-[#7A736A] leading-relaxed max-w-3xl">
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
      <section className="space-y-3 pt-3.5 sm:pt-10 border-t border-[#E8E2D6]">
        <h2 className="text-xl font-extrabold text-[#4A453E] tracking-tight">You May Also Like</h2>
        {relatedProducts.length > 2 ? (
          <Slider desktopCols={4}>
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </Slider>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

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
