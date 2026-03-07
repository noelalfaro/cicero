import { db } from '@/server/db';
import { z } from 'zod';
import { players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { teams } from '@/server/db/schema/teams';
import { sql } from 'drizzle-orm';

export const searchParamsSchema = z.object({
  query: z.string().trim().min(1, 'query is required'),
  limit: z.number().int().min(1).max(50).optional(),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;

export type SearchResult =
  | {
      type: 'player';
      id: number;
      label: string;
      meta?: { team?: string; position?: string };
    }
  | {
      type: 'team';
      id: number;
      label: string;
      meta?: { city?: string; abbr?: string };
    }
  | {
      type: 'user';
      id: string;
      label: string;
      meta?: { picture: string | null };
    };

export type SearchResponse = {
  query: string;
  results: SearchResult[];
};

export async function search(input: SearchParams): Promise<SearchResponse> {
  const { query, limit } = input;

  const q = query.trim().toLowerCase();
  const per = Math.max(1, Math.floor((limit ?? 10) / 3));

  const [playerRows, teamRows, userRows] = await Promise.all([
    db
      .select({
        id: players.id,
        firstName: players.first_name,
        lastName: players.last_name,
        teamName: players.team_name,
        position: players.position,
      })
      .from(players)
      .where(
        sql`${players.first_name} || ' ' || ${players.last_name} ILIKE ${'%' + q + '%'}`,
      )
      .orderBy(
        sql`
        CASE
          WHEN LOWER(${players.first_name} || ' ' || ${players.last_name}) LIKE ${q + '%'} THEN 1
          ELSE 2
        END,
        ${players.season_exp} DESC
      `,
      )
      .limit(per),

    db
      .select({
        id: teams.team_id,
        name: teams.name,
        logo: teams.logo,
        abbreviation: teams.abbreviation,
        city: teams.city,
      })
      .from(teams)
      .where(
        sql`${teams.name} ILIKE ${'%' + q + '%'} OR ${teams.city} ILIKE ${'%' + q + '%'}`,
      )
      .limit(per),

    db
      .select({
        id: users.id,
        username: users.username,
        picture: users.picture,
      })
      .from(users)
      .where(
        sql`${users.username} IS NOT NULL AND ${users.username} ILIKE ${'%' + q + '%'}`,
      )
      .limit(per),
  ]);

  const playerResults: SearchResult[] = playerRows.map((p) => ({
    type: 'player',
    id: p.id,
    label: `${p.firstName} ${p.lastName}`,
    meta: { team: p.teamName, position: p.position ?? undefined },
  }));

  const teamResults: SearchResult[] = teamRows.map((t) => ({
    type: 'team',
    id: t.id,
    label: t.name,
    meta: { abbr: t.abbreviation, city: t.city },
  }));

  const userResults: SearchResult[] = userRows.map((u) => ({
    type: 'user',
    id: u.id,
    label: u.username!,
    meta: { picture: u.picture },
  }));

  const results = [...playerResults, ...teamResults, ...userResults].slice(
    0,
    limit ?? 10,
  );
  return { query: q, results };
}
