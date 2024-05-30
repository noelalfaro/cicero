export interface Player {
  player_id: number;
  family_name: string;
  given_name: string;
  stats: {
    ppg: number;
    apg: number;
    rpg: number;
    plus_minus: number;
    cicero_score: number;
  };
  position: string;
  hometown: string;
}
