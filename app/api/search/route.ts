import { search, searchParamsSchema } from '@/lib/search';
import { NextRequest, NextResponse } from 'next/server';

function unauthorized(message = 'Unauthorized') {
  return NextResponse.json({ error: message }, { status: 401 });
}

export async function GET(req: NextRequest) {
  // Manual bearer auth so you can test from Postman
  const auth = req.headers.get('authorization') || '';
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return unauthorized('Missing bearer token');
  }

  // Optional: verify JWT signature/claims locally (e.g., using jose)
  // For quick dev, you can skip verification and just proceed if token is present.
  // But for real protection, verify here against Kinde's JWKS.

  const { searchParams } = req.nextUrl;
  const query = searchParams.get('q') ?? '';
  const limit = searchParams.get('limit')
    ? Number(searchParams.get('limit'))
    : undefined;

  try {
    const results = await search({ query, limit });
    return NextResponse.json(results);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  // console.log('Search endpoint hit with bearer token');

  // const q = req.nextUrl.searchParams.get('q');
  // return NextResponse.json({ q });
}
