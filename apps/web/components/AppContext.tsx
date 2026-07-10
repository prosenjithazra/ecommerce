"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  total: number;
  address: Address;
  paymentMethod: string;
  trackingNumber?: string;
  trackingTimeline?: { status: string; date: string; desc: string; done: boolean }[];
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
  currentUser: { name: string; email: string; phone: string } | null;
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
  createOrder: (address: Address, paymentMethod: string) => Order;
  cancelOrder: (id: string) => void;
  markNotificationsAsRead: () => void;
  logout: () => void;
  loginUser: (email: string) => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "a1",
      fullName: "Jane Doe",
      street: "123 Creative Street, Suite 100",
      city: "New York",
      state: "NY",
      zip: "10001",
      country: "United States",
      phone: "+1 555-0199",
      isDefault: true
    }
  ]);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-9872",
      date: "2026-07-08",
      status: "Delivered",
      items: [
        {
          productId: "p1",
          name: "Premium Soft Cotton Tee",
          price: 29.99,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
          size: "L",
          color: "Black"
        }
      ],
      total: 59.98,
      address: {
        id: "a1",
        fullName: "Jane Doe",
        street: "123 Creative Street, Suite 100",
        city: "New York",
        state: "NY",
        zip: "10001",
        country: "United States",
        phone: "+1 555-0199",
        isDefault: true
      },
      paymentMethod: "Card",
      trackingNumber: "TRK-98724109",
      trackingTimeline: [
        { status: "Order Placed", date: "2026-07-08 10:00 AM", desc: "Your order has been logged and confirmed.", done: true },
        { status: "Processing & Print", date: "2026-07-08 02:00 PM", desc: "The custom design has been printed on the base t-shirts.", done: true },
        { status: "Shipped", date: "2026-07-09 09:00 AM", desc: "Package picked up by DHL Express.", done: true },
        { status: "Delivered", date: "2026-07-10 11:30 AM", desc: "Delivered and signed at receptionist desk.", done: true }
      ]
    }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "TXN-847294",
      date: "2026-07-08",
      amount: 59.98,
      status: "Success",
      type: "Payment",
      orderId: "ORD-9872",
      invoiceUrl: "#"
    }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "n1",
      title: "Design Studio Updated!",
      message: "Check out the new Google Fonts library inside our custom designer.",
      type: "promo",
      date: "2 hours ago",
      read: false
    },
    {
      id: "n2",
      title: "Order #ORD-9872 Delivered",
      message: "Your premium cotton tee has been delivered successfully.",
      type: "shipping",
      date: "5 hours ago",
      read: true
    }
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const isDarkMode = false; // dark mode removed
  const toggleDarkMode = () => {}; // no-op kept for backward compat
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; phone: string } | null>({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 555-0199"
  });

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

  // Cart operations
  const addToCart = (item: Omit<CartItem, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    setCart(prev => {
      // Check if identical item (same product, size, color, and without customization) already in cart
      if (!item.customDesign) {
        const existing = prev.find(
          x => x.productId === item.productId && x.size === item.size && x.color === item.color && !x.customDesign
        );
        if (existing) {
          return prev.map(x => x.id === existing.id ? { ...x, quantity: x.quantity + item.quantity } : x);
        }
      }
      return [...prev, { ...item, id }];
    });
    showToast("Added to Cart", `${item.name} (${item.size} / ${item.color}) is now in your cart.`, "success");
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
    showToast("Removed from Cart", "The item has been deleted from your cart.", "info");
  };

  const updateCartQty = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const clearCart = () => setCart([]);

  // Wishlist
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast("Removed from Wishlist", `${product.name} removed.`, "info");
        return prev.filter(p => p.id !== product.id);
      } else {
        showToast("Added to Wishlist", `${product.name} saved.`, "success");
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.some(p => p.id === productId);

  // Address operations
  const addAddress = (address: Omit<Address, 'id'>) => {
    const id = Math.random().toString(36).substring(7);
    const newAddress: Address = { ...address, id };
    if (address.isDefault) {
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: false })).concat(newAddress));
    } else {
      setAddresses(prev => [...prev, newAddress]);
    }
    showToast("Address Saved", "Address added successfully.", "success");
  };

  const updateAddress = (address: Address) => {
    setAddresses(prev => {
      let next = prev.map(a => a.id === address.id ? address : a);
      if (address.isDefault) {
        next = next.map(a => a.id !== address.id ? { ...a, isDefault: false } : a);
      }
      return next;
    });
    showToast("Address Updated", "Changes saved successfully.", "success");
  };

  const deleteAddress = (id: string) => {
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast("Address Deleted", "The address has been removed.", "info");
  };

  const setDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    showToast("Default Address Set", "Your primary address was updated.", "success");
  };

  // Orders
  const createOrder = (address: Address, paymentMethod: string) => {
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
      trackingNumber: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      trackingTimeline: [
        { status: "Order Placed", date: "Just now", desc: "Your order has been logged and confirmed.", done: true },
        { status: "Processing & Print", date: "Estimated Tomorrow", desc: "The custom design will be printed on the base t-shirts.", done: false },
        { status: "Shipped", date: "Estimated 2 days", desc: "Package will be dispatched via standard courier.", done: false },
        { status: "Delivered", date: "Estimated 4-5 days", desc: "Delivered and signed at your door.", done: false }
      ]
    };

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: newOrder.date,
      amount: total,
      status: "Success",
      type: "Payment",
      orderId: orderId,
      invoiceUrl: "#"
    };

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [newTxn, ...prev]);

    // Dispatch order sync to Qikink Print-on-Demand partner API
    fetch('/api/qikink/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId,
        address,
        cart,
        gateway: 'PREPAID',
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

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "Cancelled" as const } : o));
    setTransactions(prev => prev.map(t => t.orderId === id ? { ...t, status: "Refunded" as const, type: "Refund" as const } : t));
    showToast("Order Cancelled", "Your order was successfully cancelled and refunded.", "info");
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const logout = () => {
    setCurrentUser(null);
    showToast("Logged Out", "You have been logged out of your account.", "info");
  };

  const loginUser = (email: string) => {
    setCurrentUser({
      name: "Jane Doe",
      email: email,
      phone: "+1 555-0199"
    });
    showToast("Welcome Back!", `Logged in successfully as ${email}`, "success");
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
      markNotificationsAsRead,
      logout,
      loginUser
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
