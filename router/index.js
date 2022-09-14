import { Router } from "express";

import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";

const router = new Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);

export default router;
