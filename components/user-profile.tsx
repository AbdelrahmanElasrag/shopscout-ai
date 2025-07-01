'use client';

import { useState } from 'react';
import { useAuth } from '../lib/auth-context';
import { useFavorites } from '../lib/favorites-context';
import { countries } from '../lib/countries';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserProfile({ isOpen, onClose }: UserProfileProps) {
  const { user, selectedCountry, updateCountry, signOut } = useAuth();
  const { favorites, removeFromFavorites, clearFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites'>('profile');

  if (!isOpen || !user) return null;

  const handleCountryChange = (countryCode: string) => {
    updateCountry(countryCode);
  };

  const formatPrice = (price: number, symbol: string) => {
    return `${symbol}${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">{user.email}</p>
                {selectedCountry && (
                  <p className="text-blue-100">
                    {selectedCountry.flag} {selectedCountry.name} • {selectedCountry.currency}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'favorites'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Favorites ({favorites.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={user.name}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Shopping Preferences</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country & Currency
                  </label>
                  <select
                    value={selectedCountry?.code || ''}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.flag} {country.name} ({country.currency})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    This determines which platforms and currency we show you
                  </p>
                </div>
              </div>

              {selectedCountry && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Available Platforms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedCountry.platforms.map((platform) => (
                      <div key={platform.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm">🛒</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{platform.name}</p>
                          <p className="text-sm text-gray-500">{platform.domain}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${
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
              )}
            </div>
          )}

          {activeTab === 'favorites' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Your Favorite Products</h3>
                {favorites.length > 0 && (
                  <button
                    onClick={clearFavorites}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💝</div>
                  <p className="text-gray-500 text-lg mb-2">No favorites yet</p>
                  <p className="text-gray-400">Start shopping and save products you love!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favorites.map((product) => (
                    <div key={product.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                      <div className="flex space-x-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {product.title}
                          </h4>
                          <p className="text-xs text-gray-500 mb-1">{product.platform.name}</p>
                          <p className="font-semibold text-green-600">
                            {formatPrice(product.price, product.currencySymbol)}
                          </p>
                          <p className="text-xs text-gray-400">
                            Added {formatDate(product.dateAdded)}
                          </p>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <a
                            href={product.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 text-xs"
                          >
                            View →
                          </a>
                          <button
                            onClick={() => removeFromFavorites(product.id)}
                            className="text-red-600 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </div>
            <button
              onClick={signOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 