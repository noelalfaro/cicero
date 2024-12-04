import { config } from 'dotenv';
config({ path: '.env.local' });
import { Team } from '@/app/(main)/lib/definitions';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { teams } from '@/db/schema/teams';

async function fetchTeamDataFromAPI() {
  const apiKey = process.env.RAPID_API_KEY;

  if (!apiKey) {
    throw new Error(
      'RAPID_API_KEY is not defined in the environment variables',
    );
  }

  const url = 'https://api-nba-v1.p.rapidapi.com/teams?';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // Inspect the result structure to find the correct property that contains the team data array
    console.log(result);

    // Assuming 'result.response' contains the team data array
    const apiTeams = result.response;

    // Check if 'teams' is an array
    if (!Array.isArray(apiTeams)) {
      throw new Error("Expected 'response' to be an array");
    }

    const NbaTeams = apiTeams
      .filter((team: any) => team.nbaFranchise && team.allStar == false)
      .map(
        (team: any): Team => ({
          team_id: team.id,
          name: team.name,
          nickname: team.nickname,
          logo: team.logo,
          city: team.city,
          abbreviation: team.abbreviation,
          state: team.state,
          year_founded: team.year_founded,
        }),
      );
    console.log(`Total number of NBA franchises: ${NbaTeams.length}`);
    console.log(NbaTeams);
    // const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
    // const db = drizzle(sql);
    // await db.insert(teams).values(NbaTeams);
    // console.log("Seed done");
  } catch (error) {
    console.error(error);
  }
}

fetchTeamDataFromAPI();
