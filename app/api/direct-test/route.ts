import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Use the exact same format as Rainforest playground
    const params = new URLSearchParams({
      api_key: process.env.RAINFOREST_API_KEY || 'demo',
      type: 'search',
      amazon_domain: 'amazon.eg',
      search_term: 'iphone'
    });

    const response = await fetch(`https://api.rainforestapi.com/request?${params}`);
    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      apiKeyUsed: process.env.RAINFOREST_API_KEY?.substring(0, 8) || 'NOT_SET',
      searchResults: data.search_results?.length || 0,
      rawResponse: data
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to test Rainforest API',
      message: error instanceof Error ? error.message : 'Unknown error',
      apiKeyUsed: process.env.RAINFOREST_API_KEY?.substring(0, 8) || 'NOT_SET'
    });
  }
} 