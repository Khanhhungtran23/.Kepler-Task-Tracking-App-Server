import express from "express";
import {
  registerUser,
  loginUser,
  changeUserPassword,
  logoutUser,
  updateUserProfile,
  getAllUsers,
  getUserByName,
} from "../controller/user.controller";
import { protect } from "../middlewares/auth";
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *         - full_name
 *         - role
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the user
 *         user_name:
 *           type: string
 *           description: The user's username
 *         full_name:
 *           type: string
 *           description: The user's full name
 *         role:
 *           type: string
 *           description: The user's role
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user is an admin
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User already exists
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", loginUser);

/**
 * @swagger
 * /users/password:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Old password is incorrect
 */
router.put("/change-password", protect, changeUserPassword);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", logoutUser);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *               full_name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */
router.put("/profile", protect, updateUserProfile);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/get-all-info", protect, getAllUsers);

/**
 * @swagger
 * /users/{user_name}:
 *   get:
 *     summary: Get a user by username
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: user_name
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's username
 *     responses:
 *       200:
 *         description: A user object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: No users found with that name
 */
router.get("/search/:user_name",  protect, getUserByName);

export default router;
