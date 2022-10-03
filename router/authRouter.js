import { Router } from "express";

import authController from "../controllers/authController.js";
import AuthValidator from "../validation/authValidator.js";

const router = new Router();

router.post("/register", AuthValidator.register, authController.register);

router.post("/login", AuthValidator.login, authController.login);

router.get("/activate/:userId/:token", authController.activate);

router.post("/logout", authController.logout);

router.get("/refresh", authController.refresh);

export default router;
