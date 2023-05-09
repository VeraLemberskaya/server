import { Router } from "express";

import authRouter from "./authRouter.js";
import userRouter from "./userRouter.js";
import quizRouter from "./quizRouter.js";
import topicRouter from "./topicRouter.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/topics", topicRouter);
router.use("/quiz", authMiddleware, quizRouter);

export default router;
