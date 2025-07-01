# 🚀 Deployment Guide - ShopScout AI

## Quick Start Deployment

### 1. Prerequisites Setup

**Required Accounts:**
- [GitHub](https://github.com) - For code hosting
- [Vercel](https://vercel.com) - For deployment
- [Supabase](https://supabase.com) - For database and auth
- [OpenAI](https://openai.com) - For AI features (optional)

### 2. Supabase Setup

1. **Create a Supabase Project**
   - Go to [Supabase](https://supabase.com)
   - Click "New Project"
   - Choose organization and fill project details
   - Wait for setup to complete

2. **Get API Keys**
   - Go to Settings > API
   - Copy `URL` and `anon public` key
   - Copy `service_role` key (keep this secret!)

3. **Set up Authentication**
   - Go to Authentication > Settings
   - Enable Email authentication
   - Configure email templates (optional)

### 3. GitHub Repository Setup

1. **Create GitHub Repository**
   ```bash
   # Add all files to git
   git add .
   git commit -m "Initial commit: ShopScout AI e-commerce platform"
   
   # Create repository on GitHub, then:
   git remote add origin https://github.com/YOUR_USERNAME/shopscout-ai.git
   git branch -M main
   git push -u origin main
   ```

### 4. Vercel Deployment

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/shopscout-ai)

#### Option B: Manual Deploy

1. **Connect GitHub to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Sign up with GitHub
   - Import your repository

2. **Configure Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: Leave empty
   - Install Command: `npm install`

3. **Add Environment Variables**
   ```env
   # Required
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   
   # Recommended
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   OPENAI_API_KEY=your-openai-key
   
   # Optional for production
   REDIS_URL=your-redis-url
   STRIPE_PUBLISHABLE_KEY=your-stripe-key
   STRIPE_SECRET_KEY=your-stripe-secret
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

### 5. Database Schema Setup

1. **Run SQL in Supabase SQL Editor**
   ```sql
   -- Create users table
   create table users (
     id uuid references auth.users on delete cascade,
     email text not null,
     full_name text,
     avatar_url text,
     is_subscribed boolean default false,
     subscription_tier text default 'free',
     created_at timestamp with time zone default timezone('utc'::text, now()),
     updated_at timestamp with time zone default timezone('utc'::text, now()),
     primary key (id)
   );

   -- Create products table
   create table products (
     id text primary key,
     name text not null,
     description text,
     images text[],
     category text not null,
     brand text,
     created_at timestamp with time zone default timezone('utc'::text, now()),
     updated_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Create product_variants table
   create table product_variants (
     id text primary key,
     product_id text references products(id) on delete cascade,
     title text not null,
     price numeric not null,
     original_price numeric,
     currency text default 'USD',
     platform text not null,
     url text not null,
     affiliate_url text,
     availability text default 'in_stock',
     rating numeric,
     review_count integer,
     trust_score integer default 0,
     last_updated timestamp with time zone default timezone('utc'::text, now())
   );

   -- Enable Row Level Security
   alter table users enable row level security;
   alter table products enable row level security;
   alter table product_variants enable row level security;

   -- Create policies
   create policy "Users can view own profile" on users
     for select using (auth.uid() = id);

   create policy "Users can update own profile" on users
     for update using (auth.uid() = id);

   create policy "Products are viewable by everyone" on products
     for select using (true);

   create policy "Product variants are viewable by everyone" on product_variants
     for select using (true);
   ```

### 6. Custom Domain (Optional)

1. **Purchase Domain**
   - Buy domain from any registrar (Namecheap, GoDaddy, etc.)

2. **Configure DNS**
   - Add CNAME record: `www` → `cname.vercel-dns.com`
   - Add A record: `@` → `76.76.19.19`

3. **Add to Vercel**
   - Go to Project Settings > Domains
   - Add your domain
   - Wait for SSL certificate generation

### 7. Monitoring & Analytics

1. **Vercel Analytics**
   - Go to your project dashboard
   - Enable Analytics in Settings

2. **Google Analytics (Optional)**
   - Create GA4 property
   - Add tracking ID to environment variables:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

### 8. Production Optimizations

1. **Performance**
   - Enable Vercel Edge Functions
   - Configure image optimization
   - Set up CDN for assets

2. **SEO**
   - Verify domain in Google Search Console
   - Submit sitemap
   - Configure meta tags

3. **Security**
   - Enable HTTPS only
   - Configure CORS properly
   - Set up rate limiting

## Troubleshooting

### Common Issues

**Build Errors**
```bash
# If you get TypeScript errors
npm run type-check

# If you get dependency issues
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Working**
- Ensure variables are added in Vercel dashboard
- Check variable names match exactly
- Redeploy after adding variables

**Database Connection Issues**
- Verify Supabase URL and keys
- Check if RLS policies are correct
- Ensure database is accessible

**Search Not Working**
- Mock data should work immediately
- For real data, implement scraping services
- Check API endpoints in browser network tab

### Getting Help

- 📧 Email: support@shopscout.ai
- 📖 Documentation: Check README.md
- 🐛 Issues: Create GitHub issue
- 💬 Community: Join our Discord

## Next Steps

After deployment:

1. **Test Core Features**
   - Search functionality
   - User registration
   - Product comparison

2. **Configure Real Data Sources**
   - Set up web scraping
   - Implement API integrations
   - Add more product categories

3. **Marketing Setup**
   - Configure affiliate programs
   - Set up email marketing
   - Create social media accounts

4. **Scale & Optimize**
   - Monitor performance
   - Add caching layers
   - Implement CI/CD pipeline

---

🎉 **Congratulations!** Your AI-powered e-commerce comparison platform is now live!

Start attracting users and earning revenue through smart price comparisons! 💰 