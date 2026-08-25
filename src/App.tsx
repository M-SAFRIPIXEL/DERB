import React, { useState, useEffect } from 'react';
import {
  Product,
  ProductColor,
  CartItem,
  Order,
  Collection,
  Category,
} from './types';
import { PRODUCTS_DATA } from './data/products';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { CollectionsEditorial } from './components/CollectionsEditorial';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ReviewsSection } from './components/ReviewsSection';
import { InstagramCommunity } from './components/InstagramCommunity';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrdersTrackingModal } from './components/OrdersTrackingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Check } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import {
  syncUserCart,
  fetchUserCart,
  syncUserWishlist,
  fetchUserWishlist,
} from './lib/firebaseService';

export function App() {
  const { user } = useAuth();

  // Products State
  const [products, setProducts] = useState<Product[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Cart & Wishlist State (with localStorage & Firestore synchronization)
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

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Promo Code State
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch Firestore Cart & Wishlist on Auth change
  useEffect(() => {
    if (user?.uid) {
      fetchUserCart(user.uid).then((remoteCart) => {
        if (remoteCart && remoteCart.length > 0) {
          setCart(remoteCart);
        }
      });
      fetchUserWishlist(user.uid).then((remoteWishlist) => {
        if (remoteWishlist && remoteWishlist.length > 0) {
          setWishlistIds(remoteWishlist);
        }
      });
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };


  // Add To Cart
  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity: number = 1
  ) => {
    const chosenSize = size || product.sizes[1] || product.sizes[0];
    const chosenColor = color || product.colors[0];
    const itemId = `${product.id}-${chosenSize}-${chosenColor.name}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: itemId,
            product,
            selectedSize: chosenSize,
            selectedColor: chosenColor,
            quantity,
          },
        ];
      }
    });

    showToast(`Added ${product.name} (${chosenSize}) to your bag!`);
  };

  const handleUpdateCartQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== itemId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
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
  };

  // Promo Code Validation
  const handleApplyPromo = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'MOROCCO10' || normalized === 'DERB10' || normalized === 'CASA10') {
      setPromoCode(normalized);
      setDiscountPercentage(10);
      return true;
    }
    return false;
  };

  // Smooth scroll
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Category select
  const handleSelectCategory = (_categoryKey: Category['categoryKey']) => {
    handleNavigateSection('shop');
  };

  // Collection explore
  const handleExploreCollection = (_col: Collection) => {
    handleNavigateSection('shop');
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotalMAD = cart.reduce(
    (acc, item) => acc + item.product.priceMAD * item.quantity,
    0
  );
  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#161616] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#CCFF00]/40 flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-bold">
          <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-black">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Streetwear Sticky Navbar */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        cartCount={cartCount}
        cartTotalMAD={cartTotalMAD}
        wishlistCount={wishlistIds.length}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Landing Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero
          onShopNow={() => handleNavigateSection('shop')}
          onDiscoverCollection={() => handleNavigateSection('collections')}
        />

        {/* Featured Categories (500GSM, Hoodies, Oversized Tees, Arabic Typography, Anime, Pants) */}
        <CategoriesSection onSelectCategory={handleSelectCategory} />

        {/* Catalog & Shop with Tabs, Sorting, & Quick-Add */}
        <FeaturedProducts
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, sz, clr) => handleAddToCart(p, sz, clr, 1)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Lookbook & Editorial Capsules */}
        <CollectionsEditorial onExploreCollection={handleExploreCollection} />

        {/* Moroccan Atelier Quality Guarantees & COD */}
        <WhyChooseUs />

        {/* Moroccan Customer Reviews */}
        <ReviewsSection />

        {/* Instagram Streetwear Community Gallery */}
        <InstagramCommunity />

        {/* VIP Drops Newsletter */}
        <Newsletter />
      </main>

      {/* Comprehensive Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS & DRAWERS */}

      {/* Admin Dashboard Hub (Restricted strictly to safrim629@gmail.com) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={setProducts}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, sz, clr, qty) => {
          handleAddToCart(prod, sz, clr, qty);
        }}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Shopping Bag Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedPromo={promoCode}
        onApplyPromo={handleApplyPromo}
        discountPercentage={discountPercentage}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      {/* Live Search Modal */}
      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* One-Page Morocco Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountPercentage={discountPercentage}
        promoCode={promoCode}
        onOrderPlaced={(order) => {
          console.log('Order placed in Firebase:', order);
        }}
        onClearCart={handleClearCart}
      />

      {/* Firebase Order History & Real-Time Tracking Modal */}
      <OrdersTrackingModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
}


export default App;
