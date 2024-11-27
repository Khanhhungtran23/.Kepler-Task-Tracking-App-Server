import { deleteCache, clearCacheByPattern } from "../helpers/cacheHelper";
import logger from "../configs/logger.config";

const clearApplicationCache = async () => {
  try {
    await Promise.all([
      deleteCache("applications:all"),
      deleteCache("applications:todo"),
      deleteCache("applications:implement"),
      deleteCache("applications:test"),
      deleteCache("applications:production"),
      clearCacheByPattern("applications:search:*"),
      clearCacheByPattern("applications:tdsearch:*"),
      clearCacheByPattern("applications:itsearch:*"),
      clearCacheByPattern("applications:tgsearch:*"),
      clearCacheByPattern("applications:pnsearch:*"),
      deleteCache("application:status-count"),
      deleteCache("application:priority-count"),
      deleteCache("users:applications-count"),
      deleteCache("TrashApplication:all"),
    ]);

    logger.info("Application cache cleared successfully!");
  } catch (error) {
    logger.info("Error clearing application cache:", error);
  }
};

export default clearApplicationCache;
