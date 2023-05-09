import Joi from "joi";
import { validateRequestBody } from "./validateRequestBody.js";

class AuthValidator {
  register(req, res, next) {
    const schema = Joi.object({
      name: Joi.string().required(),
      surname: Joi.string().required(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      confirmPassword: Joi.string()
        .required()
        .min(6)
        .valid(Joi.ref("password")),
    });
    validateRequestBody(req, next, schema);
  }
  login(req, res, next) {
    const schema = Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6),
      persist: Joi.boolean().required(),
    });
    validateRequestBody(req, next, schema);
  }
}

export default new AuthValidator();
