import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import ApiError from "../exceptions/ApiError";

export default function (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  //console.log(error);
  if (error instanceof ApiError) {
    return res.status(error.status).json({
      message: error.message,
      errors: error.errors,
    });
  } else if(error instanceof ZodError){
    return res.status(400).json({ message: "Неправельно заполнены поля", errors: error.errors })
  } else {
    console.log(error);
    return res.status(500).json({ message: "Произошла непредвиденная ошибка" });
  }
}
