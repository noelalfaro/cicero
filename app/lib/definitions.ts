import { z } from "zod";
const playerStatsSchema = z.object({
  player_id: z.number(),
  stat_id: z.number(),
  points: z.number(),
  min: z.string(),
  fgm: z.number(),
  fga: z.number(),
  fgp: z.string(),
  ftm: z.number(),
  fta: z.number(),
  ftp: z.string(),
  tpm: z.number(),
  tpa: z.number(),
  tpp: z.string(),
  offReb: z.number(),
  defReb: z.number(),
  totReb: z.number(),
  assists: z.number(),
  pFouls: z.number(),
  steals: z.number(),
  turnovers: z.number(),
  blocks: z.number(),
  plusMinus: z.string(),
});

// Export the player stats schema
export { playerStatsSchema };
const playerSchema = z.object({
  id: z.number(),
  first_name: z.string(),
  last_name: z.string(),
  display_first_last: z.string(),
  display_last_comma_first: z.string(),
  display_fi_last: z.string(),
  player_slug: z.string(),
  birthdate: z.string(),
  school: z.string(),
  country: z.string(),
  last_affiliation: z.string(),
  height: z.string(),
  weight: z.string(),
  season_exp: z.number(),
  jersey: z.string(),
  position: z.string(),
  rosterstatus: z.string(),
  team_id: z.number(),
  team_name: z.string(),
  team_abbreviation: z.string(),
  team_code: z.string(),
  team_city: z.string(),
  playercode: z.string(),
  from_year: z.number(),
  to_year: z.number(),
  dleague_flag: z.string(),
  nba_flag: z.string(),
  games_played_flag: z.string(),
  draft_year: z.string(),
  draft_round: z.string(),
  draft_number: z.string(),
  is_active: z.string(),
  picture: z.string().optional(),
  averages: z
    .object({
      points: z.number(),
      min: z.string(),
      fgm: z.number(),
      fga: z.number(),
      fgp: z.string(),
      ftm: z.number(),
      fta: z.number(),
      ftp: z.string(),
      tpm: z.number(),
      tpa: z.number(),
      tpp: z.string(),
      offReb: z.number(),
      defReb: z.number(),
      totReb: z.number(),
      assists: z.number(),
      pFouls: z.number(),
      steals: z.number(),
      turnovers: z.number(),
      blocks: z.number(),
      plusMinus: z.string(),
    })
    .nullable(),
  stats: playerStatsSchema, // assuming stats is another schema
});

// Export the schema
export { playerSchema };

// Example of a playerStatsSchema, adjust accordingly

export type Player = z.infer<typeof playerSchema>;
export type PlayerStats = z.infer<typeof playerStatsSchema>;

export const newsArticleSchema = z.object({
  title: z.string(),
  url: z.string(),
  source: z.string(),
  // Add other properties based on the API response
});
export type NewsArticle = z.infer<typeof newsArticleSchema>;

const teamSchema = z.object({
  team_id: z.number(),
  name: z.string(),
  nickname: z.string(),
  logo: z.string(),
  city: z.string(),
  abbreviation: z.string(),
  state: z.string(),
  year_founded: z.number(),
});

export { teamSchema };
export type Team = z.infer<typeof teamSchema>;

const userSchema = z.object({
  family_name: z.string().nullable(),
  given_name: z.string().nullable(),
  picture: z.string().nullable(),
  email: z.string().nullable(),
  id: z.string(),
  username: z.string().nullable(),
});

export { userSchema };
export type User = z.infer<typeof userSchema>;
