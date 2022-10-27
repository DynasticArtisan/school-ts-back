import { NextFunction, Request, Response } from "express";
import ApiError from "../exceptions/ApiError";
import tokenService from "../services/token.service";

export default async function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const accessToken = (req.headers.authorization || "").replace(
      /^Bearer\s/,
      ""
    );
    if (!accessToken) {
      return next(ApiError.Forbidden());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    // @ts-ignore
    req.user = userData;
    next();
  } catch (e) {
    return next(ApiError.Forbidden());
  }
}
