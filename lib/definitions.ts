import { z } from 'zod';
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

// const averagesSchema = z.optional();

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
  from_year: z.number().nullable(),
  to_year: z.number().nullable(),
  dleague_flag: z.string(),
  nba_flag: z.string(),
  games_played_flag: z.string(),
  draft_year: z.string(),
  draft_round: z.string().nullable(),
  draft_number: z.string().nullable(),
  is_active: z.string(),
  picture: z.string().optional(),
  averages: z.object({
    ppg: z.number().optional(),
    minutes: z.string().optional(),
    fgm: z.number().optional(),
    fga: z.number().optional(),
    fgp: z.number().optional(),
    ftm: z.number().optional(),
    fta: z.number().optional(),
    ftp: z.number().optional(),
    tpm: z.number().optional(),
    tpa: z.number().optional(),
    tpp: z.number().optional(),
    offReb: z.number().optional(),
    defReb: z.number().optional(),
    totReb: z.number().optional(),
    assists: z.number().optional(),
    pFouls: z.number().optional(),
    steals: z.number().optional(),
    turnovers: z.number().optional(),
    blocks: z.number().optional(),
    plusMinus: z.string().optional(),
  }),
  stats: z.array(playerStatsSchema).optional(), // assuming stats is another schema
});

// Export the schema
export { playerSchema };
// export type Averages = z.infer<typeof averagesSchema>;

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
  id: z.string(),

  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .nullable()
    .optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  picture: z.string(),
  display_name: z
    .string()
    .min(2, { message: 'Display must be at least 2 characters.' })
    .nullable(),
  onboarding_status: z.boolean(),
  social_connection_id: z.string().nullable().optional(),
});
const updateUserFormSchema = z.object({
  id: z.string(),
  display_name: z
    .string()
    .min(2, { message: 'Display must be at least 2 characters.' }),
});

export { userSchema, updateUserFormSchema };
export type User = z.infer<typeof userSchema>;
