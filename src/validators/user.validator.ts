import Joi from "joi";

// Schema for user registration
export const registerUserSchema = Joi.object({
  user_name: Joi.string().required().messages({
    "any.required": "Field user_name is required",
  }),
  role: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Schema for user login
export const loginUserSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// Schema for changing user password
export const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});
