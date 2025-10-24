import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

const SITES_KEY = 'quick-listicle-sites';

// Check if Redis is configured
const isRedisConfigured = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Initialize Upstash Redis client only if configured
let redis: Redis | null = null;
if (isRedisConfigured) {
  redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
  });
}

export async function GET() {
  try {
    // If Redis is not configured, return empty array with a flag
    if (!isRedisConfigured || !redis) {
      return NextResponse.json({ 
        sites: [],
        backendConnected: false,
        message: 'Backend not configured. Add Redis environment variables to enable saving sites.'
      });
    }

    const sites = await redis.smembers(SITES_KEY) || [];
    return NextResponse.json({ 
      sites,
      backendConnected: true
    });
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json({
      sites: [],
      backendConnected: false,
      error: 'Failed to fetch sites',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if Redis is configured
    if (!isRedisConfigured || !redis) {
      return NextResponse.json({
        error: 'Backend not configured. Redis environment variables are not set.',
        backendConnected: false
      }, { status: 503 });
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
      totalSites,
      backendConnected: true
    });
  } catch (error) {
    console.error('Error saving domain:', error);
    return NextResponse.json({
      error: 'Failed to save domain',
      details: error instanceof Error ? error.message : 'Unknown error',
      backendConnected: false
    }, { status: 500 });
  }
}
