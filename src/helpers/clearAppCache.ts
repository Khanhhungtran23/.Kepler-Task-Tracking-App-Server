import redisClient from "../utils/redis";

const clearCache = async (pattern: string) => {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await Promise.all(keys.map((key) => redisClient.del(key)));
    }
  } catch (error) {
    console.error("Error clearing cache:", error);
  }
};

const clearApplicationCache = async () => {
  try {
    await clearCache("applications:*");

    await clearCache("applications:search:*");

    await Promise.all([
      redisClient.del("applications:status-count"),
      redisClient.del("applications:priority-count"),
      redisClient.del("users:applications-count"),
      redisClient.del("TrashApplication:all"),
    ]);

    console.log("Application cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing application cache:", error);
  }
};

export default clearApplicationCache;
