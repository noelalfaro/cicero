import { z } from "zod";

const playerStatsSchema = z.object({
  stat_id: z.number(),
  player_id: z.number(),
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
const playerSchema = z.object({
  player_id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  team_id: z.string(),
  leagues: z.object({
    jersey: z.number(),
    active: z.boolean(),
    pos: z.boolean(),
  }),
  height: z.object({
    feets: z.string(),
    inches: z.string(),
    meters: z.string(),
  }),
  weight: z.object({
    pounds: z.string(),
    kilograms: z.string(),
  }),
  birth: z.object({ date: z.string(), country: z.string() }),
  nba_start: z.number(),
  nba_pro: z.number(),
  college: z.string(),
});

export { playerSchema, playerStatsSchema };
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
  code: z.string(),
  city: z.string(),
  logo: z.string(),
});

export { teamSchema };
export type Team = z.infer<typeof teamSchema>;
