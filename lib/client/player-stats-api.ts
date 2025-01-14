export const fetchPlayerStatsApi = async (playerId: number) => {
  const response = await fetch(`/api/player-stats/${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats');
  }
  return response.json();
};
