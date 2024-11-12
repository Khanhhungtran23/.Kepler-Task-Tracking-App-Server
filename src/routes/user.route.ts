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


router.post("/register", registerUser);

router.post("/login", loginUser);

router.put("/change-password", protect, changeUserPassword);

router.post("/logout", protect, logoutUser);

router.put("/profile", protect, updateUserProfile);

router.get("/get-all-info", protect, isAdmin, getAllUsers);

router.get("/search/:user_name", protect, isAdmin, getUserByName);

router.put("/disable-account/:email", protect, isAdmin, disableUserAccount);

router.put("/enable-account/:email", protect, isAdmin, enableUserAccount);

export default router;

