import { NextFunction, Request, Response } from "express";
import ApiError from "src/exceptions/ApiError";
import { UserRole } from "src/models/userModel";

export default async function OnlySuperMiddleware(req: Request) {
  if (req.user.role !== UserRole.super) {
    throw ApiError.Forbidden();
  }
}
