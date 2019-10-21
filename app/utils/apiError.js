class apiError extends Error {
  constructor({
    message = '',
    status = 400
  } = {}) {
    super();
    if (message) this.message = message;
    this.status = status;
  }
}

module.exports = apiError;