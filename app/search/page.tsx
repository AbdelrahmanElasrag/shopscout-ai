'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Star, ExternalLink, Shield, Truck } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import type { SearchResult, SearchFilters } from '@/types';

async function searchProducts(query: string, filters: SearchFilters = {}): Promise<SearchResult> {
  const params = new URLSearchParams({
    q: query,
    page: filters.page?.toString() || '1',
    limit: filters.limit?.toString() || '20',
    ...(filters.sortBy && { sortBy: filters.sortBy }),
    ...(filters.platforms && { platforms: filters.platforms.join(',') }),
    ...(filters.minPrice && { minPrice: filters.minPrice.toString() }),
    ...(filters.maxPrice && { maxPrice: filters.maxPrice.toString() }),
    ...(filters.categories && { categories: filters.categories.join(',') }),
    ...(filters.brands && { brands: filters.brands.join(',') }),
    ...(filters.minRating && { minRating: filters.minRating.toString() }),
    ...(filters.inStockOnly && { inStockOnly: 'true' }),
  });

  const response = await fetch(`/api/search?${params}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Search failed');
  }
  
  return data.data;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'relevance',
    page: 1,
    limit: 20,
  });

  const { data: searchResult, isLoading, error } = useQuery({
    queryKey: ['search', query, filters],
    queryFn: () => searchProducts(query, filters),
    enabled: !!query,
  });

  const platformColors = {
    amazon: 'bg-orange-50 text-orange-700 ring-orange-600/20',
    aliexpress: 'bg-red-50 text-red-700 ring-red-600/20',
    noon: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  };

  const trustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!query) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">No search query provided</h1>
            <p className="text-gray-600">Please enter a search term to find products.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Search results for "{query}"
          </h1>
          {searchResult && (
            <p className="text-gray-600">
              Found {searchResult.totalCount} products in {searchResult.searchTime}ms
            </p>
          )}
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="relevance">Most Relevant</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )}

          {searchResult?.products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Product Image */}
                <div className="lg:w-48 lg:h-48 w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <img
                    src={product.images[0] || '/placeholder-product.png'}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-product.png';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  
                  {/* Variants */}
                  <div className="space-y-4">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ring-1 ring-inset ${platformColors[variant.platform]}`}>
                                {variant.platform.charAt(0).toUpperCase() + variant.platform.slice(1)}
                              </span>
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <span className={`text-sm font-medium ${trustScoreColor(variant.trustScore)}`}>
                                  {variant.trustScore}% Trust Score
                                </span>
                              </div>
                            </div>
                            
                            <h4 className="font-medium text-gray-900 mb-1">{variant.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">by {variant.seller.name}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {variant.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{variant.rating}</span>
                                  <span>({variant.reviewCount} reviews)</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Truck className="w-4 h-4" />
                                <span>
                                  {variant.shipping?.isFree ? 'Free shipping' : `$${variant.shipping?.cost} shipping`} 
                                  · {variant.shipping?.estimatedDays} days
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="mb-2">
                              <span className="text-2xl font-bold text-gray-900">
                                {formatPrice(variant.price)}
                              </span>
                              {variant.originalPrice && variant.originalPrice > variant.price && (
                                <div className="text-sm">
                                  <span className="text-gray-500 line-through">
                                    {formatPrice(variant.originalPrice)}
                                  </span>
                                  <span className="text-green-600 ml-2">
                                    {calculateDiscount(variant.originalPrice, variant.price)}% off
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            <Button
                              className="w-full sm:w-auto"
                              onClick={() => window.open(variant.url, '_blank')}
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Deal
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {searchResult?.products.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No products found</h2>
              <p className="text-gray-600">Try adjusting your search terms or filters.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 