export default class HttpError extends Error {
  constructor(status, message = messagesList[status]) {
    super(message);
    this.status = status;
  }
}

const messagesList = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

export { HttpError };
