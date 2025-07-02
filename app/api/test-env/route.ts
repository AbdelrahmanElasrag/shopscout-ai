import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    hasApiKey: !!process.env.RAINFOREST_API_KEY,
    apiKeyLength: process.env.RAINFOREST_API_KEY?.length || 0,
    apiKeyStart: process.env.RAINFOREST_API_KEY?.substring(0, 8) || 'NOT_SET',
    isDemoKey: process.env.RAINFOREST_API_KEY === 'demo',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('RAINFOREST')),
    timestamp: new Date().toISOString()
  });
} 