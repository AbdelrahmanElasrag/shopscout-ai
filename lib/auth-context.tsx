'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Country, getCountryByCode } from './countries';

interface User {
  id: string;
  email: string;
  name: string;
  countryCode: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  selectedCountry: Country | null;
  signUp: (email: string, password: string, name: string, countryCode: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  updateCountry: (countryCode: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('shopscout_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        const country = getCountryByCode(userData.countryCode);
        setSelectedCountry(country || null);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = async (email: string, password: string, name: string, countryCode: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - In production, replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        countryCode,
        createdAt: new Date().toISOString()
      };

      // Save to localStorage (In production, this would be handled by your backend)
      localStorage.setItem('shopscout_user', JSON.stringify(newUser));
      setUser(newUser);
      
      const country = getCountryByCode(countryCode);
      setSelectedCountry(country || null);
    } catch (error) {
      throw new Error('Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // Simulate API call - In production, replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, check if user exists in localStorage
      const savedUser = localStorage.getItem('shopscout_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        if (userData.email === email) {
          setUser(userData);
          const country = getCountryByCode(userData.countryCode);
          setSelectedCountry(country || null);
          return;
        }
      }
      
      throw new Error('Invalid credentials');
    } catch (error) {
      throw new Error('Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('shopscout_user');
    setUser(null);
    setSelectedCountry(null);
  };

  const updateCountry = (countryCode: string) => {
    if (user) {
      const updatedUser = { ...user, countryCode };
      localStorage.setItem('shopscout_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      const country = getCountryByCode(countryCode);
      setSelectedCountry(country || null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    selectedCountry,
    signUp,
    signIn,
    signOut,
    updateCountry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 