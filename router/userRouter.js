import { Router } from "express";

import userController from "../controllers/userController.js";
import { userValidator } from "../validation/userValidation.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = new Router();

router.put(
  "/:id",
  authMiddleware,
  userValidator.updateUser(),
  validationMiddleware,
  userController.update
);

router.post(
  "/password",
  authMiddleware,
  userValidator.changePassword(),
  validationMiddleware,
  userController.changePassword
);

router.post(
  "/forgot-password",
  userValidator.forgotPassword(),
  validationMiddleware,
  userController.forgotPassword
);

router.get("/reset-password/:userId/:token", userController.verifyResetLink);

router.put(
  "/reset-password/:userId/:token",
  userValidator.resetPassword(),
  validationMiddleware,
  userController.resetPassword
);

export default router;
