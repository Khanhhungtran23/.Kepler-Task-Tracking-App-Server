// /* eslint-disable @typescript-eslint/no-explicit-any */
import redisClient from "../utils/redis";

export const getCache = async (key: string): Promise<unknown> => {
  try {
    const cachedData = await redisClient.get(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    } else {
      console.log(`Cache miss for key: ${key}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting cache for key: ${key}`, error);
    return null;
  }
};

export const setCache = async (
  key: string,
  data: unknown,
  expiry: number = 3600, // Default expiry: 1 hour
): Promise<void> => {
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
    console.log(`Cache set for key: ${key} with expiry: ${expiry}s`);
  } catch (error) {
    console.error(`Error setting cache for key: ${key}`, error);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error(`Error deleting cache for key: ${key}`, error);
  }
};

export const clearCacheByPattern = async (pattern: string): Promise<void> => {
  try {
    const stream = redisClient.scanIterator({ MATCH: pattern });
    for await (const key of stream) {
      await redisClient.del(key);
      console.log(`Cache deleted for key: ${key}`);
    }
  } catch (error) {
    console.error(`Error clearing cache for pattern: ${pattern}`, error);
  }
};
