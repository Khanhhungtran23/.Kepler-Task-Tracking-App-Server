import { deleteCache, clearCacheByPattern } from "../helpers/cacheHelper";

const clearUserCache = async () => {
  try {
    await Promise.all([
      deleteCache("users:all"),
      clearCacheByPattern("users:search:*"),
    ]);
    console.log("User cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing user cache:", error);
  }
};

export default clearUserCache;
