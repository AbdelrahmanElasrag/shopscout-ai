import { NextRequest, NextResponse } from 'next/server';
import { searchProducts } from '@/lib/search-service';
import { sanitizeSearchQuery } from '@/lib/utils';
import type { SearchFilters } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const sortBy = searchParams.get('sortBy') as SearchFilters['sortBy'] || 'relevance';
    const platforms = searchParams.get('platforms')?.split(',') as SearchFilters['platforms'];
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const categories = searchParams.get('categories')?.split(',');
    const brands = searchParams.get('brands')?.split(',');
    const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
    const inStockOnly = searchParams.get('inStockOnly') === 'true';

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeSearchQuery(query);
    
    const filters: SearchFilters = {
      sortBy,
      page,
      limit,
      platforms,
      minPrice,
      maxPrice,
      categories,
      brands,
      minRating,
      inStockOnly,
    };

    const startTime = Date.now();
    const searchResult = await searchProducts(sanitizedQuery, filters);
    const searchTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        ...searchResult,
        searchTime,
      },
      meta: {
        page,
        limit,
        total: searchResult.totalCount,
        hasNext: page * limit < searchResult.totalCount,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, filters } = body;

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Search query must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const sanitizedQuery = sanitizeSearchQuery(query);
    const startTime = Date.now();
    const searchResult = await searchProducts(sanitizedQuery, filters);
    const searchTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        ...searchResult,
        searchTime,
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 