'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import AuthModal from '../components/auth-modal';
import SearchInterface from '../components/search-interface';

export default function HomePage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, selectedCountry, signOut } = useAuth();

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopScout AI
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && selectedCountry && (
              <div className="flex items-center space-x-3 text-sm">
                <span className="text-gray-600">
                  {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.currency})
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">Hi, {user.name}!</span>
              </div>
            )}
            
            {user ? (
              <button
                onClick={signOut}
                className="text-gray-700 hover:text-red-600 font-medium"
              >
                Sign Out
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find the <span className="text-yellow-300">Best Deals</span><br />
            Across All Platforms
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            AI-powered price comparison that searches your local platforms 
            {selectedCountry ? ` in ${selectedCountry.name}` : ''} 
            to find you the most reliable and cheapest products in seconds.
          </p>
          
          {/* Main Search Interface */}
          <SearchInterface onAuthRequired={openAuthModal} />

          {/* Popular Searches - Only show if user is not logged in */}
          {!user && (
            <div className="mb-12">
              <p className="text-blue-100 mb-4">Popular searches:</p>
              <div className="flex flex-wrap justify-center gap-3">
                {['iPhone 15 Pro', 'MacBook Air M3', 'Nike Air Jordan', 'Sony WH-1000XM5'].map((search) => (
                  <button
                    key={search}
                    onClick={openAuthModal}
                    className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Features - Only show if user is not logged in */}
          {!user && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="p-3 bg-white/20 rounded-full">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">AI-Powered</h3>
                  <p className="text-sm text-blue-100">Smart product matching</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="p-3 bg-white/20 rounded-full">
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Global & Local</h3>
                  <p className="text-sm text-blue-100">Regional platforms & currency</p>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-3 text-white/90">
                <div className="p-3 bg-white/20 rounded-full">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold">Verified Sellers</h3>
                  <p className="text-sm text-blue-100">Trusted & authentic</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Platform Showcase Section - Only show if user is logged in */}
      {user && selectedCountry && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Shopping in {selectedCountry.flag} {selectedCountry.name}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We search across {selectedCountry.platforms.length} trusted platforms to find you the best deals in {selectedCountry.currency}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {selectedCountry.platforms.map((platform) => (
                <div key={platform.id} className="p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl">🛒</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{platform.domain}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs ${
                    platform.category === 'global' ? 'bg-blue-100 text-blue-800' :
                    platform.category === 'regional' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {platform.category}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section - Only show if user is not logged in */}
      {!user && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose ShopScout AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Multi-Platform Search</h3>
                <p className="text-gray-600">Search local and international platforms simultaneously</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Local Currency</h3>
                <p className="text-gray-600">See prices in your local currency with real-time conversion</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Regional Platforms</h3>
                <p className="text-gray-600">Access platforms specific to your country and region</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">ShopScout AI</span>
            </div>
            <p className="text-gray-400">Save money, shop smart with AI-powered global price comparison!</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p>&copy; 2024 ShopScout AI. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
    </main>
  );
}
