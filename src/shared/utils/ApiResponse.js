class ApiResponse {
  constructor(statusCode, message = "Success", data) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  send(res) {
    return res.status(this.statusCode).json(this);
  }
}

export { ApiResponse };
