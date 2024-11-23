import { deleteCache, clearCacheByPattern } from "../helpers/cacheHelper";

const clearApplicationCache = async () => {
  try {
    await Promise.all([
      deleteCache("applications:all"),
      deleteCache("applications:todo"),
      deleteCache("applications:implement"),
      deleteCache("applications:test"),
      deleteCache("applications:production"),
      clearCacheByPattern("applications:search:*"),
      deleteCache("application:status-count"),
      deleteCache("application:priority-count"),
      deleteCache("users:applications-count"),
      deleteCache("TrashApplication:all"),
    ]);

    console.log("Application cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing application cache:", error);
  } 
};

export default clearApplicationCache;