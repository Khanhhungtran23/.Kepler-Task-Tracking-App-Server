import { createClient } from "redis";
import * as dotenv from "dotenv";
dotenv.config();

let redisClient: ReturnType<typeof createClient>;

describe("Redis Integration Tests", () => {
  beforeAll(async () => {
    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false,
      },
    });

    await redisClient.connect();
  });

  afterAll(async () => {
    await redisClient.quit();
  });

  it("should connect to Redis and set a key", async () => {
    await redisClient.set("test_key", "test_value", { EX: 3600 });
    const value = await redisClient.get("test_key");
    expect(value).toBe("test_value");
  });

  it("should delete a key in Redis", async () => {
    await redisClient.set("delete_key", "to_be_deleted");
    await redisClient.del("delete_key");
    const value = await redisClient.get("delete_key");
    expect(value).toBeNull();
  });

  it("should expire a key in Redis", async () => {
    await redisClient.set("expire_key", "temp_value", { EX: 2 });
    const value = await redisClient.get("expire_key");
    expect(value).toBe("temp_value");

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const expiredValue = await redisClient.get("expire_key");
    expect(expiredValue).toBeNull();
  });
});
