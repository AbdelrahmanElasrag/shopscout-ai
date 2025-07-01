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
  
  const { user, selectedCountry } = useAuth();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedCountry) {
      onAuthRequired();
      return;
    }

    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      // Simulate API call - In production, this would call your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock search results based on user's country
      const mockProducts: Product[] = selectedCountry.platforms.map((platform, index) => ({
        id: `${platform.id}_${index}`,
        title: `${query} - Premium Edition`,
        price: Math.floor(Math.random() * 1000) + 50,
        originalPrice: Math.floor(Math.random() * 1200) + 150,
        currency: selectedCountry.currency,
        currencySymbol: selectedCountry.currencySymbol,
        image: `/products/sample-${index + 1}.jpg`,
        rating: 4.0 + Math.random(),
        reviewCount: Math.floor(Math.random() * 1000) + 100,
        platform,
        url: `${platform.searchUrl}${encodeURIComponent(query)}`,
        availability: ['in-stock', 'limited', 'out-of-stock'][Math.floor(Math.random() * 3)] as any
      }));

      setProducts(mockProducts.sort((a, b) => a.price - b.price));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-xl disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search AI'}
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
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            {isSearching ? 'Searching across platforms...' : `Results for "${query}"`}
          </h3>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">{product.platform.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getAvailabilityColor(product.availability)}`}>
                      {getAvailabilityText(product.availability)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-100 h-32 rounded-lg mb-3 flex items-center justify-center">
                    <span className="text-gray-400">Product Image</span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h4>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(product.price, product.currencySymbol)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice, product.currencySymbol)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(Math.floor(product.rating))}
                      {'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span className="text-sm text-gray-600">({product.reviewCount})</span>
                  </div>
                  
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View on {product.platform.name}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No products found. Try a different search term.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 