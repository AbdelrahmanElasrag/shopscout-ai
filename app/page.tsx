export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ShopScout AI
            </span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Search</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Categories</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Deals</a>
          </nav>
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
            AI-powered price comparison that searches Amazon, AliExpress, and Noon 
            to find you the most reliable and cheapest products in seconds.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products (e.g., iPhone 15, MacBook, headphones)..."
                className="w-full pl-6 pr-32 py-4 text-lg bg-white/95 border-0 rounded-2xl shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300/50"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 rounded-xl">
                Search AI
              </button>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="mb-12">
            <p className="text-blue-100 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['iPhone 15 Pro', 'MacBook Air M3', 'Nike Air Jordan', 'Sony WH-1000XM5'].map((search) => (
                <button
                  key={search}
                  className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-200"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
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
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Real-time Prices</h3>
                <p className="text-sm text-blue-100">Always up-to-date</p>
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
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose ShopScout AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Multi-Platform Search</h3>
              <p className="text-gray-600">Search Amazon, AliExpress, and Noon simultaneously</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Price Tracking</h3>
              <p className="text-gray-600">Get alerts when prices drop on your favorite items</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-4">Trust Scores</h3>
              <p className="text-gray-600">AI-verified seller reliability and product authenticity</p>
            </div>
          </div>
        </div>
      </section>

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
            <p className="text-gray-400">Save money, shop smart with AI-powered price comparison!</p>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p>&copy; 2024 ShopScout AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
} 