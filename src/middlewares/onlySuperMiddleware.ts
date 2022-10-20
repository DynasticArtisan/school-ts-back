import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { UserRole } from "src/models/userModel";

export default async function OnlySuperMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user.role !== UserRole.super) {
    next(ApiError.Forbidden());
  }
}
