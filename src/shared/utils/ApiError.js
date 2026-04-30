class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    clientMessage = null,
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message; // backend
    this.clientMessage = clientMessage; // frontend
    this.success = false;
    this.errors = errors;
    this.data = null;
    this.isOperational = true

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
