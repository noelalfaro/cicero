export const fetchPlayerStats = async (playerId: number) => {
  // console.log('client-fetch', playerId);
  const response = await fetch(`/api/player-stats/${playerId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch player stats');
  }
  return response.json();
};
