import { validationResult } from "express-validator";

import ApiError from "../exceptions/ApiError.js";

const validationMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(ApiError.badRequest("Validation error", errors.array()));
  }

  return next();
};

export default validationMiddleware;
