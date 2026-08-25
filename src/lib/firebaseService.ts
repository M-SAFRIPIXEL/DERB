import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import {
  signInWithPopup,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  db,
  auth,
  googleProvider,
  handleFirestoreError,
  sanitizeForFirestore,
  OperationType,
} from './firebase';
import { CartItem, Order, Product } from '../types';

export interface DBUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export interface DBPromoCode {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderMAD?: number;
  description?: string;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface DBStoreSettings {
  id: string;
  announcementAr: string;
  announcementEn: string;
  whatsappNumber: string;
  freeShippingThreshold: number;
  isMaintenanceMode?: boolean;
  updatedAt: string;
}

export interface DBReview {
  id: string;
  userId?: string;
  author: string;
  city: string;
  rating: number;
  comment: string;
  arabicComment?: string;
  productPurchased: string;
  fitFeedback?: string;
  createdAt: string;
}

// Authentication
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      // Save or update user profile
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        const userData = sanitizeForFirestore({
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Streetwear Enthusiast',
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
        });
        await setDoc(userRef, userData);
      }
    }
    return user;
  } catch (error) {
    console.error('Google Sign In failed:', error);
    throw error;
  }
}

export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}

// Save Order to Firestore
export async function createOrderInFirestore(order: Order, userId?: string): Promise<void> {
  const path = `orders/${order.id}`;
  try {
    const orderDocRef = doc(db, 'orders', order.id);
    const orderPayload = sanitizeForFirestore({
      ...order,
      userId: userId || 'guest',
      createdAt: order.createdAt || new Date().toISOString(),
    });
    await setDoc(orderDocRef, orderPayload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Fetch orders for logged in user or tracking number
export async function fetchUserOrders(userId: string): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Track single order by tracking number or order ID
export async function trackOrderById(orderIdOrTracking: string): Promise<Order | null> {
  const path = `orders/${orderIdOrTracking}`;
  try {
    // Check direct doc ID
    const directDoc = await getDoc(doc(db, 'orders', orderIdOrTracking));
    if (directDoc.exists()) {
      return directDoc.data() as Order;
    }
    // Search by tracking number
    const q = query(
      collection(db, 'orders'),
      where('trackingNumber', '==', orderIdOrTracking)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      return snap.docs[0].data() as Order;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Sync user cart with Firestore
export async function syncUserCart(userId: string, items: CartItem[]): Promise<void> {
  const path = `user_carts/${userId}`;
  try {
    const cartRef = doc(db, 'user_carts', userId);
    const payload = sanitizeForFirestore({
      id: userId,
      userId,
      items,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(cartRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch user cart
export async function fetchUserCart(userId: string): Promise<CartItem[] | null> {
  const path = `user_carts/${userId}`;
  try {
    const cartRef = doc(db, 'user_carts', userId);
    const snap = await getDoc(cartRef);
    if (snap.exists()) {
      return snap.data().items as CartItem[];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Sync user wishlist with Firestore
export async function syncUserWishlist(userId: string, productIds: string[]): Promise<void> {
  const path = `user_wishlists/${userId}`;
  try {
    const wishlistRef = doc(db, 'user_wishlists', userId);
    const payload = sanitizeForFirestore({
      id: userId,
      userId,
      productIds,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(wishlistRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch user wishlist
export async function fetchUserWishlist(userId: string): Promise<string[] | null> {
  const path = `user_wishlists/${userId}`;
  try {
    const wishlistRef = doc(db, 'user_wishlists', userId);
    const snap = await getDoc(wishlistRef);
    if (snap.exists()) {
      return snap.data().productIds as string[];
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// Subscribe to VIP Newsletter
export async function subscribeToNewsletter(email: string): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  const docId = btoa(normalizedEmail).replace(/=/g, '');
  const path = `newsletter_subscribers/${docId}`;
  try {
    const subRef = doc(db, 'newsletter_subscribers', docId);
    const payload = sanitizeForFirestore({
      id: docId,
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
    });
    await setDoc(subRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Add verified customer review
export async function addCustomerReview(review: DBReview): Promise<void> {
  const path = `reviews/${review.id}`;
  try {
    const reviewRef = doc(db, 'reviews', review.id);
    const payload = sanitizeForFirestore({
      ...review,
      createdAt: review.createdAt || new Date().toISOString(),
    });
    await setDoc(reviewRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// Fetch all reviews
export async function fetchAllReviews(): Promise<DBReview[]> {
  const path = 'reviews';
  try {
    const snap = await getDocs(collection(db, 'reviews'));
    return snap.docs.map((d) => d.data() as DBReview);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// ================= ADMIN SERVICES (Restricted to safrim629@gmail.com) =================

// 1. Fetch All Store Orders (Admin)
export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const path = 'orders';
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Order);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 2. Update Order Status (Admin)
export async function updateOrderStatusAdmin(
  orderId: string,
  newStatus: Order['status']
): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// 3. Delete Order (Admin)
export async function deleteOrderAdmin(orderId: string): Promise<void> {
  const path = `orders/${orderId}`;
  try {
    await deleteDoc(doc(db, 'orders', orderId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Fetch All Newsletter Subscribers (Admin)
export interface DBSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

export async function fetchAllSubscribersAdmin(): Promise<DBSubscriber[]> {
  const path = 'newsletter_subscribers';
  try {
    const snap = await getDocs(collection(db, 'newsletter_subscribers'));
    return snap.docs.map((d) => d.data() as DBSubscriber);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// 5. Delete Customer Review (Admin)
export async function deleteReviewAdmin(reviewId: string): Promise<void> {
  const path = `reviews/${reviewId}`;
  try {
    await deleteDoc(doc(db, 'reviews', reviewId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 6. Fetch / Save Store Settings (Admin)
export async function fetchStoreSettings(): Promise<DBStoreSettings | null> {
  const path = 'store_settings/global';
  try {
    const snap = await getDoc(doc(db, 'store_settings', 'global'));
    if (snap.exists()) {
      return snap.data() as DBStoreSettings;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function saveStoreSettingsAdmin(settings: Partial<DBStoreSettings>): Promise<void> {
  const path = 'store_settings/global';
  try {
    const docRef = doc(db, 'store_settings', 'global');
    const payload = sanitizeForFirestore({
      id: 'global',
      ...settings,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// 7. Promo Codes CRUD (Admin)
export async function fetchAllPromoCodes(): Promise<DBPromoCode[]> {
  const path = 'promo_codes';
  try {
    const snap = await getDocs(collection(db, 'promo_codes'));
    return snap.docs.map((d) => d.data() as DBPromoCode);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function savePromoCodeAdmin(promo: DBPromoCode): Promise<void> {
  const path = `promo_codes/${promo.id}`;
  try {
    const promoRef = doc(db, 'promo_codes', promo.id);
    const payload = sanitizeForFirestore({
      ...promo,
      createdAt: promo.createdAt || new Date().toISOString(),
    });
    await setDoc(promoRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePromoCodeAdmin(promoId: string): Promise<void> {
  const path = `promo_codes/${promoId}`;
  try {
    await deleteDoc(doc(db, 'promo_codes', promoId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 8. Custom Products Inventory Sync (Admin)
export async function fetchCustomProductsAdmin(): Promise<Product[]> {
  const path = 'products';
  try {
    const snap = await getDocs(collection(db, 'products'));
    return snap.docs.map((d) => d.data() as Product);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function saveProductAdmin(product: Product): Promise<void> {
  const path = `products/${product.id}`;
  try {
    const prodRef = doc(db, 'products', product.id);
    const payload = sanitizeForFirestore({
      ...product,
      updatedAt: new Date().toISOString(),
    });
    await setDoc(prodRef, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductAdmin(productId: string): Promise<void> {
  const path = `products/${productId}`;
  try {
    await deleteDoc(doc(db, 'products', productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

