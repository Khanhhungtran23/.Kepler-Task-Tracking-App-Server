import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
  console.error("Error Details:", err);
});

// Connecting Redis database
(async () => {
  try {
    console.log("Connecting to Redis...");
    await redisClient.connect();
    console.log("Connected to Redis successfully!");
  } catch (error) {
    console.error("Could not connect to Redis:", error);
  }
})();

export default redisClient;
