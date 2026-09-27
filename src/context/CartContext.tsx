import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Product, ProductColor, CartItem } from '../types';
import { PRODUCTS_DATA } from '../data/products';
import { useAuth } from './AuthContext';
import {
  syncUserCart,
  fetchUserCart,
  syncUserWishlist,
  fetchUserWishlist,
  fetchCustomProductsAdmin,
  fetchAllPromoCodes,
  DBPromoCode,
} from '../lib/firebaseService';

interface CartContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  cart: CartItem[];
  wishlistIds: string[];
  promoCode: string;
  discountPercentage: number;
  toastMessage: string | null;
  selectedProduct: Product | null;
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  isCheckoutOpen: boolean;
  isOrdersOpen: boolean;

  setSelectedProduct: (product: Product | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  setIsCheckoutOpen: (open: boolean) => void;
  setIsOrdersOpen: (open: boolean) => void;

  handleAddToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number) => void;
  handleUpdateCartQuantity: (itemId: string, newQuantity: number) => void;
  handleRemoveFromCart: (itemId: string) => void;
  handleClearCart: () => void;
  handleToggleWishlist: (product: Product) => void;
  handleApplyPromo: (code: string) => boolean;
  showToast: (msg: string) => void;

  cartCount: number;
  cartTotalMAD: number;
  wishlistProducts: Product[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('derb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('derb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);

  const [promoDb, setPromoDb] = useState<DBPromoCode[]>([]);

  // Fetch products from Firebase on load (fallback to hardcoded)
  useEffect(() => {
    fetchCustomProductsAdmin().then((firebaseProducts) => {
      if (firebaseProducts && firebaseProducts.length > 0) {
        const merged = [...PRODUCTS_DATA];
        firebaseProducts.forEach((fp) => {
          const idx = merged.findIndex((p) => p.id === fp.id);
          if (idx >= 0) {
            merged[idx] = fp;
          } else {
            merged.unshift(fp);
          }
        });
        setProducts(merged);
      }
    }).catch(() => {
      // Keep hardcoded products as fallback
    });

    fetchAllPromoCodes().then((codes) => {
      if (codes && codes.length > 0) {
        setPromoDb(codes);
      }
    }).catch(() => {});
  }, []);

  // Fetch Firestore Cart & Wishlist on Auth change
  useEffect(() => {
    if (user?.uid) {
      fetchUserCart(user.uid).then((remoteCart) => {
        if (remoteCart && remoteCart.length > 0) {
          setCart(remoteCart);
        }
      }).catch(() => {});
      fetchUserWishlist(user.uid).then((remoteWishlist) => {
        if (remoteWishlist && remoteWishlist.length > 0) {
          setWishlistIds(remoteWishlist);
        }
      }).catch(() => {});
    }
  }, [user]);

  // Persist Cart (Local & Firestore)
  useEffect(() => {
    try {
      localStorage.setItem('derb_cart', JSON.stringify(cart));
      if (user?.uid) {
        syncUserCart(user.uid, cart).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, [cart, user]);

  // Persist Wishlist (Local & Firestore)
  useEffect(() => {
    try {
      localStorage.setItem('derb_wishlist', JSON.stringify(wishlistIds));
      if (user?.uid) {
        syncUserWishlist(user.uid, wishlistIds).catch(console.error);
      }
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds, user]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  const handleAddToCart = useCallback(
    (product: Product, size?: string, color?: ProductColor, quantity: number = 1) => {
      const chosenSize = size || product.sizes[1] || product.sizes[0];
      const chosenColor = color || product.colors[0];
      const itemId = `${product.id}-${chosenSize}-${chosenColor.name}`;

      setCart((prev) => {
        const existing = prev.find((item) => item.id === itemId);
        if (existing) {
          return prev.map((item) =>
            item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
          );
        } else {
          return [
            ...prev,
            { id: itemId, product, selectedSize: chosenSize, selectedColor: chosenColor, quantity },
          ];
        }
      });

      showToast(`Added ${product.name} (${chosenSize}) to your bag!`);
    },
    [showToast]
  );

  const handleUpdateCartQuantity = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
      );
    }
  }, []);

  const handleRemoveFromCart = useCallback((itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  const handleToggleWishlist = useCallback(
    (product: Product) => {
      setWishlistIds((prev) => {
        const isAlready = prev.includes(product.id);
        if (isAlready) {
          showToast(`Removed ${product.name} from saved grails`);
          return prev.filter((id) => id !== product.id);
        } else {
          showToast(`Saved ${product.name} to wishlist ⚡`);
          return [...prev, product.id];
        }
      });
    },
    [showToast]
  );

  const handleApplyPromo = useCallback(
    (code: string): boolean => {
      const normalized = code.trim().toUpperCase();

      // Check hardcoded promo codes
      if (normalized === 'MOROCCO10' || normalized === 'PHILOSTORYA10' || normalized === 'DERB10' || normalized === 'CASA10') {
        setPromoCode(normalized);
        setDiscountPercentage(10);
        return true;
      }

      // Check Firebase promo codes
      const dbPromo = promoDb.find(
        (p) => p.code.toUpperCase() === normalized && p.isActive
      );
      if (dbPromo) {
        setPromoCode(dbPromo.code);
        setDiscountPercentage(
          dbPromo.discountType === 'percentage' ? dbPromo.discountValue : 0
        );
        return true;
      }

      return false;
    },
    [promoDb]
  );

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalMAD = cart.reduce((acc, item) => acc + item.product.priceMAD * item.quantity, 0);
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <CartContext.Provider
      value={{
        products,
        setProducts,
        cart,
        wishlistIds,
        promoCode,
        discountPercentage,
        toastMessage,
        selectedProduct,
        isCartOpen,
        isWishlistOpen,
        isSearchOpen,
        isCheckoutOpen,
        isOrdersOpen,
        setSelectedProduct,
        setIsCartOpen,
        setIsWishlistOpen,
        setIsSearchOpen,
        setIsCheckoutOpen,
        setIsOrdersOpen,
        handleAddToCart,
        handleUpdateCartQuantity,
        handleRemoveFromCart,
        handleClearCart,
        handleToggleWishlist,
        handleApplyPromo,
        showToast,
        cartCount,
        cartTotalMAD,
        wishlistProducts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
