import express from "express";
import userRoutes from "../routes/user.route";
import appRoutes from "../routes/app.route";
const router = express.Router();

router.use("/user", userRoutes); 
router.use("/app", appRoutes);

export default router;