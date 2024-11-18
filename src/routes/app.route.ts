import { addActivity } from './../controller/application.controller';
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
} from "../controller/application.controller";
import { validate } from "../middlewares/validate";
import {
  createApplicationSchema,
  editApplicationSchema,
  addMemberToApplicationSchema,
  addNewActivityToApplicationSchema
} from "../validators/application.validator";
import { protect, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.post(
  "/add-new",
  protect,
  isAdmin,
  validate(createApplicationSchema),
  createApplication,
);

router.put(
  "/edit/:id",
  protect,
  isAdmin,
  validate(editApplicationSchema),
  editApplication,
);

router.put("/trash/:title", protect, isAdmin, trashApplication);

router.delete("/delete/:id", protect, isAdmin, deleteApplication);

router.get("/get-all", protect, getApplications);

router.get("/get-all-todo", protect, getTodoApplications);

router.get("/get-all-implement", protect, getImplementApplications);

router.get("/get-all-testing", protect, getTestingApplications);

router.get("/get-all-production", protect, getProductionApplications);

router.get("/search-app/:application_title", protect, searchApp);

router.get("/search-todo-app/:application_title", protect, searchTodoApp);

router.get(
  "/search-implement-app/:application_title",
  protect,
  searchImplementApp,
);

router.get("/search-testing-app/:application_title", protect, searchTestingApp);

router.get(
  "/search-production-app/:application_title",
  protect,
  searchProductionApp,
);

router.put("/restore/:title", protect, isAdmin, restoreApplication);

router.get("/get-trashed-app", protect, isAdmin, getTrashedApplications);

router.get("/get-status-statistic", protect, countApplicationsByStatus);

router.get("/get-priority-statistic", protect, countApplicationsByPriority);

router.get("/get-apps-user", protect, countApplicationsPerUser);

router.post(
  "/add-member-app",
  protect,
  isAdmin,
  validate(addMemberToApplicationSchema),
  addMemberToApplication,
);

router.post(
  "/add-activity-app",
  protect,
  validate(addNewActivityToApplicationSchema),
  addActivity
);

export default router;
