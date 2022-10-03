import { Router } from "express";

import userController from "../controllers/userController.js";
import UserValidator from "../validation/userValidator.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.put(
  "/:id",
  authMiddleware,
  UserValidator.updateUser,
  userController.update
);

router.patch(
  "/password",
  authMiddleware,
  UserValidator.updatePassword,
  userController.changePassword
);

router.post(
  "/forgot-password",
  UserValidator.forgotPassword,
  userController.forgotPassword
);

router.get("/reset-password/:userId/:token", userController.verifyResetLink);

router.put(
  "/reset-password/:userId/:token",
  UserValidator.resetPassword,
  userController.resetPassword
);

export default router;
