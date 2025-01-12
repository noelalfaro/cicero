import 'server-only';
// ('use server');
import { unstable_noStore as noStore } from 'next/cache';

import { players } from '@/server/db/schema/players';
import { users } from '@/server/db/schema/users';
import { playerStats } from '@/server/db/schema/player_stats';

import { eq } from 'drizzle-orm';
import {
  playerSchema,
  Player,
  NewsArticle,
  newsArticleSchema,
  User,
  PlayerStats,
} from '@/lib/definitions';

// import { BLACKLISTED_TERMS } from '@/config.js';

import { db } from '@/server/db';
import { cache } from 'react';

export async function fetchPlayerData(): Promise<Player[]> {
  noStore();
  try {
    // Perform a join between players and player_stats
    const result = await db.select().from(players).limit(10);

    // Convert the grouped data into an array and add picture URLs
    // Add picture URLs
    const playersWithPictures = result.map((player) => {
      const pictureUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${player.id}.png`;
      return { ...player, picture: pictureUrl };
    });

    // Parse each player object using the schema
    return playersWithPictures.map((playerData) =>
      playerSchema.parse(playerData),
    );
  } catch (error) {
    throw new Error(
      'Failed to fetch players data - Function: fetchPlayerData()' + error,
    );
  }
}

export async function fetchPlayerDataByID(id: number): Promise<Player | null> {
  // Use Promise.all for parallel data fetching
  const [playerResult, statsResult] = await Promise.all([
    db.select().from(players).where(eq(players.id, id)),
    db.select().from(playerStats).where(eq(playerStats.player_id, id)),
  ]);

  if (playerResult.length === 0) {
    return null;
  }

  const player = playerResult[0];
  const pictureUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${id}.png`;

  try {
    return playerSchema.parse({
      ...player,
      stats: statsResult || [], // An array of stats or an empty array if no stats found
      picture: pictureUrl,
    });
  } catch (error) {
    console.error('Failed to parse player data:', error);
    return null; // More graceful error handling
  }
}

export const fetchPlayerStatsByID = async (
  id: number,
): Promise<PlayerStats[]> => {
  return db.select().from(playerStats).where(eq(playerStats.player_id, id));
};

// export const fetchPlayerDataByID = cache(
//   async (id: number): Promise<Player | null> => {
//     // Use Promise.all for parallel data fetching
//     const [playerResult, statsResult] = await Promise.all([
//       db.select().from(players).where(eq(players.id, id)),
//       db.select().from(playerStats).where(eq(playerStats.player_id, id)),
//     ]);

//     if (playerResult.length === 0) {
//       return null;
//     }

//     const player = playerResult[0];
//     const pictureUrl = `https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/1040x760/${id}.png`;

//     try {
//       return playerSchema.parse({
//         ...player,
//         stats: statsResult || [], // An array of stats or an empty array if no stats found
//         picture: pictureUrl,
//       });
//     } catch (error) {
//       console.error('Failed to parse player data:', error);
//       return null; // More graceful error handling
//     }
//   },
// );

export async function fetchNewsArticles(): Promise<NewsArticle[] | null> {
  const url = 'https://nba-latest-news.p.rapidapi.com/articles?limit=10';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
      'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
    },
  };
  noStore();

  try {
    const response = await fetch(url, options);

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Fetched data: ", data);

    // Assuming 'data' is an array of articles
    return data.map((article: any) => newsArticleSchema.parse(article));
  } catch (error) {
    return null;
    // console.error('Error fetching articles: ', error);
    // throw new Error('Failed to fetch articles data.');
  }
}

export async function FetchNewsArticlesByPlayerID(
  first_name: string,
  last_name: string,
): Promise<NewsArticle[] | null> {
  // console.log(first_name + last_name);
  const url = `https://nba-latest-news.p.rapidapi.com/articles?player=${first_name.toLowerCase()}-${last_name.toLowerCase()}&limit=10`;
  // console.log(url);
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY!,
      'X-RapidAPI-Host': 'nba-latest-news.p.rapidapi.com',
    },
  };
  noStore();
  try {
    // console.log("Fetching Data");
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    return data.map((article: any) => newsArticleSchema.parse(article));
  } catch (error: any) {
    // console.error('Error fetching articles: ', error);
    // throw new Error('Failed to fetch articles data.');
    return null;
  }
}

export async function createUser(user: User): Promise<string> {
  // console.log('user received: ');
  // console.log(user);
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id));
  // console.log(existingUser);
  if (!existingUser[0]) {
    const result = await db.insert(users).values(user);
    console.log(result);
    return 'Successfully inserted user to user database';
  } else {
    return 'User already in database';
  }
}

export async function fetchUserDataByUsername(username: string): Promise<User> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  // console.log(existingUser);

  return existingUser[0];
}

export async function fetchUserDataById(id: string): Promise<User | null> {
  const existingUser: User[] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  // console.log(existingUser);

  return existingUser[0];
}

export async function updateUserUsername(userId: string, username: string) {
  await db
    .update(users)
    .set({ username: username, display_name: username })
    .where(eq(users.id, userId));
}

// export async function testDB() {
//   const result = await db.select().from(players).where(eq(players.id, 2544));
//   // console.log(result);
// }

// Simulated async function to fetch player news
export async function fetchPlayerNews(playerId: number) {
  // Simulate an API call with a timeout
  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      id: 1,
      title: 'NBA Draft Insights',
      content:
        'The 2022 NBA Draft is set to take place on July 29th, 2022. The Detroit Pistons have the first overall pick. lorem ipsum dolor sit amet ihbsdiufngdksja vciuas jd sinasj dijs ibsaib dsji asiu fdsgfjsdnaousboua vhsdba iisuadbf ijsabod asiudgifwpfn 3ew ',
    },
    {
      id: 2,
      title: 'NBA Finals Update',
      content:
        'The NBA Finals are set to begin on July 8th, 2022. The Milwaukee Bucks are the defending champions.',
    },

    {
      id: 3,
      title: 'All-Star Game Location',
      content:
        'The 2022 NBA All-Star Game will be held in Salt Lake City, Utah on February 20th, 2022.',
    },
  ];
}

// Simulated async function to generate AI summary
export async function generateAiSummary(playerId: number) {
  // Simulate an AI summary generation with a timeout
  // await new Promise((resolve) => setTimeout(resolve, 4000));

  return `AI-generated insights for player ${playerId}: 
  Demonstrates exceptional skill in offensive strategies, 
  with a consistent performance record across recent games. 
  Key strengths include quick decision-making and strategic positioning.`;
}
