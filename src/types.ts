export interface ProductColor {
  name: string;
  hex: string;
  bgClass: string;
  imageIndex: number;
}

export interface Product {
  id: string;
  name: string;
  arabicName: string;
  slug: string;
  priceMAD: number;
  originalPriceMAD?: number;
  category: 'hoodies' | 't-shirts' | 'sweatshirts' | 'limited' | 'arabic-typography' | 'anime-capsule' | 'pants';
  categoryLabel: string;
  tags: string[];
  images: string[];
  colors: ProductColor[];
  sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL' | 'Oversized')[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  gsm: number; // e.g. 500GSM, 450GSM, 320GSM
  material: string;
  fit: string; // e.g. "Boxy Oversized Drop Shoulder"
  description: string;
  details: string[];
  careInstructions: string[];
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  arabicName: string;
  categoryKey: Product['category'];
  image: string;
  itemsCount: number;
  description: string;
  badge?: string;
}

export interface Collection {
  id: string;
  title: string;
  arabicTitle: string;
  tagline: string;
  description: string;
  bannerImage: string;
  accentColor: string;
  tag: string;
  productIds: string[];
}

export interface CartItem {
  id: string; // generated unique cart item id
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface CustomerReview {
  id: string;
  author: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  arabicComment?: string;
  verifiedBuyer: boolean;
  avatar: string;
  productPurchased: string;
  fitFeedback: 'Fits True to Size' | 'Slightly Oversized' | 'Perfect Boxy Fit';
}

export interface MoroccanCity {
  name: string;
  arabicName: string;
  shippingDays: string;
  shippingFeeMAD: number;
}

export interface OrderShippingDetails {
  fullName: string;
  phone: string;
  city: string;
  address: string;
  postalCode?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  trackingNumber: string;
  items: CartItem[];
  shippingDetails: OrderShippingDetails;
  paymentMethod: 'cod' | 'card';
  subtotalMAD: number;
  shippingFeeMAD: number;
  discountMAD: number;
  totalMAD: number;
  promoCodeApplied?: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  estimatedDelivery: string;
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  arabicTitle: string;
  city: string;
  model: string;
  image: string;
  taggedProductIds: string[];
  likes: number;
}
