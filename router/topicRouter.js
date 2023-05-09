import { Router } from "express";

import TopicController from "../controllers/topicController.js";

const router = new Router();

router.get("/", TopicController.getTopics);

export default router;
