import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (
  schema: Joi.ObjectSchema,
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        res.status(400).json({
          message: "Invalid request data",
          error: error.details.map((detail) => detail.message).join(", "),
        });
      } else {
        next();
      }
    } catch (err) {
      next(err);
    }
  };
};
