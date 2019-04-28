class apiError {
  constructor(
    message = '',
    status = 400
  ) {
    if (message) this.message = message;
    this.status = status;
  }
}

module.exports = apiError;