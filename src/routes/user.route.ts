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
  enableUserAccount,
  deleteAccount,
  adminUpdateUser
} from "../controller/user.controller";
import { validate } from "../middlewares/validate";
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
} from "../validators/user.validator";
import { protect, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.post("/register", validate(registerUserSchema), registerUser);

router.post("/login", validate(loginUserSchema), loginUser);

router.put(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changeUserPassword,
);

router.post("/logout", protect, logoutUser);

router.put("/profile", protect, updateUserProfile);

router.get("/get-all-info", protect, isAdmin, getAllUsers);

router.get("/search/:user_name", protect, isAdmin, getUserByName);

router.put("/disable-account/:email", protect, isAdmin, disableUserAccount);

router.put("/enable-account/:email", protect, isAdmin, enableUserAccount);

router.delete("/delete/:email", protect, isAdmin, deleteAccount);

router.put("/admin/update-user/:email", protect, isAdmin, adminUpdateUser);

export default router;
