interface ProductCategory {
  keywords: string[];
  images: string[];
  basePrice: { min: number; max: number };
  variations: string[];
}

interface SearchResult {
  query: string;
  category: string;
  relevantImages: string[];
  basePrice: { min: number; max: number };
  productVariations: string[];
}

export const productCategories: Record<string, ProductCategory> = {
  smartphone: {
    keywords: ['iphone', 'samsung', 'phone', 'mobile', 'android', 'ios', 'smartphone', 'galaxy', 'pixel', 'oneplus'],
    images: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 200, max: 1500 },
    variations: ['Pro', 'Pro Max', 'Plus', 'Mini', 'Standard', 'Ultra']
  },
  laptop: {
    keywords: ['macbook', 'laptop', 'computer', 'dell', 'hp', 'lenovo', 'surface', 'notebook', 'gaming laptop'],
    images: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 500, max: 3000 },
    variations: ['Air', 'Pro', 'Gaming', 'Business', 'Ultrabook', 'Workstation']
  },
  headphones: {
    keywords: ['headphones', 'earbuds', 'airpods', 'sony', 'bose', 'audio', 'wireless', 'bluetooth'],
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1545127398-14699f92334b?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1608156639585-b3ad7189e2d6?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 50, max: 500 },
    variations: ['Pro', 'Max', 'Studio', 'Wireless', 'Gaming', 'Noise Cancelling']
  },
  watch: {
    keywords: ['watch', 'smartwatch', 'apple watch', 'rolex', 'time', 'wrist', 'fitness tracker'],
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1579586337278-3f436f25d4d6?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1594534475808-b18fc33b045e?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 100, max: 1000 },
    variations: ['Sport', 'Classic', 'Digital', 'Analog', 'Fitness', 'Luxury']
  },
  shoes: {
    keywords: ['shoes', 'sneakers', 'nike', 'adidas', 'jordan', 'running', 'basketball', 'boots'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 80, max: 400 },
    variations: ['Air', 'Max', 'Pro', 'Sport', 'Classic', 'Limited Edition']
  },
  clothing: {
    keywords: ['shirt', 'dress', 'pants', 'jacket', 'hoodie', 'clothes', 'fashion', 'clothing'],
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506629905607-197d97873b77?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544348817-5f2cf14b8e8a?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 30, max: 300 },
    variations: ['Classic', 'Premium', 'Designer', 'Casual', 'Formal', 'Limited']
  },
  home: {
    keywords: ['home', 'kitchen', 'furniture', 'chair', 'table', 'decor', 'appliances'],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?w=300&h=300&fit=crop'
    ],
    basePrice: { min: 50, max: 800 },
    variations: ['Modern', 'Classic', 'Vintage', 'Minimalist', 'Luxury', 'Eco-Friendly']
  }
};

export function analyzeSearchQuery(query: string): SearchResult {
  const lowerQuery = query.toLowerCase().trim();
  
  // Find matching category
  for (const [categoryName, category] of Object.entries(productCategories)) {
    for (const keyword of category.keywords) {
      if (lowerQuery.includes(keyword)) {
        return {
          query,
          category: categoryName,
          relevantImages: category.images,
          basePrice: category.basePrice,
          productVariations: category.variations
        };
      }
    }
  }
  
  // Default fallback for unknown queries
  return {
    query,
    category: 'general',
    relevantImages: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    ],
    basePrice: { min: 50, max: 500 },
    productVariations: ['Standard', 'Premium', 'Pro', 'Deluxe', 'Ultimate']
  };
}

export function generateRelevantProductTitle(query: string, variation: string, brandSuggestions: string[]): string {
  const brand = brandSuggestions[Math.floor(Math.random() * brandSuggestions.length)];
  return `${brand} ${query} ${variation}`;
}

export const brandsByCategory: Record<string, string[]> = {
  smartphone: ['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'],
  laptop: ['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'Microsoft'],
  headphones: ['Sony', 'Bose', 'Apple', 'Sennheiser', 'Audio-Technica', 'Beats'],
  watch: ['Apple', 'Rolex', 'Casio', 'Seiko', 'Omega', 'Fossil'],
  shoes: ['Nike', 'Adidas', 'Jordan', 'Puma', 'New Balance', 'Vans'],
  clothing: ['Zara', 'H&M', 'Nike', 'Adidas', 'Tommy Hilfiger', 'Calvin Klein'],
  home: ['IKEA', 'West Elm', 'CB2', 'Pottery Barn', 'Wayfair', 'Ashley'],
  general: ['Premium', 'Elite', 'Professional', 'Advanced', 'Superior', 'Ultimate']
}; 