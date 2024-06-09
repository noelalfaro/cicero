import fs from "fs/promises"; // Import for promise-based file system operations
import { player_data } from "./player_data.js";

const lowerCasePlayerData = player_data.map((player) => {
  // Create a new object to store lowercased properties
  const newPlayer = {};

  // Loop through each key-value pair in the player object
  for (const key in player) {
    // Convert the key to lowercase
    const lowerKey = key.toLowerCase();

    // Assign the value from the original object to the new object
    newPlayer[lowerKey] = player[key];
  }

  // Return the new object with lowercased keys
  return newPlayer;
});

// Convert the processed data to JSON string
const jsonData = JSON.stringify(lowerCasePlayerData, null, 2); // Format the JSON for readability

// Define filename and path (replace 'new_player_data.json' with your desired name)
const filePath = "./new_player_data.json"; // Adjust the path as needed

// Write the JSON data to a new file using async/await
(async () => {
  try {
    await fs.writeFile(filePath, jsonData);
    console.log("Successfully created new file:", filePath);
  } catch (err) {
    console.error("Error writing to file:", err);
  }
})();
