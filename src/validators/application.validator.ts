import Joi from "joi";

// Schema for creating a new application
export const createApplicationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  assets: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid("To Do", "Implementing", "Testing", "Production")
    .required(),
  priority: Joi.string().valid("High", "Medium", "Low").required(),
});

// Schema for editing an application
export const editApplicationSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  assets: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid("To Do", "Implementing", "Testing", "Production")
    .optional(),
  priority: Joi.string().valid("High", "Medium", "Low").optional(),
  tasks: Joi.array().items(Joi.string()).optional(),
  teamMembers: Joi.array().items(Joi.string()).optional(),
});

// Schema for adding a member to an application
export const addMemberToApplicationSchema = Joi.object({
  appId: Joi.string().required(),
  userId: Joi.string().required(),
});

// Schema for adding new activity to application
export const addNewActivityToApplicationSchema = Joi.object({
  appId: Joi.string().required(), 
  title: Joi.string()
    .valid(
      "Requirement Clarification",
      "Implementation",
      "QC1",
      "UAT",
      "QC2",
      "Deployment"
    )
    .required(), 
  comment: Joi.string().required(), 
});
