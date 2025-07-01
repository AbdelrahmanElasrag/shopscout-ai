import { HeroSection } from '@/components/hero-section';
import { SearchSection } from '@/components/search-section';
import { FeaturesSection } from '@/components/features-section';
import { TrendingProducts } from '@/components/trending-products';
import { StatsSection } from '@/components/stats-section';
import { CTASection } from '@/components/cta-section';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Main Search Interface */}
      <SearchSection />
      
      {/* Platform Features */}
      <FeaturesSection />
      
      {/* Trending Products */}
      <TrendingProducts />
      
      {/* Statistics */}
      <StatsSection />
      
      {/* Call to Action */}
      <CTASection />
      
      <Footer />
    </main>
  );
} 