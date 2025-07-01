# ShopScout AI - E-commerce Price Comparison Platform

## 🚀 Overview

ShopScout AI is an intelligent e-commerce price comparison platform that aggregates products from multiple marketplaces (Amazon, AliExpress, and Noon) to help users find the best deals. Built with modern technologies and AI-powered product matching, it provides real-time price comparisons, authenticity verification, and smart recommendations.

## ✨ Key Features

### 🤖 AI-Powered Features
- **Smart Product Matching**: AI algorithms match similar products across platforms
- **Price Prediction**: ML models predict price trends and optimal purchase timing
- **Authenticity Scoring**: Trust scores based on seller reliability and product authenticity
- **Intelligent Search**: Natural language search with product recommendations

### 🛍️ Shopping Features
- **Multi-Platform Search**: Search across Amazon, AliExpress, and Noon simultaneously
- **Real-time Price Updates**: Live price monitoring and alerts
- **Advanced Filtering**: Filter by price, rating, brand, platform, and more
- **Price History**: Track price changes over time
- **Deal Alerts**: Get notified when prices drop
- **Wishlist Management**: Save and organize favorite products

### 💰 Monetization
- **Affiliate Marketing**: Earn commissions from partner platforms
- **Premium Subscriptions**: Advanced features for power users
- **Sponsored Listings**: Featured product placements
- **API Access**: B2B data licensing

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **React Query** - Data fetching and caching
- **Zustand** - State management
- **Radix UI** - Accessible UI components

### Backend & APIs
- **Next.js API Routes** - Server-side API endpoints
- **Supabase** - Authentication and real-time features
- **PostgreSQL** - Primary database
- **Redis** - Caching and session storage
- **OpenAI API** - AI-powered features

### Services & Tools
- **Web Scraping**: Puppeteer for data extraction
- **Image Processing**: Sharp for optimization
- **Email Service**: Resend for notifications
- **Analytics**: Built-in analytics dashboard
- **Payment Processing**: Stripe for subscriptions

## 📦 Project Structure

```
shopscout-ai/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── search/        # Product search endpoint
│   │   ├── auth/         # Authentication
│   │   └── webhooks/     # External webhooks
│   ├── search/           # Search results page
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   ├── hero-section.tsx  # Landing page hero
│   ├── header.tsx        # Navigation header
│   └── footer.tsx        # Site footer
├── lib/                  # Utility functions
│   ├── search-service.ts # Search logic
│   ├── utils.ts          # Common utilities
│   └── supabase.ts       # Supabase client
├── hooks/                # Custom React hooks
│   ├── use-auth.ts       # Authentication hook
│   └── use-search.ts     # Search functionality
├── types/                # TypeScript definitions
│   └── index.ts          # Type definitions
├── styles/               # Additional styles
├── public/               # Static assets
└── scripts/              # Build and deployment scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/shopscout-ai.git
   cd shopscout-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Required
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # Optional but recommended
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=your_redis_url
   
   # For production
   DATABASE_URL=your_database_url
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment to Vercel

### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/shopscout-ai)

### Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Configure Environment Variables**
   In your Vercel dashboard, add all the environment variables from your `.env.local` file.

4. **Custom Domain (Optional)**
   - Go to your Vercel project settings
   - Add your custom domain
   - Configure DNS settings

### Environment Variables for Production

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# Database
DATABASE_URL=your_production_database_url

# Redis (for caching)
REDIS_URL=your_production_redis_url

# AI Features
OPENAI_API_KEY=your_openai_api_key

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Payments
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Email
RESEND_API_KEY=your_resend_api_key
```

## 🔧 Configuration

### Database Schema
The application uses Supabase with the following main tables:
- `users` - User profiles and preferences
- `products` - Product information
- `product_variants` - Platform-specific product data
- `searches` - Search history and analytics
- `price_alerts` - User price notifications
- `reviews` - Aggregated product reviews

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/search` | GET | Search products across platforms |
| `/api/products/:id` | GET | Get detailed product information |
| `/api/auth/signin` | POST | User authentication |
| `/api/alerts` | POST | Create price alerts |
| `/api/webhooks/stripe` | POST | Handle Stripe webhooks |

## 📱 Features Roadmap

### Phase 1 (Current) ✅
- [x] Basic product search
- [x] Multi-platform comparison
- [x] User authentication
- [x] Responsive design
- [x] Price tracking

### Phase 2 (In Progress) 🚧
- [ ] Advanced filtering
- [ ] Price alerts
- [ ] User dashboard
- [ ] Product reviews
- [ ] Mobile app

### Phase 3 (Planned) 📋
- [ ] AI recommendations
- [ ] Price prediction
- [ ] Bulk search
- [ ] API access
- [ ] Browser extension

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure responsive design
- Follow accessibility guidelines

## 📊 Analytics & Monitoring

### Built-in Analytics
- Search volume tracking
- Popular products analysis
- Platform performance metrics
- User behavior insights

### External Services
- Google Analytics for web traffic
- Sentry for error tracking
- Uptime monitoring
- Performance monitoring

## 🔒 Security

- Environment variables for sensitive data
- Rate limiting on API endpoints
- Input validation and sanitization
- HTTPS enforcement
- CORS configuration
- SQL injection prevention

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Supabase](https://supabase.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vercel](https://vercel.com/) for hosting
- [OpenAI](https://openai.com/) for AI capabilities

## 📞 Support

- 📧 Email: support@shopscout.ai
- 💬 Discord: [ShopScout Community](https://discord.gg/shopscout)
- 📖 Documentation: [docs.shopscout.ai](https://docs.shopscout.ai)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/shopscout-ai/issues)

---

**Made with ❤️ by the ShopScout Team**

*Save money, shop smart with AI-powered price comparison!* 