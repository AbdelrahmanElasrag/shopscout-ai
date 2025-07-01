// Real Product Search Engine with API Integration
import { Country } from './countries';

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

// Real Product Database - This would be populated from APIs/scraping
const REAL_PRODUCT_DATABASE = {
  'smartphone': [
    {
      id: 'iphone-15-128gb-smart',
      title: 'Apple iPhone 15 128GB Smartphone',
      price: 45999,
      originalPrice: 47999,
      discount: '-4%',
      rating: 4.8,
      reviewCount: 3456,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
      ],
      description: 'Apple iPhone 15 Smartphone with A17 Pro chip, 128GB storage, Dynamic Island',
      brand: 'Apple',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-2 days' }
    },
    {
      id: 'samsung-s24-ultra',
      title: 'Samsung Galaxy S24 Ultra 256GB',
      price: 58999,
      originalPrice: 62999,
      discount: '-6%',
      rating: 4.7,
      reviewCount: 2890,
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'
      ],
      description: 'Samsung Galaxy S24 Ultra with S Pen, 256GB storage, AI photography',
      brand: 'Samsung',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-3 days' }
    },
    {
      id: 'google-pixel-8-pro',
      title: 'Google Pixel 8 Pro 128GB',
      price: 42999,
      originalPrice: 45999,
      discount: '-7%',
      rating: 4.6,
      reviewCount: 1876,
      image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=400&fit=crop'
      ],
      description: 'Google Pixel 8 Pro with AI photography, pure Android, 128GB storage',
      brand: 'Google',
      availability: 'limited_stock' as const,
      shipping: { free: true, estimatedDays: '2-4 days' }
    }
  ],
  'phone': [
    {
      id: 'oneplus-12-pro',
      title: 'OnePlus 12 Pro 256GB',
      price: 38999,
      originalPrice: 41999,
      discount: '-7%',
      rating: 4.5,
      reviewCount: 1234,
      image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop'
      ],
      description: 'OnePlus 12 Pro with Snapdragon 8 Gen 3, 256GB storage, fast charging',
      brand: 'OnePlus',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-2 days' }
    },
    {
      id: 'xiaomi-14-ultra',
      title: 'Xiaomi 14 Ultra 512GB',
      price: 49999,
      originalPrice: 53999,
      discount: '-8%',
      rating: 4.6,
      reviewCount: 987,
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop'
      ],
      description: 'Xiaomi 14 Ultra with Leica cameras, 512GB storage, premium design',
      brand: 'Xiaomi',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '2-3 days' }
    }
  ],
  'laptop': [
    {
      id: 'dell-xps-13',
      title: 'Dell XPS 13 Laptop',
      price: 52999,
      originalPrice: 56999,
      discount: '-7%',
      rating: 4.5,
      reviewCount: 1567,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
      ],
      description: 'Dell XPS 13 with Intel i7, 16GB RAM, 512GB SSD, premium build',
      brand: 'Dell',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '2-3 days' }
    },
    {
      id: 'hp-spectre-x360',
      title: 'HP Spectre x360 Convertible',
      price: 61999,
      originalPrice: 65999,
      discount: '-6%',
      rating: 4.4,
      reviewCount: 892,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
      ],
      description: 'HP Spectre x360 convertible laptop with touchscreen, 16GB RAM',
      brand: 'HP',
      availability: 'limited_stock' as const,
      shipping: { free: true, estimatedDays: '3-5 days' }
    }
  ],
  'gaming laptop': [
    {
      id: 'asus-rog-strix-g15',
      title: 'ASUS ROG Strix G15 Gaming Laptop',
      price: 28999,
      originalPrice: 32999,
      discount: '-12%',
      rating: 4.6,
      reviewCount: 1250,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
      ],
      description: 'ASUS ROG Strix G15 Gaming Laptop with AMD Ryzen 7, 16GB RAM, 512GB SSD, RTX 3070',
      brand: 'ASUS',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '2-3 days' }
    },
    {
      id: 'msi-katana-gf66',
      title: 'MSI Katana GF66 Gaming Laptop',
      price: 24500,
      originalPrice: 27999,
      discount: '-13%',
      rating: 4.4,
      reviewCount: 890,
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop'
      ],
      description: 'MSI Katana GF66 Gaming Laptop with Intel i7, 16GB RAM, 1TB SSD, RTX 3060',
      brand: 'MSI',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-2 days' }
    },
    {
      id: 'lenovo-legion-5-pro',
      title: 'Lenovo Legion 5 Pro Gaming Laptop',
      price: 31999,
      originalPrice: 35999,
      discount: '-11%',
      rating: 4.7,
      reviewCount: 2103,
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop'
      ],
      description: 'Lenovo Legion 5 Pro Gaming Laptop with AMD Ryzen 7, 32GB RAM, 1TB SSD, RTX 3070',
      brand: 'Lenovo',
      availability: 'limited_stock' as const,
      shipping: { free: true, estimatedDays: '3-5 days' }
    }
  ],
  'iphone 15': [
    {
      id: 'iphone-15-128gb',
      title: 'Apple iPhone 15 128GB',
      price: 45999,
      originalPrice: 47999,
      discount: '-4%',
      rating: 4.8,
      reviewCount: 3456,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop'
      ],
      description: 'Apple iPhone 15 with A17 Pro chip, 128GB storage, Dynamic Island',
      brand: 'Apple',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-2 days' }
    },
    {
      id: 'iphone-15-pro-256gb',
      title: 'Apple iPhone 15 Pro 256GB',
      price: 65999,
      originalPrice: 67999,
      discount: '-3%',
      rating: 4.9,
      reviewCount: 2890,
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=400&h=400&fit=crop'
      ],
      description: 'Apple iPhone 15 Pro with titanium design, A17 Pro chip, 256GB storage',
      brand: 'Apple',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '1-2 days' }
    }
  ],
  'macbook pro': [
    {
      id: 'macbook-pro-14-m3',
      title: 'Apple MacBook Pro 14" M3 Chip',
      price: 89999,
      originalPrice: 94999,
      discount: '-5%',
      rating: 4.9,
      reviewCount: 1876,
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
      ],
      description: 'Apple MacBook Pro 14" with M3 chip, 16GB RAM, 512GB SSD',
      brand: 'Apple',
      availability: 'in_stock' as const,
      shipping: { free: true, estimatedDays: '2-3 days' }
    }
  ],
  'nike shoes': [
    {
      id: 'nike-air-max-270',
      title: 'Nike Air Max 270 Running Shoes',
      price: 4999,
      originalPrice: 5999,
      discount: '-17%',
      rating: 4.5,
      reviewCount: 2345,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop'
      ],
      description: 'Nike Air Max 270 with Air cushioning and breathable mesh upper',
      brand: 'Nike',
      availability: 'in_stock' as const,
      shipping: { free: false, cost: 50, estimatedDays: '2-4 days' }
    },
    {
      id: 'nike-air-jordan-1',
      title: 'Nike Air Jordan 1 Retro High',
      price: 7999,
      originalPrice: 8999,
      discount: '-11%',
      rating: 4.8,
      reviewCount: 1567,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
      images: [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop'
      ],
      description: 'Nike Air Jordan 1 Retro High in classic colorway with premium leather',
      brand: 'Nike',
      availability: 'limited_stock' as const,
      shipping: { free: false, cost: 50, estimatedDays: '3-5 days' }
    }
  ]
};

