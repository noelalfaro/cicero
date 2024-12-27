import { NextRequest, NextResponse } from 'next/server';
import { fetchPlayerStatsByID } from '@/app/(main)/lib/data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    console.log(`Fetching stats for player ID: ${id}`);

    if (!id) {
      return NextResponse.json({ error: 'Invalid player ID' }, { status: 400 });
    }

    const playerStats = await fetchPlayerStatsByID(Number(id));
    return NextResponse.json(playerStats, { status: 200 });
  } catch (error) {
    console.error('Error fetching player stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player stats' },
      { status: 500 },
    );
  }
}
