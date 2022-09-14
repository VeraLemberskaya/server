class ApiError extends Error {
  status;
  errors = [];

  constructor(status, message, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError(404, message, errors);
  }

  static internalServerError(message, errors) {
    return new ApiError(500, message, errors);
  }

  static firbidden(message, errors) {
    return new ApiError(403, message, errors);
  }

  static unauthorized() {
    return new ApiError(401, "User is not authorized.");
  }
}

export default ApiError;
