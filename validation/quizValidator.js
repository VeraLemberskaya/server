import Joi from "joi";

import { validateRequestBody } from "./validateRequestBody.js";

class QuizValidator {
  getQuiz(req, res, next) {
    const schema = Joi.object({
      topicId: Joi.string().required(),
    });

    validateRequestBody(req, next, schema);
  }

  setAnswer(req, res, next) {
    const schema = Joi.object({
      answerId: Joi.string().required(),
    });

    validateRequestBody(req, next, schema);
  }
}

export default new QuizValidator();
