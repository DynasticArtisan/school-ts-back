import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
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
      errors: error.errors,
    });
  } else {
    console.log(error);
    return res.status(500).json({ message: "Произошла непредвиденная ошибка" });
  }
}
