import { deleteCache, clearCacheByPattern } from "../helpers/cacheHelper";
import logger from "../configs/logger.config";

const clearUserCache = async () => {
  try {
    await Promise.all([
      deleteCache("users:all"),
      clearCacheByPattern("users:search:*"),
    ]);
    logger.info("User cache cleared successfully!");
  } catch (error) {
    logger.info("Error clearing user cache:", error);
  }
};

export default clearUserCache;
