import { Router } from "express";

import QuizController from "../controllers/quizController.js";
import QuizValidator from "../validation/quizValidator.js";

const router = new Router();

router.post("/", QuizValidator.getQuiz, QuizController.getQuiz);

router.get("/", QuizController.getSavedQuiz);

router.get("/score", QuizController.getQuizScore);

router.get("/:id", QuizController.getQuizById);

router.patch("/answer", QuizValidator.setAnswer, QuizController.setAnswer);

export default router;
