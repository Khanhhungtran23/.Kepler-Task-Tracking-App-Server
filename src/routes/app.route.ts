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

/**
 * @swagger
 * /app/add-new:
 *   post:
 *     summary: Create a new application
 *     description: Creates a new application with provided details. Only admin users can create an application.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - status
 *               - priority
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the application
 *               description:
 *                 type: string
 *                 description: Detailed description of the application
 *               assets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of asset URLs related to the application
 *               status:
 *                 type: string
 *                 description: Current status of the application
 *                 enum: [To Do, Implement, Testing, Production]
 *               priority:
 *                 type: integer
 *                 description: Priority level of the application (e.g., 1 for highest priority)
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Only admins can create applications
 */

router.post("/add-new", protect, isAdmin, createApplication);

/**
 * @swagger
 * /app/edit/{id}:
 *   put:
 *     summary: Edit an existing application
 *     description: Allows an admin to edit the details of an application.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               assets:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [To Do, Implement, Testing, Production]
 *               priority:
 *                 type: integer
 *               tasks:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of task IDs associated with the application
 *               teamMembers:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of user IDs assigned to the application
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       404:
 *         description: Application not found
 *       403:
 *         description: Only admins can edit applications
 */

router.put("/edit/:id", protect, isAdmin, editApplication);
/**
 * @swagger
 * /app/trash/{title}:
 *   put:
 *     summary: Move an application to trash
 *     description: Marks an application as trashed. Only admins can perform this action.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID to trash
 *     responses:
 *       200:
 *         description: Application moved to trash
 *       404:
 *         description: Application not found
 *       403:
 *         description: Only admins can trash applications
 */

router.put("/trash/:title", protect, isAdmin, trashApplication);

/**
 * @swagger
 * /app/delete/{id}:
 *   delete:
 *     summary: Permanently delete an application
 *     description: Permanently deletes an application. Only trashed applications can be permanently deleted. Only admins can perform this action.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID to delete
 *     responses:
 *       200:
 *         description: Application permanently deleted
 *       404:
 *         description: Application not found or not in trash
 *       403:
 *         description: Only admins can delete applications permanently
 */

router.delete("/delete/:id", protect, isAdmin, deleteApplication);

/**
 * @swagger
 * /app/get-all:
 *   get:
 *     summary: Get all applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all applications
 */
router.get("/get-all", protect, getApplications);

/**
 * @swagger
 * /app/search-app/{application_title}:
 *   get:
 *     summary: Search an application by title
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_title
 *         required: true
 *         schema:
 *           type: string
 *         description: The application title
 *     responses:
 *       200:
 *         description: Application search results
 *       404:
 *         description: Application not found
 */
router.get("/search-app/:application_title", protect, searchApp);

/**
 * @swagger
 * /app/search-todo-app/{application_title}:
 *   get:
 *     summary: Search a To Do application by title
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_title
 *         required: true
 *         schema:
 *           type: string
 *         description: The application title
 *     responses:
 *       200:
 *         description: To Do application search results
 *       404:
 *         description: Application not found
 */
router.get("/search-todo-app/:application_title", protect, searchTodoApp);

/**
 * @swagger
 * /app/search-implement-app/{application_title}:
 *   get:
 *     summary: Search an Implementing application by title
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_title
 *         required: true
 *         schema:
 *           type: string
 *         description: The application title
 *     responses:
 *       200:
 *         description: Implementing application search results
 *       404:
 *         description: Application not found
 */
router.get("/search-implement-app/:application_title", protect, searchImplementApp);

/**
 * @swagger
 * /app/search-testing-app/{application_title}:
 *   get:
 *     summary: Search a Testing application by title
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_title
 *         required: true
 *         schema:
 *           type: string
 *         description: The application title
 *     responses:
 *       200:
 *         description: Testing application search results
 *       404:
 *         description: Application not found
 */
router.get("/search-testing-app/:application_title", protect, searchTestingApp);

/**
 * @swagger
 * /app/search-production-app/{application_title}:
 *   get:
 *     summary: Search a Production application by title
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: application_title
 *         required: true
 *         schema:
 *           type: string
 *         description: The application title
 *     responses:
 *       200:
 *         description: Production application search results
 *       404:
 *         description: Application not found
 */
router.get("/search-production-app/:application_title", protect, searchProductionApp);



export default router;
