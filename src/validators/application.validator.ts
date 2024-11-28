import Joi from "joi";

// Schema for creating a new application
export const createApplicationSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  assets: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid("To Do", "Implement", "Testing", "Production")
    .required(),
  priority: Joi.string().valid("High", "Medium", "Low").required(),
  teamMembers: Joi.array().items(Joi.string().length(24)).optional(),
  // tasks: Joi.array().items(Joi.string()).optional(),
});

// Schema for editing an application
export const editApplicationSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  assets: Joi.array().items(Joi.string()).optional(),
  status: Joi.string()
    .valid("To Do", "Implement", "Testing", "Production")
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
      "Deployment",
    )
    .required(),
  comment: Joi.string().required(),
});

export const duplicateApplicationSchema = Joi.object({
  includeRelations: Joi.boolean().optional().default(true),
});

export const paramsIdSchema = Joi.object({
  id: Joi.string().length(24).required(),
});

export const titleSchema = Joi.object({
  title: Joi.string().required(),
});

export const apptitleSchema = Joi.object({
  application_title: Joi.string().required(),
});

export const paramsApplicationIdSchema = Joi.object({
  applicationId: Joi.string().length(24).required(),
});

export const taskBodySchema = Joi.object({
  title: Joi.string().required(),
  deadline: Joi.date().iso().required(),
  tag: Joi.string().required(),
  status: Joi.string().valid("To Do", "In progress", "Done").optional(),
});
