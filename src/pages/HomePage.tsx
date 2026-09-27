import React from 'react';
import { useCart } from '../context/CartContext';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { CategoriesSection } from '../components/CategoriesSection';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { CollectionsEditorial } from '../components/CollectionsEditorial';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { ReviewsSection } from '../components/ReviewsSection';
import { InstagramCommunity } from '../components/InstagramCommunity';
import { Newsletter } from '../components/Newsletter';
import { Footer } from '../components/Footer';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { CartDrawer } from '../components/CartDrawer';
import { WishlistDrawer } from '../components/WishlistDrawer';
import { QuickSearchModal } from '../components/QuickSearchModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { OrdersTrackingModal } from '../components/OrdersTrackingModal';
import { MobileBottomNav } from '../components/MobileBottomNav';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Order, Collection, Category } from '../types';

export const HomePage: React.FC = () => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    cart,
    wishlistIds,
    isCartOpen,
    setIsCartOpen,
    isWishlistOpen,
    setIsWishlistOpen,
    isSearchOpen,
    setIsSearchOpen,
    isCheckoutOpen,
    setIsCheckoutOpen,
    isOrdersOpen,
    setIsOrdersOpen,
    handleAddToCart,
    handleUpdateCartQuantity,
    handleRemoveFromCart,
    handleClearCart,
    handleToggleWishlist,
    handleApplyPromo,
    toastMessage,
    cartCount,
    cartTotalMAD,
    wishlistProducts,
    promoCode,
    discountPercentage,
  } = useCart();

  const navigate = useNavigate();

  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (_categoryKey: Category['categoryKey']) => {
    handleNavigateSection('shop');
  };

  const handleExploreCollection = (_col: Collection) => {
    handleNavigateSection('shop');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-50 bg-[#161616] text-white px-4 sm:px-5 py-3 rounded-2xl shadow-2xl border border-[#CCFF00]/40 flex items-center gap-3 animate-fade-in text-xs sm:text-sm font-bold font-arabic">
          <div className="w-6 h-6 rounded-full bg-[#CCFF00] text-black flex items-center justify-center font-black shrink-0">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Navbar
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => navigate('/admin')}
        cartCount={cartCount}
        cartTotalMAD={cartTotalMAD}
        wishlistCount={wishlistIds.length}
        onNavigateSection={handleNavigateSection}
      />

      <main className="flex-1 pb-24 lg:pb-0">
        <Hero
          onShopNow={() => handleNavigateSection('shop')}
          onDiscoverCollection={() => handleNavigateSection('collections')}
          onSelectCategory={handleSelectCategory}
        />
        <CategoriesSection onSelectCategory={handleSelectCategory} />
        <FeaturedProducts
          products={products}
          onSelectProduct={(p) => setSelectedProduct(p)}
          onAddToCart={(p, sz, clr) => handleAddToCart(p, sz, clr, 1)}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
        <CollectionsEditorial onExploreCollection={handleExploreCollection} />
        <WhyChooseUs />
        <ReviewsSection />
        <InstagramCommunity />
        <Newsletter />
      </main>

      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenAdmin={() => navigate('/admin')}
      />

      {/* Mobile Bottom Floating Navigation Bar */}
      <MobileBottomNav
        onNavigateHome={() => handleNavigateSection('hero')}
        onNavigateShop={() => handleNavigateSection('shop')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={cartCount}
        cartTotalMAD={cartTotalMAD}
        wishlistCount={wishlistIds.length}
      />

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, sz, clr, qty) => handleAddToCart(prod, sz, clr, qty)}
        isWishlisted={selectedProduct ? wishlistIds.includes(selectedProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

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

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onAddToCart={(p) => handleAddToCart(p)}
      />

      <QuickSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        discountPercentage={discountPercentage}
        promoCode={promoCode}
        onOrderPlaced={(order: Order) => {
          console.log('Order placed in Firebase:', order);
        }}
        onClearCart={handleClearCart}
      />

      <OrdersTrackingModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </div>
  );
};
