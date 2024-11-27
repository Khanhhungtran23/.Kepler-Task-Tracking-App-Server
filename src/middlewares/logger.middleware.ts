import { envConfig } from "../configs/env.config";
import logger from "../configs/logger.config";
import { NextFunction, Request, Response } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let bodyMsg;
  const { method, originalUrl, body } = req;
  if (Object.keys(body).length > 0 && envConfig.NODE_ENV === "developement") {
    bodyMsg = `-> BODY: ${JSON.stringify(body).slice(0, 100)}}`;
  }
  if (!originalUrl.includes("/docs")) {
    logger.info(`${method} ${originalUrl} ${bodyMsg ? bodyMsg : ""}`);
  }
  next();
};
