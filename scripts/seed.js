const { db } = require("@vercel/postgres");
const { players } = require("../app/lib/placeholder-data.js");

async function seedPlayers(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // Create the "customers" table if it doesn't exist
    const createTable = await client.sql`
      CREATE TABLE IF NOT EXISTS players (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        stats JSONB NOT NULL,
        position VARCHAR(255) NOT NULL,
        hometown VARCHAR(255) NOT NULL
      );
    `;

    console.log(`Created "players" table`);

    // Insert data into the "players" table
    const insertedPlayers = await Promise.all(
      players.map(
        (player) => client.sql`
        INSERT INTO players (id, name, stats, position, hometown)
        VALUES (${player.id}, ${player.name}, ${JSON.stringify(player.stats)}, ${player.position}, ${player.hometown})
        ON CONFLICT (id) DO NOTHING;
      `,
      ),
    );

    console.log(`Seeded ${insertedPlayers.length} players`);

    return {
      createTable,
      players: insertedPlayers,
    };
  } catch (error) {
    console.error("Error seeding players:", error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await seedPlayers(client);

  await client.end();
}

main().catch((err) => {
  console.error(
    "An error occurred while attempting to seed the database:",
    err,
  );
});
