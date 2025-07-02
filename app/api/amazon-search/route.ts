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
    console.log('🌍 API Route - Available countries:', countries.map(c => c.code));

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

    // Get Rainforest API instance
    const rainforestAPI = getRainforestAPI();
    console.log('🚀 API Route - Starting Rainforest API search...');
    
    // Perform search using Rainforest API
    const searchResult = await rainforestAPI.searchProducts(query, country, filters, 1, limit);

    console.log('✅ API Route - Search completed:', {
      productsFound: searchResult.products.length,
      totalResults: searchResult.totalResults,
      searchTime: searchResult.searchTime
    });

    return NextResponse.json(searchResult);

  } catch (error) {
    console.error('❌ API Route - Rainforest API search error:', error);
    
    // Return detailed error information
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