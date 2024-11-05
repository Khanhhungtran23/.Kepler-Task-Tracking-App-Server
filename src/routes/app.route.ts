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
        searchProductionApp 
    } from "../controller/application.controller";

const router = express.Router();

router.post("/add-new", createApplication);
router.put("/edit/:id", editApplication);
router.delete("/trash/:id", trashApplication);
router.delete("/delete/:id",  deleteApplication);
router.get("/get-all", getApplications);
router.get("/search-app/:application_title", searchApp);
router.get("/search-todo-app/:application_title", searchTodoApp);
router.get("/search-implement-app/:application_title", searchImplementApp);
router.get("/search-testing-app/:application_title", searchTestingApp);
router.get("/search-production-app/:application_title", searchProductionApp);


export default router;
