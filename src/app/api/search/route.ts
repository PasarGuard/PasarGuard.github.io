import { NextRequest, NextResponse } from 'next/server';

// Disable search API to prevent language support errors
export async function GET(request: NextRequest) {
  // Return empty search results to prevent errors
  return NextResponse.json({
    hits: [],
    count: 0,
    elapsed: 0
  });
}