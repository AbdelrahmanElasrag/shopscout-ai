'use client';

import React, { useState, useEffect } from 'react';
import LiveProductScraper, { LiveProduct, LiveSearchResult } from '@/lib/live-scraper';
import { popularCategories } from '@/lib/search-engine';
import { useAuth } from '@/lib/auth-context';
import { useFavorites } from '@/lib/favorites-context';

// Using LiveProduct from live-scraper.ts  
type Product = LiveProduct;

// Using SearchFilters from real-search-engine.ts but with compatible naming
interface Filters {
  priceRange: { min: number; max: number };
  minRating: number;
  inStock: boolean;
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'reviews';
}

const PLATFORM_LOGOS: Record<string, string> = {
  'Amazon Egypt': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Noon Egypt': 'https://logos-world.net/wp-content/uploads/2021/08/Noon-Logo.png',
  'Jumia Egypt': 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Jumia_Logo.png',
  'Amazon UAE': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Noon UAE': 'https://logos-world.net/wp-content/uploads/2021/08/Noon-Logo.png',
  'Amazon Saudi': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Noon Saudi': 'https://logos-world.net/wp-content/uploads/2021/08/Noon-Logo.png',
  'Amazon US': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Walmart US': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Walmart_logo.svg',
  'Amazon UK': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'Argos UK': 'https://logos-world.net/wp-content/uploads/2020/12/Argos-Logo.png'
};

export default function SearchInterface() {
  const { user, selectedCountry } = useAuth();
  const { favorites, addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    priceRange: { min: 0, max: 10000 },
    minRating: 0,
    inStock: false,
    sortBy: 'relevance'
  });

  const currentCountry = selectedCountry;

  // Apply filters when filter settings change
  useEffect(() => {
    if (results.length > 0) {
      const filteredResults = applyFilters(results);
      if (filteredResults.length !== results.length) {
        setResults(filteredResults);
        setTotalResults(filteredResults.length);
      }
    }
  }, [filters]);

  const generateSearchURL = (platform: string, query: string): string => {
    const encodedQuery = encodeURIComponent(query);
    
    // Generate actual search URLs that work
    switch (platform) {
      case 'Amazon Egypt':
        return `https://www.amazon.eg/s?k=${encodedQuery}&ref=nb_sb_noss`;
      case 'Noon Egypt':
        return `https://www.noon.com/egypt-en/search/?q=${encodedQuery}`;
      case 'Jumia Egypt':
        return `https://www.jumia.com.eg/catalog/?q=${encodedQuery}`;
      case 'Amazon UAE':
        return `https://www.amazon.ae/s?k=${encodedQuery}&ref=nb_sb_noss`;
      case 'Noon UAE':
        return `https://www.noon.com/uae-en/search/?q=${encodedQuery}`;
      case 'Amazon Saudi':
        return `https://www.amazon.sa/s?k=${encodedQuery}&ref=nb_sb_noss`;
      case 'Noon Saudi':
        return `https://www.noon.com/saudi-en/search/?q=${encodedQuery}`;
      case 'Amazon US':
        return `https://www.amazon.com/s?k=${encodedQuery}&ref=nb_sb_noss`;
      case 'Walmart US':
        return `https://www.walmart.com/search?q=${encodedQuery}`;
      case 'Amazon UK':
        return `https://www.amazon.co.uk/s?k=${encodedQuery}&ref=nb_sb_noss`;
      case 'Argos UK':
        return `https://www.argos.co.uk/search/${encodedQuery}/`;
      default:
        return '#';
    }
  };

  async function searchLiveProducts(query: string, count: number): Promise<Product[]> {
    if (!currentCountry) return [];
    
    try {
      // API Keys Configuration - Replace YOUR_API_KEY with your actual key
      const apiKeys = {
        scrapingBee: 'YOUR_API_KEY_HERE', // Put your ScrapingBee API key here
        scraperApi: undefined,
        brightData: undefined,
        zenRows: undefined,
      };
      
      const liveScraper = new LiveProductScraper(currentCountry, apiKeys);
      const result = await liveScraper.searchLiveProducts(query, count);
      
      // Apply local filters to the live results
      let filteredProducts = result.products;
      
      if (filters.priceRange.min > 0 || filters.priceRange.max < 100000) {
        filteredProducts = filteredProducts.filter(product => 
          product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
        );
      }
      
      if (filters.minRating > 0) {
        filteredProducts = filteredProducts.filter(product => product.rating >= filters.minRating);
      }
      
      if (filters.inStock) {
        filteredProducts = filteredProducts.filter(product => product.availability === 'in_stock');
      }
      
      // Apply sorting
      switch (filters.sortBy) {
        case 'price_low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        default:
          // Keep intelligent ranking from live scraper
          break;
      }
      
      return filteredProducts;
    } catch (error) {
      console.error('Live product search error:', error);
      return [];
    }
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const liveProducts = await searchLiveProducts(searchQuery, 12);
      
      setResults(liveProducts);
      setTotalResults(liveProducts.length);
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
      const newProducts = await searchLiveProducts(query, 8);
      
      setResults(prev => [...prev, ...newProducts]);
      setTotalResults(prev => prev + newProducts.length);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (products: Product[]): Product[] => {
    return products
      .filter(product => {
        if (product.price < filters.priceRange.min || product.price > filters.priceRange.max) return false;
        if (product.rating < filters.minRating) return false;
        if (filters.inStock && product.availability !== 'in_stock') return false;
        return true;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case 'price_low': return a.price - b.price;
          case 'price_high': return b.price - a.price;
          case 'rating': return b.rating - a.rating;
          case 'reviews': return b.reviewCount - a.reviewCount;
          default: return 0; // relevance (keep original order)
        }
      });
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
                  placeholder="Search for products across multiple platforms..."
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
                    onChange={(e) => setFilters((prev: Filters) => ({
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
                  value={filters.minRating}
                  onChange={(e) => setFilters(prev => ({ ...prev, minRating: Number(e.target.value) }))}
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
                    checked={filters.inStock}
                    onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm">In Stock Only</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as Filters['sortBy'] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
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
                Showing {results.length} of {totalResults} results for "{query}"
                {currentCountry && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {currentCountry.flag} {currentCountry.name}
                  </span>
                )}
              </div>
            )}

            {loading && results.length === 0 ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Live scraping Amazon, Noon, Jumia...</p>
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
                            target.src = 'https://via.placeholder.com/20x20';
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
                          {product.price.toLocaleString()}{product.currencySymbol}
                        </span>
                        {product.originalPrice && (
                          <>
                            <span className="text-sm text-gray-500 line-through">
                              {product.originalPrice.toLocaleString()}{product.currencySymbol}
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
                        View on {product.platform.name} →
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
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Your Search</h3>
                <p className="text-gray-600 mb-6">
                  Search for any product and we'll find the best deals across multiple platforms
                </p>
                <div className="text-sm text-gray-500">
                  Try searching for: "iPhone 15", "MacBook Pro", "Nike shoes", or "Gaming laptop"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 