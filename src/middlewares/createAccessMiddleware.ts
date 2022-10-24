import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import { UserRole } from "../models/user.model";

export default function CreateAccessMiddleware(allowedRolesArray: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRolesArray.includes(req.user.role)) {
      next(ApiError.Forbidden());
    }
    next();
  };
}
