import redisClient from "../utils/redis";

const clearUserCache = async () => {
  try {
    const userKeys = await redisClient.keys("users:*");
    if (userKeys.length > 0) {
      await Promise.all(userKeys.map((key) => redisClient.del(key)));
    }

    await redisClient.del("users:count");
    console.log("User cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing user cache:", error);
  }
};

export default clearUserCache;
