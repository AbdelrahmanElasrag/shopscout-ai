'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { Platform } from '../lib/countries';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  currency: string;
  currencySymbol: string;
  image: string;
  rating: number;
  reviewCount: number;
  platform: Platform;
  url: string;
  availability: 'in-stock' | 'out-of-stock' | 'limited';
}

interface SearchInterfaceProps {
  onAuthRequired: () => void;
}

export default function SearchInterface({ onAuthRequired }: SearchInterfaceProps) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  
  const { user, selectedCountry } = useAuth();

  // Array of product images for realistic appearance
  const productImages = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop'
  ];

  const generateProductUrl = (platform: Platform, productId: string, productTitle: string) => {
    // Generate realistic product URLs for each platform
    const slugTitle = productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    
    switch (platform.id.split('_')[0]) {
      case 'amazon':
        return `${platform.searchUrl.replace('/s?k=', '')}/${slugTitle}/dp/${productId}`;
      case 'noon':
        return `${platform.domain}/product/${productId}/${slugTitle}`;
      case 'jumia':
        return `${platform.domain}/product/${productId}/${slugTitle}`;
      case 'walmart':
        return `${platform.domain}/ip/${slugTitle}/${productId}`;
      case 'target':
        return `${platform.domain}/p/${slugTitle}/-/A-${productId}`;
      case 'carrefour':
        return `${platform.domain}/product/${productId}`;
      case 'extra':
        return `${platform.domain}/en/product/${productId}`;
      case 'argos':
        return `${platform.domain}/product/${productId}`;
      default:
        return `${platform.searchUrl}${encodeURIComponent(productTitle)}`;
    }
  };

  const getProductImage = (index: number): string => {
    return productImages[index % productImages.length] || productImages[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
  };

  const generateMockProducts = (startIndex: number = 0, count: number = 6): Product[] => {
    if (!selectedCountry) return [];

    return selectedCountry.platforms.flatMap((platform, platformIndex) => 
      Array.from({ length: count / selectedCountry.platforms.length }, (_, index) => {
        const productIndex = startIndex + platformIndex * (count / selectedCountry.platforms.length) + index;
        const productId = `PROD${String(productIndex + 1000).padStart(8, '0')}`;
        const productTitle = `${query} - ${['Pro', 'Premium', 'Deluxe', 'Ultimate', 'Advanced'][productIndex % 5]} Edition`;
        
        return {
          id: `${platform.id}_${productId}`,
          title: productTitle,
          price: Math.floor(Math.random() * 1000) + 50,
          originalPrice: Math.random() > 0.3 ? Math.floor(Math.random() * 1200) + 150 : undefined,
          currency: selectedCountry.currency,
          currencySymbol: selectedCountry.currencySymbol,
          image: getProductImage(productIndex),
          rating: 3.5 + Math.random() * 1.5,
          reviewCount: Math.floor(Math.random() * 2000) + 100,
          platform,
          url: generateProductUrl(platform, productId, productTitle),
          availability: ['in-stock', 'in-stock', 'in-stock', 'limited', 'out-of-stock'][Math.floor(Math.random() * 5)] as 'in-stock' | 'out-of-stock' | 'limited'
        };
      })
    ).sort((a, b) => a.price - b.price);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedCountry) {
      onAuthRequired();
      return;
    }

    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setProducts([]);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newProducts = generateMockProducts(0, 9); // Start with 9 products
      setProducts(newProducts);
      setCanLoadMore(true);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLoadMore = async () => {
    if (!canLoadMore || isLoadingMore) return;

    setIsLoadingMore(true);
    
    try {
      // Simulate API call for more products
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const moreProducts = generateMockProducts(products.length, 6);
      setProducts(prev => [...prev, ...moreProducts]);
      
      // Simulate that we can only load more if we have less than 30 products
      if (products.length + moreProducts.length >= 30) {
        setCanLoadMore(false);
      }
    } catch (error) {
      console.error('Load more failed:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const formatPrice = (price: number, symbol: string) => {
    return `${symbol}${price.toLocaleString()}`;
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'text-green-600 bg-green-50';
      case 'limited': return 'text-yellow-600 bg-yellow-50';
      case 'out-of-stock': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in-stock': return 'In Stock';
      case 'limited': return 'Limited Stock';
      case 'out-of-stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search products${selectedCountry ? ` in ${selectedCountry.name}` : ''}...`}
            className="w-full pl-6 pr-32 py-4 text-lg bg-white/95 border-0 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-xl disabled:opacity-50 transition-all"
          >
            {isSearching ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                <span>Searching...</span>
              </div>
            ) : (
              'Search AI'
            )}
          </button>
        </div>
        
        {user && selectedCountry && (
          <div className="mt-4 text-center">
            <p className="text-blue-100">
              🔍 Searching in {selectedCountry.flag} {selectedCountry.name} • Currency: {selectedCountry.currency}
            </p>
            <div className="flex justify-center gap-2 mt-2">
              {selectedCountry.platforms.map((platform) => (
                <span key={platform.id} className="px-3 py-1 bg-white/20 rounded-full text-sm text-white">
                  {platform.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </form>

      {/* Search Results */}
      {hasSearched && (
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {isSearching ? 'Searching across platforms...' : `Results for "${query}"`}
            </h3>
            {!isSearching && products.length > 0 && (
              <div className="text-sm text-gray-500">
                {products.length} products found
              </div>
            )}
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-6 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-gray-600 flex items-center space-x-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span>{product.platform.name}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getAvailabilityColor(product.availability)}`}>
                        {getAvailabilityText(product.availability)}
                      </span>
                    </div>
                    
                    <div className="relative overflow-hidden rounded-lg mb-3">
                      <img 
                        src={product.image} 
                        alt={product.title}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                        }}
                      />
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm leading-relaxed">
                      {product.title}
                    </h4>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-green-600">
                        {formatPrice(product.price, product.currencySymbol)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(product.originalPrice, product.currencySymbol)}
                          </span>
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (
                          <span key={i}>
                            {i < Math.floor(product.rating) ? '★' : i < product.rating ? '★' : '☆'}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {product.rating.toFixed(1)} ({product.reviewCount.toLocaleString()})
                      </span>
                    </div>
                    
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium"
                    >
                      View on {product.platform.name} →
                    </a>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {canLoadMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 font-medium"
                  >
                    {isLoadingMore ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading More...</span>
                      </div>
                    ) : (
                      'Load More Products'
                    )}
                  </button>
                  <p className="text-gray-500 text-sm mt-2">
                    Showing {products.length} products
                  </p>
                </div>
              )}

              {!canLoadMore && products.length >= 15 && (
                <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    🎉 You've seen all available products for "{query}"
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try a different search term to find more products
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 text-lg mb-2">No products found for "{query}"</p>
              <p className="text-gray-400">Try searching for different keywords or check your spelling</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 