import { Router } from "express";

import authController from "../controllers/authController.js";
import validationMiddleware from "../middlewares/validationMiddleware.js";
import { userValidator } from "../validation/userValidation.js";

const router = new Router();

router.post(
  "/registration",
  userValidator.createUser(),
  validationMiddleware,
  authController.registration
);
router.post("/login", authController.login);

export default router;
