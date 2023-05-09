import Joi from "joi";

import { validateRequestBody } from "./validateRequestBody.js";

class UserValidator {
  forgotPassword(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().required().email(),
    });
    validateRequestBody(req, next, schema);
  }
  resetPassword(req, res, next) {
    const schema = Joi.object({
      password: Joi.string().required().min(6),
      confirmPassword: Joi.string()
        .required()
        .min(6)
        .valid(Joi.ref("password")),
    });
    validateRequestBody(req, next, schema);
  }
  updateUser(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().required().email(),
    });
    validateRequestBody(req, next, schema);
  }
  updatePassword(req, res, next) {
    const schema = Joi.object({
      oldPassword: Joi.string().required().min(6),
      password: Joi.string().required().min(6),
      confirmPassword: Joi.string()
        .required()
        .min(6)
        .valid(Joi.ref("password")),
    });
    validateRequestBody(req, next, schema);
  }
}

export default new UserValidator();
