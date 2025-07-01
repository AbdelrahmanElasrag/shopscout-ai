'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const popularSearches = [
    'iPhone 15 Pro',
    'MacBook Air M3',
    'Nike Air Jordan',
    'Sony WH-1000XM5',
    'Samsung Galaxy S24',
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
              Find the <span className="text-yellow-300">Best Deals</span>
              <br />
              Across All Platforms
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              AI-powered price comparison that searches Amazon, AliExpress, and Noon 
              to find you the most reliable and cheapest products in seconds.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-8 animate-scale-in">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" />
                  <Sparkles className="h-4 w-4 text-yellow-400 ml-2" />
                </div>
                <input
                  type="text"
                  placeholder="What are you looking for? (e.g., iPhone 15, gaming laptop, wireless earbuds)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-16 pr-32 py-4 text-lg bg-white/95 backdrop-blur-sm border-0 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50 placeholder-gray-500"
                />
                <Button
                  type="submit"
                  size="lg"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-xl shadow-lg"
                >
                  Search AI
                </Button>
              </div>
            </form>
          </div>

          <div className="mb-12 animate-fade-in">
            <p className="text-blue-100 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search) => (
                <button
                  key={search}
                  onClick={() => {
                    setSearchQuery(search);
                    router.push(`/search?q=${encodeURIComponent(search)}`);
                  }}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200 border border-white/30"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-scale-in">
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <div className="p-3 bg-white/20 rounded-full">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">AI-Powered</h3>
                <p className="text-sm text-blue-100">Smart product matching</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <div className="p-3 bg-white/20 rounded-full">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Real-time Prices</h3>
                <p className="text-sm text-blue-100">Always up-to-date</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center space-x-3 text-white/90">
              <div className="p-3 bg-white/20 rounded-full">
                <Shield className="w-6 h-6" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Verified Sellers</h3>
                <p className="text-sm text-blue-100">Trusted & authentic</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 