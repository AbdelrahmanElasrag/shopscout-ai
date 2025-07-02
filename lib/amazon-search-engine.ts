// Amazon PA-API Powered Search Engine
import { Country } from './countries';
import { AmazonPAAPI, AmazonCredentials, AmazonProduct } from './amazon-pa-api';

export interface RealProduct {
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

export interface SearchFilters {
  priceRange: { min: number; max: number };
  minRating: number;
  inStock: boolean;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'reviews';
  category?: string;
  brand?: string;
}

export interface SearchResult {
  products: RealProduct[];
  totalResults: number;
  searchTime: number;
  query: string;
  suggestions: string[];
}

export class AmazonSearchEngine {
  private country: Country;
  private amazonAPI: AmazonPAAPI;

  constructor(country: Country, credentials: AmazonCredentials) {
    this.country = country;
    this.amazonAPI = new AmazonPAAPI(country, credentials);
  }

  async searchProducts(
    query: string, 
    filters: SearchFilters, 
    limit: number = 20
  ): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 Searching Amazon ${this.country.name} for: "${query}"`);
      
      // Search Amazon using PA-API
      const searchIndex = this.determineSearchIndex(query, filters.category);
      const amazonResponse = await this.amazonAPI.searchProducts(
        query,
        searchIndex,
        Math.min(limit, 50), // Amazon PA-API limit
        1
      );

      if (!amazonResponse.SearchResult?.Items) {
        console.log('⚠️  No products found on Amazon');
        return {
          products: [],
          totalResults: 0,
          searchTime: Date.now() - startTime,
          query,
          suggestions: await this.amazonAPI.getSearchSuggestions(query)
        };
      }

      console.log(`✅ Found ${amazonResponse.SearchResult.Items.length} products on Amazon`);

      // Convert Amazon products to our format
      const products = amazonResponse.SearchResult.Items
        .map(item => this.convertAmazonProduct(item))
        .filter(product => product !== null) as RealProduct[];

      // Apply filters
      const filteredProducts = this.applyFilters(products, filters);

      // Sort products
      const sortedProducts = this.sortProducts(filteredProducts, filters.sortBy);

      const searchTime = Date.now() - startTime;
      console.log(`🎯 Processed ${sortedProducts.length} products in ${searchTime}ms`);

      return {
        products: sortedProducts.slice(0, limit),
        totalResults: amazonResponse.SearchResult.TotalResultCount || sortedProducts.length,
        searchTime,
        query,
        suggestions: await this.amazonAPI.getSearchSuggestions(query)
      };

    } catch (error) {
      console.error('❌ Amazon search failed:', error);
      
      // Fallback to prevent complete failure
      return {
        products: [],
        totalResults: 0,
        searchTime: Date.now() - startTime,
        query,
        suggestions: []
      };
    }
  }

  private convertAmazonProduct(amazonProduct: AmazonProduct): RealProduct | null {
    try {
      const listing = amazonProduct.Offers?.Listings?.[0];
      const summary = amazonProduct.Offers?.Summaries?.[0];
      
      // Skip products without basic info
      if (!amazonProduct.ItemInfo?.Title?.DisplayValue) {
        return null;
      }

      const price = listing?.Price?.Amount || summary?.LowestPrice?.Amount || 0;
      const originalPrice = listing?.SavingBasis?.Amount || summary?.HighestPrice?.Amount;
      
      let discount = '';
      if (originalPrice && originalPrice > price) {
        const discountPercent = Math.round(((originalPrice - price) / originalPrice) * 100);
        discount = `-${discountPercent}%`;
      }

      // Get images
      const images: string[] = [];
      if (amazonProduct.Images?.Primary?.Large?.URL) {
        images.push(amazonProduct.Images.Primary.Large.URL);
      }
      if (amazonProduct.Images?.Primary?.Medium?.URL && !images.includes(amazonProduct.Images.Primary.Medium.URL)) {
        images.push(amazonProduct.Images.Primary.Medium.URL);
      }
      if (amazonProduct.Images?.Variants) {
        amazonProduct.Images.Variants.forEach(variant => {
          if (variant.Large?.URL && !images.includes(variant.Large.URL)) {
            images.push(variant.Large.URL);
          }
        });
      }

      const availability = this.parseAvailability(listing?.Availability?.Type || 'Available');

      return {
        id: amazonProduct.ASIN,
        title: amazonProduct.ItemInfo.Title.DisplayValue,
        price: price > 0 ? price / 100 : 0, // Convert from cents
        originalPrice: originalPrice ? originalPrice / 100 : undefined,
        discount,
        rating: amazonProduct.CustomerReviews?.StarRating?.Value || 4.0,
        reviewCount: amazonProduct.CustomerReviews?.Count || 0,
        image: images[0] || 'https://via.placeholder.com/400x400?text=No+Image',
        images,
        description: amazonProduct.ItemInfo?.Features?.DisplayValues?.join('. ') || '',
        brand: amazonProduct.ItemInfo?.ByLineInfo?.Brand?.DisplayValue || 
               amazonProduct.ItemInfo?.ByLineInfo?.Manufacturer?.DisplayValue || 'Unknown',
        category: amazonProduct.ItemInfo?.Classifications?.ProductGroup?.DisplayValue || 'General',
        platform: {
          id: `amazon-${this.country.code.toLowerCase()}`,
          name: `Amazon ${this.country.name}`,
          domain: amazonProduct.DetailPageURL?.includes('amazon.') ? 
                   new URL(amazonProduct.DetailPageURL).hostname : 
                   `amazon.${this.country.code.toLowerCase()}`,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
        },
        url: amazonProduct.DetailPageURL || '#',
        availability,
        shipping: {
          free: listing?.DeliveryInfo?.IsFreeShippingEligible || false,
          estimatedDays: listing?.DeliveryInfo?.IsPrimeEligible ? '1-2 days' : '3-7 days'
        },
        currency: this.country.currency,
        currencySymbol: this.country.currencySymbol,
        lastUpdated: new Date().toISOString()
      };

    } catch (error) {
      console.error('Error converting Amazon product:', error);
      return null;
    }
  }

  private parseAvailability(type: string): 'in_stock' | 'out_of_stock' | 'limited_stock' {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('in stock') || lowerType.includes('available')) {
      return 'in_stock';
    } else if (lowerType.includes('out of stock') || lowerType.includes('unavailable')) {
      return 'out_of_stock';
    } else {
      return 'limited_stock';
    }
  }

  private determineSearchIndex(query: string, category?: string): string {
    if (category) {
      const categoryMap: Record<string, string> = {
        'Electronics': 'Electronics',
        'Computers': 'Computers',
        'Clothing': 'Fashion',
        'Shoes': 'Fashion',
        'Books': 'Books',
        'Home': 'HomeGarden',
        'Sports': 'SportsAndOutdoors',
        'Beauty': 'Beauty',
        'Automotive': 'Automotive'
      };
      return categoryMap[category] || 'All';
    }

    // Auto-detect based on query
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('phone') || lowerQuery.includes('smartphone') || lowerQuery.includes('iphone') || lowerQuery.includes('samsung')) {
      return 'Electronics';
    }
    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer') || lowerQuery.includes('macbook')) {
      return 'Computers';
    }
    if (lowerQuery.includes('book') || lowerQuery.includes('novel')) {
      return 'Books';
    }
    if (lowerQuery.includes('shoes') || lowerQuery.includes('sneakers') || lowerQuery.includes('boots')) {
      return 'Fashion';
    }
    if (lowerQuery.includes('headphones') || lowerQuery.includes('speaker') || lowerQuery.includes('tv')) {
      return 'Electronics';
    }
    
    return 'All';
  }

  private applyFilters(products: RealProduct[], filters: SearchFilters): RealProduct[] {
    return products.filter(product => {
      // Price range filter
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }
      
      // Rating filter
      if (product.rating < filters.minRating) {
        return false;
      }
      
      // Stock filter
      if (filters.inStock && product.availability !== 'in_stock') {
        return false;
      }
      
      // Category filter
      if (filters.category && !product.category.toLowerCase().includes(filters.category.toLowerCase())) {
        return false;
      }
      
      // Brand filter
      if (filters.brand && !product.brand.toLowerCase().includes(filters.brand.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }

  private sortProducts(products: RealProduct[], sortBy: string): RealProduct[] {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price_low':
        return sorted.sort((a, b) => a.price - b.price);
      
      case 'price_high':
        return sorted.sort((a, b) => b.price - a.price);
      
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      
      case 'reviews':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      
      case 'relevance':
      default:
        // Amazon already returns products by relevance
        return sorted;
    }
  }

  async getProductDetails(asin: string): Promise<RealProduct | null> {
    try {
      const amazonProduct = await this.amazonAPI.getProductDetails(asin);
      if (!amazonProduct) {
        return null;
      }
      
      return this.convertAmazonProduct(amazonProduct);
    } catch (error) {
      console.error('Failed to get product details:', error);
      return null;
    }
  }
} 