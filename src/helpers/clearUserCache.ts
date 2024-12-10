import { deleteCache, clearCacheByPattern, flushAllCache } from "../helpers/cacheHelper";

const clearUserCache = async () => {
  try {
    await flushAllCache();
    console.log("User cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing user cache:", error);
  }
};

export default clearUserCache;
