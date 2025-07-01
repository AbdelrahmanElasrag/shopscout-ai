import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'ShopScout AI - Smart Price Comparison',
    template: '%s | ShopScout AI'
  },
  description: 'AI-powered e-commerce price comparison platform. Find the best deals across Amazon, AliExpress, and Noon with smart product matching and real-time price tracking.',
  keywords: ['price comparison', 'e-commerce', 'AI shopping', 'best deals', 'Amazon', 'AliExpress', 'Noon'],
  authors: [{ name: 'ShopScout AI Team' }],
  creator: 'ShopScout AI',
  publisher: 'ShopScout AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'ShopScout AI',
    title: 'ShopScout AI - Smart Price Comparison',
    description: 'AI-powered e-commerce price comparison platform. Find the best deals with smart product matching.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ShopScout AI - Smart Price Comparison',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopScout AI - Smart Price Comparison',
    description: 'AI-powered e-commerce price comparison platform. Find the best deals with smart product matching.',
    images: ['/og-image.png'],
    creator: '@shopscout_ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        'min-h-screen bg-background font-sans antialiased',
        inter.variable
      )}>
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
} 