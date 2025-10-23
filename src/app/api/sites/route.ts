import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const SITES_KEY = 'quick-listicle-sites';

// Check for required environment variables
if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  console.error('Missing required environment variables: KV_REST_API_URL or KV_REST_API_TOKEN');
}

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
  try {
    // Check if Redis is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({
        error: 'Redis not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.'
      }, { status: 500 });
    }

    const sites = await redis.smembers(SITES_KEY) || [];
    return NextResponse.json({ sites });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({
      error: 'Failed to fetch sites',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Redis is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return NextResponse.json({
        error: 'Redis not configured. Please set KV_REST_API_URL and KV_REST_API_TOKEN environment variables.'
      }, { status: 500 });
    }

    const { domain } = await request.json();

    if (!domain || typeof domain !== 'string') {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Basic domain validation
    try {
      new URL(`https://${domain}`);
    } catch {
      return NextResponse.json({ error: 'Invalid domain format' }, { status: 400 });
    }

    await redis.sadd(SITES_KEY, domain);
    const totalSites = await redis.scard(SITES_KEY);

    return NextResponse.json({
      success: true,
      domain,
      totalSites
    });
  } catch (error) {
    console.error('Error saving domain:', error);
    return NextResponse.json({
      error: 'Failed to save domain',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
