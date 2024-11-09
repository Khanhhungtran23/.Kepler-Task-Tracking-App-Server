import express from "express";
import {
  registerUser,
  loginUser,
  changeUserPassword,
  logoutUser,
  updateUserProfile,
  getAllUsers,
  getUserByName,
  disableUserAccount,
  enableUserAccount
} from "../controller/user.controller";
import { protect, isAdmin } from "../middlewares/auth";
const router = express.Router();

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user to the system.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_name
 *               - role
 *               - email
 *               - password
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: Username for the new user
 *               role:
 *                 type: string
 *                 description: Role of the user in the project (e.g., Developer, Manager)
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user account
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: User already exists
 */

router.post("/register", registerUser);
/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     description: Logs in an existing user. Returns a JWT token.
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
 *                 description: User email address
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid email or password
 */

router.post("/login", loginUser);

/**
 * @swagger
 * /user/change-password:
 *   put:
 *     summary: Change user password
 *     description: Allows a user to change their password. Requires the old password.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: Current password
 *               newPassword:
 *                 type: string
 *                 description: New password
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Old password is incorrect
 */

router.put("/change-password", protect, changeUserPassword);

/**
 * @swagger
 * /user/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post("/logout", protect, logoutUser);

/**
 * @swagger
 * /user/profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows a user to update their profile information.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_name:
 *                 type: string
 *                 description: New username
 *               role:
 *                 type: string
 *                 description: New role
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       404:
 *         description: User not found
 */

router.put("/profile", protect, updateUserProfile);

/**
 * @swagger
 * /user/get-all-info:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns a list of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/get-all-info", protect, isAdmin, getAllUsers);

/**
 * @swagger
 * /user/search/{user_name}:
 *   get:
 *     summary: Get a user by username
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_name
 *         required: true
 *         schema:
 *           type: string
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
router.get("/search/:user_name", protect, isAdmin, getUserByName);

/**
 * @swagger
 * /user/disable-account:
 *   put:
 *     summary: Disable a user account
 *     description: Disables a user's account by setting isActive to false. Only admins can perform this action.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the account to disable
 *     responses:
 *       200:
 *         description: Account disabled successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

router.put("/disable-account/:email", protect, isAdmin, disableUserAccount);

/**
 * @swagger
 * /user/enable-account:
 *   put:
 *     summary: Enable a user account
 *     description: Enables a user's account by setting isActive to true. Only admins can perform this action.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the account to enable
 *     responses:
 *       200:
 *         description: Account enabled successfully
 *       404:
 *         description: User not found
 *       403:
 *         description: Access denied
 */

router.put("/enable-account/:email", protect, isAdmin, enableUserAccount);

export default router;