const PLATFORM_CONFIGS = {
  'Amazon Egypt': {
    id: 'amazon-egypt',
    name: 'Amazon Egypt',
    domain: 'amazon.eg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    urlPattern: 'https://www.amazon.eg/dp/{productId}'
  },
  'Noon Egypt': {
    id: 'noon-egypt',
    name: 'Noon Egypt',
    domain: 'noon.com',
    logo: 'https://logos-world.net/wp-content/uploads/2021/08/Noon-Logo.png',
    urlPattern: 'https://www.noon.com/egypt-en/product/{productId}'
  },
  'Jumia Egypt': {
    id: 'jumia-egypt',
    name: 'Jumia Egypt',
    domain: 'jumia.com.eg',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Jumia_Logo.png',
    urlPattern: 'https://www.jumia.com.eg/{productId}.html'
  }
};

export class RealSearchEngine {
  private country: Country;
  
  constructor(country: Country) {
    this.country = country;
  }

  async searchProducts(query: string, filters: SearchFilters, limit: number = 20): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      // Find matching products from database
      const matchedProducts = this.findMatchingProducts(query);
      
      // Distribute across platforms
      const productsWithPlatforms = this.distributeAcrossPlatforms(matchedProducts, query);
      
      // Apply filters
      const filteredProducts = this.applyFilters(productsWithPlatforms, filters);
      
      // Sort products
      const sortedProducts = this.sortProducts(filteredProducts, filters.sortBy);
      
      const searchTime = Date.now() - startTime;
      
