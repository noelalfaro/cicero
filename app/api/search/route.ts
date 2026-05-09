import { search } from '@/lib/search';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
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
}
