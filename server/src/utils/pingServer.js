import cron from "node-cron";
import fetch from "node-fetch";
import sequelize from "../db/db.js";

// Replace with your actual server URL
const SERVER_URL = process.env.SERVER_URL;

sequelize
  .authenticate()
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Unable to connect to the database:", err));

async function scheduleServerPing() {
  // Schedule a ping every 15 minutes (*/15 * * * *)
  cron.schedule("*/15 * * * *", async () => {
    try {
      console.log(`Pinging server at ${new Date().toISOString()}...`);

      const response = await fetch(SERVER_URL);

      if (response.ok) {
        console.log(`Server ping successful with status: ${response.status}`);
      } else {
        console.error(`Server ping failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error while pinging server:", error);
    }
  });

  console.log("Server ping service initialized");
}

export default scheduleServerPing;
