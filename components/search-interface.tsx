'use client';

import React, { useState, useEffect } from 'react';
import { getRainforestAPI, RainforestProduct, RainforestSearchFilters, RainforestSearchResult } from '@/lib/rainforest-api';
import { popularCategories } from '@/lib/search-engine';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

// Using RainforestProduct from Rainforest API
type Product = RainforestProduct;

const PLATFORM_LOGOS: Record<string, string> = {
  'Amazon Egypt': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Amazon UAE': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Amazon Saudi Arabia': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Amazon United States': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Amazon United Kingdom': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
};

export default function SearchInterface() {
  const { user, selectedCountry } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [filters, setFilters] = useState<RainforestSearchFilters>({
    priceRange: { min: 0, max: 10000 },
    rating: 0,
    availability: [],
    shipping: [],
    brand: [],
    category: [],
    sortBy: 'relevance'
  });

  // Default to Egypt if no country is selected
  const currentCountry = selectedCountry || {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'ج.م',
    flag: '🇪🇬',
    platforms: []
  };

  async function searchRainforestProducts(query: string, page: number = 1): Promise<RainforestSearchResult> {
    if (!currentCountry) {
      console.log('❌ No country selected, using default Egypt');
      return {
        products: [],
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        filters: {
          priceRange: { min: 0, max: 10000 },
          rating: 0,
          availability: [],
          shipping: [],
          brand: [],
          category: [],
          sortBy: 'relevance'
        },
        searchTime: 0
      };
    }
    
    try {
      console.log(`🚀 Starting API search for "${query}" in ${currentCountry.name}`);
      console.log('🏳️ Country details:', currentCountry);
      console.log('📡 Making fetch request to /api/amazon-search');
      
      // Call the API route instead of calling Rainforest API directly
      const requestBody = {
        query,
        countryCode: currentCountry.code,
        filters,
        limit: 12
      };
      console.log('📤 Request body:', requestBody);

      const response = await fetch('/api/amazon-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📥 Response status:', response.status, response.statusText);
      console.log('📥 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        
        throw new Error(errorData.message || 'Search failed');
      }

      const result: RainforestSearchResult = await response.json();
      console.log('✅ API Response received:', result);
      
      console.log(`✅ Found ${result.products.length} products in ${result.searchTime}ms`);
      return result;
      
    } catch (error) {
      console.error('❌ API search error:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      
      return {
        products: [],
        totalResults: 0,
        currentPage: 1,
        totalPages: 0,
        filters: {
          priceRange: { min: 0, max: 10000 },
          rating: 0,
          availability: [],
          shipping: [],
          brand: [],
          category: [],
          sortBy: 'relevance'
        },
        searchTime: 0
      };
    }
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      console.log(`🔍 Searching for: "${searchQuery}"`);
      const searchResult = await searchRainforestProducts(searchQuery, 1);
      
      setResults(searchResult.products);
      setTotalResults(searchResult.totalResults);
      setSearchTime(searchResult.searchTime);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (results.length >= 30) return; // Max 30 results
    
    setLoading(true);
    try {
      const currentPage = Math.floor(results.length / 12) + 1;
      const searchResult = await searchRainforestProducts(query, currentPage + 1);
      
      setResults((prev: Product[]) => [...prev, ...searchResult.products]);
      setTotalResults((prev: number) => prev + searchResult.products.length);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (keywords: string[]) => {
    if (keywords.length === 0) return;
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    if (randomKeyword) {
      setQuery(randomKeyword);
      handleSearch(randomKeyword);
    }
  };

  const toggleFavorite = (product: Product) => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites({
        id: product.id,
        title: product.title,
        price: product.price,
        currency: product.currency,
        currencySymbol: product.currencySymbol,
        image: product.image,
        platform: product.platform,
        url: product.url,
        dateAdded: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Rainforest API Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-green-600">🌟</span>
            <div>
              <h4 className="font-medium text-green-900">Rainforest API - Real Amazon Data!</h4>
              <p className="text-sm text-green-700">
                This search uses <strong>Rainforest API</strong> for real-time Amazon product data across all your markets. 
                <strong> Add your Rainforest API key to enable live searches.</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Search Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Amazon products across regions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                />
                <button
                  onClick={() => handleSearch()}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  🔍
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              ⚙️ Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.priceRange.min}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.priceRange.max}
                    onChange={(e) => setFilters(prev => ({
                      ...prev,
                      priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
                <select
                  value={filters.rating}
                  onChange={(e) => setFilters(prev => ({ ...prev, rating: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value={0}>Any Rating</option>
                  <option value={3}>3+ Stars</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.availability.includes('in_stock')}
                    onChange={(e) => {
                      const newAvailability = e.target.checked 
                        ? [...filters.availability, 'in_stock']
                        : filters.availability.filter(a => a !== 'in_stock');
                      setFilters(prev => ({ ...prev, availability: newAvailability }));
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as RainforestSearchFilters['sortBy'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-6">
          {/* Category Sidebar */}
          <div className="hidden lg:block w-64">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="space-y-2">
                {popularCategories.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category.keywords)}
                    className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <span className="text-2xl">{category.icon}</span>
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            {totalResults > 0 && (
              <div className="mb-4 text-sm text-gray-600">
                Showing {results.length} results for "{query}" 
                {searchTime > 0 && <span className="ml-2">({searchTime}ms)</span>}
                {currentCountry && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {currentCountry.flag} Amazon {currentCountry.name}
                  </span>
                )}
              </div>
            )}

            {loading && results.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Searching Amazon with Rainforest API...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                    <div className="relative">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop';
                        }}
                      />
                      <button
                        onClick={() => toggleFavorite(product)}
                        className={`absolute top-3 right-3 p-2 rounded-full ${
                          isFavorite(product.id) 
                            ? 'bg-red-500 text-white' 
                            : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                        } transition-colors`}
                      >
                        ❤️
                      </button>
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.availability === 'in_stock' ? 'bg-green-100 text-green-800' :
                          product.availability === 'limited_stock' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {product.availability === 'in_stock' ? 'In Stock' : 
                           product.availability === 'limited_stock' ? 'Limited Stock' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={PLATFORM_LOGOS[product.platform.name] || product.platform.logo}
                          alt={product.platform.name}
                          className="w-5 h-5 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg';
                          }}
                        />
                        <span className="text-xs text-blue-600 font-medium">{product.platform.name}</span>
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center">
                          <span className="text-yellow-400">★</span>
                          <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
                        </div>
                        <span className="text-sm text-gray-500">({product.reviewCount.toLocaleString()})</span>
                      </div>

                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl font-bold text-green-600">
                          {product.currencySymbol}{product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {product.currencySymbol}{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-red-600 font-medium">{product.discount}</span>
                          </>
                        )}
                      </div>

                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-center block"
                      >
                        View on Amazon →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {results.length > 0 && results.length < 30 && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </div>
                  ) : (
                    'Load More Products'
                  )}
                </button>
              </div>
            )}

            {results.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Amazon Products</h3>
                <p className="text-gray-600 mb-6">
                  Search across Amazon marketplaces using the official Product Advertising API
                </p>
                <div className="text-sm text-gray-500">
                  Try searching for: "iPhone 15", "MacBook Pro", "Gaming headset", or "Running shoes"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 