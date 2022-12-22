enum HTTPErrorStatuses {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  PAYMENT_REQUIRED = 402,
  FORBIDDEN = 403,
  NOTFOUND = 404,
}

export default class ApiError extends Error {
  status;
  constructor(status: HTTPErrorStatuses, message: string) {
    super(message);
    this.status = status;
  }

  static BadRequest(message?: string) {
    return new ApiError(
      HTTPErrorStatuses.BAD_REQUEST,
      message || "Некорректный запрос"
    );
  }

  static UnauthorizedError(message?: string) {
    return new ApiError(
      HTTPErrorStatuses.UNAUTHORIZED,
      message || "Требуется авторизация"
    );
  }

  static Forbidden(message?: string) {
    return new ApiError(
      HTTPErrorStatuses.FORBIDDEN,
      message || "Доступ запрещен"
    );
  }

  static NotFound(message?: string) {
    return new ApiError(
      HTTPErrorStatuses.NOTFOUND,
      message || "Данные не найдены"
    );
  }
}
