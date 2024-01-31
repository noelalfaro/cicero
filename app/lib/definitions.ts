export type Player = {
  id: number;
  name: string;
  stats: {
    ppg: number;
    apg: number;
    rpg: number;
    plusMinus: number;
    ciceroScore: number;
  };
  position: string;
  hometown: string;
};
