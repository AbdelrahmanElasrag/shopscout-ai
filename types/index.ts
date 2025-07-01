export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  category: string;
  brand?: string;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  platform: Platform;
  url: string;
  affiliateUrl?: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited_stock';
  rating?: number;
  reviewCount?: number;
  seller: Seller;
  trustScore: number;
  lastUpdated: string;
  shipping?: ShippingInfo;
  features?: string[];
}

export interface Seller {
  id: string;
  name: string;
  rating?: number;
  totalReviews?: number;
  isVerified: boolean;
  platform: Platform;
}

export interface ShippingInfo {
  cost: number;
  currency: string;
  estimatedDays: number;
  isFree: boolean;
  methods: string[];
}

export type Platform = 'amazon' | 'aliexpress' | 'noon';

export interface SearchResult {
  query: string;
  products: Product[];
  totalCount: number;
  facets: SearchFacets;
  suggestions?: string[];
  searchTime: number;
}

export interface SearchFacets {
  categories: FacetItem[];
  brands: FacetItem[];
  priceRanges: PriceRange[];
  platforms: FacetItem[];
}

export interface FacetItem {
  value: string;
  count: number;
  label: string;
}

export interface PriceRange {
  min: number;
  max: number;
  count: number;
  label: string;
}

export interface SearchFilters {
  categories?: string[];
  brands?: string[];
  platforms?: Platform[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockOnly?: boolean;
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  isSubscribed: boolean;
  subscriptionTier: 'free' | 'premium';
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  currency: string;
  language: string;
  notifications: NotificationSettings;
  favoriteCategories: string[];
  priceAlerts: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  priceDrops: boolean;
  newDeals: boolean;
  weeklyDigest: boolean;
}

export interface PriceAlert {
  id: string;
  userId: string;
  productId: string;
  targetPrice: number;
  currency: string;
  isActive: boolean;
  createdAt: string;
  triggeredAt?: string;
}

export interface SavedProduct {
  id: string;
  userId: string;
  productId: string;
  notes?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId?: string;
  rating: number;
  title?: string;
  content: string;
  platform: Platform;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

export interface PriceHistory {
  productVariantId: string;
  date: string;
  price: number;
  currency: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasNext?: boolean;
  };
}

export interface ScrapingJob {
  id: string;
  platform: Platform;
  url: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ProductComparison {
  products: ProductVariant[];
  bestPrice: ProductVariant;
  averagePrice: number;
  priceRange: {
    min: number;
    max: number;
  };
  recommendations: ProductVariant[];
}

export interface TrustScore {
  overall: number;
  factors: {
    sellerReliability: number;
    productAuthenticity: number;
    deliveryReliability: number;
    customerService: number;
  };
  explanation: string;
}

export interface AIInsight {
  productId: string;
  insights: {
    priceRecommendation: string;
    qualityAssessment: string;
    alternatives: string[];
    riskFactors: string[];
  };
  confidence: number;
  generatedAt: string;
}

export interface AnalyticsData {
  searchVolume: number;
  popularProducts: Product[];
  trendingCategories: string[];
  platformPerformance: {
    platform: Platform;
    totalProducts: number;
    averagePrice: number;
    averageRating: number;
  }[];
} 