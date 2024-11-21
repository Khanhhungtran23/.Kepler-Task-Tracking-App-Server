import session from "express-session";
import RedisStore from "connect-redis";
import redisClient from "../utils/redis";

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: "eoNi4@oldbv!jvan@#", // encrypt session ID
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  },
});

export default sessionMiddleware;
