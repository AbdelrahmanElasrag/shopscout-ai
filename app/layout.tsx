import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth-context';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ShopScout AI - Smart Price Comparison',
  description: 'AI-powered e-commerce price comparison platform. Find the best deals across Amazon, AliExpress, and Noon.',
  keywords: ['price comparison', 'e-commerce', 'AI shopping', 'best deals', 'Amazon', 'AliExpress', 'Noon'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`min-h-screen bg-white font-sans antialiased ${inter.variable}`}>
        <AuthProvider>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
} 