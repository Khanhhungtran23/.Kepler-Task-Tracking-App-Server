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

// Schema for admin updating a user
export const adminUpdateUserSchema = Joi.object({
  user_name: Joi.string().optional(),
  role: Joi.string().optional(),
  email: Joi.string().email().optional(),
  isAdmin: Joi.boolean().optional(),
});

// Schema for searching a user by name
export const searchUserByNameSchema = Joi.object({
  user_name: Joi.string().required().messages({
    "any.required": "Field user_name is required",
  }),
});

// Schema for finding/disabling/enabling/deleting user by email
export const emailParamSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Field email is required",
    "string.email": "Field email must be a valid email",
  }),
});


