import express from "express";
import {
  createApplication,
  editApplication,
  trashApplication,
  deleteApplication,
  getApplications,
  getTodoApplications,
  getImplementApplications,
  getTestingApplications,
  getProductionApplications,
  searchApp,
  searchTodoApp,
  searchImplementApp,
  searchTestingApp,
  searchProductionApp,
  restoreApplication,
  getTrashedApplications,
  countApplicationsByStatus,
  countApplicationsByPriority,
  countApplicationsPerUser,
  addMemberToApplication,
  duplicateApplication,
  getAppById,
} from "../controller/application.controller";
import { addActivity } from "../controller/activity.controller";
import {
  addTaskToApplication,
  updateTaskInApplication,
  deleteTaskFromApplication,
} from "../controller/task.controller";
import { validate } from "../middlewares/validate";
import {
  createApplicationSchema,
  editApplicationSchema,
  addMemberToApplicationSchema,
  addNewActivityToApplicationSchema,
  paramsIdSchema,
  titleSchema,
  apptitleSchema,
  duplicateApplicationSchema,
  paramsApplicationIdSchema,
  taskBodySchema,
} from "../validators/application.validator";
import { protect, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/add-new",
  protect,
  isAdmin,
  validate({ body: createApplicationSchema }),
  createApplication,
);

router.put(
  "/edit/:id",
  protect,
  isAdmin,
  validate({
    params: paramsIdSchema,
    body: editApplicationSchema,
  }),
  editApplication,
);

router.put(
  "/trash/:title",
  protect,
  isAdmin,
  validate({
    params: titleSchema,
  }),
  trashApplication,
);

router.delete(
  "/delete/:id",
  protect,
  isAdmin,
  validate({
    params: paramsIdSchema,
  }),
  deleteApplication,
);

router.get("/get-all", protect, getApplications);

router.get("/get-all-todo", protect, getTodoApplications);

router.get("/get-all-implement", protect, getImplementApplications);

router.get("/get-all-testing", protect, getTestingApplications);

router.get("/get-all-production", protect, getProductionApplications);

router.get(
  "/get-app-id/:id",
  protect,
  validate({
    params: paramsIdSchema,
  }),
  getAppById,
);

router.get(
  "/search-app/:application_title",
  protect,
  validate({
    params: apptitleSchema,
  }),
  searchApp,
);

router.get(
  "/search-todo-app/:application_title",
  protect,
  validate({
    params: apptitleSchema,
  }),
  searchTodoApp,
);

router.get(
  "/search-implement-app/:application_title",
  protect,
  validate({
    params: apptitleSchema,
  }),
  searchImplementApp,
);

router.get("/search-testing-app/:application_title", protect, searchTestingApp);

router.get(
  "/search-production-app/:application_title",
  protect,
  searchProductionApp,
);

router.put(
  "/restore/:title",
  protect,
  isAdmin,
  validate({
    params: titleSchema,
  }),
  restoreApplication,
);

router.get("/get-trashed-app", protect, isAdmin, getTrashedApplications);

router.get("/get-status-statistic", protect, countApplicationsByStatus);

router.get("/get-priority-statistic", protect, countApplicationsByPriority);

router.get("/get-apps-user", protect, countApplicationsPerUser);

router.post(
  "/add-member-app",
  protect,
  isAdmin,
  validate({ body: addMemberToApplicationSchema }),
  addMemberToApplication,
);

router.post(
  "/add-activity-app",
  protect,
  validate({ body: addNewActivityToApplicationSchema }),
  addActivity,
);

router.post(
  "/duplicate/:id",
  protect,
  isAdmin,
  validate({
    params: paramsIdSchema,
    body: duplicateApplicationSchema,
  }),
  duplicateApplication,
);

router.put(
  "/add-task/:applicationId",
  protect,
  validate({
    params: paramsApplicationIdSchema,
    body: taskBodySchema,
  }),
  addTaskToApplication,
);

router.put(
  "/update-task/:applicationId/:taskId",
  protect,
  updateTaskInApplication,
);

router.delete(
  "/delete-task/:applicationId/:taskId",
  protect,
  deleteTaskFromApplication,
);

export default router;
