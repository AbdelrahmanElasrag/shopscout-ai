import { NextRequest, NextResponse } from 'next/server';
import { getRainforestAPI } from '@/lib/rainforest-api';
import { countries } from '@/lib/countries';

export async function POST(request: NextRequest) {
  try {
    const { query, countryCode, filters, limit = 12 } = await request.json();

    console.log('🔍 API Route - Search request:', { query, countryCode, limit });
    console.log('🔑 API Route - API Key available:', !!process.env.RAINFOREST_API_KEY);
    console.log('🔑 API Route - API Key first 8 chars:', process.env.RAINFOREST_API_KEY?.substring(0, 8) || 'NOT_SET');
    console.log('🔑 API Route - Using demo key?:', process.env.RAINFOREST_API_KEY === 'demo');

    if (!query || query.trim() === '') {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    // Find the country
    const country = countries.find(c => c.code === countryCode);
    if (!country) {
      console.log('❌ API Route - Country not found:', countryCode);
      return NextResponse.json(
        { error: 'Country not supported', availableCountries: countries.map(c => ({ code: c.code, name: c.name })) },
        { status: 400 }
      );
    }

    console.log('✅ API Route - Country found:', country.name);
    console.log('🔍 API Route - Searching for:', query);

    // Direct Rainforest API call (bypassing the wrapper for now)
    const params = new URLSearchParams({
      api_key: process.env.RAINFOREST_API_KEY || 'demo',
      type: 'search',
      amazon_domain: country.name === 'Egypt' ? 'amazon.eg' :
                    country.name === 'United Arab Emirates' ? 'amazon.ae' :
                    country.name === 'Saudi Arabia' ? 'amazon.sa' :
                    country.name === 'United States' ? 'amazon.com' :
                    country.name === 'United Kingdom' ? 'amazon.co.uk' : 'amazon.com',
      search_term: query,
      sort_by: filters?.sortBy || 'relevance',
      page: '1'
    });

    console.log('🚀 API Route - Making direct Rainforest API call...');
    
    const response = await fetch(`https://api.rainforestapi.com/request?${params}`);
    const data = await response.json();

    console.log('📡 API Route - Rainforest response status:', response.status);
    console.log('📦 API Route - Rainforest response data keys:', Object.keys(data));

    if (!response.ok) {
      console.error('❌ API Route - Rainforest API error:', data);
      return NextResponse.json(
        { 
          error: 'Rainforest API error',
          message: data.message || 'API request failed',
          details: data
        },
        { status: response.status }
      );
    }

    // Parse the results in the same format as our interface expects
    const products = (data.search_results || []).slice(0, limit).map((item: any) => ({
      id: item.asin || `product_${Date.now()}_${Math.random()}`,
      title: item.title || 'Product Title',
      price: item.price?.value || 0,
      originalPrice: item.price?.list_price,
      discount: item.price?.list_price && item.price?.value ? 
        Math.round(((item.price.list_price - item.price.value) / item.price.list_price) * 100) + '%' : undefined,
      rating: item.rating || 4.0 + Math.random(),
      reviewCount: item.ratings_total || Math.floor(Math.random() * 1000) + 100,
      image: item.image || 'https://via.placeholder.com/300x300?text=Product',
      images: [item.image || 'https://via.placeholder.com/300x300?text=Product'],
      description: item.title ? `${item.title} - High quality product with excellent features.` : 'Product description',
      brand: item.title?.split(' ')[0] || 'Generic',
      category: 'Electronics',
      platform: {
        id: 'amazon_' + countryCode.toLowerCase(),
        name: `Amazon ${country.name}`,
        domain: params.get('amazon_domain') || 'amazon.com',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
      },
      url: `https://${params.get('amazon_domain')}/dp/${item.asin}`,
      availability: 'in_stock',
      shipping: {
        free: item.is_prime || false,
        cost: item.is_prime ? 0 : 5,
        estimatedDays: item.is_prime ? '1-2 days' : '3-5 days'
      },
      currency: country.currency,
      currencySymbol: country.currencySymbol,
      lastUpdated: new Date().toISOString()
    }));

    const searchResult = {
      products,
      totalResults: data.pagination?.total_pages ? data.pagination.total_pages * limit : products.length,
      currentPage: 1,
      totalPages: data.pagination?.total_pages || 1,
      filters: {
        priceRange: { min: 0, max: 10000 },
        rating: 0,
        availability: [],
        shipping: [],
        brand: [],
        category: [],
        sortBy: 'relevance'
      },
      searchTime: data.request_metadata?.total_time_taken || 0
    };

    console.log('✅ API Route - Search completed:', {
      productsFound: searchResult.products.length,
      totalResults: searchResult.totalResults,
      searchTime: searchResult.searchTime
    });

    return NextResponse.json(searchResult);

  } catch (error) {
    console.error('❌ API Route - Search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error',
        details: {
          apiKeyConfigured: !!process.env.RAINFOREST_API_KEY,
          apiKeyFirstChars: process.env.RAINFOREST_API_KEY?.substring(0, 8) || 'NOT_SET',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
} 