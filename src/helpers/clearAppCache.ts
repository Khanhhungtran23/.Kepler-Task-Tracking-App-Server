import { deleteCache, clearCacheByPattern, flushAllCache } from "../helpers/cacheHelper";

const clearApplicationCache = async () => {
  try {
    await flushAllCache();
    console.log("Application cache cleared successfully!");
  } catch (error) {
    console.error("Error clearing application cache:", error);
  }
};

export default clearApplicationCache;
