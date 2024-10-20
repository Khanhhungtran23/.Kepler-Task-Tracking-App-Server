import express from "express";
import { protect, isAdmin } from "../middlewares/auth";
import { createApplication, 
        editApplication, 
        trashApplication, 
        deleteApplication, 
        getApplications 
    } from "../controller/application.controller";

const router = express.Router();

router.post("/add-new", protect, createApplication);
router.put("/edit/:id", protect, editApplication);
router.delete("/trash/:id", protect, trashApplication);
router.delete("/delete/:id", protect, deleteApplication);
router.get("/get-all", protect, getApplications);

export default router;