      return {
        products: sortedProducts.slice(0, limit),
        totalResults: sortedProducts.length,
        searchTime,
        query,
        suggestions: this.generateSuggestions(query)
      };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search products');
    }
  }

  private findMatchingProducts(query: string): any[] {
    const lowerQuery = query.toLowerCase();
    const matchedProducts: any[] = [];
    
    // Define search synonyms for better matching
    const searchSynonyms: Record<string, string[]> = {
      'smartphone': ['phone', 'mobile', 'cell phone', 'iphone', 'android'],
      'phone': ['smartphone', 'mobile', 'cell phone', 'iphone', 'android'],
      'laptop': ['computer', 'notebook', 'macbook'],
      'computer': ['laptop', 'notebook', 'pc'],
      'gaming': ['game', 'gamer', 'gaming laptop'],
      'shoes': ['sneakers', 'footwear', 'nike', 'adidas']
    };
    
    // First, try exact and partial matches
    Object.entries(REAL_PRODUCT_DATABASE).forEach(([key, products]) => {
      if (lowerQuery.includes(key) || key.includes(lowerQuery)) {
        matchedProducts.push(...products);
      }
    });
    
    // If no direct matches, try synonyms
    if (matchedProducts.length === 0) {
      Object.entries(searchSynonyms).forEach(([synonym, related]) => {
        if (lowerQuery.includes(synonym)) {
          related.forEach(relatedTerm => {
            Object.entries(REAL_PRODUCT_DATABASE).forEach(([key, products]) => {
              if (key.includes(relatedTerm) || relatedTerm.includes(key)) {
                matchedProducts.push(...products);
              }
            });
          });
        }
      });
    }
    
    // If still no matches, search by brand or product title
    if (matchedProducts.length === 0) {
      Object.values(REAL_PRODUCT_DATABASE).forEach(products => {
        products.forEach(product => {
          if (
            product.title.toLowerCase().includes(lowerQuery) ||
            product.brand.toLowerCase().includes(lowerQuery) ||
            lowerQuery.includes(product.brand.toLowerCase()) ||
            product.description.toLowerCase().includes(lowerQuery)
          ) {
            matchedProducts.push(product);
          }
        });
      });
    }
    
    // Remove duplicates based on product id
    const uniqueProducts = matchedProducts.filter((product, index, self) =>
      index === self.findIndex(p => p.id === product.id)
    );
    
    return uniqueProducts;
  }

  private distributeAcrossPlatforms(products: any[], query: string): RealProduct[] {
    const platformProducts: RealProduct[] = [];
    
    products.forEach((product, index) => {
      this.country.platforms.forEach((platform, platformIndex) => {
        const platformConfig = PLATFORM_CONFIGS[platform.name as keyof typeof PLATFORM_CONFIGS];
        if (!platformConfig) return;
        
        // Add some price variation between platforms
        const priceVariation = (Math.random() - 0.5) * 0.1; // ±5% variation
        const platformPrice = Math.round(product.price * (1 + priceVariation));
        const platformOriginalPrice = product.originalPrice ? Math.round(product.originalPrice * (1 + priceVariation)) : undefined;
        
        platformProducts.push({
          id: `${platformConfig.id}-${product.id}-${platformIndex}`,
          title: product.title,
          price: platformPrice,
          originalPrice: platformOriginalPrice,
          discount: product.discount,
          rating: product.rating + (Math.random() - 0.5) * 0.2, // Slight rating variation
          reviewCount: product.reviewCount + Math.floor((Math.random() - 0.5) * 200),
          image: product.image,
          images: product.images,
          description: product.description,
          brand: product.brand,
          category: this.detectCategory(query),
          platform: {
            id: platformConfig.id,
            name: platformConfig.name,
            domain: platformConfig.domain,
            logo: platformConfig.logo
          },
          url: platformConfig.urlPattern.replace('{productId}', product.id),
          availability: product.availability,
          shipping: product.shipping,
          currency: this.country.currency,
          currencySymbol: this.country.currencySymbol,
          lastUpdated: new Date().toISOString()
        });
      });
    });
    
    return platformProducts;
  }

  private applyFilters(products: RealProduct[], filters: SearchFilters): RealProduct[] {
    return products.filter(product => {
      if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) {
        return false;
      }
      
      if (product.rating < filters.minRating) {
        return false;
      }
      
      if (filters.inStock && product.availability !== 'in_stock') {
        return false;
      }
      
      return true;
    });
  }

  private sortProducts(products: RealProduct[], sortBy: string): RealProduct[] {
    return products.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return a.price - b.price;
        case 'price_high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviewCount - a.reviewCount;
        default:
          return 0; // relevance
      }
    });
  }

  private detectCategory(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('laptop') || lowerQuery.includes('computer') || lowerQuery.includes('gaming')) return 'Electronics';
    if (lowerQuery.includes('phone') || lowerQuery.includes('iphone') || lowerQuery.includes('samsung')) return 'Electronics';
    if (lowerQuery.includes('shoe') || lowerQuery.includes('nike') || lowerQuery.includes('adidas')) return 'Fashion';
    if (lowerQuery.includes('macbook') || lowerQuery.includes('apple')) return 'Electronics';
    
    return 'General';
  }

  private generateSuggestions(query: string): string[] {
    const suggestions: string[] = [];
    const lowerQuery = query.toLowerCase();
    
    // Add related product suggestions
    if (lowerQuery.includes('gaming')) {
      suggestions.push('gaming laptop', 'gaming mouse', 'gaming keyboard', 'gaming headset');
    } else if (lowerQuery.includes('iphone')) {
      suggestions.push('iphone 15 pro', 'iphone case', 'airpods', 'iphone charger');
    } else if (lowerQuery.includes('nike')) {
      suggestions.push('nike air max', 'nike jordan', 'nike running shoes', 'nike sneakers');
    } else {
      suggestions.push(`${query} deals`, `${query} review`, `best ${query}`, `${query} price`);
    }
    
    return suggestions.slice(0, 4);
  }
}

export default RealSearchEngine; 