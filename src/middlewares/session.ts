import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../utils/redis";
import { envConfig } from "../configs/env.config";

const sessionMiddleware = session({
  store: new RedisStore({
    client: redisClient,
    ttl: 86400, // Set TTL to 1 day (in seconds)
  }),
  secret: envConfig.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
