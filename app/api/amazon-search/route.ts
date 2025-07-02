import { NextRequest, NextResponse } from 'next/server';
import { getRainforestAPI } from '@/lib/rainforest-api';
import { countries } from '@/lib/countries';

export async function POST(request: NextRequest) {
  try {
    const { query, countryCode, filters, limit = 12 } = await request.json();

    // Find the country
    const country = countries.find(c => c.code === countryCode);
    if (!country) {
      return NextResponse.json(
        { error: 'Country not supported' },
        { status: 400 }
      );
    }

    // Get Rainforest API instance
    const rainforestAPI = getRainforestAPI();
    
    // Perform search using Rainforest API
    const searchResult = await rainforestAPI.searchProducts(query, country, filters, 1, limit);

    return NextResponse.json(searchResult);

  } catch (error) {
    console.error('Rainforest API search error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 