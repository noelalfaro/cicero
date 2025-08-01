import { nullable, z } from 'zod';
const playerStatsSchema = z.object({
  stats_id: z.number(),
  player_id: z.number(),
  points: z.number(),
  min: z.string(),
  fgm: z.number(),
  fga: z.number(),
  fgp: z.number(),
  ftm: z.number(),
  fta: z.number(),
  ftp: z.number(),
  tpm: z.number(),
  tpa: z.number(),
  tpp: z.number(),
  offReb: z.number(),
  defReb: z.number(),
  totReb: z.number(),
  assists: z.number(),
  pFouls: z.number(),
  steals: z.number(),
  turnovers: z.number(),
  blocks: z.number(),
  game_result: z.string().nullable(),
  season: z.number(),
  game_id: z.string(),
  comment: z.string().nullable(),
  prScore: z.number().nullable(),
  opp: z.string().nullable(),
  plusMinus: z.string(),
  gamedate: z.date(),
  created_at: z.date(),
});
const playerAveragesSchema = z.object({
  averages_id: z.number(),
  player_id: z.number(),
  ppg: z.number().optional(),
  apg: z.number().optional(),
  rpg: z.number().optional(),
  last_update: z.date().optional().nullable(),
});
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
  averages: playerAveragesSchema.optional(),
  stats: z.array(playerStatsSchema).optional(), // assuming stats is another schema
  last_update: z.date().optional().nullable(),
});
// Export the schema
export { playerStatsSchema, playerAveragesSchema, playerSchema };
export type Player = z.infer<typeof playerSchema>;
export type PlayerStats = z.infer<typeof playerStatsSchema>;
export type PlayerAverages = z.infer<typeof playerAveragesSchema>;

export const newsArticleSchema = z.object({
  title: z.string(),
  url: z.string(),
  source: z.string(),
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
  display_name: z
    .string()
    .min(2, { message: 'Display must be at least 2 characters.' })
    .nullable(),
  onboarding_status: z.boolean(),
  social_connection_id: z.string().nullable().optional(),

  // New onboarding fields (make them optional/nullable as appropriate for your logic)
  hometown: z.string().nullable().optional(),
  favorite_team: z.string().nullable().optional(),
  goat: z.string().nullable().optional(),
  picture: z
    .string()
    .url({ message: 'Invalid URL for avatar' })
    .nullable()
    .optional(), // For the profile_picture from the form
  social_handle: z.string().nullable().optional(),
  age: z.number().int().positive().nullable().optional(),
});
const updateUserFormSchema = z.object({
  id: z.string(),
  display_name: z
    .string()
    .min(2, { message: 'Display must be at least 2 characters.' }),
  picture: z
    .string()
    .url({ message: 'Invalid URL for avatar' })
    .nullable()
    .optional(), // For the profile_picture from the form
});

export { userSchema, updateUserFormSchema };
export type User = z.infer<typeof userSchema>;
