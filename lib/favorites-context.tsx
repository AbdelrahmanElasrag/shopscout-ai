'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

export interface FavoriteProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  currencySymbol: string;
  image: string;
  platform: {
    id: string;
    name: string;
    domain: string;
  };
  url: string;
  dateAdded: string;
}

interface FavoritesContextType {
  favorites: FavoriteProduct[];
  addToFavorites: (product: FavoriteProduct) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const { user } = useAuth();

  // Load favorites from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      try {
        const savedFavorites = localStorage.getItem(`shopscout_favorites_${user.id}`);
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (user && favorites.length >= 0) {
      try {
        localStorage.setItem(`shopscout_favorites_${user.id}`, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites:', error);
      }
    }
  }, [favorites, user]);

  const addToFavorites = (product: FavoriteProduct) => {
    if (!user) return;
    
    setFavorites(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === product.id)) {
        return prev;
      }
      return [...prev, { ...product, dateAdded: new Date().toISOString() }];
    });
  };

  const removeFromFavorites = (productId: string) => {
    if (!user) return;
    
    setFavorites(prev => prev.filter(fav => fav.id !== productId));
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.id === productId);
  };

  const clearFavorites = () => {
    if (!user) return;
    
    setFavorites([]);
    localStorage.removeItem(`shopscout_favorites_${user.id}`);
  };

  const value: FavoritesContextType = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 