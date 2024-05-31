import { z } from "zod";

const statsSchema = z.object({
  ppg: z.number(),
  apg: z.number(),
  rpg: z.number(),
  plus_minus: z.number(),
  cicero_score: z.number(),
});

const playerSchema = z.object({
  player_id: z.number(),
  family_name: z.string(),
  given_name: z.string(),
  stats: statsSchema,
  position: z.string(),
  hometown: z.string().nullable(),
});

export { statsSchema, playerSchema };
export type Player = z.infer<typeof playerSchema>;
