export const validateRequestBody = (req, next, shema) => {
  const { error } = shema.validate(req.body);

  if (error) {
    next({
      message: `Validation error: ${error.details
        .map((error) => error.message)
        .join(",")}`,
    });
  } else {
    next();
  }
};
