import express from "express";
import userRoutes from "../routes/user.route";
import appRoutes from "../routes/app.route";
import authRoutes from "./auth.route";
import recoveryRoutes from "./password.route";
const router = express.Router();

router.use("/user", userRoutes);
router.use("/app", appRoutes);
router.use("/auth", authRoutes);
router.use("/r", recoveryRoutes);

export default router;
