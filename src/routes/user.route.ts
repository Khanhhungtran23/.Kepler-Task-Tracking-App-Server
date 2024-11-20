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
  adminUpdateUserSchema,
  searchUserByNameSchema,
  emailParamSchema,
} from "../validators/user.validator";
import { protect, isAdmin } from "../middlewares/auth";

const router = express.Router();

router.post("/register", validate( {body: registerUserSchema}), registerUser);

router.post("/login", validate({body:loginUserSchema}), loginUser);

router.put(
  "/change-password",
  protect,
  validate({body:changePasswordSchema}),
  changeUserPassword,
);

router.post("/logout", protect, logoutUser);

router.put("/profile", protect, updateUserProfile);

router.get("/get-all-info", protect, isAdmin, getAllUsers);

router.get("/search/:user_name", protect, isAdmin, validate({ params: searchUserByNameSchema }), getUserByName);

router.put("/disable-account/:email", protect, isAdmin, validate({ params: emailParamSchema }), disableUserAccount);

router.put("/enable-account/:email", protect, isAdmin, validate({ params: emailParamSchema }), enableUserAccount);

router.delete("/delete/:email", protect, isAdmin, validate({ params: emailParamSchema }), deleteAccount);

router.put("/admin/update-user/:email", protect, isAdmin, validate({
  params: emailParamSchema, 
  body: adminUpdateUserSchema, 
}), adminUpdateUser);

export default router;
