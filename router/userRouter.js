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

export default router;
