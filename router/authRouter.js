import { Router } from "express";

import authController from "../controllers/authController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { userValidator } from "../validation/userValidation.js";

const router = new Router();

router.post(
  "/register",
  userValidator.createUser(),
  validationMiddleware,
  authController.register
);

router.post("/login", authController.login);

router.get("/activate/:userId/:token", authController.activate);

router.post("/logout", authController.logout);

router.get("/refresh", authController.refresh);

export default router;
