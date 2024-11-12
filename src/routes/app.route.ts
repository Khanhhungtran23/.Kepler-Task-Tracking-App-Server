import express from "express";
import { protect, isAdmin } from "../middlewares/auth";

import { createApplication, 
        editApplication, 
        trashApplication, 
        deleteApplication, 
        getApplications,
        searchApp,
        searchTodoApp,
        searchImplementApp,
        searchTestingApp,
        searchProductionApp,
        restoreApplication,
        getTrashedApplications,
        countApplicationsByStatus,
        countApplicationsByPriority
    } from "../controller/application.controller";
const router = express.Router();

router.post("/add-new", protect, isAdmin, createApplication);

router.put("/edit/:id", protect, isAdmin, editApplication);

router.put("/trash/:title", protect, isAdmin, trashApplication);

router.delete("/delete/:id", protect, isAdmin, deleteApplication);

router.get("/get-all", protect, getApplications);

router.get("/search-app/:application_title", protect, searchApp);

router.get("/search-todo-app/:application_title", protect, searchTodoApp);

router.get("/search-implement-app/:application_title", protect, searchImplementApp);

router.get("/search-testing-app/:application_title", protect, searchTestingApp);

router.get("/search-production-app/:application_title", protect, searchProductionApp);

router.put("/restore/:title", protect, isAdmin, restoreApplication);

router.get("/get-trashed-app", protect, isAdmin, getTrashedApplications);

router.get("/get-status-statistic", protect, countApplicationsByStatus);

router.get("/get-priority-statistic", protect, countApplicationsByPriority);

export default router;
