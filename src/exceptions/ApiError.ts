enum HTTPErrorStatuses {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
}

export default class ApiError extends Error {
  status;
  errors;
  constructor(
    status: HTTPErrorStatuses,
    message: string,
    errors: Error[] = []
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(
      HTTPErrorStatuses.UNAUTHORIZED,
      "Требуется авторизация"
    );
  }

  static BadRequest(message: string, errors = []) {
    return new ApiError(HTTPErrorStatuses.BAD_REQUEST, message, errors);
  }

  static Forbidden() {
    return new ApiError(HTTPErrorStatuses.FORBIDDEN, "Доступ запрещен");
  }
}
