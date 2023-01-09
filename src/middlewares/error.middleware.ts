import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiError from "../exceptions/ApiError";

export default function (
  error: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
    });
  } else if (error instanceof ZodError) {
    return res.status(400).json({
      message: "Некорректный запрос, проверьте отправляемые данные",
      errors: error.errors,
    });
  } else {
    console.log(error);
    return res.status(500).json({ message: "Произошла непредвиденная ошибка" });
  }
}
