import request from "supertest";
import app from "../index";
import server from "../app";
import redisClient from "../utils/redis";

jest.mock("../utils/redis", () => ({
  get: jest.fn(),
  setEx: jest.fn(),
  del: jest.fn(),
  quit: jest.fn(),
}));

describe("User API with Redis Cache", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await redisClient.quit();
    server.close();
    console.log("Server and Redis connection closed");
  });

  it("should fetch users and cache the result", async () => {
    (redisClient.get as jest.Mock).mockResolvedValueOnce(null);

    const response = await request(app).get("/api/user/get-all-info");

    expect(redisClient.get).toHaveBeenCalledWith("users:all");
    expect(redisClient.setEx).toHaveBeenCalledWith(
      "users:all",
      3600,
      expect.any(String),
    );
    expect(response.status).toBe(200);
  });

  it("should return cached result for users", async () => {
    (redisClient.get as jest.Mock).mockResolvedValueOnce(
      JSON.stringify([{ id: 1, name: "John Doe" }]),
    );

    const response = await request(app).get("/api/user/get-all-info");

    expect(redisClient.get).toHaveBeenCalledWith("users:all");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "John Doe" }]);
  });
});
