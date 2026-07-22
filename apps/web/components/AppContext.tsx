"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from './ApiConfig';
import { useRouter } from 'next/navigation';

// Interfaces
export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  font: string;
  rotation: number;
}

export interface ImageLayer {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface CustomDesign {
  textLayers: TextLayer[];
  imageLayers: ImageLayer[];
  view: 'front' | 'back';
  productColor: string;
  baseImage: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
  customDesign?: CustomDesign;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  tag?: string;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  inStock: boolean;
  slug?: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size: string;
  color: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus?: string;
  trackingNumber?: string;
  trackingTimeline?: { status: string; date: string; desc: string; done: boolean }[];
  itemsJson?: any;
  email?: string;
  cancelReason?: string;
  returnReason?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Success' | 'Pending' | 'Refunded';
  type: 'Payment' | 'Refund';
  orderId: string;
  invoiceUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'promo' | 'order' | 'shipping';
  date: string;
  read: boolean;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  addresses: Address[];
  orders: Order[];
  transactions: Transaction[];
  notifications: Notification[];
  toasts: ToastMessage[];
  searchQuery: string;
  isDarkMode: boolean;
  currentUser: { name: string; email: string; phone?: string; id?: string; role?: string; avatar?: string; preferences?: any } | null;
  setSearchQuery: (q: string) => void;
  toggleDarkMode: () => void; // kept for backward compat, no-op
  showToast: (title: string, message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateCartQty: (id: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  createOrder: (address: Address, paymentMethod: string, paymentId?: string, paymentStatus?: string) => Order;
  cancelOrder: (id: string, reason: string) => Promise<boolean>;
  returnOrder: (id: string, reason: string) => Promise<boolean>;
  markNotificationsAsRead: () => void;
  logout: () => void;
  loginUser: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  googleAuthUser: (email?: string, name?: string, avatar?: string, phone?: string, credential?: string) => Promise<boolean>;
  updateUserProfile: (name: string, avatar?: string, phone?: string) => Promise<boolean>;
  updateUserPreferences: (preferences: any) => Promise<boolean>;
  companySettings: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    twitterUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    customTshirtPrice: number;
    customPoloPrice: number;
    customShirtPrice: number;
  };
  settingsLoading: boolean;
  profileLoading: boolean;
  settingsResponseTime: number | null;
  updateCompanySettings: (data: any) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy Initial Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Premium Soft Cotton Tee",
    price: 29.99,
    originalPrice: 39.99,
    rating: 4.8,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&auto=format&fit=crop&q=80"
    ],
    category: "T-Shirts",
    tag: "Best Seller",
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
  {
    id: "p2",
    name: "Heavyweight Fleece Hoodie",
    price: 49.99,
    originalPrice: 59.99,
    rating: 4.9,
    reviewsCount: 88,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80"
    ],
    category: "Hoodies",
    tag: "New",
    description: "Stay warm in style. This heavy fleece hoodie offers a comfortable boxy fit, lined hood, double-stitched kangaroo pocket, and premium cuffs. Ideal for bold back designs and cozy vibes.",
    colors: [
      { name: "Black", hex: "#0f172a" },
      { name: "Sand", hex: "#e2e8f0" },
      { name: "Forest Green", hex: "#14532d" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    inStock: true
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = false; // dark mode removed
  const toggleDarkMode = () => {}; // no-op kept for backward compat
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone?: string; id?: string; role?: string; avatar?: string; preferences?: any } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [settingsResponseTime, setSettingsResponseTime] = useState<number | null>(null);
  const [companySettings, setCompanySettings] = useState({
    email: 'support@kliamofashion.com',
    phone: '+1 555-0199',
    address: '123 Creative St, New York, NY 10001',
    hours: 'Mon - Fri, 9am - 6pm EST',
    twitterUrl: 'https://twitter.com/kliamo',
    instagramUrl: 'https://instagram.com/kliamo',
    facebookUrl: 'https://facebook.com/kliamo',
    customTshirtPrice: 599,
    customPoloPrice: 799,
    customShirtPrice: 999,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setProfileLoading(true);
      fetch(getApiUrl("/user/profile"), {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Invalid token");
      })
      .then(user => {
        setCurrentUser({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          phone: user.phone || "",
          preferences: user.preferences || {}
        });
        if (user.addresses && user.addresses.length > 0) {
          setAddresses(user.addresses);
        }
        setProfileLoading(false);
        // Fetch persisted cart from backend after profile load
        fetch(getApiUrl('/cart'), { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data) return;
            const items: CartItem[] = (data.items || []).map((i: any) => ({
              id: i.cartItemId || i.productId,
              productId: i.productId,
              name: i.name,
              price: Number(i.price) || 0,
              quantity: Number(i.quantity) || 1,
              image: i.image || '',
              size: i.size || '',
              color: i.color || '',
              customDesign: i.customDesign,
            }));
            setCart(items);
          })
          .catch(() => {});
        // Fetch persisted wishlist from backend
        fetch(getApiUrl('/wishlist'), { headers: { Authorization: `Bearer ${token}` } })
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (!data) return;
            const products: Product[] = (data.items || []).map((i: any) => ({
              id: i.cartItemId || i.productId,
              name: i.name,
              price: Number(i.price) || 0,
              originalPrice: Number(i.originalPrice) || 0,
              image: i.image || '',
              category: i.category || '',
              rating: Number(i.rating) || 0,
              reviewsCount: Number(i.reviewsCount) || 0,
              inStock: i.inStock ?? true,
              images: [],
              description: '',
              colors: [],
              sizes: [],
            }));
            setWishlist(products);
          })
          .catch(() => {});
      })
      .catch(() => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        setProfileLoading(false);
      });
    }

    // Load global settings
    setSettingsLoading(true);
    const settingsStart = performance.now();
    fetch(getApiUrl("/settings"))
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to load settings");
      })
      .then(data => {
        setSettingsResponseTime(Math.round(performance.now() - settingsStart));
        if (data) {
          setCompanySettings(data);
        }
        setSettingsLoading(false);
      })
      .catch(err => {
        console.warn("Could not load global settings, using defaults.", err);
        setSettingsResponseTime(Math.round(performance.now() - settingsStart));
        setSettingsLoading(false);
      });
  }, []);

  // ─── CART BACKEND HELPERS ───────────────────────────────────────────────────
  const fetchCartFromBackend = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await fetch(getApiUrl('/cart'), {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return;
      const data = await res.json();
      const items: CartItem[] = (data.items || []).map((i: any) => ({
        id: i.cartItemId || i.productId,
        productId: i.productId,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.image || '',
        size: i.size || '',
        color: i.color || '',
        customDesign: i.customDesign,
      }));
      setCart(items);
    } catch (err) {
      console.error('Failed to fetch cart from backend:', err);
    }
  };

  // ─── WISHLIST BACKEND HELPERS ─────────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        try { setWishlist(JSON.parse(storedWishlist)); } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (currentUser?.email) {
      fetch(getApiUrl("/orders"))
        .then(res => {
          if (res.ok) return res.json();
          throw new Error("Failed to load orders");
        })
        .then(data => {
          const userOrders = data
            .filter((o: any) => o.email === currentUser.email)
            .map((o: any) => ({
              id: o.id,
              date: o.date || new Date(o.createdAt).toLocaleDateString(),
              status: o.status,
              total: Number(o.total || 0),
              address: o.itemsJson && Array.isArray(o.itemsJson) && o.itemsJson[0]?.address ? o.itemsJson[0].address : {
                id: 'default', fullName: o.customer || 'Customer', street: 'Address details on invoice', city: '', state: '', zip: '', country: '', phone: '', isDefault: true
              },
              paymentMethod: o.paymentMethod || 'CARD',
              paymentId: o.paymentId,
              paymentStatus: o.paymentStatus,
              trackingNumber: o.trackingNumber,
              trackingTimeline: o.trackingTimeline,
              cancelReason: o.cancelReason,
              returnReason: o.returnReason,
              items: o.itemsJson && Array.isArray(o.itemsJson) ? o.itemsJson.map((it: any) => ({
                productId: it.productId,
                name: it.name,
                price: Number(it.price || 0),
                quantity: Number(it.quantity || 1),
                image: it.image,
                size: it.size,
                color: it.color,
                colorHex: it.colorHex,
                category: it.category,
                customDesign: it.customDesign
              })) : [
                { productId: 'standard', name: 'Order Item', price: o.total, quantity: o.items || 1, image: '/kliamologoNew.png', size: 'M', color: 'White' }
              ],
              itemsJson: o.itemsJson,
              email: o.email
            }));
          setOrders(userOrders);
        })
        .catch(err => console.error("Error loading user orders from DB:", err));
    }
  }, [currentUser]);

  // Toast System
  const showToast = (title: string, message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart operations — all synced to backend API
  const addToCart = async (item: Omit<CartItem, 'id'>) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || !currentUser) {
      showToast('Login Required', 'Please login first to add products to your cart.', 'error');
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/cart/add'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity || 1,
          size: item.size,
          color: item.color,
          customDesign: item.customDesign,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast('Cart Error', data.message || 'Failed to add item to cart.', 'error');
        return;
      }
      const items: CartItem[] = (data.items || []).map((i: any) => ({
        id: i.cartItemId || i.productId,
        productId: i.productId,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.image || '',
        size: i.size || '',
        color: i.color || '',
        customDesign: i.customDesign,
      }));
      setCart(items);
      showToast('Added to Cart', `${item.name} (${item.size} / ${item.color}) added.`, 'success');
    } catch (err) {
      showToast('Cart Error', 'Could not connect to cart server.', 'error');
    }
  };

  const removeFromCart = async (id: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    // id here is cartItemId (unique per cart slot, even for same productId with different designs)
    try {
      const res = await fetch(getApiUrl(`/cart/item/${id}`), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        showToast('Error', data.message || 'Failed to remove item.', 'error');
        return;
      }
      const data = await res.json();
      const items: CartItem[] = (data.items || []).map((i: any) => ({
        id: i.cartItemId || i.productId,
        productId: i.productId,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.image || '',
        size: i.size || '',
        color: i.color || '',
        customDesign: i.customDesign,
      }));
      setCart(items);
      showToast('Removed from Cart', 'The item has been removed from your cart.', 'info');
    } catch (err) {
      showToast('Error', 'Could not connect to cart server.', 'error');
    }
  };

  const updateCartQty = async (id: string, qty: number) => {
    if (qty <= 0) { removeFromCart(id); return; }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) return;
    try {
      const res = await fetch(getApiUrl(`/cart/item/${id}`), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quantity: qty }),
      });
      if (!res.ok) {
        const data = await res.json();
        showToast('Error', data.message || 'Failed to update quantity.', 'error');
        return;
      }
      const data = await res.json();
      const items: CartItem[] = (data.items || []).map((i: any) => ({
        id: i.cartItemId || i.productId,
        productId: i.productId,
        name: i.name,
        price: Number(i.price) || 0,
        quantity: Number(i.quantity) || 1,
        image: i.image || '',
        size: i.size || '',
        color: i.color || '',
        customDesign: i.customDesign,
      }));
      setCart(items);
    } catch (err) {
      showToast('Error', 'Could not connect to cart server.', 'error');
    }
  };

  const clearCart = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token) { setCart([]); return; }
    try {
      await fetch(getApiUrl('/cart/clear'), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart([]);
    } catch {
      setCart([]);
    }
  };

  // Wishlist — backend synced
  const toggleWishlist = async (product: Product) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!token || !currentUser) {
      showToast('Login Required', 'Please login to save items to your wishlist.', 'error');
      router.push('/login');
      return;
    }
    try {
      const res = await fetch(getApiUrl('/wishlist/toggle'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          category: product.category,
          rating: product.rating,
          reviewsCount: product.reviewsCount,
          inStock: product.inStock,
        }),
      });
      if (!res.ok) { showToast('Error', 'Failed to update wishlist.', 'error'); return; }
      const data = await res.json();
      const products: Product[] = (data.wishlist?.items || []).map((i: any) => ({
        id: i.cartItemId || i.productId,
        name: i.name,
        price: Number(i.price) || 0,
        originalPrice: Number(i.originalPrice) || 0,
        image: i.image || '',
        category: i.category || '',
        rating: Number(i.rating) || 0,
        reviewsCount: Number(i.reviewsCount) || 0,
        inStock: i.inStock ?? true,
        images: [],
        description: '',
        colors: [],
        sizes: [],
      }));
      setWishlist(products);
      if (data.added) {
        showToast('Added to Wishlist', `${product.name} saved.`, 'success');
      } else {
        showToast('Removed from Wishlist', `${product.name} removed.`, 'info');
      }
    } catch {
      showToast('Error', 'Could not connect to wishlist server.', 'error');
    }
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  // Address operations
  const syncAddresses = (updatedAddresses: Address[]) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(getApiUrl("/user/profile/update"), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ addresses: updatedAddresses })
    })
    .catch(err => console.error("Error syncing addresses:", err));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setAddresses(prev => {
      let next = [...prev, { ...address, id }];
      if (address.isDefault) {
        next = next.map(a => a.id !== id ? { ...a, isDefault: false } : a);
      }
      syncAddresses(next);
      return next;
    });
    showToast("Address Saved", "Address added successfully.", "success");
  };

  const updateAddress = (address: Address) => {
    setAddresses(prev => {
      let next = prev.map(a => a.id === address.id ? address : a);
      if (address.isDefault) {
        next = next.map(a => a.id !== address.id ? { ...a, isDefault: false } : a);
      }
      syncAddresses(next);
      return next;
    });
    showToast("Address Updated", "Changes saved successfully.", "success");
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => {
      const next = prev.filter(a => a.id !== id);
      syncAddresses(next);
      return next;
    });
    showToast("Address Deleted", "The address has been removed.", "info");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => {
      const next = prev.map(a => ({ ...a, isDefault: a.id === id }));
      syncAddresses(next);
      return next;
    });
    showToast("Default Address Set", "Your primary address was updated.", "success");
  };

  // Orders
  const createOrder = (address: Address, paymentMethod: string, paymentId?: string, paymentStatus?: string) => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const items: OrderItem[] = cart.map(c => ({
      productId: c.productId,
      name: c.name,
      price: c.price,
      quantity: c.quantity,
      image: c.image,
      size: c.size,
      color: c.color
    }));
    const subtotal = cart.reduce((acc, c) => acc + c.price * c.quantity, 0);
    const tax = subtotal * 0.18;
    const shipping = subtotal > 50 ? 0 : 5.99;
    const total = subtotal + tax + shipping;

    const newOrder: Order = {
      id: orderId,
      date: new Date().toISOString().split('T')[0] || "",
      status: "Pending",
      items,
      total,
      address,
      paymentMethod,
      paymentId: paymentId || undefined,
      paymentStatus: paymentStatus || "Pending",
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingTimeline: [
        { status: "Order Placed", date: "Just now", desc: "Your order has been logged and confirmed.", done: true },
        { status: "Processing & Print", date: "Estimated Tomorrow", desc: "Your items will be printed and prepared.", done: false },
        { status: "Shipped", date: "Estimated 2 days", desc: "Package will be dispatched via standard courier.", done: false },
        { status: "Delivered", date: "Estimated 4-5 days", desc: "Delivered and signed at your door.", done: false }
      ]
    };

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: newOrder.date,
      amount: total,
      status: (paymentStatus === "Paid" || paymentStatus === "Success") ? "Success" : "Pending",
      type: "Payment",
      orderId: orderId,
      invoiceUrl: "#"
    };

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTxn, ...prev]);

    // Save order to PostgreSQL database
    fetch(getApiUrl("/orders"), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: orderId,
        customer: address.fullName,
        email: currentUser?.email || "guest@example.com",
        date: newOrder.date,
        items: items.length,
        total: total,
        status: "Pending",
        itemsJson: cart,
        paymentMethod: paymentMethod,
        paymentId: paymentId || null,
        paymentStatus: paymentStatus || "Pending"
      })
    })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save order to database");
      return res.json();
    })
    .then(data => {
      console.log("Order saved to database successfully:", data);
    })
    .catch(err => {
      console.error("Error saving order to database:", err);
    });

    // Dispatch order sync to Qikink partner API
    fetch('/api/qikink/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        address,
        cart,
        gateway: paymentMethod.toUpperCase().includes('COD') ? 'COD' : 'PREPAID',
        total
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        showToast("Partner Synced", `Order successfully submitted to Qikink.`, "success");
      } else {
        console.warn('Qikink submission warning:', data.error || data.qikinkResponse);
        showToast("Sync Pending", "Order placed locally. Sync with print partner pending credentials.", "info");
      }
    })
    .catch(err => {
      console.error('Qikink connection failed:', err);
    });

    clearCart();
    return newOrder;
  };

  const cancelOrder = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl(`/orders/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled", cancelReason: reason })
      });
      if (!res.ok) throw new Error("Failed to cancel order on backend");

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled" as const, cancelReason: reason } : o));
      setTransactions(prev => prev.map(t => t.orderId === id ? { ...t, status: "Refunded" as const, type: "Refund" as const } : t));
      showToast("Order Cancelled", "Your order has been cancelled. 20% processing fee has been deducted.", "success");
      return true;
    } catch (err: any) {
      showToast("Error", err.message || "Failed to cancel order.", "error");
      return false;
    }
  };

  const returnOrder = async (id: string, reason: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl(`/orders/${id}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Returned", returnReason: reason })
      });
      if (!res.ok) throw new Error("Failed to register return on backend");

      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Returned" as const, returnReason: reason } : o));
      showToast("Return Processed", "Return request submitted. Our pickup agent will contact you soon.", "success");
      return true;
    } catch (err: any) {
      showToast("Error", err.message || "Failed to submit return request.", "error");
      return false;
    }
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('wishlist');
    setCurrentUser(null);
    setCart([]);
    setWishlist([]); // clear local state — wishlist stays in MongoDB for next login
    showToast('Logged Out', 'You have been logged out of your account.', 'info');
    router.push('/');
  };

  const loginUser = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(getApiUrl("/user/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: password || "dummy-password" }),
      });
      const data = await res.json();
      if (!res.ok) {
        const errorMsg = data.message || "Invalid email or password. Please try again.";
        return { success: false, error: errorMsg };
      }
      localStorage.setItem('token', data.token);
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        phone: data.user.phone || ''
      });
      // Restore cart from backend after login
      fetch(getApiUrl('/cart'), { headers: { Authorization: `Bearer ${data.token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(cartData => {
          if (!cartData) return;
          const items: CartItem[] = (cartData.items || []).map((i: any) => ({
            id: i.cartItemId || i.productId,
            productId: i.productId,
            name: i.name,
            price: Number(i.price) || 0,
            quantity: Number(i.quantity) || 1,
            image: i.image || '',
            size: i.size || '',
            color: i.color || '',
          }));
          setCart(items);
        })
        .catch(() => {});
      // Restore wishlist from backend after login
      fetch(getApiUrl('/wishlist'), { headers: { Authorization: `Bearer ${data.token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(wlData => {
          if (!wlData) return;
          const products: Product[] = (wlData.items || []).map((i: any) => ({
            id: i.cartItemId || i.productId,
            name: i.name,
            price: Number(i.price) || 0,
            originalPrice: Number(i.originalPrice) || 0,
            image: i.image || '',
            category: i.category || '',
            rating: Number(i.rating) || 0,
            reviewsCount: Number(i.reviewsCount) || 0,
            inStock: i.inStock ?? true,
            images: [],
            description: '',
            colors: [],
            sizes: [],
          }));
          setWishlist(products);
        })
        .catch(() => {});
      showToast('Welcome Back!', `Logged in successfully as ${data.user.email}`, 'success');
      return { success: true };
    } catch (err) {
      return { success: false, error: "Could not connect to the server. Please check your connection." };
    }
  };

  const registerUser = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl("/user/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Registration Failed", data.message || "Could not register account", "error");
        return false;
      }
      const loginResult = await loginUser(email, password);
      return loginResult.success;
    } catch (err) {
      showToast("Connection Error", "Could not connect to the authentication server.", "error");
      return false;
    }
  };

  const googleAuthUser = async (
    email?: string,
    name?: string,
    avatar?: string,
    phone?: string,
    credential?: string
  ): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl("/user/google-auth"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatar, phone, credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Google Authentication Failed", data.message || "Could not authenticate with Google", "error");
        return false;
      }
      localStorage.setItem("token", data.token);
      setCurrentUser({
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatar: data.user.avatar,
        phone: data.user.phone || ''
      });
      showToast("Welcome to KLIAMO!", `Signed in with Google as ${data.user.email}`, "success");
      return true;
    } catch (err) {
      showToast("Connection Error", "Could not connect to the authentication server.", "error");
      return false;
    }
  };

  const updateUserProfile = async (name: string, avatar?: string, phone?: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/user/profile/update"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name, avatar, phone })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Update Failed", data.message || "Failed to update profile", "error");
        return false;
      }
      setCurrentUser({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        avatar: data.avatar,
        phone: data.phone || "",
        preferences: data.preferences || {}
      });
      showToast("Profile Updated", "Your changes have been saved successfully.", "success");
      return true;
    } catch (err) {
      showToast("Connection Error", "Could not connect to the profile update server.", "error");
      return false;
    }
  };

  const updateUserPreferences = async (preferences: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/user/profile/update"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ preferences })
      });
      const data = await res.json();
      if (!res.ok) {
        showToast("Update Failed", data.message || "Failed to update preferences", "error");
        return false;
      }
      setCurrentUser(prev => prev ? {
        ...prev,
        preferences: data.preferences
      } : null);
      showToast("Preferences Updated", "Your preference settings have been saved.", "success");
      return true;
    } catch (err) {
      showToast("Connection Error", "Could not connect to the profile update server.", "error");
      return false;
    }
  };

  const updateCompanySettings = async (data: any): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(getApiUrl("/settings"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      const updated = await res.json();
      if (!res.ok) {
        showToast("Update Failed", updated.message || "Failed to update company settings", "error");
        return false;
      }
      setCompanySettings(updated);
      showToast("Settings Saved", "Company settings updated successfully.", "success");
      return true;
    } catch (err) {
      showToast("Connection Error", "Could not connect to settings update server.", "error");
      return false;
    }
  };

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      addresses,
      orders,
      transactions,
      notifications,
      toasts,
      searchQuery,
      isDarkMode,
      currentUser,
      setSearchQuery,
      toggleDarkMode,
      showToast,
      dismissToast,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      addAddress,
      updateAddress,
      deleteAddress,
      setDefaultAddress,
      createOrder,
      cancelOrder,
      returnOrder,
      markNotificationsAsRead,
      logout,
      loginUser,
      registerUser,
      googleAuthUser,
      updateUserProfile,
      updateUserPreferences,
      companySettings,
      settingsLoading,
      profileLoading,
      settingsResponseTime,
      updateCompanySettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
