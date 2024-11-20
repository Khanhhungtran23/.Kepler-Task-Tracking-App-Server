import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export const validate = (schema: {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const errors: string[] = [];

      if (schema.body) {
        const { error } = schema.body.validate(req.body);
        if (error) {
          errors.push(
            `Body: ${error.details.map((detail) => detail.message).join(", ")}`,
          );
        }
      }

      if (schema.params) {
        const { error } = schema.params.validate(req.params);
        if (error) {
          errors.push(
            `Params: ${error.details.map((detail) => detail.message).join(", ")}`,
          );
        }
      }

      if (schema.query) {
        const { error } = schema.query.validate(req.query);
        if (error) {
          errors.push(
            `Query: ${error.details.map((detail) => detail.message).join(", ")}`,
          );
        }
      }

      if (errors.length > 0) {
        res.status(400).json({
          message: "Invalid request data",
          errors,
        });
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};
