import type { SearchResult, SearchFilters, Product, ProductVariant } from '@/types';

// Mock data for demonstration - in production, this would connect to real APIs
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'Latest iPhone with advanced features',
    images: ['https://example.com/iphone15pro.jpg'],
    category: 'Electronics',
    brand: 'Apple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: '1-amazon',
        productId: '1',
        title: 'iPhone 15 Pro 128GB',
        price: 999,
        originalPrice: 1099,
        currency: 'USD',
        platform: 'amazon',
        url: 'https://amazon.com/iphone15pro',
        availability: 'in_stock',
        rating: 4.5,
        reviewCount: 1250,
        seller: {
          id: 'amazon-official',
          name: 'Amazon.com',
          rating: 4.8,
          totalReviews: 50000,
          isVerified: true,
          platform: 'amazon'
        },
        trustScore: 95,
        lastUpdated: new Date().toISOString(),
        shipping: {
          cost: 0,
          currency: 'USD',
          estimatedDays: 2,
          isFree: true,
          methods: ['Prime']
        }
      },
      {
        id: '1-aliexpress',
        productId: '1',
        title: 'iPhone 15 Pro 128GB Global Version',
        price: 899,
        originalPrice: 999,
        currency: 'USD',
        platform: 'aliexpress',
        url: 'https://aliexpress.com/iphone15pro',
        availability: 'in_stock',
        rating: 4.3,
        reviewCount: 890,
        seller: {
          id: 'tech-seller-ali',
          name: 'TechGlobal Store',
          rating: 4.2,
          totalReviews: 15000,
          isVerified: true,
          platform: 'aliexpress'
        },
        trustScore: 78,
        lastUpdated: new Date().toISOString(),
        shipping: {
          cost: 15,
          currency: 'USD',
          estimatedDays: 12,
          isFree: false,
          methods: ['Standard Shipping']
        }
      }
    ]
  },
  {
    id: '2',
    name: 'MacBook Air M3',
    description: 'Powerful laptop with M3 chip',
    images: ['https://example.com/macbookair.jpg'],
    category: 'Electronics',
    brand: 'Apple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    variants: [
      {
        id: '2-amazon',
        productId: '2',
        title: 'MacBook Air 13" M3 8GB 256GB',
        price: 1299,
        originalPrice: 1399,
        currency: 'USD',
        platform: 'amazon',
        url: 'https://amazon.com/macbookair',
        availability: 'in_stock',
        rating: 4.7,
        reviewCount: 2100,
        seller: {
          id: 'amazon-official',
          name: 'Amazon.com',
          rating: 4.8,
          totalReviews: 50000,
          isVerified: true,
          platform: 'amazon'
        },
        trustScore: 98,
        lastUpdated: new Date().toISOString(),
        shipping: {
          cost: 0,
          currency: 'USD',
          estimatedDays: 1,
          isFree: true,
          methods: ['Prime']
        }
      },
      {
        id: '2-noon',
        productId: '2',
        title: 'Apple MacBook Air M3 13-inch',
        price: 1350,
        currency: 'USD',
        platform: 'noon',
        url: 'https://noon.com/macbookair',
        availability: 'in_stock',
        rating: 4.6,
        reviewCount: 456,
        seller: {
          id: 'noon-official',
          name: 'Noon.com',
          rating: 4.5,
          totalReviews: 12000,
          isVerified: true,
          platform: 'noon'
        },
        trustScore: 92,
        lastUpdated: new Date().toISOString(),
        shipping: {
          cost: 20,
          currency: 'USD',
          estimatedDays: 3,
          isFree: false,
          methods: ['Express']
        }
      }
    ]
  }
];

export async function searchProducts(query: string, filters: SearchFilters = {}): Promise<SearchResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Simple mock search logic
  let filteredProducts = mockProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.brand?.toLowerCase().includes(query.toLowerCase())
  );

  // Apply filters
  if (filters.categories?.length) {
    filteredProducts = filteredProducts.filter(product =>
      filters.categories!.includes(product.category)
    );
  }

  if (filters.brands?.length) {
    filteredProducts = filteredProducts.filter(product =>
      product.brand && filters.brands!.includes(product.brand)
    );
  }

  if (filters.platforms?.length) {
    filteredProducts = filteredProducts.map(product => ({
      ...product,
      variants: product.variants.filter(variant =>
        filters.platforms!.includes(variant.platform)
      )
    })).filter(product => product.variants.length > 0);
  }

  if (filters.minPrice || filters.maxPrice) {
    filteredProducts = filteredProducts.map(product => ({
      ...product,
      variants: product.variants.filter(variant => {
        const price = variant.price;
        return (!filters.minPrice || price >= filters.minPrice) &&
               (!filters.maxPrice || price <= filters.maxPrice);
      })
    })).filter(product => product.variants.length > 0);
  }

  if (filters.minRating) {
    filteredProducts = filteredProducts.map(product => ({
      ...product,
      variants: product.variants.filter(variant =>
        !variant.rating || variant.rating >= filters.minRating!
      )
    })).filter(product => product.variants.length > 0);
  }

  if (filters.inStockOnly) {
    filteredProducts = filteredProducts.map(product => ({
      ...product,
      variants: product.variants.filter(variant =>
        variant.availability === 'in_stock'
      )
    })).filter(product => product.variants.length > 0);
  }

  // Sort products
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price_low':
        filteredProducts.sort((a, b) => {
          const aMinPrice = Math.min(...a.variants.map(v => v.price));
          const bMinPrice = Math.min(...b.variants.map(v => v.price));
          return aMinPrice - bMinPrice;
        });
        break;
      case 'price_high':
        filteredProducts.sort((a, b) => {
          const aMaxPrice = Math.max(...a.variants.map(v => v.price));
          const bMaxPrice = Math.max(...b.variants.map(v => v.price));
          return bMaxPrice - aMaxPrice;
        });
        break;
      case 'rating':
        filteredProducts.sort((a, b) => {
          const aAvgRating = a.variants.reduce((sum, v) => sum + (v.rating || 0), 0) / a.variants.length;
          const bAvgRating = b.variants.reduce((sum, v) => sum + (v.rating || 0), 0) / b.variants.length;
          return bAvgRating - aAvgRating;
        });
        break;
      case 'newest':
        filteredProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }
  }

  // Pagination
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

  // Generate facets
  const allCategories = Array.from(new Set(mockProducts.map(p => p.category)));
  const allBrands = Array.from(new Set(mockProducts.map(p => p.brand).filter(Boolean)));
  const allPlatforms = Array.from(new Set(mockProducts.flatMap(p => p.variants.map(v => v.platform))));

  return {
    query,
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    facets: {
      categories: allCategories.map(cat => ({ value: cat, count: 0, label: cat })),
      brands: allBrands.map(brand => ({ value: brand!, count: 0, label: brand! })),
      platforms: allPlatforms.map(platform => ({ value: platform, count: 0, label: platform })),
      priceRanges: [
        { min: 0, max: 100, count: 0, label: 'Under $100' },
        { min: 100, max: 500, count: 0, label: '$100 - $500' },
        { min: 500, max: 1000, count: 0, label: '$500 - $1000' },
        { min: 1000, max: 99999, count: 0, label: 'Over $1000' }
      ]
    },
    searchTime: 0, // Will be calculated in the API route
  };
} 