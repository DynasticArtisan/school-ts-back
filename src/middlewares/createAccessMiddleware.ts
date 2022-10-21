import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { UserRole } from "src/models/userModel";

export default function CreateAccessMiddleware(allowedRolesArray: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!allowedRolesArray.includes(req.user.role)) {
      next(ApiError.Forbidden());
    }
    next();
  };
}
