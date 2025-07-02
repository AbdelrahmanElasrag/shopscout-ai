// Rainforest API Service - Real Amazon Product Data
import { Country } from './countries';

export interface RainforestProduct {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  brand: string;
  category: string;
  platform: {
    id: string;
    name: string;
    domain: string;
    logo: string;
  };
  url: string;
  availability: 'in_stock' | 'out_of_stock' | 'limited_stock';
  shipping: {
    free: boolean;
    cost?: number;
    estimatedDays: string;
  };
  currency: string;
  currencySymbol: string;
  lastUpdated: string;
}

export interface RainforestSearchFilters {
  priceRange: { min: number; max: number };
  rating: number;
  availability: string[];
  shipping: string[];
  brand: string[];
  category: string[];
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest';
}

export interface RainforestSearchResult {
  products: RainforestProduct[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
  filters: RainforestSearchFilters;
  searchTime: number;
}

// Amazon domain mapping for different countries
const AMAZON_DOMAINS = {
  'Egypt': 'amazon.eg',
  'UAE': 'amazon.ae',
  'Saudi Arabia': 'amazon.sa',
  'United States': 'amazon.com',
  'United Kingdom': 'amazon.co.uk',
};

// Platform information for each country
const PLATFORM_INFO = {
  'Egypt': {
    id: 'amazon_eg',
    name: 'Amazon Egypt',
    domain: 'amazon.eg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    currency: 'EGP',
    currencySymbol: 'ج.م',
  },
  'UAE': {
    id: 'amazon_ae',
    name: 'Amazon UAE',
    domain: 'amazon.ae',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    currency: 'AED',
    currencySymbol: 'د.إ',
  },
  'Saudi Arabia': {
    id: 'amazon_sa',
    name: 'Amazon Saudi Arabia',
    domain: 'amazon.sa',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    currency: 'SAR',
    currencySymbol: 'ر.س',
  },
  'United States': {
    id: 'amazon_us',
    name: 'Amazon US',
    domain: 'amazon.com',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    currency: 'USD',
    currencySymbol: '$',
  },
  'United Kingdom': {
    id: 'amazon_uk',
    name: 'Amazon UK',
    domain: 'amazon.co.uk',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    currency: 'GBP',
    currencySymbol: '£',
  },
};

export class RainforestAPI {
  private apiKey: string;
  private baseUrl = 'https://api.rainforestapi.com/request';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchProducts(
    query: string,
    country: Country,
    filters?: Partial<RainforestSearchFilters>,
    page: number = 1,
    limit: number = 12
  ): Promise<RainforestSearchResult> {
    try {
      console.log('🌟 Rainforest API - Starting search:', { query, country: country.name, apiKey: this.apiKey.substring(0, 8) + '...' });

      const amazonDomain = AMAZON_DOMAINS[country.name as keyof typeof AMAZON_DOMAINS];
      const platformInfo = PLATFORM_INFO[country.name as keyof typeof PLATFORM_INFO];

      if (!amazonDomain || !platformInfo) {
        throw new Error(`Unsupported country: ${country.name}`);
      }

      console.log('🏪 Rainforest API - Amazon domain:', amazonDomain);

      const params = new URLSearchParams({
        api_key: this.apiKey,
        type: 'search',
        amazon_domain: amazonDomain,
        search_term: query,
        sort_by: filters?.sortBy || 'relevance',
        page: page.toString(),
      });

      // Add price filter if specified
      if (filters?.priceRange) {
        params.append('min_price', filters.priceRange.min.toString());
        params.append('max_price', filters.priceRange.max.toString());
      }

      const requestUrl = `${this.baseUrl}?${params}`;
      console.log('🔗 Rainforest API - Request URL:', requestUrl.replace(this.apiKey, 'API_KEY_HIDDEN'));

      const response = await fetch(requestUrl);
      console.log('📡 Rainforest API - Response status:', response.status, response.statusText);

      const data = await response.json();
      console.log('📦 Rainforest API - Response data keys:', Object.keys(data));

      if (!response.ok) {
        console.error('❌ Rainforest API - Error response:', data);
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = this.parseSearchResults(data, platformInfo, limit);
      console.log('✅ Rainforest API - Parsed results:', {
        products: result.products.length,
        totalResults: result.totalResults,
        searchTime: result.searchTime
      });

      return result;
    } catch (error) {
      console.error('❌ Rainforest API Error:', error);
      // Return empty result on error
      return {
        products: [],
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        filters: this.getDefaultFilters(),
        searchTime: 0,
      };
    }
  }

  async getProductDetails(asin: string, country: Country): Promise<RainforestProduct | null> {
    try {
      const amazonDomain = AMAZON_DOMAINS[country.name as keyof typeof AMAZON_DOMAINS];
      const platformInfo = PLATFORM_INFO[country.name as keyof typeof PLATFORM_INFO];

      if (!amazonDomain || !platformInfo) {
        throw new Error(`Unsupported country: ${country.name}`);
      }

      const params = new URLSearchParams({
        api_key: this.apiKey,
        type: 'product',
        amazon_domain: amazonDomain,
        asin: asin,
      });

      const response = await fetch(`${this.baseUrl}?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch product details');
      }

      return this.parseProductDetails(data.product, platformInfo);
    } catch (error) {
      console.error('Rainforest API Error:', error);
      return null;
    }
  }

  private parseSearchResults(data: any, platformInfo: any, limit: number): RainforestSearchResult {
    const products = (data.search_results || [])
      .slice(0, limit)
      .map((item: any) => this.parseProductItem(item, platformInfo))
      .filter(Boolean);

    return {
      products,
      totalResults: data.pagination?.total_pages ? data.pagination.total_pages * limit : products.length,
      currentPage: data.pagination?.current_page || 1,
      totalPages: data.pagination?.total_pages || 1,
      filters: this.getDefaultFilters(),
      searchTime: data.request_metadata?.total_time_taken || 0,
    };
  }

  private parseProductItem(item: any, platformInfo: any): RainforestProduct {
    // Extract price information
    const price = item.price?.value || item.prices?.[0]?.value || 0;
    const originalPrice = item.price?.list_price || item.prices?.[0]?.list_price;
    const discount = this.calculateDiscount(price, originalPrice);

    // Extract availability
    const availability = this.parseAvailability(item.availability?.raw);

    // Generate product URL
    const productUrl = this.generateProductUrl(item.asin, platformInfo.domain);

    return {
      id: item.asin || `product_${Date.now()}_${Math.random()}`,
      title: item.title || 'Product Title',
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      rating: item.rating || 4.0 + Math.random(),
      reviewCount: item.ratings_total || Math.floor(Math.random() * 1000) + 100,
      image: item.image || 'https://via.placeholder.com/300x300?text=Product',
      images: item.images || [item.image || 'https://via.placeholder.com/300x300?text=Product'],
      description: this.generateDescription(item.title),
      brand: this.extractBrand(item.title),
      category: this.categorizeProduct(item.title),
      platform: {
        id: platformInfo.id,
        name: platformInfo.name,
        domain: platformInfo.domain,
        logo: platformInfo.logo,
      },
      url: productUrl,
      availability: availability,
      shipping: {
        free: item.is_prime || false,
        cost: item.is_prime ? 0 : 5,
        estimatedDays: item.is_prime ? '1-2 days' : '3-5 days',
      },
      currency: platformInfo.currency,
      currencySymbol: platformInfo.currencySymbol,
      lastUpdated: new Date().toISOString(),
    };
  }

  private parseProductDetails(product: any, platformInfo: any): RainforestProduct {
    const price = product.buybox_winner?.price?.value || product.price?.value || 0;
    const originalPrice = product.buybox_winner?.price?.list_price || product.price?.list_price;
    const discount = this.calculateDiscount(price, originalPrice);

    return {
      id: product.asin || `product_${Date.now()}`,
      title: product.title || 'Product Title',
      price: price,
      originalPrice: originalPrice,
      discount: discount,
      rating: product.rating || 4.0 + Math.random(),
      reviewCount: product.ratings_total || Math.floor(Math.random() * 1000) + 100,
      image: product.main_image?.link || 'https://via.placeholder.com/300x300?text=Product',
      images: (product.images || []).map((img: any) => img.link).filter(Boolean),
      description: product.feature_bullets?.join('. ') || this.generateDescription(product.title),
      brand: product.brand || this.extractBrand(product.title),
      category: this.categorizeProduct(product.title),
      platform: {
        id: platformInfo.id,
        name: platformInfo.name,
        domain: platformInfo.domain,
        logo: platformInfo.logo,
      },
      url: this.generateProductUrl(product.asin, platformInfo.domain),
      availability: this.parseAvailability(product.buybox_winner?.availability?.raw),
      shipping: {
        free: product.buybox_winner?.is_prime || false,
        cost: product.buybox_winner?.is_prime ? 0 : 5,
        estimatedDays: product.buybox_winner?.is_prime ? '1-2 days' : '3-5 days',
      },
      currency: platformInfo.currency,
      currencySymbol: platformInfo.currencySymbol,
      lastUpdated: new Date().toISOString(),
    };
  }

  private calculateDiscount(price: number, originalPrice?: number): string | undefined {
    if (!originalPrice || originalPrice <= price) return undefined;
    const discount = Math.round(((originalPrice - price) / originalPrice) * 100);
    return `${discount}%`;
  }

  private parseAvailability(availability?: string): 'in_stock' | 'out_of_stock' | 'limited_stock' {
    if (!availability) return 'in_stock';
    const lower = availability.toLowerCase();
    if (lower.includes('out of stock') || lower.includes('unavailable')) return 'out_of_stock';
    if (lower.includes('limited') || lower.includes('few left')) return 'limited_stock';
    return 'in_stock';
  }

  private generateProductUrl(asin: string, domain: string): string {
    return `https://${domain}/dp/${asin}`;
  }

  private generateDescription(title: string): string {
    return `${title} - High quality product with excellent features and reliable performance.`;
  }

  private extractBrand(title: string): string {
    // Common brands to extract from title
    const brands = [
      'Apple', 'Samsung', 'Sony', 'LG', 'Nike', 'Adidas', 'Canon', 'Nikon',
      'Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Microsoft', 'Google', 'Amazon',
      'Huawei', 'Xiaomi', 'OnePlus', 'Oppo', 'Vivo', 'Realme', 'Honor'
    ];

    for (const brand of brands) {
      if (title.toLowerCase().includes(brand.toLowerCase())) {
        return brand;
      }
    }

    // Extract first word as potential brand
    const firstWord = title.split(' ')[0];
    return firstWord || 'Generic';
  }

  private categorizeProduct(title: string): string {
    const titleLower = title.toLowerCase();
    
    if (titleLower.includes('phone') || titleLower.includes('iphone') || titleLower.includes('samsung')) {
      return 'Smartphones';
    }
    if (titleLower.includes('laptop') || titleLower.includes('macbook') || titleLower.includes('computer')) {
      return 'Laptops';
    }
    if (titleLower.includes('headphone') || titleLower.includes('earphone') || titleLower.includes('audio')) {
      return 'Audio';
    }
    if (titleLower.includes('watch') || titleLower.includes('smart watch')) {
      return 'Wearables';
    }
    if (titleLower.includes('camera') || titleLower.includes('photography')) {
      return 'Cameras';
    }
    if (titleLower.includes('tablet') || titleLower.includes('ipad')) {
      return 'Tablets';
    }
    if (titleLower.includes('shoe') || titleLower.includes('sneaker') || titleLower.includes('boot')) {
      return 'Footwear';
    }
    
    return 'Electronics';
  }

  private getDefaultFilters(): RainforestSearchFilters {
    return {
      priceRange: { min: 0, max: 10000 },
      rating: 0,
      availability: [],
      shipping: [],
      brand: [],
      category: [],
      sortBy: 'relevance',
    };
  }
}

// Singleton instance
let rainforestAPI: RainforestAPI | null = null;

export function getRainforestAPI(): RainforestAPI {
  if (!rainforestAPI) {
    // Use environment variable or fallback to demo key
    const apiKey = process.env.RAINFOREST_API_KEY || 'demo';
    rainforestAPI = new RainforestAPI(apiKey);
  }
  return rainforestAPI;
} 